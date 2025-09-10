from rest_framework import serializers
from .models import Degree, Cohort, Module, Student, Grade

class DegreeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Degree
        fields = ['url', 'full_name', 'shortcode']

class CohortSerializer(serializers.HyperlinkedModelSerializer):
    degree = serializers.HyperlinkedRelatedField(
        queryset=Degree.objects.all(),
        view_name='degree-detail'
    )

    class Meta:
        model = Cohort
        fields = ['url', 'id', 'year', 'degree', 'name']

class ModuleSerializer(serializers.HyperlinkedModelSerializer):
    delivered_to = serializers.HyperlinkedRelatedField(
        many=True,
        queryset=Cohort.objects.all(),
        view_name='cohort-detail'
    )

    class Meta:
        model = Module
        fields = ['url', 'code', 'full_name', 'delivered_to', 'ca_split']

class StudentSerializer(serializers.HyperlinkedModelSerializer):
    cohort = serializers.HyperlinkedRelatedField(
        queryset=Cohort.objects.all(),
        view_name='cohort-detail'
    )

    class Meta:
        model = Student
        fields = ['url', 'student_id', 'first_name', 'last_name', 'cohort', 'email']

class GradeSerializer(serializers.HyperlinkedModelSerializer):
    student = serializers.HyperlinkedRelatedField(
        queryset=Student.objects.all(),
        view_name='student-detail'
    )
    module = serializers.HyperlinkedRelatedField(
        queryset=Module.objects.all(),
        view_name='module-detail'
    )

    class Meta:
        model = Grade
        fields = ['url', 'id', 'student', 'module', 'ca_mark']