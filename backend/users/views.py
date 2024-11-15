from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from djoser.social.views import ProviderAuthView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .models import UserAccount as User
from rest_framework.permissions import AllowAny  
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import json
from django.db.models import Sum
from django.http import Http404
from rest_framework.permissions import IsAuthenticated
from .models import Organization, Person, Image
from .serializers import *
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from django.core.mail import send_mail
from .serializers import GuestSerializer
from rest_framework.parsers import MultiPartParser, FormParser
import os
from rest_framework.exceptions import ValidationError
from django.db.models import Sum, F, Case, When, Value
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta, time, datetime
from dateutil.relativedelta import relativedelta
from collections import defaultdict
from .models import TaskHistory
import pandas as pd
from .ai import *
from docx import Document

class UpdatePersonView(APIView):
    permission_classes = [AllowAny]

    def put(self, request, person_id):
        user = User.objects.get(id=person_id)
        try:
            person = Person.objects.get(User=user)
        except Person.DoesNotExist:
            return Response({'error': 'Person not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PersonSerializer(person, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateOrganizationDescriptionView(APIView):
    permission_classes = [AllowAny]

    def put(self, request, organization_id):
        try:
            organization = Organization.objects.get(id=organization_id)
        except Organization.DoesNotExist:
            return Response({'error': 'Organization not found'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.get('description')
        if data:
            organization.description = data
            organization.save()
            return Response({'description': organization.description}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Description is required'}, status=status.HTTP_400_BAD_REQUEST)


class SubscribeNewsletterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = NewsletterSubscriptionSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            subscription, created = NewsletterSubscription.objects.get_or_create(email=email)
            if created:
                return Response({'message': 'Subscribed successfully'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': 'Email already subscribed'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PersonOrganizationDetailsDeleteView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    
    def delete(self, request, *args, **kwargs):
        person_id = kwargs.get('person_id')
        organization_id = kwargs.get('organization_id')

        try:
            detail = PersonOrganizationDetails.objects.get(Person_id=person_id, Organization_id=organization_id)
            detail.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except PersonOrganizationDetails.DoesNotExist:
            return Response({'error': 'Details not found'}, status=status.HTTP_404_NOT_FOUND)
                          

class PersonOrganizationDetailsDeleteViewLeave(generics.GenericAPIView):
    permission_classes = [AllowAny]
    
    def delete(self, request, *args, **kwargs):
        user_id = kwargs.get('user_id')
        organization_id = kwargs.get('organization_id')

        try:
            user = User.objects.get(id=user_id)
            person = Person.objects.get(User=user)
            detail = PersonOrganizationDetails.objects.filter(Person=person, Organization_id=organization_id)
            detail.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except PersonOrganizationDetails.DoesNotExist:
            return Response({'error': 'Details not found'}, status=status.HTTP_404_NOT_FOUND)
                           

class ApplyOrgView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id, org_id):
        try:

            if not user_id or not org_id:
                return Response(
                    {'error': 'user_id and org_id are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = User.objects.get(id=user_id)
            organization = Organization.objects.get(id=org_id)
            person = Person.objects.get(User=user)

            candidate, created = Candidate.objects.get_or_create(Person=person, Organization=organization)

            if created:
                return Response(
                    {'message': 'Candidate successfully added to the organization!'},
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    {'message': 'Already applied to this organization.'},
                    status=status.HTTP_200_OK
                )

        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Organization.DoesNotExist:
            return Response(
                {'error': 'Organization not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Person.DoesNotExist:
            return Response(
                {'error': 'Person not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Error applying to organization: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserFormView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, user_id):
        try:
            data = request.data
            user = User.objects.get(id=user_id)
            person = Person.objects.get(User=user)
            person.date_of_birth = data.get('dateOfBirth')
            person.profession = data.get('profession')
            person.experience = data.get('experience')
            person.street_name = data.get('street')
            person.city = data.get('city')
            person.available_days = data.get('availableDays')
            person.available_times = data.get('availableTimes')
            person.modality = data.get('modality')
            person.topics = data.get('topics')
            person.goals = data.get('goals')
            person.motivations = data.get('motivations')
            person.save()

            user.is_form = True
            user.save()
            return Response({'message': 'Form data saved successfully!'}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Person.DoesNotExist:
            return Response({'error': 'Person not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RetrieveOrganizationExtView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            organization = Organization.objects.get(id=user_id)
            
            return Response(
                {'name': organization.name,
                 'description':organization.description,
                 'country':organization.country,
                 'userId':organization.User.id},
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Organization.DoesNotExist:
            return Response(
                {'error': 'Organization not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Error retrieving organization: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class RetrieveOrganizationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            organization = Organization.objects.get(User=user)
            
            return Response(
                {'id': organization.id,
                'name': organization.name,
                 'description':organization.description,
                 'country':organization.country},
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Organization.DoesNotExist:
            return Response(
                {'error': 'Organization not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Error retrieving organization: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RetrieveUserOrganizations(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            print('ok')
            user = User.objects.get(id=user_id)
            person = Person.objects.get(User=user)
            print('ok')
            organizations = Organization.objects.filter(personorganizationdetails__Person=person)
            organization_serializer = OrganizationSerializer(organizations, many=True)
            print('ok')
            return Response(
                {'organizations': organization_serializer.data},
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Person.DoesNotExist:
            return Response(
                {'error': 'Person not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(e)
            return Response(
                {'error': f'Error retrieving organizations: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class RetrievePersonView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            person = Person.objects.get(User=user)
            person_serializer = PersonSerializer(person)
            user_serializer = UserSerializer(user) 
            return Response(
                {'person': person_serializer.data,
                 'user': user_serializer.data},
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Person.DoesNotExist:
            return Response(
                {'error': 'Person not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Error retrieving person: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        

class ApproveCandidate(APIView):
    permission_classes = [AllowAny]

    def post(self, request, candidate_id):
        try:
            candidate = Candidate.objects.get(id=candidate_id)
            person = candidate.Person
            organization = candidate.Organization

            # Crear PersonOrganizationDetails
            PersonOrganizationDetails.objects.create(Person=person, Organization=organization)

            # Eliminar el candidato
            candidate.delete()

            return Response({'message': 'Candidate approved and added to organization'}, status=status.HTTP_200_OK)
        except Candidate.DoesNotExist:
            return Response({'error': 'Candidate not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RejectCandidate(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, candidate_id):
        try:
            candidate = Candidate.objects.get(id=candidate_id)
            candidate.delete()

            return Response({'message': 'Candidate rejected and deleted'}, status=status.HTTP_200_OK)
        except Candidate.DoesNotExist:
            return Response({'error': 'Candidate not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class OrgView(generics.ListAPIView):
    
    permission_classes = [AllowAny]
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

class CandidateDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, organization_id):
        try:
            organization = Organization.objects.get(id=organization_id)
        except Organization.DoesNotExist:
            return Response({'error': 'Organization not found'}, status=status.HTTP_404_NOT_FOUND)

        candidates = Candidate.objects.filter(Organization=organization)
        serializer = CandidateDetailSerializer(candidates, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RetrieveImageOrgView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        try:
            user_id = request.query_params.get('user_id')
            if not user_id:
                return Response(
                    {'error': 'User ID is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            organization = Organization.objects.get(id=user_id) 
            images = Image.objects.filter(User=organization.User)

            if images.exists():
                images_serializer = ImageSerializer(images, many=True)
                return Response(
                    {'images': images_serializer.data},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'error': 'No images found for the specified user'},
                    status=status.HTTP_404_NOT_FOUND
                )
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Error retrieving image: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RetrieveImageView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        try:
    
            user_id = request.query_params.get('user_id')
            if not user_id:
                return Response(
                    {'error': 'User ID is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = User.objects.get(id=user_id)
            images = Image.objects.filter(User=user)

            if images.exists():
                images_serializer = ImageSerializer(images, many=True)
                return Response(
                    {'images': images_serializer.data},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'error': 'No images found for the specified user'},
                    status=status.HTTP_404_NOT_FOUND
                )
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Error retrieving image: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UploadImageView(APIView):

    permission_classes = [AllowAny]
    def post(self, request):
        try:
            data = self.request.data
            user_id = data.get('user_id')                
            user = User.objects.get(id=user_id) 

            image = data['image']
            
            extension = image.name.split('.')[-1].lower()
            if extension not in ['jpg', 'jpeg', 'png']:
                raise ValidationError('Unsupported file extension. Please upload a JPG, JPEG or PNG image.')

            Image.objects.create(
                    image = image,
                    User = user
                )
            
            return Response(
                    {'success': 'Image Uploaded Successfully'},
                    status=status.HTTP_201_CREATED

                )
        except:
            return Response(
                {'error': 'Error Uploading Image'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                
            )


class CreatePerson(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            data = request.data
            user_id = data.get('user_id')
            user = User.objects.get(id=user_id)
            
            person = Person(
                phone_number=data.get('phone_number'),
                country=data.get('country'),
                description=data.get('description'),
                User=user  # Usuario obtenido por ID
            )
            person.save()

            return Response({'message': 'Person created successfully'}, status=status.HTTP_201_CREATED)

        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CreateOrganization(APIView):
    permission_classes = [AllowAny]  

    def post(self, request):
        try:
            data = request.data
            

            user_id = data.get('user_id')
            if not user_id:
                return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
            # Crear la organización
            organization = Organization(
                name=data.get('name'),
                description=data.get('description'),
                country=data.get('country'),
                website=data.get('website', ''),
                User=user
            )
            organization.save()

            return Response({'message': 'Organization created successfully'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# @method_decorator(csrf_exempt, name='dispatch')
class UserTypeUpdate(APIView):
    permission_classes = [AllowAny]  
    def patch(self, request, pk):
        try:
            data = json.loads(request.body)
            user = User.objects.get(pk=pk)
            user_type = data.get('user_type')
            is_completed = data.get('is_completed')

            if user_type is not None:
                user.user_type = user_type 
            if is_completed is not None:
                user.is_completed = is_completed

            user.save()
            return JsonResponse({'message': 'User updated successfully'}, status=200)
        except User.DoesNotExist:
            raise Http404("User not found")
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

class CheckAttendanceAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, event_id, user_id):
        event = get_object_or_404(Event, id=event_id)
        user = get_object_or_404(UserAccount, id=user_id)
        
        # Verificar si la persona ya está registrada como asistente
        if EventPersonDetails.objects.filter(Event=event, Person__User=user).exists():
            return Response({'is_attending': True}, status=200)
        else:
            return Response({'is_attending': False}, status=200)

class CheckUserType(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id, *args, **kwargs):
        try:
            user = User.objects.get(id=user_id)
            return Response({'user_type': user.user_type})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

class CheckCompleteView(APIView):
    permission_classes = [AllowAny]  

    def get(self, request, *args, **kwargs):
        user_id = kwargs.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            return Response({'is_completed': user.is_completed})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

class CustomProviderAuthView(ProviderAuthView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 201:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            response.set_cookie(
                'access',
                access_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )
            response.set_cookie(
                'refresh',
                refresh_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )

        return response


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            response.set_cookie(
                'access',
                access_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )
            response.set_cookie(
                'refresh',
                refresh_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )

        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')
        print(refresh_token)
        if refresh_token:
            request.data['refresh'] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')

            response.set_cookie(
                'access',
                access_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )

        return response


class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        access_token = request.COOKIES.get('access')

        if access_token:
            request.data['token'] = access_token

        return super().post(request, *args, **kwargs)


class LogoutView(APIView): 
    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie('access')
        response.delete_cookie('refresh')

        return response


# tasksViews
class TaskListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            organization = Organization.objects.get(id=pk)
        except Organization.DoesNotExist:
            return Response({'error': 'Organization not found'}, status=status.HTTP_404_NOT_FOUND)

        tasks = Task.objects.filter(Organization=organization)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    def post(self, request, pk):
        
        try:
            organization = Organization.objects.get(id=pk)
        except Organization.DoesNotExist:
            return Response({'error': 'Organization not found'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data['Organization'] = organization.id  # Asociar la tarea a la organización obtenida de la URL

        serializer = TaskSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskUpdateDestroyView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            task = Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = TaskSerializer(task)
        return Response(serializer.data)
        

    def put(self, request, pk):
        try:
            task = Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        
        serializer = TaskSerializer(task, data=data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            task = Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
        
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class OrganizationMembersView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, organization_id, *args, **kwargs):
        organization = get_object_or_404(Organization, id=organization_id)
        
        person_org_details = PersonOrganizationDetails.objects.filter(Organization=organization)
        members = [details.Person for details in person_org_details]
        
        serializer = PersonSerializer(members, many=True)
        return Response(serializer.data)

class EventListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            organization = Organization.objects.get(id=pk)
        except Organization.DoesNotExist:
            return Response({'error': 'Organization not found'}, status=status.HTTP_404_NOT_FOUND)

        events = Event.objects.filter(Organization=organization)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    #Se puede postear un evento a la vez ya que, sino gernera erro en la linea 550
    def post(self, request, pk):
        try:
            organization = Organization.objects.get(id=pk)
        except Organization.DoesNotExist:
            return Response({'error': 'Organization not found'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data['Organization'] = organization.id # Asociar la tarea a la organización obtenida de la URL

        serializer = EventSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class EventUpdateDestroyView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            event = Event.objects.get(id=pk)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = EventSerializer(event)
        return Response(serializer.data)
        

    def put(self, request, pk):
        try:
            event = Event.objects.get(id=pk)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        
        serializer = EventSerializer(event, data=data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            event = Event.objects.get(id=pk)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TagListCreateAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, organization_id):
        organization = get_object_or_404(Organization, id=organization_id)
        tags = Tag.objects.filter(Organization=organization)
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)

    def post(self, request, organization_id):
        print(request.data)
        organization = get_object_or_404(Organization, id=organization_id)
        data = request.data.copy()
        data['Organization'] = organization.id
        serializer = TagSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TagDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get_object(self, organization_id, pk):
        return get_object_or_404(Tag, pk=pk, Organization_id=organization_id)

    def get(self, request, organization_id, pk):
        tag = self.get_object(organization_id, pk)
        serializer = TagSerializer(tag)
        return Response(serializer.data)

    def put(self, request, organization_id, pk):
        tag = self.get_object(organization_id, pk)
        data = request.data.copy()
        data['Organization'] = organization_id
        serializer = TagSerializer(tag, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, organization_id, pk):
        tag = self.get_object(organization_id, pk)
        tag.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PersonTagsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            # Obtener todas las etiquetas asociadas a la persona y eliminar duplicados
            person_tags = PersonTagDetails.objects.filter(Person__id=user_id).values('Tag').distinct()
            tag_ids = [detail['Tag'] for detail in person_tags]

            # Obtener las instancias de las etiquetas basadas en los IDs
            tags = Tag.objects.filter(id__in=tag_ids)

            # Serializar las etiquetas
            serializer = TagSerializer(tags, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Person.DoesNotExist:
            return Response({'error': 'Person not found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, user_id):
        person = get_object_or_404(Person, id=user_id)
        data = request.data.copy()
        data['person'] = person.id

        serializer = AssignTagsToPersonSerializer(data=data)
        if serializer.is_valid():
            tags = serializer.validated_data['tags']
            for tag_id in tags:
                tag = get_object_or_404(Tag, id=tag_id)
                PersonTagDetails.objects.create(Person=person, Tag=tag)

            return Response({'message': 'Tags assigned successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, user_id):
        tag_id = request.query_params.get('tag_id')
        if not tag_id:
            return Response({'error': 'Tag ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            person_tag = PersonTagDetails.objects.filter(Person__id=user_id, Tag__id=tag_id)
            person_tag.delete()
            return Response({'message': 'Tag deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except PersonTagDetails.DoesNotExist:
            return Response({'error': 'Tag not found for this user'}, status=status.HTTP_404_NOT_FOUND)


class HeadquarterListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, organization_id):
        headquarters = Headquarter.objects.filter(Organization__id=organization_id)
        serializer = HeadquarterSerializer(headquarters, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, organization_id):
        organization = get_object_or_404(Organization, pk=organization_id)  # Obtener la instancia de la organización

        data = request.data.copy()  # Hacer una copia de los datos enviados
        data['Organization'] = organization.id  # Asignar la organización al diccionario de datos

        #No se repita el nombre de la sede
        if Headquarter.objects.filter(name=request.data['name']).exists():
            return Response({'error': 'Headquarter with the same name already exists'}, status=status.HTTP_400_BAD_REQUEST)    

        serializer = HeadquarterSerializer(data=data)
        if serializer.is_valid():
            headquarter = serializer.save(Organization=organization) 
            Inventory.objects.create(Headquarter=headquarter)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HeadquarterDetailUpdateDestroyView(APIView):
    permission_classes = [AllowAny]

    def get_object(self, organization_id, pk):
        return get_object_or_404(Headquarter, pk=pk, Organization_id=organization_id)

    def get(self, request, organization_id, pk):
        headquarter = self.get_object(organization_id, pk)
        serializer = HeadquarterSerializer(headquarter)
        return Response(serializer.data)

    def put(self, request, organization_id, pk):
        headquarter = self.get_object(organization_id, pk)
        serializer = HeadquarterSerializer(headquarter, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, organization_id, pk):
        headquarter = self.get_object(organization_id, pk)
        headquarter.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        
        #No se repita el nombre del producto
        if Product.objects.filter(name=request.data['name']).exists():
            return Response({'error': 'Product with the same name already exists'}, status=status.HTTP_400_BAD_REQUEST)


        if serializer.is_valid():
            product = serializer.save()
            return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        product.delete()
        return Response({"message": "Product deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk):
        print(request.data)
    # Obtener el producto que se va a actualizar
        product = get_object_or_404(Product, pk=pk)

    # Obtener los datos enviados
        data = request.data

    # Verificar si la categoría existe, y crearla si no existe
        category, created = ProductCategory.objects.get_or_create(name=data.get('Category'))
        print(f"Category: {category}, Created: {created}")

    # Convertir el ID del estado en el objeto correspondiente
        try:
            product_status = ProductStatus.objects.get(id=data.get('Status'))
        except ProductStatus.DoesNotExist:
            return Response({'error': 'Status not found'}, status=status.HTTP_400_BAD_REQUEST)
        print(f"Status: {product_status}")

    # Obtener o crear la entrada correspondiente en ProductInventory para actualizar las unidades
        try:
            product_inventory = ProductInventoryDetails.objects.get(Product=product)
        except ProductInventoryDetails.DoesNotExist:
            return Response({'error': 'Product inventory not found'}, status=status.HTTP_400_BAD_REQUEST)

    # Actualizar las unidades (cuantity) en ProductInventory, si el campo está presente en los datos recibidos
        if 'cuantity' in data:
            product_inventory.cuantity = data['cuantity']
            product_inventory.save()
            print(f"Updated quantity to: {product_inventory.cuantity}")
        else:
            print("Quantity not provided in request data")

    # Actualizar los datos del producto
        data['Category'] = category.id
        data['Status'] = product_status.id

    # Serializar y validar los datos del producto
        serializer = ProductSerializer(product, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductForHeadquarterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, headquarter_id):
        data = request.data
        # Intentar obtener el inventario asociado al headquarter
        try:
            inventory = Inventory.objects.get(Headquarter_id=headquarter_id)
        except Inventory.DoesNotExist:
            return Response({'error': 'Inventory for specified headquarter not found'}, status=status.HTTP_404_NOT_FOUND)

        # Obtener el producto del request
        product_id = data.get('Product')
        
        # Verificar si ya existe un registro en ProductInventoryDetails con el mismo producto e inventario
        try:
            product_inventory_details = ProductInventoryDetails.objects.get(Product_id=product_id, Inventory=inventory)
            # Si existe, actualizar la cantidad
            product_inventory_details.cuantity += int(data.get('cuantity', 0))
            product_inventory_details.save()
            return Response(ProductInventoryDetailsSerializer(product_inventory_details).data, status=status.HTTP_200_OK)
        except ProductInventoryDetails.DoesNotExist:
            # Si no existe, crear un nuevo registro
            data['Inventory'] = inventory.id
            serializer = ProductInventoryDetailsSerializer(data=data)
            
            if serializer.is_valid():
                product_inventory_details = serializer.save()
                return Response(ProductInventoryDetailsSerializer(product_inventory_details).data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, headquarter_id):
        
        try:
            inventory = Inventory.objects.get(Headquarter_id=headquarter_id)
        except Inventory.DoesNotExist:
            return Response({'error': 'Inventory for specified headquarter not found'}, status=status.HTTP_404_NOT_FOUND)
            
        product_inventory_details = ProductInventoryDetails.objects.filter(Inventory=inventory)
        serializer = ProductInventoryDetailsSerializer(product_inventory_details, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OrganizationHistoryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, organization_id):
        try:
            # Verificar que la organización existe
            organization = Organization.objects.get(id=organization_id)

            # Filtrar el historial de acciones de la ONG usando el campo headquarter_id
            history_records = History.objects.filter(Organization=organization)
            serializer = HistorySerializer(history_records, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Organization.DoesNotExist:
            return Response({'error': 'Organization not found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, organization_id):
        serializer = HistorySerializer(data=request.data)
        print(request.data)
        print(serializer)
        if serializer.is_valid():

            # Verificar que el usuario y la sede existen
            try:
                organization = Organization.objects.get(id=organization_id)

                # Crear el historial
                history = History.objects.create(
                    action=serializer.validated_data['action'],
                    description=serializer.validated_data['description'],
                    Organization=organization
                )

                return Response({'message': 'Action recorded successfully', 'id': history.id}, status=status.HTTP_201_CREATED)

            except UserAccount.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            except Headquarter.DoesNotExist:
                return Response({'error': 'Headquarter not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, organization_id, headquarter_id):
        headquarter = get_object_or_404(Headquarter, pk=headquarter_id, Organization_id=organization_id)
        inventory, created = Inventory.objects.get_or_create(Headquarter=headquarter)
        
        category_name = request.data.get('Category')

        category, created = ProductCategory.objects.get_or_create(name=category_name)
        
        request.data['Category'] = category.id
        
        product_serializer = ProductSerializer(data=request.data)
        
        if product_serializer.is_valid():
            product = product_serializer.save()

            product_inventory_details = ProductInventoryDetails.objects.create(
                Product=product,
                Inventory=inventory,
                cuantity=request.data.get('quantity', 0)
            )

            return Response(ProductInventoryDetailsSerializer(product_inventory_details).data, status=status.HTTP_201_CREATED)
        
        else:
            print('Errores del serializador:', product_serializer.errors)
        
        return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#PROBRAR LA FUNCONES DE ABAJO(Si funciona el query_params y en postman. Sino cambia pasando el user_id por parametro en la url)

class EventAttendanceView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        event_id = request.query_params.get('event_id')

        try:
            event = Event.objects.get(id=event_id)
            list = EventPersonDetails.objects.filter(Event=event)
            serializers = EventPersonSerializer(list, many=True)
            return Response(serializers.data, status=status.HTTP_200_OK)

        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)


    def post(self, request):
        person_id = request.query_params.get('person_id')
        event_id = request.query_params.get('event_id')

        try:
            person = Person.objects.get(id=person_id)
            event = Event.objects.get(id=event_id)

            # Verificar si ya está registrado
            if EventPersonDetails.objects.filter(Person=person, Event=event).exists():
                return Response({'error': 'Person is already attending this event'}, status=status.HTTP_400_BAD_REQUEST)

            event_person_details = EventPersonDetails.objects.create(Person=person, Event=event)
            serializer = EventPersonSerializer(event_person_details)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Person.DoesNotExist:
            return Response({'error': 'Person not found'}, status=status.HTTP_404_NOT_FOUND)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request):
        person_id = request.query_params.get('person_id')
        event_id = request.query_params.get('event_id')

        try:
            person = Person.objects.get(id=person_id)
            event = Event.objects.get(id=event_id)

            try:
                event_person_details = EventPersonDetails.objects.get(Person=person, Event=event)
                event_person_details.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)

            except EventPersonDetails.DoesNotExist:
                return Response({'error': 'Person is not attending this event'}, status=status.HTTP_404_NOT_FOUND)

        except Person.DoesNotExist:
            return Response({'error': 'Person not found'}, status=status.HTTP_404_NOT_FOUND)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)


class CreateInvitationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        event_id = request.query_params.get('event_id')

        try:
            event = Event.objects.get(id=event_id)

            if Invitation.objects.filter(Event=event).exists():
                return Response({'error': 'Invitation is already attending this event'}, status=status.HTTP_400_BAD_REQUEST)

            invitation = Invitation.objects.create(Event=event, status=True)
            serializer = InvitedEventSerializer(invitation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)


class CheckMembershipView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = request.query_params.get('person_id')
        event_id = request.query_params.get('event_id')


        try:
            person = Person.objects.get(id=user_id)
            event = Event.objects.get(id=event_id)
            organization = Organization.objects.get(id=event.Organization.id)

            if PersonOrganizationDetails.objects.filter(Person= person, Organization = organization).exists():
                return Response({'is_member': True, 'event_id': event.id}, status=status.HTTP_200_OK)
            return Response({'is_member': False, 'event_id': event.id}, status=status.HTTP_403_FORBIDDEN)

        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)


class TaskParticipationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
            person_id = request.query_params.get('person_id')
            task_id = request.query_params.get('task_id')

            if not person_id or not task_id:
                return Response({'error': 'person_id and task_id are required'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                user = User.objects.get(id=person_id)
                task = Task.objects.get(id=task_id)
                person = Person.objects.get(User=user)

                # Verificar si la persona ya está asignada a la tarea
                is_taken = TaskPersonDetails.objects.filter(Person=person, Task=task).exists()
                print(f'{person} {is_taken} {user} {task}')
                
                return Response({'is_taken': is_taken}, status=status.HTTP_200_OK)

            except Person.DoesNotExist:
                return Response({'error': 'Person not found'}, status=status.HTTP_404_NOT_FOUND)
            except Task.DoesNotExist:
                return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)


    def post(self, request):
        person_id = request.query_params.get('person_id')
        task_id = request.query_params.get('task_id')

        if not person_id or not task_id:
            return Response({'error': 'person_id and task_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=person_id)
            task = Task.objects.get(id=task_id)
            person = Person.objects.get(User=user)

            if TaskPersonDetails.objects.filter(Person=person, Task=task).exists():
                return Response({'error': 'Person is already assigned to this task'}, status=status.HTTP_400_BAD_REQUEST)

            # Crear la instancia de TaskPersonDetails
            task_person_details = TaskPersonDetails.objects.create(Person=person, Task=task)
            return Response({'message': 'Task taken successfully', 'task_person_details': TaskPersonDetailsSerializer(task_person_details).data}, status=status.HTTP_201_CREATED)

        except Person.DoesNotExist:
            return Response({'error': 'Person not found'}, status=status.HTTP_404_NOT_FOUND)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request):
        person_id = request.query_params.get('person_id')
        task_id = request.query_params.get('task_id')

        try:
            user = User.objects.get(id=person_id)
            task = Task.objects.get(id=task_id)
            person = Person.objects.get(User=user)

            try:
                task_person_details = TaskPersonDetails.objects.get(Person=person, Task=task)
                task_person_details.delete()
                return Response({'message': 'Task left successfully'}, status=status.HTTP_204_NO_CONTENT)

            except TaskPersonDetails.DoesNotExist:
                return Response({'error': 'Person is not assigned to this task'}, status=status.HTTP_404_NOT_FOUND)

        except Person.DoesNotExist:
            return Response({'error': 'Person not found'}, status=status.HTTP_404_NOT_FOUND)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

# Se epera en body un atributo denominado products, con la lista de ids de los productos comprados o vendidos
# "products": [
#         {
#             "product": 1,
#             "quantity": 10
#         }
#         {
#             "product": 6, (id del producto)
#             "quantity": 10
#         }
#     ]
class OperationAPIView(APIView):
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)  # Permite subir archivos

    def get(self, request, organization_id, operation_id=None):
        if operation_id:
            operation = get_object_or_404(Operation, id=operation_id, Organization_id=organization_id)
            serializer = OperationSerializer(operation)
            return Response(serializer.data)
        else:
            operations = Operation.objects.filter(Organization_id=organization_id)
            serializer = OperationSerializer(operations, many=True)
            return Response(serializer.data)

    def post(self, request, organization_id):
        # Hacer una copia mutable de request.data
        data = request.data.copy()
        
        if 'time' in data:
            try:
                # Convertir a `time`
                time_value = datetime.strptime(data['time'], '%H:%M:%S').time()
                data['time'] = time_value
            except ValueError:
                return Response({'error': 'Invalid time format for time. Use HH:MM:SS.'}, status=status.HTTP_400_BAD_REQUEST)

        if 'expDate' in data:
            try:
                # Convertir a `date`
                exp_date = datetime.strptime(data['expDate'], '%Y-%m-%d').date()
                data['expDate'] = exp_date
            except ValueError:
                return Response({'error': 'Invalid date format for expDate. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)


        # Ahora puedes modificar 'data' como necesites
        data['Organization'] = organization_id
        serializer = OperationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, organization_id, operation_id):
        operation = get_object_or_404(Operation, id=operation_id, Organization_id=organization_id)
        
        if operation.invoice:
            operation.invoice.delete()

        operation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OperationTypeListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = OperationType.objects.all()
    serializer_class = OperationTypeSerializer


class InventoryView(APIView):
    permission_classes = [AllowAny]
    # Obtener productos de una organización específica con la cantidad total
    def get(self, request, organization_id):
        # Filtramos los inventarios pertenecientes a la organización
        inventory_ids = Inventory.objects.filter(Headquarter__Organization_id=organization_id).values_list('id', flat=True)

        # Anotamos los productos con la suma total de las cantidades
        products = Product.objects.filter(
            productinventorydetails__Inventory_id__in=inventory_ids
        ).annotate(total_quantity=Sum('productinventorydetails__cuantity')).distinct()

        # Serializamos los productos con la cantidad total
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


# Product, Headquarter_1, Headquarter_2, quantity
class ProductTransferAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        product_id = request.query_params.get('product_id')
        headquarter1_id = request.query_params.get('headquarter1_id')
        headquarter2_id = request.query_params.get('headquarter2_id')
        quantity = request.query_params.get('quantity')

        if not product_id or not headquarter1_id or not headquarter2_id or not quantity:
            return Response({'error': 'product_id, headquarter1_id, headquarter2_id and quantity are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
            headquarter1 = Headquarter.objects.get(id=headquarter1_id)
            headquarter2 = Headquarter.objects.get(id=headquarter2_id)

            # Obtener el inventario de la sede
            inventory1 = Inventory.objects.get(Headquarter=headquarter1)
            inventory2 = Inventory.objects.get(Headquarter=headquarter2)

            # Verificar si el producto está disponible en el inventario de la sede 1
            product_inventory_details = ProductInventoryDetails.objects.get(Product=product, Inventory=inventory1)
            if product_inventory_details.cuantity < int(quantity):
                return Response({'error': 'Not enough quantity in headquarter 1'}, status=status.HTTP_400_BAD_REQUEST)

            # Actualizar las cantidades en los inventarios
            product_inventory_details.cuantity -= int(quantity)
            product_inventory_details.save()

            # Obtener o crear el detalle de inventario para la sede de destino, inicializando cuantity en 0 si es creado
            product_inventory_details2, created = ProductInventoryDetails.objects.get_or_create(
                Product=product, 
                Inventory=inventory2,
                defaults={'cuantity': 0}
            )

            # Actualizar la cantidad en el inventario de la sede de destino
            product_inventory_details2.cuantity += int(quantity)
            product_inventory_details2.save()

            return Response({'message': 'Product transferred successfully'}, status=status.HTTP_201_CREATED)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        except Headquarter.DoesNotExist:
            return Response({'error': 'Headquarter not found'}, status=status.HTTP_404_NOT_FOUND)
        except ProductInventoryDetails.DoesNotExist:
            return Response({'error': 'Product not found in headquarter 1'}, status=status.HTTP_404_NOT_FOUND)


#Se debera poder agregar/eliminar miembros de un evento.
class MemberEventsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        event_id = request.query_params.get('event_id')

        try:
            event = Event.objects.get(id=event_id)
            members = EventPersonDetails.objects.filter(Event=event)
            serializer = EventPersonDetailsSerializer(members, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def post(self, request):
        person_id = request.query_params.get('person_id')
        event_id = request.query_params.get('event_id')

        if not person_id or not event_id:
            return Response({'error': 'person_id and event_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            person = Person.objects.get(id=person_id)
            event = Event.objects.get(id=event_id)

            if EventPersonDetails.objects.filter(Person=person, Event=event).exists():
                return Response({'error': 'Person is already attending this event'}, status=status.HTTP_400_BAD_REQUEST)

            event_person_details = EventPersonDetails.objects.create(Person=person, Event=event)
            return Response({'message': 'Person added successfully', 'event_person_details': EventPersonDetailsSerializer(event_person_details).data}, status=status.HTTP_201_CREATED)

        except Person.DoesNotExist:
            return Response({'error': 'Person not found'}, status=status.HTTP_404_NOT_FOUND)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request):
        person_id = request.query_params.get('person_id')
        event_id = request.query_params.get('event_id')

        try:
            person = Person.objects.get(id=person_id)
            event = Event.objects.get(id=event_id)

            try:
                event_person_details = EventPersonDetails.objects.get(Person=person, Event=event)
                event_person_details.delete()
                return Response({'message': 'Person removed successfully'}, status=status.HTTP_204_NO_CONTENT)

            except EventPersonDetails.DoesNotExist:
                return Response({'error': 'Person is not attending this event'}, status=status.HTTP_404_NOT_FOUND)

        except Person.DoesNotExist:
            return Response({'error': 'Person not found'}, status=status.HTTP_404_NOT_FOUND)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

    
#Se debera poder agregar/eliminar invitados a un evento con la class Guest.
class GuestEventsAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print(request.data)
        event_id = request.data.get('event_id')
        print(f"Received event_id: {event_id}")

        if not event_id:
            return Response({'error': 'event_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            event = Event.objects.get(id=event_id)
            print(f"Event found: {event}")

            # Excluye 'Event' de los datos que se pasarán al serializador, ya que lo estamos manejando manualmente
            guest_data = {
                'name': request.data.get('name'),
                'email': request.data.get('email'),
                'role': request.data.get('role'),
                'Event': event_id 
            }
            print(f"Guest data: {guest_data}")

            # Crea el invitado sin pasar el campo 'Event'
            serializer = GuestSerializer(data=guest_data)

            if serializer.is_valid():
                guest = serializer.save(Event=event)
                print(f"Guest added!")
                return Response({'message': 'Guest added successfully', 'guest': GuestSerializer(guest).data}, status=status.HTTP_201_CREATED)

            # Si el serializador no es válido, imprimir los errores
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        
    def delete(self, request):
        guest_id = request.query_params.get('guest_id')

        if not guest_id:
            return Response({'error': 'guest_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            guest = Guest.objects.get(id=guest_id)
            guest.delete()
            return Response({'message': 'Guest removed successfully'}, status=status.HTTP_204_NO_CONTENT)

        except Guest.DoesNotExist:
            return Response({'error': 'Guest not found'}, status=status.HTTP_404_NOT_FOUND)
        
"""
se espera un body similar a este:{
    "description": "Donation description",
    "date": "2024-08-20",
    "products": [
        {
            "product": 1,
            "quantity": 10
        }
        {
            "product": 6, (id del producto)
            "quantity": 10
        }
    ]
}
"""
class DonationAPIView(APIView):
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)  # Permite subir archivos

#Hace falta que se vean los detalles de la donacions
    def get(self, request):
        org_id = request.query_params.get('org_id')
        
        if not org_id:
            return Response({'error': 'org_id is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        organization = Organization.objects.get(id=org_id)
        donations = Donation.objects.filter(Organization=organization)
        serializer = DonationSerializer(donations, many=True)
        return Response(serializer.data)

    def post(self, request):
        org_id = request.query_params.get('org_id')
        organization = get_object_or_404(Organization, id=org_id)
        data = request.data.copy()
        data['Organization'] = organization.id

        print("Datos recibidos para donación:", data)  # Para depuración

        if 'time' in data:
            try:
                # Convertir a `time`
                time_value = datetime.strptime(data['time'], '%H:%M:%S').time()
                data['time'] = time_value
            except ValueError:
                return Response({'error': 'Invalid time format for time. Use HH:MM:SS.'}, status=status.HTTP_400_BAD_REQUEST)

        if 'expDate' in data:
            try:
                # Convertir a `date`
                exp_date = datetime.strptime(data['expDate'], '%Y-%m-%d').date()
                data['expDate'] = exp_date
            except ValueError:
                return Response({'error': 'Invalid date format for expDate. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = DonationSerializer(data=data)
        if serializer.is_valid():
            donation = serializer.save(file=request.FILES.get('fileDonation'))
            return Response(DonationSerializer(donation).data, status=status.HTTP_201_CREATED)

        print("Errores de serialización:", serializer.errors)  # Para depuración
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DonationsByCategoryAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, organization_id):
        try:
            # Filtrar las donaciones de la organización, excluir "Dinero" y agrupar por el campo 'type'
            donations = Donation.objects.filter(
                Organization_id=organization_id
            ).exclude(type="Dinero").values('type').annotate(total_donations=Sum('quantity')).order_by('type')

            # Separar las categorías y los valores en arrays
            categories = [item['type'] for item in donations]
            total_donations = [item['total_donations'] or 0 for item in donations]

            # Crear respuesta estructurada
            data = {
                'categories': categories,
                'total_donations': total_donations,
            }

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  

class DonationDetailAPIView(APIView):
    permission_classes = [AllowAny]
    # Obtener, actualizar o eliminar una donación específica
    def get(self, request):
        org_id = request.query_params.get('org_id')
        donation_id = request.query_params.get('donation_id')

        if not org_id or not donation_id:
            return Response({'error': 'org_id and donation_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        donation = get_object_or_404(Donation, id=donation_id, Organization_id=org_id)
        serializer = DonationSerializer(donation)
        return Response(serializer.data)

    def put(self, request):
        org_id = request.query_params.get('org_id')
        donation_id = request.query_params.get('donation_id')

        if not org_id or not donation_id:
            return Response({'error': 'org_id and donation_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        donation = get_object_or_404(Donation, id=donation_id, Organization_id=org_id)
        serializer = DonationSerializer(donation, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        org_id = request.query_params.get('org_id')
        donation_id = request.query_params.get('donation_id')

        if not org_id or not donation_id:
            return Response({'error': 'org_id and donation_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        donation = get_object_or_404(Donation, id=donation_id, Organization_id=org_id)
        donation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

#Se debe crear una view que permita enviar las invitaciones por mail 
"""
Se espera un body similar a este:
{
  "emails": ["galleguillolucas2006@gmail.com"],
  "event_id": 1,
  "subject": "Estás Invitado a Nuestro Evento",
  "link": "https://www.google.com"
}
Les desea mucha suerte galle :) <3
"""
class SendInvitationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        emails = [request.data.get('email')] 
        event_id = request.data.get('event_id')  
        subject = 'Invitación a Evento'
        link = request.data.get('link')  
        event = Event.objects.get(id=event_id)
        organization = event.Organization.name

        # Validar que los campos obligatorios están presentes
        if not emails or not event or not organization or not link:
            return Response({'error': 'emails, event and link are required fields.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            message_template = f"Hola,\n\nEstás invitado(a) a nuestro evento '{event.name}' que se llevará a cabo próximamente.\nEsperamos contar con tu presencia.\nSaludos cordiales,\nEl equipo de {organization}.\n\nLink de invitación: {link}."

            send_mail(
                subject=subject,  # Asunto del correo
                message=message_template,  # Contenido del mensaje personalizado
                from_email=settings.DEFAULT_FROM_EMAIL,  # Dirección de correo del remitente
                recipient_list=emails,  # Lista de destinatarios
                fail_silently=False,  # Generar excepción si falla el envío
            )
            print(f"Invitaciones enviadas exitosamente a: {', '.join(emails)}")
            return Response({'message': 'Invitations sent successfully'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
       

class SendInvitationPlatView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        emails = [request.data.get('email')] 
        subject = 'You are invited to our platform!'
        organization_id = request.data.get('org_id')
        organization = Organization.objects.get(id=organization_id) 
        link = f'http://localhost:3000/dashboard/organization/{organization_id}'
        # Validar que los campos obligatorios están presentes
        if not emails or not organization or not link:
            return Response({'error': 'emails, and link are required fields.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            message_template = f"Hola,\n\nFuiste invitado a unirte a nuestra plataforma y ser parte de: '{organization.name}'.\nDeseamos verte pronto.\n{link}\n\nSaludos."
            send_mail(
                subject=subject,  # Asunto del correo
                message=message_template,  # Contenido del mensaje personalizado
                from_email=settings.DEFAULT_FROM_EMAIL,  # Dirección de correo del remitente
                recipient_list=emails,  # Lista de destinatarios
                fail_silently=False,  # Generar excepción si falla el envío
            )
            print(emails)
            return Response({'message': 'Invitations sent successfully'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


#View para subir un video al perfil de una organizacion

class VideoUploadView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            data = self.request.data
            org_id = data.get('organization_id')
            organization = Organization.objects.get(id=org_id)

            video_file = data.get('video_file')
            title = data.get('title')
            description = data.get('description', 'Video content')

            Video.objects.create(
                title=title,
                description=description,
                video_file=video_file,
                Organization=organization
            )

            return Response(
                {'success': 'Video Uploaded Successfully'},
                status=status.HTTP_201_CREATED
            )
        except Organization.DoesNotExist:
            return Response(
                {'error': 'Organization not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Error Uploading Video: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class IsAdminView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = request.query_params.get('user_id')

        try:
            # Buscar el usuario primero
            user = User.objects.get(id=user_id)

            # Obtener la instancia de Person relacionada con el usuario
            person = Person.objects.get(User=user)

            # Filtrar las etiquetas del usuario usando la relación persontagdetails
            tags_user = Tag.objects.filter(persontagdetails__Person=person, isAdmin=True)  # Usar isAdmin en lugar de TagType

            if tags_user.exists():
                return Response(True, status=status.HTTP_200_OK)
            return Response(False, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Person.DoesNotExist:
            return Response({'error': 'Person not found'}, status=status.HTTP_404_NOT_FOUND)
    

class UnassignedTagsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        # Obtener la persona
        person = get_object_or_404(Person, id=user_id)
        
        # Obtener IDs de las tags asignadas al usuario
        assigned_tag_ids = PersonTagDetails.objects.filter(Person=person).values_list('Tag', flat=True)
        
        if assigned_tag_ids.exists():
            # Obtener las tags que no están asignadas al usuario si existen etiquetas asignadas
            unassigned_tags = Tag.objects.exclude(id__in=assigned_tag_ids).distinct()
        else:
            # Si no hay etiquetas asignadas, obtener todas las etiquetas
            unassigned_tags = Tag.objects.all().distinct()

        # Serializar y devolver las tags
        serializer = TagSerializer(unassigned_tags, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AllProductsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, organization_id):
        # Verificamos que la organización existe
        organization = get_object_or_404(Organization, id=organization_id)

        # Obtenemos todos los IDs de inventarios asociados a la organización
        inventory_ids = Inventory.objects.filter(Headquarter__Organization=organization).values_list('id', flat=True)

        # Obtenemos los productos asociados a esos inventarios, agrupados por sede y sumando la cantidad total
        products = Product.objects.filter(
            productinventorydetails__Inventory_id__in=inventory_ids
        ).annotate(total_quantity=Sum('productinventorydetails__cuantity')).distinct()

        # Serializamos los productos
        serializer = ProductSerializer(products, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class EventDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, organization_id, event_id):
        event = get_object_or_404(Event, id=event_id, Organization_id=organization_id)
        serializer = EventSerializer(event)
        return Response(serializer.data, status=200)
    
    
class TaskDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, organization_id, task_id):
        task = get_object_or_404(Task, id=task_id, Organization_id=organization_id)
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=200)


class MarkTaskAsDoneView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id)
            task.state = 'Finalizado'  # Cambia el estado de la tarea
            task.save()
            return Response({"message": "Task marked as done successfully"}, status=status.HTTP_200_OK)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)


class MarkTaskAsPendingView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id)
            task.state = 'Pendiente'  # Cambia el estado de la tarea a Pending
            task.save()
            return Response({"message": "Task marked as pending successfully"}, status=status.HTTP_200_OK)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)


class EventGuestsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, event_id):
        try:
            # Obtén los invitados del evento por el ID del evento
            guests = Guest.objects.filter(Event_id=event_id)
            serializer = GuestSerializer(guests, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Guest.DoesNotExist:
            return Response({'error': 'No guests found for this event.'}, status=status.HTTP_404_NOT_FOUND)


class EventParticipantsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        event_id = request.query_params.get('event_id')
        if not event_id:
            return Response({'error': 'event_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Obtener todas las relaciones de personas para el evento
        event_person_details = EventPersonDetails.objects.filter(Event_id=event_id)

        if not event_person_details.exists():
            return Response({'error': 'No participants found for this event.'}, status=status.HTTP_404_NOT_FOUND)

        # Obtener las personas relacionadas con el evento
        persons = [details.Person for details in event_person_details]

        # Serializar los datos de las personas
        serialized_persons = PersonSerializer(persons, many=True).data

        return Response(serialized_persons, status=status.HTTP_200_OK)

class DeleteGuestView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, guest_id, *args, **kwargs):
        try:
            guest = Guest.objects.get(id=guest_id)  # Asegúrate de usar el modelo 'Guest'
            guest.delete()
            return Response({"message": "Guest deleted successfully"}, status=status.HTTP_200_OK)
        except Guest.DoesNotExist:
            return Response({"error": "Guest not found"}, status=status.HTTP_404_NOT_FOUND)

class DeleteMemberView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, member_id, *args, **kwargs):
        try:
            member = EventPersonDetails.objects.get(id=member_id)
            member.delete()
            return Response({"message": "Member deleted successfully"}, status=status.HTTP_200_OK)
        except EventPersonDetails.DoesNotExist:
            return Response({"error": "Member not found"}, status=status.HTTP_404_NOT_FOUND)

class DeleteEventView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, event_id, *args, **kwargs):
        try:
            event = Event.objects.get(id=event_id)  # Busca el evento por su ID
            event.delete()  # Elimina el evento
            return Response({"message": "Event deleted successfully"}, status=status.HTTP_200_OK)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)


class FinishEventView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, event_id, *args, **kwargs):
        try:
            event = Event.objects.get(id=event_id)
            event.state = 'Finalizado'  # Cambiar el estado a 'Done'
            event.save()
            return Response({"message": "Event finished successfully"}, status=status.HTTP_200_OK)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

class ToggleEventStateView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, event_id, *args, **kwargs):
        try:
            event = Event.objects.get(id=event_id)
            if event.state == 'Finalizado':
                event.state = 'Pendiente'  # Cambia el estado a "Pending" si estaba "Done"
            else:
                event.state = 'Finalizado'  # Cambia el estado a "Done" si estaba en otro estado
            event.save()
            return Response({"message": f"Event state changed to {event.state}", "state": event.state}, status=status.HTTP_200_OK)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

class EventToggleAttendanceAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, event_id, user_id):
        # Obtener el usuario y la persona correspondiente
        user = get_object_or_404(User, id=user_id)
        person = get_object_or_404(Person, User=user)
        event = get_object_or_404(Event, id=event_id)

        # Verificar si la persona ya está registrada en el evento
        try:
            event_person_detail = EventPersonDetails.objects.get(Person=person, Event=event)
            # Si existe, significa que ya está asistiendo, entonces lo removemos (leave)
            event_person_detail.delete()
            return Response({"message": "User has left the event."}, status=status.HTTP_200_OK)
        except EventPersonDetails.DoesNotExist:
            # Si no existe, lo registramos como asistente (join)
            EventPersonDetails.objects.create(Person=person, Event=event)
            return Response({"message": "User is now attending the event."}, status=status.HTTP_201_CREATED)


class UploadProfileImageView(APIView):
    
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        user = get_object_or_404(UserAccount, id=user_id)

        user_image = Image.objects.filter(User=user).first()

        if user_image and os.path.isfile(user_image.image.path):
            os.remove(user_image.image.path)
            user_image.delete()

        if 'file' not in request.FILES:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        new_image = Image(User=user, image=request.FILES['file'], alt="Profile Image")
        new_image.save()

        image_url = request.build_absolute_uri(new_image.image.url)
        
        return Response({
            'message': 'Imagen de perfil actualizada correctamente',
            'image_url': image_url
        }, status=status.HTTP_201_CREATED)

class CheckMembershipView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        # Obtener los parámetros desde los query params
        organization_id = request.query_params.get('organization_id')
        user_id = request.query_params.get('user_id')
        print(request.data)
        if not organization_id or not user_id:
            return Response({'error': 'Both organization_id and user_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Busca el usuario en la base de datos
            user = User.objects.get(id=user_id)
            
            # Verifica si existe un perfil asociado a ese usuario
            try:
                person = Person.objects.get(User=user)
            except Person.DoesNotExist:
                return Response({'error': 'Person not found for the given user'}, status=status.HTTP_404_NOT_FOUND)

            # Busca la organización en la base de datos
            organization = Organization.objects.get(id=organization_id)

            # Verifica si la persona es miembro de la organización
            if PersonOrganizationDetails.objects.filter(Person=person, Organization=organization).exists():
                return Response({'is_member': True}, status=status.HTTP_200_OK)
            else:
                return Response({'is_member': False}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Organization.DoesNotExist:
            return Response({'error': 'Organization not found'}, status=status.HTTP_404_NOT_FOUND)


#ESTADISTICAS (suerte, la van a necesitar:D)

# Filtrar donations por category y mostrar el historial de donaciones pasando por query params la ong+_id y la category
class DonationHistoryAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        ong = request.query_params.get('ong')
        category = request.query_params.get('category')

        if not ong:
            return Response({'error': 'ong is required'}, status=status.HTTP_400_BAD_REQUEST)

        organization = Organization.objects.get(id=ong)

        if category:
            donations_detail = Donation.objects.filter(Organization=organization)
            serializer = DonationSerializer(donations_detail, many=True).filter(Organization=organization)
           #donations_detail = DonationProductDetail.objects.filter(Organization=organization, Product__Category = category) 
           #serializer = DonationProductDetailSerializer(donations_detail, many=True)  
            return Response(serializer.data, status=status.HTTP_200_OK)

        try: 
            donations_detail = Donation.objects.filter(Organization=organization)
            serializer = DonationSerializer(donations_detail, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Organization.DoesNotExist:
            return Response({'error': 'Organization not found'}, status=status.HTTP_404_NOT_FOUND)

# Ver el historial de compra y venta. Putiendo filtrar por type o ordenar 
class OperationHistoryAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        organization_id = request.query_params.get('ong')
        operation_type = request.query_params.get('type')
        first_operation = request.query_params.get('first') #Aca se espera recibir un TRUE en caso de que quiera que se ordene del mas viejo al mas nuevo

        if not organization_id:
            return Response({'error': 'ong is required'}, status=status.HTTP_400_BAD_REQUEST)

        organization = Organization.objects.get(id=organization_id)

        if first_operation:
            operations = OperationProductDetailsSerializer.objects.filter(Operation__Organization=organization_id).order_by('-Operation__date')
            serializer = OperationProductDetailsSerializer(operations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if operation_type:
            operations = OperationProductDetailsSerializer.objects.filter(Operation__Organization=organization_id, Operation__type=operation_type)
            serializer = OperationProductDetailsSerializer(operations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        operations = Operation.objects.filter(Organization_id=organization_id)
        serializer = OperationSerializer(operations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Obtener total de la donaciones de dinero
#HACE FLATA HACER QUE SEA SOLO PARA DINERO CON UN CATEGORY
class TotalAmountDonationAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        organization_id = request.query_params.get('ong')

        if not organization_id:
            return Response({'error': 'ong is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            organization = Organization.objects.get(id=organization_id)
            # Filtrar las donaciones de tipo 'Dinero' y sumar la quantity
            donations = Donation.objects.filter(
                Organization=organization, type="Dinero"
            )
            total_amount = donations.aggregate(total_quantity=Sum('quantity'))['total_quantity'] or 0

            return Response({'total_amount': total_amount}, status=status.HTTP_200_OK)

        except Organization.DoesNotExist:
            return Response({'error': 'Organization not found'}, status=status.HTTP_404_NOT_FOUND)

# Obtener la diferencia entre el total de la compras/ventas
class TotalAmountOperationAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        organization_id = request.query_params.get('ong')
        type = request.query_params.get('type')

        if not organization_id:
            return Response({'error': 'ong is required'}, status=status.HTTP_400_BAD_REQUEST)

        organization = Organization.objects.get(id=organization_id)
        operations = Operation.objects.filter(Organization=organization).annotate(
            adjusted_amount=Case(
                # Si el tipo de operación es 'type 1' (puedes cambiar el valor según corresponda), multiplicar el amount por -1
                When(type='Venta', then=F('amount') * Value(-1)),
                # En los demás casos, dejar el amount sin cambios
                default=F('amount'),
                output_field=models.IntegerField(),
            )
        )

        for operation in operations:
            print(f'Operation ID: {operation.id}, Adjusted Amount: {operation.adjusted_amount}')

        # Calcular el total
        total_amount = operations.aggregate(total=Sum('adjusted_amount'))['total']

        return Response({'total_amount': total_amount}, status=status.HTTP_200_OK)


class DonationMonthAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        organization_id = request.query_params.get('ong')
        if not organization_id:
            return Response({'error': 'Organization ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Obtener la fecha actual y el año actual
        current_date = timezone.now()
        current_year = current_date.year

        try:
            # Filtrar y agrupar las donaciones por mes del año actual y tipo "Dinero"
            donations_by_month = Donation.objects.filter(
                Organization_id=organization_id,
                date__year=current_year,  # Solo donaciones del año actual
                type="Dinero"  # Filtrar solo las donaciones de tipo "Dinero"
            ).annotate(
                month=TruncMonth('date')  # Agrupar por mes usando la fecha de la donación
            ).values('month').annotate(
                total_quantity=Sum('quantity')  # Sumar las cantidades de las donaciones por mes
            ).order_by('month')

            # Crear un array con 12 meses inicializados en 0 (enero a diciembre)
            donations_per_month = [0] * 12

            # Rellenar el array con los valores obtenidos de las donaciones
            for donation in donations_by_month:
                month = donation['month'].month  # Obtener el número del mes (1 para enero, 2 para febrero, ...)
                donations_per_month[month - 1] = donation['total_quantity'] or 0  # Colocar la cantidad en la posición correcta

            return Response(donations_per_month, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class OperationMonthAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        organization_id = request.query_params.get('ong')

        # Verificar si se pasa un id de organización
        if not organization_id:
            return Response({'error': 'Organization ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Fecha actual y el año actual
        current_date = timezone.now()
        current_year = current_date.year

        # Obtener las operaciones de compras y ventas para el año actual, agrupadas por mes
        operations_by_month = Operation.objects.filter(
            Organization_id=organization_id,
            date__year=current_year  # Solo operaciones del año actual
        ).annotate(
            month=TruncMonth('date')  # Agrupar por mes
        ).values('month', 'type').annotate(
            total_quantity=Sum('quantity')  # Sumar las cantidades de las operaciones por mes y tipo
        ).order_by('month')

        # Inicializar arrays para compras y ventas con 12 ceros (uno por cada mes)
        compras = [0] * 12
        ventas = [0] * 12

        # Rellenar los arrays con las cantidades de cada mes
        for operation in operations_by_month:
            month = operation['month'].month - 1  # Obtener el índice del mes (enero=0, diciembre=11)
            quantity = operation['total_quantity']

            if operation['type'] == 'Compra':
                compras[month] = quantity or 0
            elif operation['type'] == 'Venta':
                ventas[month] = quantity or 0

        # Devolver la respuesta con los arrays de compras y ventas
        return Response({
            'compras': compras,
            'ventas': ventas
        }, status=status.HTTP_200_OK)


# Obtener las donaciones por categoría del ultimo mes
#HACE FALTA CREAR UN CATEGOTY EN DONATIONS
class DonationCategoryAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        organization_id = request.query_params.get('ong')
        # Obtener la fecha actual
        current_date = timezone.now()

        # Calcular la fecha de inicio para el último mes
        start_date = current_date - timedelta(days=30)  # Aproximadamente el último mes

        # Filtrar y agrupar las donaciones por categoria
        donations_by_category = DonationProductDetails.objects.filter(
            Organization_id=organization_id,
            Donation__date__gte=start_date  # Solo donaciones desde el último mes
        ).values('Product__Category__name').annotate(
            total_quantity=Sum('quantity')  # Sumar las cantidades de las donaciones por categoria
        ).order_by('Product__Category__name')

        # Generar la respuesta con las categorias
        data = []
        for donation in donations_by_category:
            data.append({
                'category': donation['Category__name'],
                'total_donations': donation['total_quantity'] or 0  # Si no hay donaciones, devolver 0
            })
        print(data)
        return Response(data)

# Hacer una view para mostrar todas las organizaciones que existen, 
# exceptuando las que el usuario esta dentro. Devolver la response 
# con el id de la org, el nombre, la descripcion, la cantidad de miembros y  su logo
class ListOrganizationAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = request.query_params.get('user_id')
        user = User.objects.get(id=user_id)
        person = Person.objects.get(User=user)

        try:
            person_organizations = PersonOrganizationDetails.objects.filter(Person=person).values_list('Organization', flat=True)
            # Excluye las organizaciones a las que la persona ya pertenece
            organizations = Organization.objects.exclude(id__in=person_organizations).annotate(
                person_count=models.Count('personorganizationdetails')  # Contar cuántas personas pertenecen a la organización
            )
            # Serializar las organizaciones restantes con imagen y cantidad de personas
            serializer = OrganizationSerializer(organizations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)


        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListCandidateOrganizationsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'error': 'Falta el parámetro user_id'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Obtener el usuario y la persona asociada
            user = UserAccount.objects.get(id=user_id)
            person = Person.objects.get(User=user)

            # Obtener todas las organizaciones a las que el usuario es candidato
            candidate_organizations = Candidate.objects.filter(Person=person).values_list('Organization', flat=True)

            # Filtrar las organizaciones
            organizations = Organization.objects.filter(id__in=candidate_organizations)

            # Serializar las organizaciones
            serializer = OrganizationSerializer(organizations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except UserAccount.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Person.DoesNotExist:
            return Response({'error': 'Persona no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class IncomeList(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]  # Habilita la carga de archivos

    def get(self, request):
        org_id = request.query_params.get('org_id', None)
        if org_id is not None:
            incomes = Income.objects.filter(organization__id=org_id)
        else:
            incomes = Income.objects.all()

        serializer = IncomeSerializer(incomes, many=True)
        return Response(serializer.data)

    def post(self, request):
        org_id = request.query_params.get('org_id')
        organization = get_object_or_404(Organization, id=org_id)
        
        # Copia los datos y agrega el `organization`
        data = request.data.copy()
        data['organization'] = organization.id  # Asegúrate de que el campo sea el ID de la organización

        # Manejo de campo de fecha
        if 'date' in data:
            try:
                date_value = datetime.strptime(data['date'], '%Y-%m-%d').date()
                data['date'] = date_value
            except ValueError:
                return Response({'error': 'Invalid date format for date. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = IncomeSerializer(data=data)
        if serializer.is_valid():
            income = serializer.save(file=request.FILES.get('fileIncome'))
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print("Errores de serialización:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class IncomeDetail(APIView):
    permission_classes = [AllowAny]

    def get_object(self, pk):
        try:
            return Income.objects.get(pk=pk)
        except Income.DoesNotExist:
            return None

    def delete(self, request, pk):
        income = self.get_object(pk)
        if income is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        income.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ExpenseList(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]  # Habilita la carga de archivos

    def get(self, request):
        org_id = request.query_params.get('org_id', None)
        if org_id is not None:
            expenses = Expense.objects.filter(organization__id=org_id)
        else:
            expenses = Expense.objects.all()

        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)


    def post(self, request):
        org_id = request.query_params.get('org_id')
        organization = get_object_or_404(Organization, id=org_id)
        
        # Copia los datos y agrega el `organization`
        data = request.data.copy()
        data['organization'] = organization.id  # Agrega el ID de la organización al campo correspondiente

        # Manejo de campo de fecha
        if 'date' in data:
            try:
                date_value = datetime.strptime(data['date'], '%Y-%m-%d').date()
                data['date'] = date_value
            except ValueError:
                return Response({'error': 'Invalid date format for date. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ExpenseSerializer(data=data)
        if serializer.is_valid():
            expense = serializer.save(file=request.FILES.get('fileExpense'))
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print("Errores de serialización:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ExpenseDetail(APIView):
    permission_classes = [AllowAny]

    def get_object(self, pk):
        try:
            return Expense.objects.get(pk=pk)
        except Expense.DoesNotExist:
            return None

    def delete(self, request, pk):
        expense = self.get_object(pk)
        if expense is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        expense.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TaskHistoryActionAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, task_id, action=None):
        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

        # Obtenemos todos los registros de historial para la tarea especificada
        history_entries = TaskHistory.objects.filter(task=task).order_by('-timestamp')
        serializer = TaskHistorySerializer(history_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def post(self, request, task_id, action):
        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

        action_map = {
            "completada": "Completada",
            "pendiente": "Pendiente",
            "tomada": "Tomada",
            "dejada": "Dejada"
        }

        if action not in action_map:
            return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        description = request.data.get("description", f"La tarea fue marcada como {action_map[action]}.")

        history_entry = TaskHistory(
            task=task,
            action=action_map[action],
            description=description
        )
        print(history_entry)
        history_entry.save()

        serializer = TaskHistorySerializer(history_entry)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# lista de participantes de una tarea que muestre toda la infomacion de cada participante
class TaskParticipantsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

        # Obtener los participantes relacionados con la tarea
        participants = Person.objects.filter(
            id__in=TaskPersonDetails.objects.filter(Task=task).values_list('Person', flat=True)
        )   

        # Serializar los participantes
        serializer = PersonSerializer(participants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class ExtractPersonInfoAPIView(APIView):
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        file_ext = file.name.split('.')[-1].lower()
        text = None

        try:
            if file_ext in ['doc', 'docx']:
                doc = Document(file)
                text = ' '.join([paragraph.text for paragraph in doc.paragraphs])
            elif file_ext in ['txt']:
                text = file.read().decode('utf-8')
                print(text)
            elif file_ext in ['xls', 'xlsx']:
                df = pd.read_excel(file)
                text = df.to_string()
            else:
                return Response({'error': 'Unsupported file format'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'Error reading file: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not text:
            return Response({'error': 'Could not extract text from file'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        MAX_TEXT_LENGTH = 10000
        if len(text) > MAX_TEXT_LENGTH:
            return Response({'error': 'Text too long to process'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            extracted_data = extract_person_info(text)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'extracted_data': extracted_data}, status=status.HTTP_200_OK)
