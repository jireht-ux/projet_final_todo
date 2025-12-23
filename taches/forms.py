from django import forms
from .models import Tache


class TacheForm(forms.ModelForm):
    class Meta:
        model = Tache
        # On permet de définir le titre, la description et le statut (termine).
        fields = ["titre", "description", "termine"]
        widgets = {
            'titre': forms.TextInput(attrs={'maxlength': 200, 'class': 'form-control'}),
            'description': forms.Textarea(attrs={'rows': 4, 'class': 'form-control'}),
        }
