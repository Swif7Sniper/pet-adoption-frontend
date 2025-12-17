
# hiking/tests.py
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils import timezone

from .models import Animal, AdoptionApplication
from .forms import AdoptionApplicationForm

User = get_user_model()


# -------------------- Model tests --------------------
class ModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user("u1", "u1@example.com", "pw12345!")
        self.animal = Animal.objects.create(
            name="Pikachu", species="Dog", status="AVAILABLE", age=2
        )

    def test_animal_fields(self):
        a = Animal.objects.get(pk=self.animal.pk)
        self.assertEqual((a.name, a.species, a.status, a.age),
                         ("Pikachu", "Dog", "AVAILABLE", 2))

    def test_app_relationships(self):
        app = AdoptionApplication.objects.create(
            adopter=self.user,
            animal=self.animal,
            application_reason="We love pets",
            decision="PENDING",
            application_date=timezone.now(),
        )
        self.assertEqual(app.animal, self.animal)
        self.assertEqual(app.adopter, self.user)
        self.assertEqual(self.animal.applications.count(), 1)
        self.assertEqual(self.user.adoptionapplication_set.count(), 1)


# --------------------------------------------- View tests --------------------------------------------------------------------------------------------------------
class ViewTests(TestCase):
    def setUp(self):
        self.pw = "pass1234!"
        self.user = User.objects.create_user("adopter", "adopter@example.com", self.pw)
        self.staff = User.objects.create_user(
            "staff", "staff@example.com", self.pw, is_staff=True
        )
        self.pet_available = Animal.objects.create(
            name="Buddy", species="Dog", status="AVAILABLE", age=2
        )

    # pet_detail scenarios
    def test_pet_detail_ok(self):
        r = self.client.get(reverse("hiking:pet_detail", args=[self.pet_available.pk]))
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, "Buddy")

    def test_pet_detail_404(self):
        r = self.client.get(reverse("hiking:pet_detail", args=[999999]))
        self.assertEqual(r.status_code, 404)

    # apply_for_adoption scenarios
    def test_apply_requires_login(self):
        r = self.client.get(reverse("hiking:apply_for_adoption", args=[self.pet_available.pk]))
        self.assertEqual(r.status_code, 302)
        self.assertIn(reverse("hiking:user_login"), r["Location"])

    def test_apply_success_sets_pending(self):
        self.client.login(username=self.user.username, password=self.pw)
        url = reverse("hiking:apply_for_adoption", args=[self.pet_available.pk])
        r = self.client.post(url, {"application_reason": "We love pets"}, follow=True)
        self.assertEqual(r.status_code, 200)
        self.pet_available.refresh_from_db()
        self.assertEqual(self.pet_available.status, "PENDING")
        self.assertEqual(
            AdoptionApplication.objects.filter(
                adopter=self.user, animal=self.pet_available
            ).count(),
            1,
        )

    # review_applications scenarios
    def test_review_requires_staff(self):
        self.client.login(username=self.user.username, password=self.pw)
        r = self.client.get(reverse("hiking:review_applications"))
        self.assertIn(r.status_code, (302, 403))

    def test_review_staff_ok(self):
        self.client.login(username=self.staff.username, password=self.pw)
        r = self.client.get(reverse("hiking:review_applications"))
        self.assertEqual(r.status_code, 200)


# ----------------------------------------------------------- Form tests ---------------------------------------------------------------------------------------
class FormTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user("adopter", "adopter@example.com", "pw12345!")
        self.pet = Animal.objects.create(name="Mochi", species="Cat", status="AVAILABLE", age=1)

    def test_form_valid(self):
        form = AdoptionApplicationForm(data={"application_reason": "We have a safe home"})
        self.assertTrue(form.is_valid())

    def test_form_invalid_empty(self):
        form = AdoptionApplicationForm(data={"application_reason": ""})
        self.assertFalse(form.is_valid())
        self.assertIn("application_reason", form.errors)

    def test_form_invalid_too_long(self):
        form = AdoptionApplicationForm(data={"application_reason": "a" * 1000})
        self.assertFalse(form.is_valid())
        self.assertIn("application_reason", form.errors)
