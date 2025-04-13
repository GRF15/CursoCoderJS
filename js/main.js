document.addEventListener('DOMContentLoaded', function() {
    //localStorage
    let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];

    const formulario = document.getElementById('Formulario');
    const listaTransacciones = document.getElementById('listaTransacciones');
    const contadorBalance = document.getElementById('contadorBalance');
    const contenedorBalance = document.getElementById('contenedorBalance');

    function guardarTransacciones() {
        localStorage.setItem('transacciones', JSON.stringify(transacciones));
    }

    function renderTransacciones() {
        listaTransacciones.innerHTML = '';
        transacciones.forEach((transaccion) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.textContent = `${transaccion.tipo.charAt(0).toUpperCase() + transaccion.tipo.slice(1)}: $${transaccion.monto}`;
            
            const badge = document.createElement('span');
            badge.className = transaccion.tipo === 'ingreso' ? 'badge bg-success' : 'badge bg-danger';
            badge.textContent = transaccion.tipo === 'ingreso' ? 'Ingreso' : 'Gasto';

            li.appendChild(badge);
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
        const tipoDeTransaccion = document.getElementById('Transaccion').value;
        const monto = parseFloat(document.getElementById('Monto').value);

        // Validar que el monto sea un número positivo
        if (monto <= 0) {
            alert('El monto debe ser un número positivo.');
            return;
        }

        const nuevaTransaccion = { tipo: tipoDeTransaccion, monto: monto };
        transacciones.push(nuevaTransaccion);
        guardarTransacciones();
        renderTransacciones();
        actualizarBalance();

        formulario.reset();
    });

    botonReset.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que deseas reiniciar todas las transacciones?')) {
            transacciones = [];                     
            localStorage.removeItem('transacciones'); 
            renderTransacciones();                
            actualizarBalance();   
            location.reload()             
        }
    });

    renderTransacciones();
    actualizarBalance();
});
