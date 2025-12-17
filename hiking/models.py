# hiking/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

STATE_CHOICES   = [("NSW","NSW"),("VIC","VIC"),("QLD","QLD"),("SA","SA"),("WA","WA"),("TAS","TAS"),("ACT","ACT"),("NT","NT")]
SEX_CHOICES     = [("M","Male"),("F","Female")]
STATUS_CHOICES  = [("AVAILABLE","Available"),("PENDING","Pending"),("ADOPTED","Adopted")]
DECISION_CHOICES= [("PENDING","Pending"),("APPROVED","Approved"),("REJECTED","Rejected")]

class Animal(models.Model):
    species       = models.CharField(max_length=50)
    name          = models.CharField(max_length=80)
    age           = models.PositiveIntegerField()
    sex           = models.CharField(max_length=1, choices=SEX_CHOICES)
    breed         = models.CharField(max_length=80, blank=True)
    description   = models.TextField(blank=True)
    photo         = models.ImageField(upload_to="pet_photos/", blank=True, null=True)
    suburb        = models.CharField(max_length=80, blank=True)
    state         = models.CharField(max_length=3, choices=STATE_CHOICES, default="NSW")
    adoption_fee  = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    date_added    = models.DateTimeField(auto_now_add=True)
    status        = models.CharField(max_length=9, choices=STATUS_CHOICES, default="AVAILABLE")
    adoption_date = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.species})"


class AdopterProfile(models.Model):
    user               = models.OneToOneField(User, on_delete=models.CASCADE)
    mobile             = models.CharField(max_length=10, blank=True)
    address_line       = models.CharField(max_length=120, blank=True)
    suburb             = models.CharField(max_length=80, blank=True)
    state              = models.CharField(max_length=3, choices=STATE_CHOICES, default="NSW")
    postcode           = models.CharField(max_length=4, blank=True)
    dwelling_ownership = models.CharField(max_length=40, blank=True)
    dwelling_type      = models.CharField(max_length=40, blank=True)
    yard_size          = models.CharField(max_length=40, blank=True)
    children           = models.CharField(max_length=40, blank=True)
    other_pets         = models.CharField(max_length=120, blank=True)

    def __str__(self):
        return self.user.get_username()


class AdoptionApplication(models.Model):
    application_date = models.DateTimeField(auto_now_add=True)
    animal           = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name="applications")
    adopter          = models.ForeignKey(User, on_delete=models.CASCADE, related_name="adoption_apps")
    # IMPORTANT: matches your form/template
    reason           = models.TextField(default="")   # previously 'application_reason'
    decision         = models.CharField(max_length=10, choices=DECISION_CHOICES, default="PENDING")
    reviewer         = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="reviewed_apps")
    decision_date    = models.DateTimeField(blank=True, null=True)

    class Meta:
        unique_together = ("animal", "adopter")

    def __str__(self):
        return f"{self.adopter} → {self.animal} [{self.decision}]"
