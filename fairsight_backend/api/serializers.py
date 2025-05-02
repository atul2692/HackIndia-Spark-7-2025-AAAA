from rest_framework import serializers
from .models import FairnessAnalysis, Dataset, Model, Feedback

class FairnessAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = FairnessAnalysis
        fields = '__all__'
        
class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = '__all__'
        
class ModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__' 