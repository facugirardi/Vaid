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

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class PersonTagDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonTagDetails
        fields = '__all__'

class TaskTagDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskTagDetails
        fields = '__all__'

class AssignTagsToPersonSerializer(serializers.Serializer):
    tags = serializers.ListField(child=serializers.IntegerField())
    person = serializers.PrimaryKeyRelatedField(queryset=Person.objects.all())

class HeadquarterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Headquarter
        fields = ['name', 'address', 'id']  # Omitir el campo Organization si se lo asignará manualmente

    def create(self, validated_data):
        # Excluir Organization del validated_data
        organization = validated_data.pop('Organization')
        headquarter = Headquarter.objects.create(**validated_data, Organization=organization)
        return headquarter

class InventorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Inventory
        fields = '__all__'

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'

class ProductStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductStatus
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    Category = serializers.PrimaryKeyRelatedField(queryset=ProductCategory.objects.all())
    Status = serializers.PrimaryKeyRelatedField(queryset=ProductStatus.objects.all())
    category_name = serializers.CharField(source='Category.name', read_only=True)
    status_name = serializers.CharField(source='Status.name', read_only=True)
    total_quantity = serializers.SerializerMethodField(required=False)

    class Meta:
        model = Product
        fields = ['id', 'name', 'expDate', 'Category', 'Status', 'total_quantity']
        extra_kwargs = {
            'expDate': {'required': False, 'allow_null': True}  # Permitir null
        }
    
    def get_total_quantity(self, obj):
        # Calcula la cantidad total si el objeto tiene la anotación total_quantity
        return getattr(obj, 'total_quantity', None)    


class ProductInventoryDetailsSerializer(serializers.ModelSerializer):
    Product = ProductSerializer()

    class Meta:
        model = ProductInventoryDetails
        fields = '__all__'

class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = '__all__'


class EventPersonSerializer(serializers.ModelSerializer):
    Person = PersonSerializer()

    class Meta:
        model = EventPersonDetails
        fields = '__all__'

class InvitedEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = '__all__'

class TaskPersonDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskPersonDetails
        fields = '__all__'

class OperationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationType
        fields = '__all__'

class OperationProductDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationProductDetails
        fields = ['Product', 'Operation']

class OperationSerializer(serializers.ModelSerializer):
    products = serializers.ListField(child=serializers.IntegerField(), write_only=True)

    class Meta:
        model = Operation
        fields = ['id', 'description', 'date', 'time', 'Organization', 'Type', 'products']

    def create(self, validated_data):
        products_data = validated_data.pop('products')
        operation = Operation.objects.create(**validated_data)
        for product_id in products_data:
            OperationProductDetails.objects.create(Operation=operation, Product_id=product_id)
        return operation

class EventPersonDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventPersonDetails
        fields = '__all__'

class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = '__all__'