from rest_framework import serializers
from .models import *

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'


class CandidateDetailSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='Person.User.first_name')
    last_name = serializers.CharField(source='Person.User.last_name')
    disponibility = serializers.CharField(source='Person.disponibility')
    country = serializers.CharField(source='Person.country')
    
    class Meta:
        model = Candidate
        fields = ['first_name', 'last_name', 'disponibility', 'country', 'request_date']


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'

