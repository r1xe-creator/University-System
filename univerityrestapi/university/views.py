from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend as filters
from .models import Degree, Cohort, Module, Student, Grade
from .serializers import DegreeSerializer, CohortSerializer, ModuleSerializer, StudentSerializer, GradeSerializer

class DegreeViewSet(viewsets.ModelViewSet):
    serializer_class = DegreeSerializer
    queryset = Degree.objects.all()
    permission_classes = [AllowAny]

class CohortViewSet(viewsets.ModelViewSet):
    serializer_class = CohortSerializer
    permission_classes = [AllowAny]
    filter_backends = (filters,)
    filterset_fields = ['degree']
    queryset = Cohort.objects.all()

class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [AllowAny]
    filter_backends = (filters,)
    filterset_fields = ['cohort']
    queryset = Student.objects.all()

class ModuleViewSet(viewsets.ModelViewSet):
    serializer_class = ModuleSerializer
    permission_classes = [AllowAny]
    filter_backends = (filters,)
    filterset_fields = ['delivered_to']
    queryset = Module.objects.all()

class GradeViewSet(viewsets.ModelViewSet):
    serializer_class = GradeSerializer
    permission_classes = [AllowAny]
    filter_backends = (filters,)
    filterset_fields = ['student', 'module']
    queryset = Grade.objects.all()