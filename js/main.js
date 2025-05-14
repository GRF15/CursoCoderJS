
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
        transacciones.forEach((transaccion, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.textContent = `${transaccion.tipo.charAt(0).toUpperCase() + transaccion.tipo.slice(1)}: $${transaccion.monto} - ${transaccion.fechaHora}`;
            
            //boton x
            const botonEliminar = document.createElement('button');
            botonEliminar.className = 'btneliminar btn btn-danger btn-sm ms-3';
            botonEliminar.textContent = 'X';

            botonEliminar.addEventListener('click', function() {
                if (confirm('¿Estás seguro de que deseas eliminar esta transacción?')) {
                   
                    transacciones.splice(index, 1);
                    guardarTransacciones(); 
                    renderTransacciones();                
                    actualizarBalance();
                }
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
        const tipoDeTransaccion = document.getElementById('Transaccion').value;
        const fechaHora = document.getElementById('FechaHora').value;
        const monto = parseFloat(document.getElementById('Monto').value);

        // monto positivo
        if (monto <= 0) {
            alert('El monto debe ser un número positivo.');
            return;
        }

        if (!fechaHora) {
            alert('Por favor, ingresa una fecha y hora válida.');
            return;
        }

        const nuevaTransaccion = { tipo: tipoDeTransaccion, fechaHora: fechaHora , monto: monto };
        transacciones.push(nuevaTransaccion);
        guardarTransacciones();
        renderTransacciones();
        actualizarBalance();

        formulario.reset();
    });

    //boton reset
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
