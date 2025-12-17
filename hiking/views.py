# hiking/views.py
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.db import IntegrityError, transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from django.utils.text import slugify

from .forms import AdoptionApplicationForm, AnimalForm
from .models import Animal, AdoptionApplication, AdopterProfile

User = get_user_model()


def home(request):
    return render(request, "hiking/HTML/index.html")


def user_login(request):
    if request.method == "POST":
        email = (request.POST.get("email") or "").strip()
        password = request.POST.get("password")
        user = None
        if email and password:
            try:
                u = User.objects.get(email__iexact=email)
                user = authenticate(request, username=u.username, password=password)
            except User.DoesNotExist:
                user = None
            except User.MultipleObjectsReturned:
                messages.error(
                    request,
                    "Multiple accounts use this email. Please use your username.",
                )
                return render(request, "hiking/HTML/userLogin.html")
        if user is not None:
            login(request, user)
            messages.success(request, f"Welcome back, {user.username}!")
            return redirect("hiking:index")
        messages.error(request, "Invalid email or password")
    return render(request, "hiking/HTML/userLogin.html")


def make_unique_username(seed: str) -> str:
    base = slugify(seed.split("@")[0]) or "user"
    candidate = base
    i = 1
    while User.objects.filter(username__iexact=candidate).exists():
        i += 1
        candidate = f"{base}{i}"
    return candidate


def user_registration(request):
    if request.method == "POST":
        email = (request.POST.get("email") or "").strip().lower()
        typed_username = (request.POST.get("username") or "").strip()
        pwd1 = request.POST.get("password1") or ""
        pwd2 = request.POST.get("password2") or ""
        if not email or not pwd1:
            messages.error(request, "Email and password are required.")
            return render(request, "hiking/HTML/userRegistration.html", {"prefill": request.POST})
        if pwd1 != pwd2:
            messages.error(request, "Passwords do not match.")
            return render(request, "hiking/HTML/userRegistration.html", {"prefill": request.POST})
        if User.objects.filter(email__iexact=email).exists():
            messages.error(request, "An account with this email already exists.")
            return render(request, "hiking/HTML/userRegistration.html", {"prefill": request.POST})

        if typed_username:
            if User.objects.filter(username__iexact=typed_username).exists():
                messages.error(request, "Username is already taken. Please choose another.")
                return render(request, "hiking/HTML/userRegistration.html", {"prefill": request.POST})
            username = typed_username
        else:
            username = make_unique_username(email)

        try:
            with transaction.atomic():
                user = User.objects.create_user(username=username, email=email, password=pwd1)
                AdopterProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        "mobile": request.POST.get("mobile", ""),
                        "address_line": request.POST.get("address_line", ""),
                        "suburb": request.POST.get("suburb", ""),
                        "state": request.POST.get("state", "NSW"),
                        "postcode": request.POST.get("postcode", ""),
                    },
                )
        except IntegrityError:
            username = make_unique_username(username + "-new")
            user = User.objects.create_user(username=username, email=email, password=pwd1)

        login(request, user)
        messages.success(request, f"Welcome, {user.username}! Your account was created.")
        return redirect("hiking:index")

    return render(request, "hiking/HTML/userRegistration.html")


@login_required
def user_profile(request):
    return render(request, "hiking/HTML/userProfile.html")


def password_reset(request):
    return render(request, "hiking/HTML/passwordReset.html")


def adoption_application(request):
    # No generic form here; you must choose a specific animal first.
    messages.info(request, "Please choose a pet to apply for.")
    return redirect("hiking:pet_list")


def review_adoption_application(request):
    return render(request, "hiking/HTML/ReviewAdoptionApplicationForm.html")


def pet_search(request):
    animals = Animal.objects.filter(status="AVAILABLE")
    return render(request, "hiking/HTML/pet_search_browse_form.html", {"animals": animals})


@staff_member_required
def assign_volunteers_permissions(request):
    return render(request, "hiking/HTML/assign_volunteers_permissions_form.html")


