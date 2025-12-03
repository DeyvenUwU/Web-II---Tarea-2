//wow aqui se aplica ajax, en archivos js

function obtenerCabeceras() {
  return {'X-Requested-With': 'XMLHttpRequest'};
}

function cargarEstados() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/tarea2/api/estados/');
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.onload = function(){
    if(xhr.status === 200){
      var respuesta = JSON.parse(xhr.responseText);
      renderizarEstados(respuesta.estados);
      actualizarSelectorEstados(respuesta.estados);
    } else {
      document.getElementById('contenedorEstados').innerText = 'Error cargando estados.';
    }
  };
  xhr.send();
}

function actualizarSelectorEstados(estados){
  var selectEstado = document.querySelector('select[name="estado"]');
  if(!selectEstado) return;
  var opcionActual = selectEstado.value;
  selectEstado.innerHTML = '<option value="">---------</option>';
  estados.forEach(function(estado){
    var option = document.createElement('option');
    option.value = estado.id;
    option.textContent = estado.nombre;
    selectEstado.appendChild(option);
  });
  if(opcionActual) selectEstado.value = opcionActual;
}

function renderizarEstados(estados){
  var cont = document.getElementById('contenedorEstados');
  cont.innerHTML = '';
  if(!estados.length){ cont.innerHTML = '<p>No hay estados.</p>'; return; }

  var ulEstados = document.createElement('ul');
  estados.forEach(function(estado){
    var li = document.createElement('li');
    li.innerHTML = '<strong>'+estado.nombre+'</strong> ('+(estado.abreviatura||'')+') - Capital: '+(estado.capital||'')+' - Población: '+(estado.poblacion||'')+' <button data-id="'+estado.id+'" class="editarEstado">Editar</button> <button data-id="'+estado.id+'" class="borrarEstado">Borrar</button>';

    var ulMun = document.createElement('ul');
    estado.municipios.forEach(function(m){
      var mLi = document.createElement('li');
      mLi.innerHTML = m.nombre + ' - Población: ' + (m.poblacion||'') + ' <button data-id="'+m.id+'" class="editarMunicipio">Editar</button> <button data-id="'+m.id+'" class="borrarMunicipio">Borrar</button>';
      ulMun.appendChild(mLi);
    });
    li.appendChild(ulMun);
    ulEstados.appendChild(li);
  });
  cont.appendChild(ulEstados);

  Array.prototype.slice.call(document.getElementsByClassName('borrarEstado')).forEach(function(btn){
    btn.addEventListener('click', function(e){
      var id = e.target.getAttribute('data-id');
      borrarEstado(id);
    });
  });
  Array.prototype.slice.call(document.getElementsByClassName('editarEstado')).forEach(function(btn){
    btn.addEventListener('click', function(e){
      var id = e.target.getAttribute('data-id');
      editarEstadoPrompt(id);
    });
  });

  Array.prototype.slice.call(document.getElementsByClassName('borrarMunicipio')).forEach(function(btn){
    btn.addEventListener('click', function(e){
      var id = e.target.getAttribute('data-id');
      borrarMunicipio(id);
    });
  });
  Array.prototype.slice.call(document.getElementsByClassName('editarMunicipio')).forEach(function(btn){
    btn.addEventListener('click', function(e){
      var id = e.target.getAttribute('data-id');
      editarMunicipioPrompt(id);
    });
  });
}

document.getElementById('formularioEstado').addEventListener('submit', function(ev){
  ev.preventDefault();
  var form = ev.target;
  var datos = new FormData(form);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/tarea2/api/estados/create/');
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.onload = function(){
    if(xhr.status === 200){ cargarEstados(); form.reset(); }
    else { alert('Error creando estado: '+xhr.responseText); }
  };
  xhr.send(datos);
});

function editarEstadoPrompt(id){
  var nombreEstado = prompt('Nuevo nombre de estado:');
  if(nombreEstado === null) return;
  var datos = new FormData();
  datos.append('nombre', nombreEstado);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/tarea2/api/estados/'+id+'/edit/');
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.onload = function(){ if(xhr.status===200) cargarEstados(); else alert('Error: '+xhr.responseText); };
  xhr.send(datos);
}

function borrarEstado(id){
  if(!confirm('Confirmar borrar estado id='+id)) return;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/tarea2/api/estados/'+id+'/delete/');
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.onload = function(){ if(xhr.status===200) cargarEstados(); else alert('Error: '+xhr.responseText); };
  xhr.send();
}

document.getElementById('formularioMunicipio').addEventListener('submit', function(ev){
  ev.preventDefault();
  var form = ev.target;
  var datos = new FormData(form);
  var estadoSeleccionado = datos.get('estado');
  if(!estadoSeleccionado){ alert('Seleccione un estado para el municipio.'); return; }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/tarea2/api/estados/'+estadoSeleccionado+'/municipios/create/');
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.onload = function(){ if(xhr.status===200){ cargarEstados(); form.reset(); } else { alert('Error creando municipio: '+xhr.responseText); } };
  xhr.send(datos);
});

function editarMunicipioPrompt(id){
  var nombreMun = prompt('Nuevo nombre municipio:');
  if(nombreMun === null) return;
  var datos = new FormData();
  datos.append('nombre', nombreMun);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/tarea2/api/municipios/'+id+'/edit/');
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.onload = function(){ if(xhr.status===200) cargarEstados(); else alert('Error: '+xhr.responseText); };
  xhr.send(datos);
}

function borrarMunicipio(id){
  if(!confirm('Confirmar borrar municipio id='+id)) return;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/tarea2/api/municipios/'+id+'/delete/');
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.onload = function(){ if(xhr.status===200) cargarEstados(); else alert('Error: '+xhr.responseText); };
  xhr.send();
}

window.onload = function(){ cargarEstados(); };
