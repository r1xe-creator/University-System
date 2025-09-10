from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from .views import DegreeViewSet, CohortViewSet, ModuleViewSet, StudentViewSet, GradeViewSet

# Create and define our router
router = DefaultRouter()
router.register(r'degree', DegreeViewSet, basename='degree')
router.register(r'cohort', CohortViewSet, basename='cohort')
router.register(r'module', ModuleViewSet, basename='module')
router.register(r'student', StudentViewSet, basename='student')
router.register(r'grade', GradeViewSet, basename='grade')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]