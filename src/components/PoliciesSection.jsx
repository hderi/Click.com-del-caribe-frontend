const POLICY_GROUPS = [
  {
    title: "Recepcion del equipo",
    accent: "blue",
    items: [
      "El cliente acepta las políticas de servicio de CLICK.COM DEL CARIBE y acepta que a través de nuestros procedimientos se realice la reparación y/o diagnóstico de su equipo de cómputo al ser entregado a nuestra empresa.",
      "No se entrega el equipo en caso de no presentar la orden de servicio correspondiente; en caso de extravío presentar documentos que avalen la propiedad del mismo.",
      "Verifique que el equipo recibido esté de acuerdo a lo declarado en la orden de servicio, ya que no se aceptará alguna reclamación posterior a la fecha de entrega.",
    ],
  },
  {
    title: "Costos y pagos",
    accent: "orange",
    items: [
      "La revisión o diagnóstico del equipo reparable o no reparable es de: CPU/PC: $300.00 pesos, laptop: $300.00 pesos, impresora láser e inyección de tinta $300.00, tablet $200.00, precios más iva, en nuestras instalaciones.",
      "En caso de aceptar el servicio previa cotización, no se cobrará el diagnóstico, únicamente el costo de la reparación por mano de obra y refacciones.",
      "La forma de pago del servicio es de: contado, con tarjeta de débito o crédito (más el 2.5%), cheque a nombre de JUAN GABRIEL CUPUL HUU, y se entregará el equipo cuando el pago esté en firme en la cuenta.",
      "Al término del servicio se le informará al cliente teniendo 7 días naturales para recogerlo; caso contrario tendrá un costo de $30.00 pesos de resguardo por día, y la empresa no se hace responsable del equipo.",
    ],
  },
  {
    title: "Garantias",
    accent: "blue",
    items: [
      "El tiempo de garantía en la reparación o mano de obra es de 7 días naturales.",
      "El tiempo de garantia en refacciones dependera del fabricante o del proveedor.",
      "El tiempo de garantía no aplica en caso de eliminación de virus y de cualquier software que el cliente traiga para instalar.",
    ],
  },
  {
    title: "Responsabilidades",
    accent: "orange",
    items: [
      "CLICK.COM DEL CARIBE no se hace responsable de los accesorios y daños físicos (golpes, rayaduras) no declarados en la orden de servicio.",
      "La empresa CLICK.COM DEL CARIBE y su representante legal persona física JUAN GABRIEL CUPUL HUU no se hace responsable del software original y no original instalados, así como del equipo después de dos meses, de haber sido concluido y avisado al cliente del diagnóstico y/o reparación.",
    ],
  },
];

export default function PoliciesSection() {
  return (
    <section id="politicas" className="relative overflow-hidden bg-[#F4F8FC] px-5 py-16 sm:px-8 lg:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(0,174,239,0.14),transparent_26%),radial-gradient(circle_at_88%_80%,rgba(255,122,0,0.12),transparent_28%)]" />

      <div className="relative mx-auto max-w-[1180px]">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#FF7A00]">
              Politicas de servicio
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-[#080808] sm:text-5xl">
              Condiciones de recepcion, reparacion y entrega.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[#4B5563] lg:ml-auto">
            Las politicas se mantienen completas, pero agrupadas para que el cliente
            pueda leerlas con mas claridad.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {POLICY_GROUPS.map((group) => (
            <article
              key={group.title}
              className="overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-[#DDE7EF]"
            >
              <div className={`px-6 py-5 text-white ${group.accent === "blue" ? "bg-[#07111B]" : "bg-[#FF7A00]"}`}>
                <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">
                  CLICK.COM del Caribe
                </p>
                <h3 className="mt-1 text-2xl font-black">{group.title}</h3>
              </div>
              <div className="divide-y divide-[#E4ECF3]">
                {group.items.map((item) => (
                  <div key={item} className="p-5 sm:p-6">
                    <div className="flex gap-3">
                      <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${group.accent === "blue" ? "bg-[#00AEEF]" : "bg-[#FF7A00]"}`} />
                      <p className="text-sm font-bold leading-7 text-[#344154]">
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

