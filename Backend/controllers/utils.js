exports.timestamp = () => {
  const fechaActual = new Date();

  const dia = fechaActual.getDate().toString().padStart(2, "0");
  const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0");
  const anio = fechaActual.getFullYear().toString();
  const horas = fechaActual.getHours().toString().padStart(2, "0");
  const minutos = fechaActual.getMinutes().toString().padStart(2, "0");
  const segundos = fechaActual.getSeconds().toString().padStart(2, "0");

  const fechaFormateada = `${dia}-${mes}-${anio} ${horas}:${minutos}:${segundos}`;

  return fechaFormateada;
};
