
# Create your tests here.

from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils import timezone

from .models import Animal, AdoptionApplication

User = get_user_model()


class BasicFlowTests(TestCase):
    def setUp(self):
        self.pw = "pass1234!"
        self.adopter = User.objects.create_user(
            username="adopter1", email="adopter1@example.com", password=self.pw
        )
        self.staff = User.objects.create_user(
            username="staffer", email="staff@example.com", password=self.pw, is_staff=True
        )
        self.pet = Animal.objects.create(
            name="Pikachu",
            species="Dog",
            breed="Mixed",
            sex="Male",
            age=2,
            description="Nice dog",
            adoption_fee=100,
            suburb="Sydney",
            state="NSW",
            status="AVAILABLE",
        )
        self.c = Client()

    def test_login(self):
        r = self.c.post(reverse("hiking:user_login"),
                        {"email": self.adopter.email, "password": self.pw},
                        follow=True)
        self.assertEqual(r.status_code, 200)
        self.assertTrue(r.context["user"].is_authenticated)

    def test_apply_once_and_block_duplicate(self):
        self.c.login(username=self.adopter.username, password=self.pw)

        url = reverse("hiking:apply_for_adoption", args=[self.pet.pk])

        # First attempt of application
        self.c.post(url, {"application_reason": "We love dogs"}, follow=True)

        self.assertEqual(
            AdoptionApplication.objects.filter(adopter=self.adopter, animal=self.pet).count(), 1
        )
        self.pet.refresh_from_db()
        self.assertEqual(self.pet.status, "PENDING")

        # Second attempt preventing our duplicates
        self.c.post(url, {"application_reason": "again"}, follow=True)
        self.assertEqual(
            AdoptionApplication.objects.filter(adopter=self.adopter, animal=self.pet).count(), 1
        )

    def test_review_is_staff_only(self):
        self.c.login(username=self.adopter.username, password=self.pw)
        r = self.c.get(reverse("hiking:review_applications"))
        self.assertIn(r.status_code, (302, 403))

        self.c.login(username=self.staff.username, password=self.pw)
        r = self.c.get(reverse("hiking:review_applications"))
        self.assertEqual(r.status_code, 200)

    def test_approve_sets_adopted_and_rejects_others(self):
        adopter2 = User.objects.create_user("adopter2", "adopter2@example.com", self.pw)
        app1 = AdoptionApplication.objects.create(
            adopter=self.adopter, animal=self.pet, application_reason="A1",
            decision="PENDING", application_date=timezone.now()
        )
        app2 = AdoptionApplication.objects.create(
            adopter=adopter2, animal=self.pet, application_reason="A2",
            decision="PENDING", application_date=timezone.now()
        )

        self.c.login(username=self.staff.username, password=self.pw)
        self.c.get(reverse("hiking:approve_application", args=[app1.pk]), follow=True)

        app1.refresh_from_db()
        app2.refresh_from_db()
        self.pet.refresh_from_db()
        self.assertEqual(app1.decision, "APPROVED")
        self.assertEqual(app2.decision, "REJECTED")
        self.assertEqual(self.pet.status, "ADOPTED")
