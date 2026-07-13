"use client";
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   RepairTimeline — Technical history for a repair order
   Shows each event as a vertical timeline with status dots
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function RepairTimeline({ events = [] }) {
  if (!events.length) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-[#64748B]">Sin historial registrado aún.</p>
      </div>
    );
  }
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border-default" />
      <div className="space-y-0">
        {events.map((event, idx) => {
          const isFirst = idx === 0;
          return (
            <div key={idx} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Dot */}
              <div className="relative z-10 shrink-0 mt-0.5">
                <div
                  className="w-[10px] h-[10px] rounded-full ring-[3px] ring-surface-900"
                  style={{ backgroundColor: event.color || "#0066FF" }}
                />
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0 -mt-0.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <p className={`text-sm ${isFirst ? "font-semibold text-[#102033]" : "font-medium text-[#334155]"}`}>
                    {event.title}
                  </p>
                  <span className="text-[11px] text-[#64748B] whitespace-nowrap">
                    {event.date}
                  </span>
                </div>
                {event.description && (
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    {event.description}
                  </p>
                )}
                {event.tech && (
                  <p className="text-[11px] text-[#64748B] mt-1.5">
                    Por: <span className="text-[#334155]">{event.tech}</span>
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


