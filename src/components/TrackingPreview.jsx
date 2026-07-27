import Link from "next/link";

export default function TrackingPreview({ folio }) {
  const cleanFolio =
    typeof folio === "string" && folio.trim()
      ? decodeURIComponent(folio).trim()
      : "RX-000";

  return (
    <main
      className="min-h-screen bg-[#f3f6f9] px-4 py-8 font-[Inter] text-[#07152b] sm:px-6 lg:px-8"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <section className="mx-auto max-w-[1040px] overflow-hidden rounded-lg border border-[#d6e0ea] bg-white">
        <header className="flex flex-col gap-5 border-b border-[#d6e0ea] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/logo-clickcom.png.png"
              alt="CLICK.COM del Caribe"
              className="h-auto w-[118px] object-contain"
            />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#ff6b00]">
                Seguimiento privado
              </p>
              <h1 className="mt-2 text-2xl font-black text-[#07152b]">
                {cleanFolio}
              </h1>
              <p className="mt-1 text-sm font-semibold text-[#52647d]">
                CLICK.COM del Caribe
              </p>
            </div>
          </div>

          <span className="w-fit rounded-full border border-[#b7e2c5] bg-[#effaf3] px-3 py-1 text-xs font-black text-[#087a31]">
            Enlace verificado
          </span>
        </header>

        <div className="grid border-b border-[#d6e0ea] sm:grid-cols-2 lg:grid-cols-4">
          <InfoCell
            label="Estado"
            value="Recibido"
            detail="Ultima actualizacion visible"
          />
          <InfoCell
            label="Equipo"
            value="Equipo registrado"
            detail="Pendiente de conectar"
          />
          <InfoCell
            label="Fecha estimada"
            value="Por confirmar"
            detail="El taller actualizara este dato"
          />
          <InfoCell
            label="Saldo"
            value="Pendiente de confirmar"
            detail="Solo si aplica"
          />
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <section className="border-b border-[#d6e0ea] p-6 lg:border-b-0 lg:border-r">
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#07152b]">
              Ultimo avance
            </h2>

            <div className="mt-4 rounded-lg border border-[#d6e0ea] bg-[#f8fafc] p-5">
              <p className="text-base font-black text-[#07152b]">
                Equipo registrado
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#52647d]">
                Tu orden fue registrada. El taller publicara avances visibles
                para el cliente cuando existan actualizaciones.
              </p>
            </div>

            <h2 className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-[#07152b]">
              Historial visible
            </h2>

            <div className="mt-4 divide-y divide-[#d6e0ea] rounded-lg border border-[#d6e0ea]">
              <div className="grid gap-2 p-4 sm:grid-cols-[140px_1fr]">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#52647d]">
                  Registro
                </span>
                <div>
                  <p className="font-black text-[#07152b]">
                    Equipo recibido por el taller
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#52647d]">
                    Primer movimiento visible del folio.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="p-6">
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#07152b]">
              Evidencias visibles
            </h2>

            <div className="mt-4 rounded-lg border border-dashed border-[#b8c8d9] bg-[#f8fafc] p-8 text-center text-sm font-bold text-[#52647d]">
              Sin fotos visibles por ahora.
            </div>

            <div className="mt-5 rounded-lg border border-[#d6e0ea] p-5">
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#07152b]">
                Privacidad del enlace
              </h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#52647d]">
                Este acceso es privado. Si cierras la pagina, vuelve a entrar
                desde el enlace compartido por el taller.
              </p>
            </div>

            <Link
              href="/"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-md border border-[#cbd8e7] bg-white px-4 text-sm font-black text-[#2563eb]"
            >
              Volver al inicio
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}

function InfoCell({ label, value, detail }) {
  return (
    <div className="border-b border-[#d6e0ea] p-5 lg:border-b-0 lg:border-r lg:last:border-r-0">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#52647d]">
        {label}
      </p>
      <p className="mt-2 text-lg font-black text-[#07152b]">{value}</p>
      <p className="mt-1 text-xs font-semibold text-[#52647d]">{detail}</p>
    </div>
  );
}
