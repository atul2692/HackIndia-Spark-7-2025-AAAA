from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
import numpy as np
from aif360.datasets import BinaryLabelDataset
from aif360.algorithms.preprocessing import Reweighing
import os
import json
from django.http import JsonResponse

from .models import FairnessAnalysis, Dataset, Model, Feedback
from .serializers import FairnessAnalysisSerializer, DatasetSerializer, ModelSerializer, FeedbackSerializer

# Create your views here.

class FairnessAnalysisViewSet(viewsets.ModelViewSet):
    queryset = FairnessAnalysis.objects.all()
    serializer_class = FairnessAnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def compute_fairness_metrics(self, dataset):
        """
        Compute Statistical Parity Difference (SPD) and Disparate Impact (DI) from dataset
        """
        y_true = dataset.labels.ravel()
        z_protected = dataset.protected_attributes.ravel()

        # Find indices for privileged/unprivileged groups
        idx_privileged = np.where(z_protected == 1)[0]
        idx_unprivileged = np.where(z_protected == 0)[0]

        favorable_label = dataset.favorable_label

        # Approval rate per group
        base_privileged = np.mean(y_true[idx_privileged] == favorable_label)
        base_unprivileged = np.mean(y_true[idx_unprivileged] == favorable_label)

        spd = base_unprivileged - base_privileged
        di = base_unprivileged / (base_privileged + 1e-8)  # Add epsilon to avoid division by zero

        return spd, di
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def analyze(self, request):
        """
        Run fairness analysis on the given dataset
        """
        try:
            # Get the dataset ID from the request
            dataset_id = request.data.get('dataset_id')
            protected_attribute = request.data.get('protected_attribute', 'gender')
            outcome_attribute = request.data.get('outcome_attribute', 'approved')
            
            # For demo, we could also accept a direct file upload
            uploaded_file = request.FILES.get('file')
            
            # Create a new analysis object
            name = request.data.get('name', 'Fairness Analysis')
            analysis = FairnessAnalysis.objects.create(
                name=name,
                description=request.data.get('description', ''),
                status='processing'
            )
            
            # Process the dataset
            if dataset_id:
                # Get dataset from DB
                try:
                    dataset_obj = Dataset.objects.get(id=dataset_id)
                    file_path = dataset_obj.file_path
                except Dataset.DoesNotExist:
                    return Response({'error': 'Dataset not found'}, status=status.HTTP_404_NOT_FOUND)
            elif uploaded_file:
                # Save the uploaded file
                file_path = os.path.join('uploads', uploaded_file.name)
                with open(file_path, 'wb+') as destination:
                    for chunk in uploaded_file.chunks():
                        destination.write(chunk)
            else:
                return Response({'error': 'No dataset provided'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                # Read the dataset
                df = pd.read_csv(file_path)
                
                # --- Validate Required Columns ---
                required_columns = [protected_attribute, outcome_attribute]
                for col in required_columns:
                    if col not in df.columns:
                        raise ValueError(f"Missing required column: '{col}'")
                
                # --- Encode Categorical Features ---
                # For gender, map to binary values (assuming Male/Female format)
                if protected_attribute == 'gender' and df[protected_attribute].dtype == 'object':
                    df[protected_attribute] = df[protected_attribute].map(
                        lambda x: 0 if str(x).lower() in ['male', 'm'] else 1
                    )
                
                # Ensure outcome variable is numeric
                df[outcome_attribute] = df[outcome_attribute].astype(int)
                
                # Automatically encode remaining categorical columns
                categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
                for col in required_columns:
                    if col in categorical_cols:
                        categorical_cols.remove(col)
                
                if len(categorical_cols) > 0:
                    df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)
                
                # Fill any missing values
                df.fillna(0, inplace=True)
                
                # --- Convert to AIF360 Dataset ---
                dataset = BinaryLabelDataset(
                    df=df,
                    label_names=[outcome_attribute],
                    protected_attribute_names=[protected_attribute],
                    favorable_label=1,
                    unfavorable_label=0
                )
                
                # Define groups
                unprivileged_groups = [{protected_attribute: 0}]
                privileged_groups = [{protected_attribute: 1}]
                
                # --- Calculate Metrics Before Reweighing ---
                spd_before, di_before = self.compute_fairness_metrics(dataset)
                
                # --- Apply Reweighing Algorithm ---
                reweighing = Reweighing(
                    unprivileged_groups=unprivileged_groups,
                    privileged_groups=privileged_groups
                )
                dataset_reweighted = reweighing.fit_transform(dataset)
                
                # --- Calculate Metrics After Reweighing ---
                spd_after, di_after = self.compute_fairness_metrics(dataset_reweighted)
                
                # --- Generate Insight Messages ---
                insights = []
                
                # SPD insights
                if abs(spd_before) < 0.05:
                    spd_message = "Statistical parity is very good - outcomes are similar across groups"
                elif abs(spd_before) < 0.1:
                    spd_message = "Minor statistical parity issues detected"
                else:
                    spd_message = "Significant statistical parity issues detected - bias present in outcomes"
                insights.append(spd_message)
                
                # DI insights
                if 0.8 <= di_before <= 1.2:
                    di_message = "Disparate impact ratio is within acceptable range (0.8-1.2)"
                else:
                    di_message = "Disparate impact issues detected - outcomes disproportionately affect one group"
                insights.append(di_message)
                
                # Mitigation insights
                if abs(spd_after) < abs(spd_before) and abs(di_after - 1) < abs(di_before - 1):
                    mitigation_message = "Reweighing successfully mitigated bias in the dataset"
                else:
                    mitigation_message = "Reweighing had limited effect - consider other mitigation strategies"
                insights.append(mitigation_message)
                
                # Calculate fairness score (higher is better)
                # Convert metrics to 0-1 scale where 1 is perfectly fair
                spd_score = 1 - min(abs(spd_before), 1)
                di_score = 1 - min(abs(di_before - 1), 1)
                fairness_score = (spd_score + di_score) / 2
                
                # Update analysis
                analysis.status = 'completed'
                analysis.fairness_score = round(fairness_score, 2)
                analysis.ethical_score = round(fairness_score * 0.9 + 0.1, 2)  # Similar but slightly different
                analysis.bias_detected = abs(spd_before) > 0.1 or not (0.8 <= di_before <= 1.2)
                
                # Save metrics and insights
                analysis.report_data = {
                    'metrics': {
                        'disparate_impact': round(di_before, 2),
                        'statistical_parity_difference': round(spd_before, 2),
                        'reweighed_disparate_impact': round(di_after, 2),
                        'reweighed_statistical_parity_difference': round(spd_after, 2),
                    },
                    'insights': insights
                }
                
                analysis.save()
                
                serializer = self.get_serializer(analysis)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                analysis.status = 'failed'
                analysis.save()
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class DatasetViewSet(viewsets.ModelViewSet):
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def sample_datasets(self, request):
        """Return real sample datasets for use in the app"""
        # Load datasets from samples directory
        loaded_datasets = Dataset.load_sample_datasets()
        
        # If no datasets were loaded from disk, return some demo data
        if not loaded_datasets and Dataset.objects.count() == 0:
            sample_data = [
                {
                    'id': 1,
                    'name': 'Census Income Dataset',
                    'description': 'Adult census income data for fairness testing',
                    'format': 'CSV',
                    'file_size': 3400000
                },
                {
                    'id': 2,
                    'name': 'Credit Application Dataset',
                    'description': 'Credit approval decisions with demographic information',
                    'format': 'CSV',
                    'file_size': 2100000
                },
                {
                    'id': 3,
                    'name': 'Medical Diagnosis Dataset',
                    'description': 'Patient data with diagnostic outcomes',
                    'format': 'JSON',
                    'file_size': 4800000
                }
            ]
            return Response(sample_data)
        
        # Return real dataset info
        serializer = self.get_serializer(Dataset.objects.all(), many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def upload(self, request):
        """Upload a new dataset file"""
        try:
            # Get file from request
            uploaded_file = request.FILES.get('file')
            if not uploaded_file:
                return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get metadata
            name = request.data.get('name', uploaded_file.name)
            description = request.data.get('description', f'Uploaded dataset: {name}')
            
            # Save file to uploads directory
            file_path = os.path.join('uploads', uploaded_file.name)
            with open(file_path, 'wb+') as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)
            
            # Create dataset record
            dataset = Dataset.objects.create(
                name=name,
                description=description,
                file_path=file_path,
                file_size=uploaded_file.size,
                format='CSV'  # Assuming CSV format for now
            )
            
            serializer = self.get_serializer(dataset)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ModelViewSet(viewsets.ModelViewSet):
    queryset = Model.objects.all()
    serializer_class = ModelSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def sample_models(self, request):
        """Return some sample models for demo purposes"""
        sample_data = [
            {
                'id': 1,
                'name': 'Income Prediction Model',
                'description': 'Random Forest model to predict income levels',
                'model_type': 'classification'
            },
            {
                'id': 2,
                'name': 'Credit Scoring Model',
                'description': 'Gradient Boosting classifier for credit worthiness',
                'model_type': 'classification'
            },
            {
                'id': 3,
                'name': 'Disease Risk Predictor',
                'description': 'Neural network for medical risk assessment',
                'model_type': 'classification'
            }
        ]
        return Response(sample_data)

@csrf_exempt
def feedback_list(request):
    """
    Simple feedback endpoint with no authentication
    """
    if request.method == 'GET':
        feedbacks = Feedback.objects.all().order_by('-created_at')
        serializer = FeedbackSerializer(feedbacks, many=True)
        return JsonResponse(serializer.data, safe=False)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Determine sentiment based on rating
            rating = data.get('rating', 3)
            if rating >= 4:  # 4-5 stars is positive
                sentiment = 'positive'
            elif rating <= 2:  # 1-2 stars is negative
                sentiment = 'negative'
            else:  # 3 stars is neutral
                sentiment = 'neutral'
            
            feedback = Feedback.objects.create(
                name=data.get('name', ''),
                email=data.get('email', ''),
                rating=rating,
                comment=data.get('comment', ''),
                sentiment=sentiment
            )
            return JsonResponse({
                'id': feedback.id,
                'name': feedback.name,
                'email': feedback.email,
                'rating': feedback.rating,
                'comment': feedback.comment,
                'sentiment': feedback.sentiment,
                'created_at': feedback.created_at.isoformat()
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def feedback_detail(request, pk):
    """
    Retrieve or delete a feedback entry
    """
    try:
        feedback = Feedback.objects.get(pk=pk)
    except Feedback.DoesNotExist:
        return JsonResponse({'error': 'Feedback not found'}, status=404)
    
    if request.method == 'GET':
        serializer = FeedbackSerializer(feedback)
        return JsonResponse(serializer.data)
    
    elif request.method == 'DELETE':
        feedback.delete()
        return JsonResponse({}, status=204)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
