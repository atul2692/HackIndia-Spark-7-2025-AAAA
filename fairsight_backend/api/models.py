from django.db import models
import os
from django.conf import settings

# Create your models here.

class FairnessAnalysis(models.Model):
    ANALYSIS_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=ANALYSIS_STATUS_CHOICES, default='pending')
    fairness_score = models.FloatField(null=True, blank=True)
    ethical_score = models.FloatField(null=True, blank=True)
    bias_detected = models.BooleanField(default=False)
    report_data = models.JSONField(null=True, blank=True)
    
    def __str__(self):
        return self.name

class Dataset(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    file_path = models.CharField(max_length=500)
    file_size = models.IntegerField(null=True, blank=True)
    format = models.CharField(max_length=20)
    
    def __str__(self):
        return self.name
    
    @classmethod
    def load_sample_datasets(cls):
        """
        Load sample datasets from the samples directory
        """
        # Get all CSV files from the samples directory
        samples_dir = os.path.join(os.path.dirname(settings.BASE_DIR), 'samples')
        if not os.path.exists(samples_dir):
            return []
            
        datasets = []
        for filename in os.listdir(samples_dir):
            if filename.endswith('.csv'):
                file_path = os.path.join(samples_dir, filename)
                name = filename.replace('_', ' ').replace('.csv', '').title()
                
                # Check if dataset already exists
                if not cls.objects.filter(file_path=file_path).exists():
                    dataset = cls.objects.create(
                        name=name,
                        description=f"Sample dataset: {name}",
                        file_path=file_path,
                        file_size=os.path.getsize(file_path),
                        format='CSV'
                    )
                    datasets.append(dataset)
                    
        return datasets

class Model(models.Model):
    MODEL_TYPE_CHOICES = [
        ('classification', 'Classification'),
        ('regression', 'Regression'),
        ('clustering', 'Clustering'),
        ('nlp', 'Natural Language Processing'),
        ('cv', 'Computer Vision'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    model_type = models.CharField(max_length=20, choices=MODEL_TYPE_CHOICES)
    file_path = models.CharField(max_length=500, null=True, blank=True)
    
    def __str__(self):
        return self.name

class Feedback(models.Model):
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]
    
    SENTIMENT_CHOICES = [
        ('positive', 'Positive'),
        ('neutral', 'Neutral'),
        ('negative', 'Negative'),
    ]
    
    name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField()
    sentiment = models.CharField(max_length=20, choices=SENTIMENT_CHOICES, default='neutral')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name or 'Anonymous'} - {self.get_rating_display()}"
    
    @classmethod
    def get_sentiment_stats(cls):
        """Return sentiment statistics as percentages"""
        total = cls.objects.count()
        if total == 0:
            return {
                'positive': 0,
                'neutral': 0,
                'negative': 0
            }
        
        positive_count = cls.objects.filter(sentiment='positive').count()
        neutral_count = cls.objects.filter(sentiment='neutral').count()
        negative_count = cls.objects.filter(sentiment='negative').count()
        
        return {
            'positive': round((positive_count / total) * 100, 1),
            'neutral': round((neutral_count / total) * 100, 1),
            'negative': round((negative_count / total) * 100, 1)
        }
