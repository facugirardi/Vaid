from django.db import models
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin
)
from django.utils import timezone


class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        email = email.lower()

        user = self.model(
            email=email,
            **kwargs
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None, **kwargs):
        user = self.create_user(
            email,
            password=password,
            **kwargs
        )

        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class UserType(models.Model):
    Usertype = models.CharField(max_length=255)
    permission_level = models.IntegerField(default=1) 


class UserAccount(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, max_length=255)
    user_type = models.IntegerField(default=1)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    is_form = models.BooleanField(default=False)
    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email


class TagType(models.Model):
    name = models.CharField(max_length=255)


class Organization(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    website = models.CharField(max_length=255)
    User = models.ForeignKey(UserAccount, on_delete=models.CASCADE) 

class Person(models.Model):
    User = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=255, default='000-000-0000')
    address = models.CharField(max_length=255, default='')
    disponibility = models.CharField(max_length=255, default='')
    born_date = models.DateField(default=timezone.now)
    country = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    profession = models.CharField(max_length=255, blank=True, null=True)
    experience = models.TextField(blank=True, null=True)
    street_name = models.CharField(max_length=255, blank=True, null=True)
    street_number = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    available_days = models.JSONField(default=list) 
    available_times = models.JSONField(default=list)  
    modality = models.CharField(max_length=255, blank=True, null=True)
    topics = models.CharField(max_length=255, blank=True, null=True)
    goals = models.TextField(blank=True, null=True)
    motivations = models.TextField(blank=True, null=True)

class PersonOrganizationDetails(models.Model):
    Person = models.ForeignKey(Person, on_delete=models.CASCADE)
    Organization = models.ForeignKey(Organization, on_delete=models.CASCADE)


class Candidate(models.Model):
    #responses (cuando esten las preguntas del formulario, agregar las respuestas)

    interviewed = models.BooleanField(default=False)
    request_date = models.DateField(default=timezone.now)
    Person = models.ForeignKey(Person, on_delete=models.CASCADE) 
    Organization = models.ForeignKey(Organization, on_delete=models.CASCADE)


class Headquarter(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    Organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

class Inventory(models.Model):
    Headquarter = models.ForeignKey(Headquarter, on_delete=models.CASCADE)


class ProductCategory(models.Model):
    name = models.CharField(max_length=255)


class ProductStatus(models.Model):
    name = models.CharField(max_length=255)


class Product(models.Model):
    name = models.CharField(max_length=255)
    expDate = models.DateField(null=True, default=None) 
    Category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE)
    Status = models.ForeignKey(ProductStatus, on_delete=models.CASCADE)


class ProductInventoryDetails(models.Model):
    Product = models.ForeignKey(Product, on_delete=models.CASCADE)
    Inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    cuantity = models.IntegerField()


class Task(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()
    endDate = models.DateField()
    time = models.TimeField()
    endTime = models.TimeField()
    file = models.FileField(upload_to='tasks/', null=True, blank=True)
    state = models.CharField(max_length=255)
    Organization = models.ForeignKey(Organization, on_delete=models.CASCADE) 


class TaskPersonDetails(models.Model):
    Person = models.ForeignKey(Person, on_delete=models.CASCADE)
    Task = models.ForeignKey(Task, on_delete=models.CASCADE)


class Event(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()
    endDate = models.DateField()
    time = models.TimeField()
    endTime = models.TimeField()
    file = models.FileField(upload_to='events/', null=True, blank=True)
    state = models.CharField(max_length=255)
    Organization = models.ForeignKey(Organization, on_delete=models.CASCADE) 

class EventReport(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)  
    Event = models.ForeignKey(Event, on_delete=models.CASCADE)
    User = models.ForeignKey(UserAccount, on_delete=models.CASCADE)


class Guest(models.Model):
    name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=255)
    Event = models.ForeignKey(Event, on_delete=models.CASCADE)


class EventPersonDetails(models.Model):
    Person = models.ForeignKey(Person, on_delete=models.CASCADE)
    Event = models.ForeignKey(Event, on_delete=models.CASCADE)


class Donation(models.Model):
    description = models.CharField(max_length=255, default='General donation')
    date = models.DateField(default=timezone.now)
    Organization = models.ForeignKey(Organization, on_delete=models.CASCADE)


class DonationProductDetails(models.Model):
    Product = models.ForeignKey(Product, on_delete=models.CASCADE)
    Donation = models.ForeignKey(Donation, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)


class OperationType(models.Model):
    description = models.CharField(max_length=255)


class Operation(models.Model):
    description = models.CharField(max_length=255, default='Regular operation')
    date = models.DateField(default=timezone.now)
    time = models.TimeField(default=timezone.now)
    Organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    Type = models.ForeignKey(OperationType, on_delete=models.CASCADE)


class OperationProductDetails(models.Model):
    Product = models.ForeignKey(Product, on_delete=models.CASCADE)
    Operation = models.ForeignKey(Operation, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)


class Video(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255, default='Video content')
    url = models.CharField(max_length=255, default='http://example.com')
    Organization = models.ForeignKey(Organization, on_delete=models.CASCADE)


class Image(models.Model):
    image = models.ImageField(upload_to='images/')
    alt = models.CharField(max_length=255, default='logo')
    User = models.ForeignKey(UserAccount, on_delete=models.CASCADE)

    def __str__(self):
        return self.alt


class History(models.Model):
    action = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    Organization = models.ForeignKey(Organization, on_delete=models.CASCADE)  # Aquí asegúrate de que es headquarter, no headquarter_id
    date = models.DateField(default=timezone.now)

class Tag(models.Model):
    name = models.CharField(max_length=255)
    isAdmin = models.BooleanField() 
    Organization = models.ForeignKey(Organization, on_delete=models.CASCADE, default=1)


class PersonTagDetails(models.Model):
    Person = models.ForeignKey(Person, on_delete=models.CASCADE)
    Tag = models.ForeignKey(Tag, on_delete=models.CASCADE)


class TaskTagDetails(models.Model):
    Tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    Task = models.ForeignKey(Task, on_delete=models.CASCADE)


class Invitation(models.Model):
    Event = models.ForeignKey(Event, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)
