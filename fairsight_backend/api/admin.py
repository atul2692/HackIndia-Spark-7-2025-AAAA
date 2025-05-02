from django.contrib import admin
from django.utils.html import format_html
from django.template.response import TemplateResponse
from django.urls import path
from .models import FairnessAnalysis, Dataset, Model, Feedback

@admin.register(FairnessAnalysis)
class FairnessAnalysisAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'fairness_score', 'ethical_score', 'bias_detected', 'created_at')
    list_filter = ('status', 'bias_detected')
    search_fields = ('name', 'description')

@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    list_display = ('name', 'format', 'file_size', 'created_at')
    list_filter = ('format',)
    search_fields = ('name', 'description')

@admin.register(Model)
class ModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'model_type', 'created_at')
    list_filter = ('model_type',)
    search_fields = ('name', 'description')

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'rating', 'sentiment_display', 'created_at')
    list_filter = ('rating', 'sentiment', 'created_at')
    search_fields = ('name', 'email', 'comment')
    
    def sentiment_display(self, obj):
        """Display sentiment with colors"""
        if obj.sentiment == 'positive':
            return format_html('<span style="color: green; font-weight: bold;">Positive</span>')
        elif obj.sentiment == 'negative':
            return format_html('<span style="color: red; font-weight: bold;">Negative</span>')
        else:
            return format_html('<span style="color: #FFD700; font-weight: bold;">Neutral</span>')
    
    sentiment_display.short_description = 'Sentiment'
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('sentiment-stats/', self.admin_site.admin_view(self.sentiment_stats_view), name='sentiment-stats'),
        ]
        return custom_urls + urls
    
    def sentiment_stats_view(self, request):
        """View to display sentiment statistics"""
        sentiment_stats = Feedback.get_sentiment_stats()
        
        context = {
            **self.admin_site.each_context(request),
            'title': 'Feedback Sentiment Statistics',
            'sentiment_stats': sentiment_stats,
            'feedback_count': Feedback.objects.count(),
            'opts': self.model._meta,
        }
        
        return TemplateResponse(request, 'admin/sentiment_stats.html', context)
    
    def changelist_view(self, request, extra_context=None):
        """Add sentiment stats to the changelist view"""
        extra_context = extra_context or {}
        extra_context['sentiment_stats'] = Feedback.get_sentiment_stats()
        extra_context['feedback_count'] = Feedback.objects.count()
        return super().changelist_view(request, extra_context=extra_context)
