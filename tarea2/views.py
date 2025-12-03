from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from .models import Estado, Municipio
from .forms import EstadoForm, MunicipioForm


def administracion(request):
	formularioEstado = EstadoForm()
	formularioMunicipio = MunicipioForm()
	estados = Estado.objects.all()
	return render(request, 'tarea2/administracion.html', {
		'formularioEstado': formularioEstado,
		'formularioMunicipio': formularioMunicipio,
		'estados': estados,
	})


def _estado_to_dict(estado):
	return {
		'id': estado.id,
		'nombre': estado.nombre,
		'abreviatura': estado.abreviatura,
		'capital': estado.capital,
		'poblacion': estado.poblacion,
		'superficie': str(estado.superficie) if estado.superficie is not None else None,
		'municipios': [
			{
				'id': m.id,
				'nombre': m.nombre,
				'poblacion': m.poblacion,
				'superficie': str(m.superficie) if m.superficie is not None else None,
				'cp': m.cp,
			} for m in estado.municipios.all().order_by('nombre')
		]
	}


@require_http_methods(["GET"])
def api_estados_list(request):
	estados = Estado.objects.all()
	datos = [_estado_to_dict(e) for e in estados]
	return JsonResponse({'ok': True, 'estados': datos})


@csrf_exempt
@require_http_methods(["POST"])
def api_estados_create(request):
	formulario = EstadoForm(request.POST)
	if formulario.is_valid():
		estado = formulario.save()
		return JsonResponse({'ok': True, 'estado': _estado_to_dict(estado)})
	return JsonResponse({'ok': False, 'errores': formulario.errors}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def api_estados_edit(request, estado_id):
	estado = get_object_or_404(Estado, pk=estado_id)
	formulario = EstadoForm(request.POST, instance=estado)
	if formulario.is_valid():
		estado = formulario.save()
		return JsonResponse({'ok': True, 'estado': _estado_to_dict(estado)})
	return JsonResponse({'ok': False, 'errores': formulario.errors}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def api_estados_delete(request, estado_id):
	estado = get_object_or_404(Estado, pk=estado_id)
	estado.delete()
	return JsonResponse({'ok': True})


@csrf_exempt
@require_http_methods(["POST"])
def api_municipios_create(request, estado_id):
	estado = get_object_or_404(Estado, pk=estado_id)
	data = request.POST.copy()
	data['estado'] = estado.id
	formulario = MunicipioForm(data)
	if formulario.is_valid():
		municipio = formulario.save()
		return JsonResponse({'ok': True, 'municipio': {
			'id': municipio.id,
			'nombre': municipio.nombre,
			'poblacion': municipio.poblacion,
			'superficie': str(municipio.superficie) if municipio.superficie is not None else None,
			'cp': municipio.cp,
			'estado_id': estado.id,
		}})
	return JsonResponse({'ok': False, 'errores': formulario.errors}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def api_municipios_edit(request, municipio_id):
	municipio = get_object_or_404(Municipio, pk=municipio_id)
	formulario = MunicipioForm(request.POST, instance=municipio)
	if formulario.is_valid():
		municipio = formulario.save()
		return JsonResponse({'ok': True, 'municipio': {
			'id': municipio.id,
			'nombre': municipio.nombre,
			'poblacion': municipio.poblacion,
			'superficie': str(municipio.superficie) if municipio.superficie is not None else None,
			'cp': municipio.cp,
			'estado_id': municipio.estado.id,
		}})
	return JsonResponse({'ok': False, 'errores': formulario.errors}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def api_municipios_delete(request, municipio_id):
	municipio = get_object_or_404(Municipio, pk=municipio_id)
	municipio.delete()
	return JsonResponse({'ok': True})

