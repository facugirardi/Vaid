from rest_framework import serializers
from .models import *
from django.core.exceptions import ValidationError
from datetime import datetime

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'

class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscription
        fields = ['email']

class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'


class CandidateDetailSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='Person.User.first_name')
    last_name = serializers.CharField(source='Person.User.last_name')
    disponibility = serializers.CharField(source='Person.available_days')
    available_times = serializers.CharField(source='Person.available_times')
    country = serializers.CharField(source='Person.country')
    user_id = serializers.CharField(source='Person.User.id')
    born_date = serializers.DateField(source='Person.born_date')
    profession = serializers.DateField(source='Person.profession')
    experience = serializers.DateField(source='Person.experience')
    street_name = serializers.DateField(source='Person.street_name')
    street_number = serializers.DateField(source='Person.street_number')
    city = serializers.DateField(source='Person.city')
    modality = serializers.DateField(source='Person.modality')
    topics = serializers.DateField(source='Person.topics')
    goals = serializers.DateField(source='Person.goals')
    motivations = serializers.DateField(source='Person.motivations')
    email = serializers.CharField(source='Person.User.email')
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Candidate
        fields = '__all__'
        
    def get_tags(self, obj):
        person = obj.Person  # Asumiendo que Candidate tiene una relación directa con Person
        tags = PersonTagDetails.objects.filter(Person=person).select_related('Tag').all()
        return TagSerializer([tag_detail.Tag for tag_detail in tags], many=True).data


class PersonSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='User.first_name')
    last_name =serializers.CharField(source='User.last_name')
    tags = serializers.SerializerMethodField()
    email = serializers.CharField(source='User.email')


    class Meta:
        model = Person
        fields = '__all__'
        
    def get_tags(self, obj):
        # `obj` es la instancia de Person ya que estamos en PersonSerializer
        tags = PersonTagDetails.objects.filter(Person=obj).select_related('Tag').all()
        return TagSerializer([tag_detail.Tag for tag_detail in tags], many=True).data

class OrganizationSerializer(serializers.ModelSerializer):    
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = '__all__'

    def get_profile_image(self, obj):
        # Obtiene la imagen del usuario principal de la organización
        user_image = Image.objects.filter(User=obj.User).first()
        if user_image:
            return user_image.image.url  # Retorna la URL de la imagen si existe
        return None

    # Definimos una función de validación para los formatos de imagen permitidos.
def validate_image_format(value):
    if value:
        # Obtenemos el tipo de archivo del contenido de la imagen
        valid_formats = ['image/png', 'image/jpeg', 'image/jpg']
        if value.content_type not in valid_formats:
            raise ValidationError("La imagen debe ser de tipo PNG, JPG o JPEG.")
    return value

class TaskSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(validators=[validate_image_format], required=False)

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
    image = serializers.ImageField(validators=[validate_image_format], required=False)

    class Meta:
        model = Event
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Tag
        fields = '__all__'

    def get_member_count(self, obj):
        return PersonTagDetails.objects.filter(Tag=obj).values('Person').distinct().count()

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
        fields = ['id', 'name', 'expDate', 'Category', 'Status', 'total_quantity', 'category_name', 'status_name']
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
    first_name = serializers.CharField(source='Person.User.first_name', read_only=True)
    last_name = serializers.CharField(source='Person.User.last_name', read_only=True)
    email = serializers.CharField(source='Person.User.email', read_only=True)

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
    product_name = serializers.CharField(source='Product.name', read_only=True)
    class Meta:
        model = OperationProductDetails
        fields = ['Product', 'Operation', 'product_name']

#Esta serializer es util par acundo queremos validar atraves del serializador sin tener el id de la Operation o Donation, ya que se guarda despues de la creacion de la Operation o Donation
class ProductSerializerChild(serializers.Serializer):
    product = serializers.IntegerField()
    quantity = serializers.IntegerField()

class OperationSerializer(serializers.ModelSerializer):
    time = serializers.SerializerMethodField()

    class Meta:
        model = Operation
        fields = '__all__'

    def get_time(self, obj):
        # Si `time` es un objeto `datetime`, extrae solo la hora
        if isinstance(obj.time, datetime):
            return obj.time.time()  # Obtén solo la hora
        return obj.time  # Retorna el valor si ya es `time`

    # def create(self, validated_data):
    #     products_data = validated_data.pop('products')
    #     operation = Operation.objects.create(**validated_data)

    #     for product_data in products_data:
    #         quantity = product_data['quantity']
    #         product_id = product_data['product']
    #         product = Product.objects.get(id=product_id)
            
    #         OperationProductDetails.objects.create(Operation=operation, Product_id=product_id, quantity=quantity)
            
    #         try:
    #             product_inventory = ProductInventoryDetails.objects.get(Product=product)
    #             product_inventory.cuantity += quantity
    #             product_inventory.save()
    #         except ProductInventoryDetails.DoesNotExist:
    #             # Handle case where the ProductInventoryDetails does not exist
    #             pass
    #     return operation

class EventPersonDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventPersonDetails
        fields = '__all__'

class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = '__all__'


class DonationProductDetailsSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='Product.name')

    class Meta:
        model = DonationProductDetails
        fields = '__all__'


class DonationSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()

    class Meta:
        model = Donation
        fields = '__all__'

    def get_date(self, obj):
        # Convert datetime to date
        if isinstance(obj.date, datetime):
            return obj.date.date()
        return obj.date

    # def create(self, validated_data):
    #     products_data = validated_data.pop('products')
    #     donation = Donation.objects.create(**validated_data)
        
    #     for product_data in products_data:
    #         product_id = product_data['product']
    #         quantity = product_data['quantity']
    #         product = Product.objects.get(id=product_id)
            
    #         # Create DonationProductDetails entry
    #         DonationProductDetails.objects.create(
    #             Donation=donation, 
    #             Product=product,  
    #             quantity=quantity
    #         )
            
    #         # Update ProductInventoryDetails
    #         try:
    #             product_inventory = ProductInventoryDetails.objects.get(Product=product)
    #             product_inventory.cuantity += quantity
    #             product_inventory.save()
    #         except ProductInventoryDetails.DoesNotExist:
    #             # Handle case where the ProductInventoryDetails does not exist
    #             pass

    #     return donation
    


