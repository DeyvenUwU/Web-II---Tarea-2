from django import forms
from .models import Estado, Municipio

class EstadoForm(forms.ModelForm):
    class Meta:
        model = Estado
        fields = ['nombre', 'abreviatura']

class MunicipioForm(forms.ModelForm):
    class Meta:
        model = Municipio
        fields = ['nombre', 'estado']