@login_required
def apply_for_adoption(request, animal_id):
    # Block admins (staff or superusers)
    if request.user.is_staff or request.user.is_superuser:
        messages.error(request, "Administrators cannot apply to adopt.")
        return redirect("hiking:my_applications")

    # Fetch regardless of status; block only if ADOPTED
    animal = get_object_or_404(Animal, pk=animal_id)

    if animal.status == "ADOPTED":
        messages.error(request, "Sorry, this pet has already been adopted.")
        return redirect("hiking:pet_detail", pk=animal.id)

    # Prevent duplicate applications by same user
    if AdoptionApplication.objects.filter(animal=animal, adopter=request.user).exists():
        messages.error(request, "You have already applied for this pet.")
        return redirect("hiking:my_applications")

    if request.method == "POST":
        form = AdoptionApplicationForm(request.POST)
        if form.is_valid():
            app = form.save(commit=False)
            app.animal = animal
            app.adopter = request.user
            app.save()

            # Mark animal pending (unless already adopted)
            if animal.status != "ADOPTED":
                animal.status = "PENDING"
                animal.save(update_fields=["status"])

            messages.success(request, "Your application has been submitted.")
            return redirect("hiking:my_applications")
        else:
            messages.error(request, "Please fix the errors below.")
    else:
        form = AdoptionApplicationForm()

    return render(
        request,
        "hiking/HTML/adoption_application_form.html",
        {"form": form, "animal": animal, "adopter": request.user},
    )


@login_required
def my_applications(request):
    applications = (
        AdoptionApplication.objects.filter(adopter=request.user)
        .select_related("animal")
        .order_by("-application_date")
    )
    return render(request, "hiking/HTML/my_applications.html", {"applications": applications})


@login_required
def user_logout(request):
    logout(request)
    messages.info(request, "You have been logged out.")
    return redirect("hiking:index")


@staff_member_required
def review_applications(request):
    qs = (
        AdoptionApplication.objects.select_related("animal", "adopter")
        .order_by("-application_date")
    )

    q = (request.GET.get("q") or "").strip()
    decision = (request.GET.get("decision") or "").strip().upper()

    if q:
        qs = qs.filter(
            Q(animal__name__icontains=q)
            | Q(animal__species__icontains=q)
            | Q(adopter__username__icontains=q)
            | Q(adopter__email__icontains=q)
        )
    if decision in {"PENDING", "APPROVED", "REJECTED"}:
        qs = qs.filter(decision=decision)

    applications = qs[:100]
    return render(
        request,
        "hiking/HTML/review_applications.html",
        {"applications": applications, "q": q, "decision": decision},
    )


@staff_member_required
def approve_application(request, app_id):
    app = get_object_or_404(AdoptionApplication, pk=app_id)
    app.decision = "APPROVED"
    app.decision_date = timezone.now()
    app.reviewer = request.user
    app.save()

    pet = app.animal
    pet.status = "ADOPTED"
    pet.adoption_date = timezone.now()
    pet.save()

    # Reject all other applications for the same pet
    AdoptionApplication.objects.filter(animal=pet).exclude(pk=app.pk).update(
        decision="REJECTED",
        decision_date=timezone.now(),
        reviewer=request.user,
    )

    messages.success(request, "Application approved.")
    return redirect("hiking:review_applications")


@staff_member_required
def reject_application(request, app_id):
    app = get_object_or_404(AdoptionApplication, pk=app_id)
    app.decision = "REJECTED"
    app.decision_date = timezone.now()
    app.reviewer = request.user
    app.save()

    pet = app.animal
    has_other_pending = pet.applications.filter(decision="PENDING").exists()
    pet.status = "PENDING" if has_other_pending else "AVAILABLE"
    pet.save()

    messages.info(request, "Application rejected.")
    return redirect("hiking:review_applications")


def pet_list(request):
    pets = Animal.objects.filter(status="AVAILABLE").order_by("-id")
    return render(request, "hiking/HTML/pet_list.html", {"pets": pets})


def pet_detail(request, pk):
    pet = get_object_or_404(Animal, pk=pk)
    return render(request, "hiking/HTML/pet_detail.html", {"pet": pet})


@staff_member_required
def add_pet_listing(request):
    if request.method == "POST":
        form = AnimalForm(request.POST, request.FILES)
        if form.is_valid():
            pet = form.save()
            messages.success(request, f"Pet '{pet.name}' created.")
            return redirect("hiking:pet_list")
        messages.error(request, "Please fix the errors below.")
    else:
        form = AnimalForm()
    return render(request, "hiking/HTML/AddPetListing.html", {"form": form})
