from django.db import models

# Create your models here.
class Estado(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    abreviatura = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        verbose_name = "Estado"
        verbose_name_plural = "Estados"
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Municipio(models.Model):
    nombre = models.CharField(max_length=100)

    estado = models.ForeignKey(
        Estado,
        on_delete=models.CASCADE,
        related_name="municipios"
    )

    class Meta:
        verbose_name = "Municipio"
        verbose_name_plural = "Municipios"
        ordering = ['nombre']
        unique_together = ('nombre', 'estado')

    def __str__(self):
        return f"{self.nombre} ({self.estado.nombre})"
