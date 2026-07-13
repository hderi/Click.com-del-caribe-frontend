export default function AdminUtilityPage({ eyebrow, title, description, stats = [], sections = [], footerNote }) {
  return (
    <main className="space-y-5 text-[#172234]">
      <section className="rounded-[18px] border border-[#B8C9D8] bg-[#F7FAFC] p-6 shadow-[0_16px_32px_rgba(27,43,60,0.10)]">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#B45309]">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-[#172234]">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[#526174]">{description}</p>
      </section>

      {stats.length > 0 && (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <article key={item.label} className="rounded-[16px] border border-[#B8C9D8] bg-white p-5 shadow-[0_12px_24px_rgba(27,43,60,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-black text-[#172234]">{item.label}</p>
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color || "#0B86AD" }} />
              </div>
              <p className="mt-4 text-4xl font-black tracking-[-0.05em]" style={{ color: item.color || "#0B86AD" }}>{item.value}</p>
              <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.08em] text-[#667085]">{item.note}</p>
            </article>
          ))}
        </section>
      )}

      <section className="grid gap-5 xl:grid-cols-2">
        {sections.map((section) => (
          <article key={section.title} className="rounded-[18px] border border-[#B8C9D8] bg-white p-5 shadow-[0_16px_32px_rgba(27,43,60,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-[-0.02em] text-[#172234]">{section.title}</h2>
                <p className="mt-1 text-sm font-semibold leading-6 text-[#526174]">{section.description}</p>
              </div>
              {section.badge && <span className="rounded-full bg-[#E8F6FC] px-3 py-1 text-xs font-black text-[#087EA7]">{section.badge}</span>}
            </div>
            <div className="mt-5 space-y-3">
              {section.items.map((item) => (
                <div key={item.title} className="rounded-2xl border border-[#D0DDE8] bg-[#F7FAFC] p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-black text-[#172234]">{item.title}</p>
                      <p className="mt-1 text-sm font-semibold leading-5 text-[#526174]">{item.text}</p>
                    </div>
                    {item.tag && <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-black text-[#B45309] ring-1 ring-[#F0C9A8]">{item.tag}</span>}
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      {footerNote && (
        <div className="rounded-2xl border border-[#D0DDE8] bg-[#EDF4F8] px-5 py-4 text-sm font-bold leading-6 text-[#526174]">
          {footerNote}
        </div>
      )}
    </main>
  );
}