
from django.urls import path
from . import views
from django.urls import path, include

from .views import review_applications, approve_application, reject_application


app_name = "hiking"

urlpatterns = [
    path("", views.home, name="index"),
    # Public/adopter pages
    path("pet-search/", views.pet_search, name="pet_search"),
    path("pets/", views.pet_list, name="pet_list"),
    path("pets/<int:pk>/", views.pet_detail, name="pet_detail"),
    path("pets/<int:animal_id>/apply/", views.apply_for_adoption, name="apply_for_adoption"),
    path("my-applications/", views.my_applications, name="my_applications"),
    # Auth & profile
    path("login/", views.user_login, name="user_login"),
    path("logout/", views.user_logout, name="user_logout"),
    path("register/", views.user_registration, name="user_registration"),
    path("profile/", views.user_profile, name="user_profile"),
    path("password-reset/", views.password_reset, name="password_reset"),
    # Staff tools
    path("pets/add/", views.add_pet_listing, name="add_pet_listing"),
    path("review-applications/", views.review_applications, name="review_applications"),
    path("applications/<int:app_id>/approve/", views.approve_application, name="approve_application"),
    path("applications/<int:app_id>/reject/", views.reject_application, name="reject_application"),
    path("adoption-application/", views.adoption_application, name="adoption_application"),
    path("adoption-review/", views.review_adoption_application, name="review_adoption"),
    path("assign-volunteers/", views.assign_volunteers_permissions, name="assign_volunteers"),
        # path("", include(("hiking.urls", "hiking"), namespace="hiking")),
]
