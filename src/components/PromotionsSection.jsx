const PROMOS = [
  {
    title: "Laptop Dell 15 DC15250",
    description: "Intel Core i5-1334U, 16GB, 512GB SSD, Windows 11 Home, Espanol.",
    price: "$11,200.00 neto",
    image: "/promos/promo-laptop-dell.jpg.jpeg",
  },
  {
    title: "Monitor Gamer Gigabyte GS27F",
    description: "LCD 27 pulgadas, Full HD, FreeSync, 165Hz, HDMI/DisplayPort.",
    price: "$3,045.00 neto",
    image: "/promos/promo-monitor-gigabyte.jpg.jpeg",
  },
  {
    title: "Qian QPMT1701 Touchscreen",
    description: "Monitor LED touchscreen 17 pulgadas, color negro.",
    price: "$4,000.00 neto",
    image: "/promos/promo-qian-touch.jpg.jpeg",
  },
  {
    title: "LiteBeam airMAX AC GEN2",
    description: "CPE hasta 450 Mbps, 5 GHz, antena integrada de 23 dBi.",
    price: "$1,450.00 neto",
    image: "/promos/promo-litebeam.jpg.jpeg",
  },
  {
    title: "Proyector portatil Qian",
    description: "LCD 1280 x 720, 120 lumenes, Bluetooth, bajo pedido.",
    price: "$1,885.00 neto",
    image: "/promos/promo-proyector-qian.jpg.jpeg",
  },
];

export default function PromotionsSection() {
  return (
    <section id="promociones" className="relative overflow-hidden bg-[#07111B] px-5 py-16 text-white sm:px-8 lg:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,174,239,0.22),transparent_28%),radial-gradient(circle_at_84%_24%,rgba(255,122,0,0.24),transparent_28%),linear-gradient(180deg,#07111B_0%,#0B1D2B_100%)]" />
      <div
        className="absolute inset-0 opacity-12"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
        }}
      />

      <div className="relative mx-auto max-w-[1180px]">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#FF7A00]">Promociones actuales</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
              Equipos y precios destacados para aprovechar ahora.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/70">
            Productos disponibles o bajo pedido. El cliente puede preguntar existencia directo por WhatsApp.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PROMOS.map((promo, index) => (
            <article
              key={promo.title}
              className="group overflow-hidden rounded-[2rem] bg-white text-[#111827] shadow-[0_22px_70px_rgba(0,0,0,0.22)] ring-1 ring-white/10 transition duration-300 hover:-translate-y-1"
            >
              <a
                href={promo.image}
                target="_blank"
                rel="noreferrer"
                className="relative block aspect-[9/16] overflow-hidden bg-white"
                title={`Abrir imagen de ${promo.title}`}
              >
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 rounded-full bg-[#FF7A00] px-3 py-1 text-xs font-black uppercase tracking-wide text-white shadow-lg">
                  Promo {index + 1}
                </div>
              </a>
              <div className="p-5">
                <h3 className="text-lg font-black leading-tight text-[#080808]">{promo.title}</h3>
                <p className="mt-2 text-sm leading-5 text-[#4B5563]">{promo.description}</p>
                <p className="mt-4 text-2xl font-black text-[#FF7A00]">{promo.price}</p>
                <a
                  href={`https://wa.me/529871119621?text=${encodeURIComponent(`Hola, quiero informacion sobre: ${promo.title}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#00AEEF] px-4 py-3 text-sm font-black text-white transition hover:bg-[#FF7A00]"
                >
                  Preguntar por WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

