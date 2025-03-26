// Declaración de variables y arrays
const transacciones = [];

// Función para solicitar una transacción
function solicitarTransaccion() {
    let tipo = prompt("Ingrese el tipo de transacción ('ingreso' o 'gasto') o 'salir' para terminar:").toLowerCase();
    if (tipo === "salir") {
        return null;
    }
    let monto = parseFloat(prompt("Ingrese el monto de la transacción:"));
    if (isNaN(monto)) {
        alert("Monto inválido. Intente nuevamente.");
        return solicitarTransaccion();
    }
    return { tipo, monto };
}

// Función para calcular totales
function calcularTotales(transacciones) {
    let totalIngresos = 0;
    let totalGastos = 0;
    for (let i = 0; i < transacciones.length; i++) {
        if (transacciones[i].tipo === "ingreso") {
            totalIngresos += transacciones[i].monto;
        } else if (transacciones[i].tipo === "gasto") {
            totalGastos += transacciones[i].monto;
        }
    }
    return { totalIngresos, totalGastos };
}

// Ciclo para ingresar transacciones
let transaccion = solicitarTransaccion();
while (transaccion !== null) {
    transacciones.push(transaccion);
    transaccion = solicitarTransaccion();
}

// Calcular balance y mostrar resultados
const { totalIngresos, totalGastos } = calcularTotales(transacciones);
const balance = totalIngresos - totalGastos;
console.log("Total de Ingresos: " + totalIngresos);
console.log("Total de Gastos: " + totalGastos);
console.log("Balance Final: " + balance);
alert("Tu balance final es: " + balance);
