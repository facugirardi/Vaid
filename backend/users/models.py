from django.db import models
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin
)


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
    PermissionLevel = models.IntegerField()


class UserAccount(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, max_length=255)
    user_type = models.ForeignKey(UserType, on_delete=models.CASCADE)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email


class TagType(models.Model):
    Name = models.CharField(max_length=255)

class Tag(models.Model):
    Name = models.CharField(max_length=255)
    Type = models.ForeignKey(TagType, on_delete=models.CASCADE) 

class Organization(models.Model):
    Name = models.CharField(max_length=255)
    Description = models.CharField(max_length=255)
    PhoneNumber = models.CharField(max_length=255)  
    OrgLogo = models.CharField(max_length=255)
    Email = models.EmailField(max_length=255)
    WebeSite = models.CharField(max_length=255)

    def UploadLogo(self):
        return

class Candidate(models.Model):
    Name = models.CharField(max_length=255)
    LastName = models.CharField(max_length=255)
    PhoneNumber = models.CharField(max_length=255)
    Disponibility = models.TimeField()
    BornDate = models.DateField()

    def SendForm(self):
        return
    
    def GenerateTag(self):
        return

class CandidateTagDetails(models.Model):
    Candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    Tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

class Person(models.Model):
    Name = models.CharField(max_length=255)
    LastName = models.CharField(max_length=255)
    PhoneNumber = models.CharField(max_length=255)

class PersonTagDetails(models.Model):
    Person = models.ForeignKey(Person, on_delete=models.CASCADE)
    Tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

class Headquarters(models.Model):
    Name = models.CharField(max_length=255)
    Description = models.CharField(max_length=255)
    
class Inventory(models.Model):
    Headquarter = models.ForeignKey(Headquarters, on_delete=models.CASCADE)

    def AsignHeadquarter(self):
        return
    
    def ListInventory(self):
        return
    
    def EditCuantity(self):
        return

class ProductCategory(models.Model):
    Name = models.CharField(max_length=255)

class ProductStatus(models.Model):
    Name = models.CharField(max_length=255)

class Product(models.Model):
    Name = models.CharField(max_length=255)
    Description = models.CharField(max_length=255)
    Category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE)
    Status = models.ForeignKey(ProductStatus, on_delete=models.CASCADE)

class ProductInventoryDetails(models.Model):
    Product = models.ForeignKey(Product, on_delete=models.CASCADE)
    Inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    Cuantity = models.IntegerField()

class Task(models.Model):
    Name = models.CharField(max_length=255)
    Description = models.CharField(max_length=255)
    Date = models.DateField()
    Time = models.TimeField()

    def ListTasks(self):
        return
    
    def AddTask(self):
        return
    
    def EditTask(self):
        return
    
    def DeleteTask(self):
        return
    
    def DirectTask(self):
        return

class TaskPersonDetails(models.Model):
    Person = models.ForeignKey(Person, on_delete=models.CASCADE)
    Task = models.ForeignKey(Task, on_delete=models.CASCADE)

class Event(models.Model):
    Name = models.CharField(max_length=255)
    Description = models.CharField(max_length=255)
    Date = models.DateField()
    Time = models.TimeField()

    def ListEvents(self):
        return
    
    def AddEvent(self):
        return
    
    def EditEvent(self):
        return

class EventReport(models.Model):
    Title = models.CharField(max_length=255)
    Description = models.CharField(max_length=255)  
    Event = models.ForeignKey(Event, on_delete=models.CASCADE)
    User = models.ForeignKey(User, on_delete=models.CASCADE)

class Guest(models.Model):
    Name = models.CharField(max_length=255)
    LastName = models.CharField(max_length=255)
    Phone = models.CharField(max_length=255)
    Event = models.ForeignKey(Event, on_delete=models.CASCADE)

class EventPersonDetails(models.Model):
    Person = models.ForeignKey(Person, on_delete=models.CASCADE)
    Event = models.ForeignKey(Event, on_delete=models.CASCADE)

class Donation(models.Model):
    Name = models.CharField(max_length=255)
    Description = models.CharField(max_length=255)
    Product = models.ForeignKey(Product, on_delete=models.CASCADE)
    User = models.ForeignKey(User, on_delete=models.CASCADE)
    Date = models.DateField()

    def ListDonations(self):
        return
    
    def AddDonation(self):
        return
    
    def EditDonation(self):
        return

class DonationPersonDetails(models.Model):
    Person = models.ForeignKey(Person, on_delete=models.CASCADE)
    Donation = models.ForeignKey(Donation, on_delete=models.CASCADE)

class DonationProductDetails(models.Model):
    Product = models.ForeignKey(Product, on_delete=models.CASCADE)
    Donation = models.ForeignKey(Donation, on_delete=models.CASCADE)

class OperationType(models.Model):
    Description = models.CharField(max_length=255)

class Operation(models.Model):
    Description = models.CharField(max_length=255)
    Date = models.DateField()
    Time = models.TimeField()
    User = models.ForeignKey(User, on_delete=models.CASCADE)
    Type = models.ForeignKey(OperationType, on_delete=models.CASCADE)

    def ListOperations(self):
        return
    
    def AddOperation(self):
        return
    
    def EditOperation(self):
        return 

class OperationProductDetails(models.Model):
    Product = models.ForeignKey(Product, on_delete=models.CASCADE)
    Operation = models.ForeignKey(Operation, on_delete=models.CASCADE)

class Video(models.Model):
    Title = models.CharField(max_length=255)
    Description = models.CharField(max_length=255)
    Url = models.CharField(max_length=255)
    User = models.ForeignKey(User, on_delete=models.CASCADE)

    def UploadVideo(self):
        return
    
    def ListVideos(self):
        return
    
    def EditDescription(self):
        return
    
    def EditTitle(self):
        return

    def DeleteVideo(self):
        return
    

