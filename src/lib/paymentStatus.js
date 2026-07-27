export function getPaymentStatus(repair = {}) {
  const pago = repair.pago || repair.payment || {};
  const anticipo = repair.anticipo || repair.advance || {};
  const costo = Number(pago.costoServicio ?? pago.costo ?? repair.costoServicio ?? 0);
  const recibido = Number(anticipo.monto ?? pago.anticipo ?? repair.anticipoMonto ?? 0);
  const saldoRaw = pago.saldoPendiente ?? pago.saldo ?? repair.saldoPendiente;
  const saldo = saldoRaw === undefined || saldoRaw === null ? Math.max(0, costo - recibido) : Number(saldoRaw);

  if (costo <= 0 && recibido <= 0) {
    return { key: "sin_pago", label: "Sin pago", saldo: 0, color: "#64748B" };
  }

  if (recibido <= 0 && costo > 0) {
    return { key: "pendiente", label: "Pendiente", saldo: Math.max(0, saldo), color: "#C55A11" };
  }

  if (saldo > 0) {
    return { key: "anticipo", label: "Pendiente de pago", saldo, color: "#B98517" };
  }

  return { key: "liquidado", label: "Liquidado", saldo: 0, color: "#16854E" };
}

export function hasPendingPayment(repair = {}) {
  const status = getPaymentStatus(repair);
  return status.key === "pendiente" || status.key === "anticipo";
}
