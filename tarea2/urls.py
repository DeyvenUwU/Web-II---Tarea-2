from django.urls import path
from . import views

app_name = 'tarea2'

urlpatterns = [
    path('', views.administracion, name='administracion'),

    path('api/estados/', views.api_estados_list, name='api_estados_list'),
    path('api/estados/create/', views.api_estados_create, name='api_estados_create'),
    path('api/estados/<int:estado_id>/edit/', views.api_estados_edit, name='api_estados_edit'),
    path('api/estados/<int:estado_id>/delete/', views.api_estados_delete, name='api_estados_delete'),
    path('api/estados/<int:estado_id>/municipios/create/', views.api_municipios_create, name='api_municipios_create'),
    
    path('api/municipios/<int:municipio_id>/edit/', views.api_municipios_edit, name='api_municipios_edit'),
    path('api/municipios/<int:municipio_id>/delete/', views.api_municipios_delete, name='api_municipios_delete'),
]
