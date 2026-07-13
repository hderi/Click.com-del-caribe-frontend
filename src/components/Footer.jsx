const WHATSAPP_NUMBER = "529871119621";
const MAPS_QUERY = "214+Av+Benito+Juarez+Playa+del+Carmen+Quintana+Roo";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`;
export default function Footer() {
  return (
    <footer id="contacto" className="bg-[#080808] px-5 py-14 text-white sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1180px] gap-10 md:grid-cols-[1fr_1.15fr_0.75fr]">
        <div>
          <img
            src="/logo-clickcom.png.jpeg"
            alt="CLICK.COM DEL CARIBE"
            className="h-20 w-auto max-w-[260px] rounded-xl bg-white object-contain p-2"
          />
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
            Click.com, soluciones seguras
          </p>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#00AEEF]">Contacto</h3>
          <div className="mt-4 space-y-3 text-sm text-white/75">
            <p className="leading-6">
              Av. Benito Juarez, Entre 80 Av. Sur y Diagonal 85 Av. Sur,<br />
              Local 3, MZ 214, Lote 006,<br />
              Colonia Ejidal, Playa del Carmen, Quintana Roo.
            </p>
            <a className="block font-bold text-white" href="mailto:erickalh56@gmail.com">
              erickalh56@gmail.com
            </a>
            <a className="block font-bold text-white" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
              WhatsApp: 987 111 9621
            </a>
            <a
              className="inline-flex rounded-full border border-[#00AEEF]/30 px-4 py-2 text-xs font-black text-[#00AEEF] transition hover:bg-[#00AEEF] hover:text-white"
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
            >
              Ver ubicacion en Google Maps
            </a>
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <iframe
                src={MAPS_EMBED_URL}
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicacion de CLICK.COM del Caribe en Google Maps"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#FF7A00]">Horarios</h3>
          <div className="mt-4 space-y-2 text-sm text-white/75">
            <p>Lunes a viernes: 9:00 AM - 6:00 PM</p>
            <p>Sabado: 9:00 AM - 3:00 PM</p>
            <p>Domingo: cerrado</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1180px] flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} CLICK.COM Caribe. Todos los derechos reservados.</p>
        
      </div>
    </footer>
  );
}

