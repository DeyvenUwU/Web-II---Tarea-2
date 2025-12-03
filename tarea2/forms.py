from django import forms
from .models import Estado, Municipio

class EstadoForm(forms.ModelForm):
    class Meta:
        model = Estado
        fields = ['nombre', 'abreviatura', 'capital', 'poblacion', 'superficie']


class MunicipioForm(forms.ModelForm):
    class Meta:
        model = Municipio
        fields = ['nombre', 'poblacion', 'superficie', 'cp', 'estado']
