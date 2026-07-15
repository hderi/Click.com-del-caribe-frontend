"use client";

export default function RepairTimeline({ events = [] }) {
  if (!events.length) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-[#6b7280]">Sin historial registrado aún.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute bottom-2 left-[5px] top-2 w-px bg-[#d1d5db]" />
      <div className="space-y-0">
        {events.map((event, idx) => {
          const isFirst = idx === 0;
          return (
            <div key={idx} className="relative flex gap-4 pb-5 last:pb-0">
              <div className="relative z-10 mt-1 shrink-0">
                <div className="h-2.5 w-2.5 rounded-full border border-white" style={{ backgroundColor: event.color || "#2563eb" }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <p className={`text-sm ${isFirst ? "font-semibold text-[#111827]" : "font-medium text-[#374151]"}`}>
                    {event.title}
                  </p>
                  <span className="whitespace-nowrap text-xs text-[#6b7280]">{event.date}</span>
                </div>
                {event.description && <p className="mt-1 text-xs leading-relaxed text-[#6b7280]">{event.description}</p>}
                {event.tech && (
                  <p className="mt-1.5 text-xs text-[#6b7280]">
                    Por: <span className="text-[#374151]">{event.tech}</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
