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
)

urlpatterns = [
    re_path(
        r'^o/(?P<provider>\S+)/$',
        CustomProviderAuthView.as_view(),
        name='provider-auth'
    ),
    
    path('candidate/<int:candidate_id>/approve/', ApproveCandidate.as_view()),
    path('candidate/<int:candidate_id>/reject/', RejectCandidate.as_view()),
    path('candidate-details', CandidateDetailView.as_view()),
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
]
