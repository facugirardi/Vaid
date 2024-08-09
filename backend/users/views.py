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
from django.http import Http404
from rest_framework.permissions import IsAuthenticated
from .models import Organization, Person, Image
from .serializers import *
from django.shortcuts import get_object_or_404


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
                {'name': organization.name,
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
            user = User.objects.get(id=user_id)
            person = Person.objects.get(User=user)
            organizations = Organization.objects.filter(personorganizationdetails__Person=person)
            organization_serializer = OrganizationSerializer(organizations, many=True)
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


class CheckUserType(APIView):
    permission_classes = [AllowAny]  

    def get(self, request, *args, **kwargs):
        user_id = kwargs.get('user_id')
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

    def get(self, request, organization_id):
        try:
            organization = Organization.objects.get(id=organization_id)
            members = Person.objects.filter(Organization=organization)
            serializer = PersonSerializer(members, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Organization.DoesNotExist:
            return Response({'error': 'Organization not found'}, status=status.HTTP_404_NOT_FOUND)
        

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
            # Obtener todas las etiquetas asociadas a la persona
            person_tags = PersonTagDetails.objects.filter(Person__id=user_id)
            tags = [detail.Tag for detail in person_tags]  # Obtener solo las etiquetas

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


class HeadquarterListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, organization_id):
        headquarters = Headquarter.objects.filter(Organization__id=organization_id)
        serializer = HeadquarterSerializer(headquarters, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, organization_id):
        serializer = HeadquarterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(Organization=organization_id)  # Asegúrate de que el usuario tiene la organización
            return Response(serializer.data, status=status.HTTP_201_CREATED)
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
        
        if serializer.is_valid():
            product = serializer.save()
            return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ProductForHeadquarterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, headquarter_id):
        data = request.data
        try:
            inventory = Inventory.objects.get(Headquarter_id=headquarter_id)
        except Inventory.DoesNotExist:
            return Response({'error': 'Inventory for specified headquarter not found'}, status=status.HTTP_404_NOT_FOUND)

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
            
            # Filtrar el historial de acciones de la ONG
            history_records = History.objects.filter(headquarter_id__Organization=organization)
            serializer = HistorySerializer(history_records, many=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Organization.DoesNotExist:
            return Response({'error': 'Organization not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def post(self, request, organization_id):
        serializer = HistorySerializer(data=request.data)
        
        if serializer.is_valid():
            user_id = serializer.validated_data.get('user_id')
            headquarter_id = serializer.validated_data.get('headquarter_id')

            # Verificar que el usuario y la sede existen
            try:
                user = UserAccount.objects.get(id=user_id)
                headquarter = Headquarter.objects.get(id=headquarter_id)
                
                # Crear el historial
                history = History.objects.create(
                    user_id=user,
                    action=serializer.validated_data['action'],
                    description=serializer.validated_data['description'],
                    headquarter_id=headquarter
                )
                
                return Response({'message': 'Action recorded successfully', 'id': history.id}, status=status.HTTP_201_CREATED)

            except UserAccount.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            except Headquarter.DoesNotExist:
                return Response({'error': 'Headquarter not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    
    

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
        user_id = request.query_params.get('user_id')
        organization_id = request.query_params.get('organization_id')
        event_id = request.query_params.get('event_id')

        try:
            user = User.objects.get(id=user_id)
            event = Event.objects.get(id=event_id)
            organization = Organization.objects.get(id=organization_id)

            if PersonOrganizationDetails.objects.filter(Person__User=user, Organization = organization).exists():
                return Response({'is_member': True, 'event_id': event.id}, status=status.HTTP_200_OK)
            return Response({'is_member': False, 'event_id': event.id}, status=status.HTTP_403_FORBIDDEN)
        
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        except Organization.DoesNotExist:
            return Response({'error': 'Organization not found'}, status=status.HTTP_404_NOT_FOUND)

