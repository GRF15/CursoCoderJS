//localStorage
let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];

const formulario = document.getElementById('Formulario');
const listaTransacciones = document.getElementById('listaTransacciones');
const contadorBalance = document.getElementById('contadorBalance');
const contenedorBalance = document.getElementById('contenedorBalance');

function renderTransacciones() {
    listaTransacciones.innerHTML = '';
    transacciones.forEach((transaccion, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.textContent = `${transaccion.tipo.charAt(0).toUpperCase() + transaccion.tipo.slice(1)}: $${transaccion.monto} - ${transaccion.fechaHora}`;
        
        //boton x
        const botonEliminar = document.createElement('button');
        botonEliminar.className = 'btneliminar btn btn-danger btn-sm ms-3';
        botonEliminar.textContent = 'X';

        botonEliminar.addEventListener('click', function() {
            Swal.fire({
            title: "¿Desea eliminar ésta transaccion de forma permanente?",
            text: "Los cambios serán irreversibles",
            icon: "warning",
            showDenyButton: true,
            denyButtonText: 'No',
            confirmButtonColor: "#157F1F",
            cancelButtonColor: "#ff0000",
            confirmButtonText: "Si",
            })
            .then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                    title: "Transacciones eliminadas con exito",
                    text: "",
                    icon: "success"
                    });
                    transacciones.splice(index, 1);
                    guardarTransacciones(); 
                    renderTransacciones();                
                    actualizarBalance();  
                    renderGrafico();
                }
            });
        });

        const badge = document.createElement('span');
        badge.className = transaccion.tipo === 'ingreso' ? 'badge bg-success' : 'badge bg-danger';
        badge.textContent = transaccion.tipo === 'ingreso' ? 'Ingreso' : 'Gasto';

        li.appendChild(badge);
        li.appendChild(botonEliminar);
        listaTransacciones.appendChild(li);
    });
}

function actualizarBalance() {
    const balance = transacciones.reduce((acum, transaccion) => {
        return transaccion.tipo === 'ingreso' ? acum + transaccion.monto : acum - transaccion.monto;
    }, 0);
    contadorBalance.textContent = `$${balance}`;

    if (balance < 0) {
        contenedorBalance.classList.add('negative');
    } else {
        contenedorBalance.classList.remove('negative');
    }
}

formulario.addEventListener('submit', function(event) {
    event.preventDefault();
    const tipo = document.getElementById('Transaccion').value;
    const fecha = document.getElementById('FechaHora').value;
    const monto = parseFloat(document.getElementById('Monto').value);
    const submitBtn = formulario.querySelector('button[type="submit"]');

    if (submitBtn) submitBtn.disabled = true;

    // Limpia clases de error
    document.getElementById('Transaccion').classList.remove('is-invalid');
    document.getElementById('FechaHora').classList.remove('is-invalid');
    document.getElementById('Monto').classList.remove('is-invalid');

    // Validación
    const errores = validarTransaccion(tipo, fecha, monto);
    if (errores.length > 0) {
        if (errores.includes('tipo')) document.getElementById('Transaccion').classList.add('is-invalid');
        if (errores.includes('monto')) document.getElementById('Monto').classList.add('is-invalid');
        if (errores.includes('fechaHora') || errores.includes('fechaFutura')) document.getElementById('FechaHora').classList.add('is-invalid');
        Swal.fire({ 
            toast: true,
            position: 'top-end',
            icon: 'error', 
            title: 'Error', 
            text: 'Revisa los campos ingresados.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
        });
        if (submitBtn) submitBtn.disabled = false;
        return;
    }

    // Crear y guardar transacción
    const nuevaTransaccion = crearTransaccion(tipo, fecha, monto);
    transacciones.push(nuevaTransaccion);
    guardarTransacciones();
    renderTransacciones();
    actualizarBalance();
    renderGrafico();

    Swal.fire({ 
        toast: true,
        position: 'top-end',
        icon: 'success', 
        title: 'Transacción agregada', 
        showConfirmButton: false, 
        timer: 1200,
        timerProgressBar: true,
     });
    formulario.reset();
    document.getElementById('Transaccion').focus();
    if (submitBtn) submitBtn.disabled = false;
});

document.getElementById('FechaHora').value = new Date().toISOString().slice(0,16);

//boton reset
botonReset.addEventListener('click', function reiniciarTransacciones() {
    Swal.fire({
    title: "¿Desea eliminar todas las transacciones de forma permanente?",
    text: "Los cambios serán irreversibles",
    icon: "warning",
    showDenyButton: true,
    denyButtonText: 'No',
    confirmButtonColor: "#157F1F",
    cancelButtonColor: "#ff0000",
    confirmButtonText: "Si"
    }).then((result) => {
        if (result.isConfirmed) {
            transacciones = [];                     
            localStorage.removeItem('transacciones');
            Swal.fire({
                icon: "success",
                title: "Transacciones eliminadas con exito",
                showConfirmButton: false,
                timer: 1500
            });
            renderTransacciones();                
            actualizarBalance();   
            renderGrafico();
        }
    });
});

if (!localStorage.getItem('transacciones')) {
    fetch('datos/transacciones.json')
        .then(response => response.json())
        .then(data => {
            transacciones = data;
            guardarTransacciones();
            renderTransacciones();
            actualizarBalance();
            renderGrafico();
        });
}

renderTransacciones();
actualizarBalance();
renderGrafico();

function renderGrafico() {
    const ingresos = transacciones.filter(t => t.tipo === 'ingreso').reduce((a, t) => a + t.monto, 0);
    const gastos = transacciones.filter(t => t.tipo === 'gasto').reduce((a, t) => a + t.monto, 0);
    const ctx = document.getElementById('graficoTransacciones').getContext('2d');
    if (window.miGrafico) window.miGrafico.destroy();
    window.miGrafico = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Ingresos', 'Gastos'],
            datasets: [{
                data: [ingresos, gastos],
                backgroundColor: ['#198754', '#dc3545']
            }]
        }
    });
}
