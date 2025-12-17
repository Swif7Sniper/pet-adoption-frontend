from django import forms
from .models import AdoptionApplication, Animal

class AdoptionApplicationForm(forms.ModelForm):
    class Meta:
        model = AdoptionApplication
        fields = ["reason"]  # <-- was "application_reason"

    def clean_reason(self):
        reason = (self.cleaned_data.get("reason") or "").strip()
        if not reason:
            raise forms.ValidationError("Reason is required.")
        for char in reason:
            if not (char.isalpha() or char.isspace() or char in "-.,"):
                raise forms.ValidationError(
                    "Only letters, spaces, hyphen (-), period (.), comma (,)."
                )
        return reason

class AnimalForm(forms.ModelForm):
    class Meta:
        model = Animal
        fields = [
            "name", "species", "breed", "sex", "age", "description",
            "adoption_fee", "suburb", "state", "status", "photo",
        ]
