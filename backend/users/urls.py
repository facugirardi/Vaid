from django.urls import path, re_path
from .views import (
    CustomProviderAuthView,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    CustomTokenVerifyView,
    LogoutView,
    CheckCompleteView,
    UserTypeUpdate,
    CreateOrganization,
    CreatePerson,
    CheckUserType,
    RetrieveImageView,
    UploadImageView,
    CandidateDetailView,
    ApproveCandidate,
    RejectCandidate,
    RetrievePersonView,
    RetrieveUserOrganizations,
    OrgView,
    TaskListView,
    TaskUpdateDestroyView,
    RetrieveOrganizationView,
    RetrieveOrganizationExtView,
    RetrieveImageOrgView,
    OrganizationMembersView,
    EventListView,
    EventUpdateDestroyView,
    TagListCreateAPIView,
    TagDetailAPIView,
    PersonTagsAPIView,
    HeadquarterListCreateView,
    ProductForHeadquarterView,
    ProductView,
    HeadquarterDetailUpdateDestroyView,
    ProductForHeadquarterView,
    OrganizationHistoryView,
    EventAttendanceView,
    CreateInvitationView,
    CheckMembershipView,
    TaskParticipationView,
)

urlpatterns = [
    re_path(
        r'^o/(?P<provider>\S+)/$',
        CustomProviderAuthView.as_view(),
        name='provider-auth'
    ),

    path('retrieve-logo-org', RetrieveImageOrgView.as_view()),
    path('organization-ext/<int:user_id>/', RetrieveOrganizationExtView.as_view()),
    path('organization/<int:user_id>/', RetrieveOrganizationView.as_view()),
    path('user/all-organizations/', OrgView.as_view()),
    path('user/<int:user_id>/organizations/', RetrieveUserOrganizations.as_view()),
    path('person/<int:user_id>/', RetrievePersonView.as_view()),
    path('candidate/<int:candidate_id>/approve/', ApproveCandidate.as_view()),
    path('candidate/<int:candidate_id>/reject/', RejectCandidate.as_view()),
    path('candidate-details/<int:organization_id>/', CandidateDetailView.as_view()),
    path('retrieve-logo', RetrieveImageView.as_view()),
    path('upload-image', UploadImageView.as_view()),
    path('user/<int:user_id>/check-usertype', CheckUserType.as_view()),
    path('user/person', CreatePerson.as_view()),
    path('user/organization', CreateOrganization.as_view()),
    path('user/<int:pk>/complete', UserTypeUpdate.as_view()),
    path('user/<int:user_id>/check-complete', CheckCompleteView.as_view()),
    path('jwt/create/', CustomTokenObtainPairView.as_view()),
    path('jwt/refresh/', CustomTokenRefreshView.as_view()),
    path('jwt/verify/', CustomTokenVerifyView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('organizations/<int:pk>/tasks/', TaskListView.as_view(), name='task-list'),
    path('organizations/tasks/<int:pk>', TaskUpdateDestroyView.as_view(), name='task-update-delete'),
    
    path('organizations/<int:pk>/members/', OrganizationMembersView.as_view(), name='organization-members'),
    
    path('organizations/<int:pk>/events/', EventListView.as_view(), name='event-list'),
    path('organizations/events/<int:pk>', EventUpdateDestroyView.as_view(), name='event-update-delete'),

    path('organizations/<int:organization_id>/tags/', TagListCreateAPIView.as_view(), name='tag-list-create'),
    path('organizations/<int:organization_id>/tags/<int:pk>/', TagDetailAPIView.as_view(), name='tag-detail'),

    path('user/<int:user_id>/tags/', PersonTagsAPIView.as_view(), name='tags-to-person'),

    path('headquarters/<int:organization_id>/', HeadquarterListCreateView.as_view(), name='headquarter-list'),
    path('headquarters/<int:organization_id>/edit/<int:pk>/', HeadquarterDetailUpdateDestroyView.as_view(), name='headquarter-update-delete'),

    path('products/', ProductView.as_view(), name='product-list'),

    path('headquarters/<int:headquarter_id>/products/', ProductForHeadquarterView.as_view(), name='product-headquarter'),

    path('organizations/<int:organization_id>/history/', OrganizationHistoryView.as_view(), name='organization-history'),

    path('events/attendance/', EventAttendanceView.as_view(), name='event-attendance'),

    path('organizations/invitations/', CreateInvitationView.as_view(), name='create-invitation'),
    path('organizations/membership/', CheckMembershipView.as_view(), name='check-membership'),

    path('organizations/tasks/participation/', TaskParticipationView.as_view(), name='task-participation'),
]
#genrar url de los links de las invitaiones
