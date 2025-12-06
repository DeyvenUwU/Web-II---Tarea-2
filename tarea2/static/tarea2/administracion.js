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
    var liTexto = '<strong>'+estado.nombre+'</strong>';
    if(estado.abreviatura){
      liTexto += ' ('+estado.abreviatura+')';
    }
    liTexto += ' <button data-id="'+estado.id+'" class="editarEstado">Editar</button> <button data-id="'+estado.id+'" class="borrarEstado">Borrar</button>';
    
    var li = document.createElement('li');
    li.innerHTML = liTexto;

    var ulMun = document.createElement('ul');
    if(estado.municipios && estado.municipios.length > 0){
      estado.municipios.forEach(function(m){
        var mLi = document.createElement('li');
        mLi.innerHTML = '<strong>'+m.nombre+'</strong> <button data-id="'+m.id+'" class="editarMunicipio">Editar</button> <button data-id="'+m.id+'" class="borrarMunicipio">Borrar</button>';
        ulMun.appendChild(mLi);
      });
    } else {
      var emptyLi = document.createElement('li');
      emptyLi.innerHTML = '<em>Sin municipios</em>';
      ulMun.appendChild(emptyLi);
    }
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
  if(nombreEstado === null || nombreEstado.trim() === '') return;
  var abreviaturaEstado = prompt('Nueva abreviatura (opcional):');
  if(abreviaturaEstado === null) return;
  
  var datos = new FormData();
  datos.append('nombre', nombreEstado.trim());
  if(abreviaturaEstado.trim()) {
    datos.append('abreviatura', abreviaturaEstado.trim());
  }
  
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/tarea2/api/estados/'+id+'/edit/');
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.onload = function(){ 
    if(xhr.status===200) { 
      cargarEstados(); 
    } else { 
      alert('Error: '+xhr.responseText); 
    } 
  };
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
  var nombreMun = prompt('Nuevo nombre del municipio:');
  if(nombreMun === null || nombreMun.trim() === '') return;
  
  var datos = new FormData();
  datos.append('nombre', nombreMun.trim());
  
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/tarea2/api/municipios/'+id+'/edit/');
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.onload = function(){ 
    if(xhr.status===200) { 
      cargarEstados(); 
    } else { 
      alert('Error: '+xhr.responseText); 
    } 
  };
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
