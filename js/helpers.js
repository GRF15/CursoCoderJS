// nueva transacción
function crearTransaccion(tipo, fechaHora, monto) {
    return {
        id: Date.now(),
        tipo,
        fechaHora,
        monto
    };
}

// valida datos de la transacción y retorna errores
function validarTransaccion(tipo, fechaHora, monto) {
    let errores = [];
    if (tipo !== 'ingreso' && tipo !== 'gasto') errores.push('tipo');
    if (isNaN(monto) || monto <= 0) errores.push('monto');
    if (!fechaHora) errores.push('fechaHora');
    if (fechaHora && new Date(fechaHora) > new Date()) errores.push('fechaFutura');
    return errores;
}

// guarda las transacciones en localStorage
function guardarTransacciones() {
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
}