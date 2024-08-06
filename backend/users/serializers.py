from rest_framework import serializers
from .models import *

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'


class CandidateDetailSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='Person.User.first_name')
    last_name = serializers.CharField(source='Person.User.last_name')
    disponibility = serializers.CharField(source='Person.available_days')
    available_times = serializers.CharField(source='Person.available_times')
    country = serializers.CharField(source='Person.country')
    user_id = serializers.CharField(source='Person.User.id')
    born_date = serializers.DateField(source='Person.born_date')

    class Meta:
        model = Candidate
        fields = ['first_name', 'last_name', 'disponibility', 'country', 'request_date', 'user_id', 'born_date', 'interviewed', 'id']


class PersonSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='User.first_name')
    last_name =serializers.CharField(source='User.last_name')
    


    class Meta:
        model = Person
        fields = '__all__'

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        extra_kwargs = {
            'date': {'required': True},
            'endDate': {'required': True}
        }

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
