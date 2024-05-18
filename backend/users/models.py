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


class UserAccount(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, max_length=255)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email

class UserTypes(models.Model):
    Usertype = models.CharField(max_length=255)
    PermissionLevel = models.IntegerField()

class User(models.Model):
    Email = models.EmailField(max_length=255)
    Password = models.CharField(max_length=255)

    def ChangePasword(self):
        return

    def CreateTask(self):
        return

    def CreateEvent(self):
        return

    def CreateDonation(self):
        return

    def CreateInventory(self):
        return

    def CreateSede(self):
        return

    def RegistUser(self):
        return
        
class Organization(models.Model):
    Name = models.CharField(max_length=255)
    Description = models.CharField(max_length=255)
    PhoneNumber = models.CharField(max_length=255)  
    OrgLogo = models.CharField(max_length=255)
    Email = models.EmailField(max_length=255)
    WebeSite = models.CharField(max_length=255)

class Candidate(models.Model):
    Name = models.CharField(max_length=255)
    LastName = models.CharField(max_length=255)
    PhoneNumber = models.CharField(max_length=255)
    Disponibility = models.TimeField()
    BornDate = models.DateField()

class Person(models.Model):
    Name = models.CharField(max_length=255)
    LastName = models.CharField(max_length=255)
    PhoneNumber = models.CharField(max_length=255)

class Headquarters(models.Model):
    Name = models.CharField(max_length=255)
    Description = models.CharField(max_length=255)
    
class Inventory(models.Model):
    Headquarter = models.ForeignKey(Headquarters, on_delete=models.CASCADE)

class ProductCategory(models.Model):
    Name = models.CharField(max_length=255)

class ProductEstate(models.Model):
    Name = models.CharField(max_length=255)
        


