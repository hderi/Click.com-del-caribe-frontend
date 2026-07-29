import Link from "next/link";
import { SERVICE_POLICIES } from "@/lib/servicePolicies";

export const metadata = {
  title: "Politicas de servicio | CLICK.COM del Caribe",
  description: "Condiciones y politicas de servicio para reparaciones y diagnosticos.",
};

export default function ServicePoliciesPage() {
  return (
    <main className="min-h-screen bg-[#F4F8FB] px-5 py-10 text-[#07152B]" style={{ fontFamily: "Inter, Arial, sans-serif" }}>
      <section className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-[#D6E0EA] bg-white shadow-sm">
        <header className="border-b border-[#D6E0EA] px-6 py-7 sm:px-8">
          <Link href="/" className="text-sm font-bold text-[#0055FF] hover:underline">
            Volver a inicio
          </Link>
          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
            <img src="/logo-clickcom.png.png" alt="CLICK.COM del Caribe" className="h-auto w-[132px] object-contain" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#FF6B00]">Condiciones del servicio</p>
              <h1 className="mt-2 text-3xl font-black leading-tight text-[#07152B]">Politicas de servicio</h1>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#52647D]">
                Estas politicas aplican para diagnosticos, reparaciones, garantias, resguardo y entrega de equipos recibidos por CLICK.COM del Caribe.
              </p>
            </div>
          </div>
        </header>

        <ol className="divide-y divide-[#E5EAF0]">
          {SERVICE_POLICIES.map((policy, index) => (
            <li key={`${policy}-${index}`} className="grid gap-4 px-6 py-5 sm:grid-cols-[42px_1fr] sm:px-8">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#EEF6FF] text-sm font-black text-[#0055FF]">
                {index + 1}
              </span>
              <p className="text-sm font-bold leading-7 text-[#172033]">{policy}</p>
            </li>
          ))}
        </ol>

        <footer className="border-t border-[#D6E0EA] bg-[#F8FBFD] px-6 py-5 text-center text-xs font-bold text-[#64748B] sm:px-8">
          CLICK.COM del Caribe - Servicio especializado en informatica
        </footer>
      </section>
    </main>
  );
}
