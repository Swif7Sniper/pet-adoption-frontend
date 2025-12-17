from django.contrib import admin, messages
from django.utils import timezone
from django.contrib.auth import get_user_model

from .models import Animal, AdopterProfile, AdoptionApplication

User = get_user_model()


@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "species", "age", "sex", "status")
    list_filter = ("species", "sex", "status")
    search_fields = ("name", "breed", "suburb")
    ordering = ("status", "name")


@admin.register(AdopterProfile)
class AdopterProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "mobile", "suburb", "state")
    search_fields = ("user__username", "user__email", "mobile", "suburb")


@admin.register(AdoptionApplication)
class AdoptionApplicationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "animal",
        "adopter",
        "decision",
        "application_date",
        "reviewer",
        "decision_date",
    )
    list_filter = ("decision", "application_date")
    search_fields = ("animal__name", "adopter__username", "adopter__email")
    date_hierarchy = "application_date"
    actions = ("approve_applications", "reject_applications")

    def _set_review_fields(self, request, qs, decision, pet_status=None):
        updated = 0
        for app in qs.select_related("animal"):
            if app.decision != "PENDING":
                continue
            app.decision = decision
            app.reviewer = request.user
            app.decision_date = timezone.now()
            app.save(update_fields=["decision", "reviewer", "decision_date"])
            if pet_status:
                if pet_status == "ADOPTED" or app.animal.status != "ADOPTED":
                    app.animal.status = pet_status
                    app.animal.save(update_fields=["status"])
            updated += 1
        return updated

    @admin.action(description="Approve selected applications")
    def approve_applications(self, request, queryset):
        updated = self._set_review_fields(
            request, queryset, decision="APPROVED", pet_status="ADOPTED"
        )
        messages.success(request, f"Approved {updated} application(s).")

    @admin.action(description="Reject selected applications")
    def reject_applications(self, request, queryset):
        updated = self._set_review_fields(
            request, queryset, decision="REJECTED", pet_status="AVAILABLE"
        )
        messages.warning(request, f"Rejected {updated} application(s).")
