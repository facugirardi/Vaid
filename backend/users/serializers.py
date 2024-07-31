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
    user_id = serializers.CharField(source='Person.User.id')
    born_date = serializers.DateField(source='Person.born_date')

    class Meta:
        model = Candidate
        fields = ['first_name', 'last_name', 'disponibility', 'country', 'request_date', 'user_id', 'born_date', 'interviewed', 'id']

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

#---------------------------------------------------------------------

class HeadquartersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Headquarters
        fields = '__all__'

class OrganizationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizations
        fields = '__all__'

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statuses
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = '__all__'

class InventoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventories
        fields = '__all__'

class ProductInventoryDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductInventoryDetails
        fields = '__all__'