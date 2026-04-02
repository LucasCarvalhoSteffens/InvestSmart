from rest_framework.generics import ListAPIView
from apps.valuation.models import BarsiAnalysis, GrahamAnalysis, ProjectedAnalysis
from apps.valuation.api.history_serializers import (
    BarsiAnalysisSerializer,
    GrahamAnalysisSerializer,
    ProjectedAnalysisSerializer,
)


class GrahamHistoryAPIView(ListAPIView):
    serializer_class = GrahamAnalysisSerializer

    def get_queryset(self):
        return GrahamAnalysis.objects.select_related("asset").all()


class ProjectedHistoryAPIView(ListAPIView):
    serializer_class = ProjectedAnalysisSerializer

    def get_queryset(self):
        return ProjectedAnalysis.objects.select_related("asset").all()


class BarsiHistoryAPIView(ListAPIView):
    serializer_class = BarsiAnalysisSerializer

    def get_queryset(self):
        return BarsiAnalysis.objects.select_related("asset").all()