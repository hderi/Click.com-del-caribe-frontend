"use client";

import { getToken } from "@/lib/authStorage";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import FormSection from "@/components/admin/FormSection";
import InputField from "@/components/admin/InputField";
import SelectField from "@/components/admin/SelectField";
import Button from "@/components/ui/Button";
import { sanitizeEmail, sanitizeMultiline, sanitizePhone, sanitizeText } from "@/lib/sanitize";
import { timeLocalInput, todayLocalInput } from "@/lib/adminFormat";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const DEVICE_TYPES = [
  { value: "laptop", label: "Laptop" },
  { value: "pc", label: "PC / CPU" },
  { value: "all_in_one", label: "All in One" },
  { value: "impresora", label: "Impresora" },
  { value: "otro", label: "Otro" },
];

const BRAND_OPTIONS = [
  "Acer", "Acteck", "Apple", "Asus", "BenQ", "Brother", "Canon", "Compaq",
  "Dell", "Epson", "Gateway", "Gigabyte", "HP", "Huawei", "Intel", "Kingston",
  "Lenovo", "LG", "Logitech", "Microsoft", "MSI", "Qian", "Samsung", "Seagate",
  "Sony", "Toshiba", "Ubiquiti", "Xerox", "Otro"
].sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));

const SERVICE_TECHS = [
  { value: "humberto", label: "Humberto" },
  { value: "milton", label: "Milton" },
  { value: "christian", label: "Christian" },
].sort((a, b) => a.label.localeCompare(b.label, "es", { sensitivity: "base" }));

const CONTACT_CHANNELS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "gmail", label: "Gmail / correo" },
  { value: "ambos", label: "Ambos" },
];

const AUTHORIZATION_METHODS = [
  { value: "presencial", label: "Presencial" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "llamada", label: "Llamada" },
  { value: "correo", label: "Correo" },
];

const ACCESSORIES = [
  { id: "cargador", label: "Cargador" },
  { id: "mouse", label: "Mouse" },
  { id: "cable_poder", label: "Cable de poder" },
  { id: "cartuchos", label: "Cartuchos" },
  { id: "tintas", label: "Tintas" },
];

const PHYSICAL_CONDITIONS = [
  { id: "sin_danos", label: "Sin daños visibles" },
  { id: "rayaduras", label: "Rayaduras" },
  { id: "golpes", label: "Golpes" },
  { id: "pantalla_danada", label: "Pantalla dañada" },
  { id: "bisagra_danada", label: "Bisagra dañada" },
  { id: "teclado_danado", label: "Teclado / touchpad dañado" },
  { id: "carcasa_danada", label: "Carcasa dañada" },
  { id: "humedad", label: "Humedad / líquido" },
  { id: "faltan_piezas", label: "Faltan piezas / tornillos" },
];

const YES_NO_OPTIONS = [
  { value: "no", label: "No" },
  { value: "si", label: "Sí" },
];

const PAYMENT_METHODS = [
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta_debito", label: "Tarjeta de débito" },
  { value: "tarjeta_credito", label: "Tarjeta de crédito" },
  { value: "transferencia", label: "Transferencia" },
  { value: "cheque", label: "Cheque" },
];

const GUARANTEE_OPTIONS = [
  { value: "si", label: "Sí aplica" },
  { value: "no", label: "No aplica" },
];

const DEFAULT_REPAIR_OPTIONS = {
  tiposEquipo: DEVICE_TYPES,
  marcas: BRAND_OPTIONS,
  tecnicos: SERVICE_TECHS,
  canalesContacto: CONTACT_CHANNELS,
  metodosAutorizacion: AUTHORIZATION_METHODS,
  accesorios: ACCESSORIES,
  condicionesFisicas: PHYSICAL_CONDITIONS,
  metodosPago: PAYMENT_METHODS,
  garantia: GUARANTEE_OPTIONS,
};

function normalizeOptions(items, fallback = []) {
  const source = Array.isArray(items) && items.length ? items : fallback;
  return source
    .map((item) => {
      if (typeof item === "string") return { value: item, label: item };
      const label = item?.label || item?.nombre || item?.value || "";
      const value = item?.value || item?.id || label;
      return label && value ? { ...item, value, id: item.id || value, label } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.label.localeCompare(b.label, "es", { sensitivity: "base" }));
}

function createInitialState() {
  return {
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    contactChannel: "whatsapp",
    deviceType: "",
    deviceOther: "",
    brand: "",
    brandOther: "",
    model: "",
    serialNumber: "",
    problem: "",
    receivedBy: "",
    entryTime: timeLocalInput(),
    authorizedBy: "",
    authorizationMethod: "presencial",
    tech: "",
    observations: "",
    physicalConditions: [],
    accessories: [],
    accessoryOther: "",
    receptionPhotos: [],
    devicePassword: "",
    dateIn: todayLocalInput(),
    dateEstimated: "",
    warrantyApplies: "no",
    warrantyDays: "7",
    warrantyNotes: "",
    serviceCost: "",
    gaveAdvance: "no",
    advanceAmount: "",
    paymentMethod: "por_definir",
    invoiceRequired: "no",
    paymentNotes: "",
  };
}


function fileToPhoto(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve({
      nombre: file.name,
      name: file.name,
      tipo: "recepcion",
      dataUrl: reader.result,
        size: file.size,
        lastModified: file.lastModified,
    });
    reader.onerror = () => resolve({ nombre: file.name, name: file.name, tipo: "recepcion" });
    reader.readAsDataURL(file);
  });
}
function money(value) {
  return value.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function CheckChip({ id, label, checked, onChange }) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
        checked
          ? "border-[#FF9F43] bg-[#FFF4E8] text-[#5F3200] shadow-[0_8px_18px_rgba(255,122,0,0.12)]"
          : "border-[#D5E2EC] bg-white text-[#334155] hover:border-[#BFD0DF] hover:bg-[#F8FBFD]"
      }`}
    >
      <span className={`flex h-4 w-4 items-center justify-center rounded border-2 ${checked ? "border-[#FF7A00] bg-[#FF7A00]" : "border-[#91A4B7]"}`}>
        {checked && (
          <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
      </span>
      <input id={id} type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  );
}

function TextAreaField({ id, label, value, onChange, placeholder, required, error, rows = 4, disabled = false }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1 text-sm font-medium text-[#334155]">
        {label}
        {required && <span className="text-brand-orange text-xs">*</span>}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm leading-relaxed text-[#102033] outline-none transition placeholder:text-[#7A8AA0] hover:border-[#BFD0DF] hover:bg-[#F8FBFD] focus:border-brand-blue focus:bg-white focus:shadow-[var(--shadow-input-focus)] disabled:cursor-not-allowed disabled:bg-[#EEF3F7] disabled:text-[#8190A3] disabled:opacity-70 ${
          error ? "border-error/50 focus:border-error" : "border-[#D5E2EC]"
        }`}
      />
      {error && <p className="text-[11px] font-medium text-error">{error}</p>}
    </div>
  );
}

function SearchableChoiceField({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = "Buscar...",
  required = false,
  error,
  allowCustom = false,
  customLabel = "Otro",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const normalizedOptions = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option
  );
  const selected = normalizedOptions.find((option) => option.value === value);
  const displayValue = selected?.label || value || "";
  const filtered = normalizedOptions
    .filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => a.label.localeCompare(b.label, "es", { sensitivity: "base" }));

  const selectValue = (nextValue) => {
    onChange({ target: { value: nextValue } });
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1 text-xs font-semibold text-[#374151]">
        {label}
        {required && <span className="text-[#b91c1c]">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={open ? query : displayValue}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 120);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            if (allowCustom) onChange({ target: { value: event.target.value } });
          }}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-md border bg-white py-2 pl-3 pr-10 text-sm leading-5 text-[#111827] outline-none transition-colors placeholder:text-[#9ca3af] ${
            error ? "border-red-300 focus:border-red-500" : "border-[#d1d5db] focus:border-[#2563eb]"
          }`}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-[#526174] hover:bg-[#eef2f7]"
          aria-label="Abrir opciones"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        {open && (
          <div className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-md border border-[#d1d5db] bg-white py-1 shadow-lg">
            {filtered.map((option) => (
              <button
                key={option.value}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectValue(option.value)}
                className={`block w-full px-3 py-2 text-left text-sm font-medium hover:bg-[#eef6ff] ${
                  value === option.value ? "bg-[#2563eb] text-white hover:bg-[#2563eb]" : "text-[#111827]"
                }`}
              >
                {option.label}
              </button>
            ))}
            {allowCustom && query.trim() && !filtered.some((option) => option.label.toLowerCase() === query.trim().toLowerCase()) && (
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectValue(query.trim())}
                className="block w-full border-t border-[#e5e7eb] px-3 py-2 text-left text-sm font-semibold text-[#0b6ea8] hover:bg-[#eef6ff]"
              >
                Usar "{query.trim()}"
              </button>
            )}
            {allowCustom && (
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectValue(customLabel)}
                className="block w-full border-t border-[#e5e7eb] px-3 py-2 text-left text-sm font-semibold text-[#374151] hover:bg-[#f8fafc]"
              >
                {customLabel}
              </button>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-xs font-medium text-[#b91c1c]">{error}</p>}
    </div>
  );
}

function PasswordVisibleField({ id, label, value, onChange, placeholder }) {
  const [visible, setVisible] = useState(true);
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1 text-xs font-semibold text-[#374151]">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full rounded-md border border-[#d1d5db] bg-white py-2 pl-3 pr-20 text-sm leading-5 text-[#111827] outline-none transition-colors placeholder:text-[#9ca3af] focus:border-[#2563eb]"
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-[#d1d5db] bg-white px-2 py-1 text-xs font-semibold text-[#374151] hover:bg-[#f3f4f6]"
        >
          {visible ? "Ocultar" : "Ver"}
        </button>
      </div>
    </div>
  );
}

function PhotoDropPreview({ files, onChange }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#BFD0DF] bg-[#F8FBFD] p-4">
      <label htmlFor="reception-photos" className="block cursor-pointer">
        <div className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-black text-[#102033]">Fotos al recibir</p>
            <p className="mt-1 text-xs font-bold leading-5 text-[#64748B]">
              Evidencia para rayones, golpes, pantalla, accesorios o estado general.
            </p>
          </div>
          <span className="rounded-xl border border-[#C9D8E5] bg-white px-4 py-2 text-xs font-black text-[#24566F]">
            Seleccionar fotos
          </span>
        </div>
      </label>
      <input id="reception-photos" type="file" accept="image/*" multiple className="sr-only" onChange={onChange} />
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {files.map((file, index) => (
            <div key={`${file.nombre || file.name}-${index}`} className="rounded-xl border border-[#D5E2EC] bg-white p-3 text-xs font-bold text-[#526174]">
              {file.dataUrl ? <img src={file.dataUrl} alt={file.nombre || file.name || `Foto ${index + 1}`} className="mb-2 h-20 w-full rounded-lg object-cover" /> : null}
              Foto {index + 1}
              <span className="mt-1 block truncate font-medium">{file.nombre || file.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NewRepairForm() {
  const router = useRouter();
  const [form, setForm] = useState(createInitialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRepair, setCreatedRepair] = useState(null);
  const [repairOptions, setRepairOptions] = useState(DEFAULT_REPAIR_OPTIONS);

  const deviceTypeOptions = useMemo(() => normalizeOptions(repairOptions.tiposEquipo, DEVICE_TYPES), [repairOptions.tiposEquipo]);
  const brandOptions = useMemo(() => normalizeOptions(repairOptions.marcas, BRAND_OPTIONS), [repairOptions.marcas]);
  const techOptions = useMemo(() => normalizeOptions(repairOptions.tecnicos, SERVICE_TECHS), [repairOptions.tecnicos]);
  const contactChannelOptions = useMemo(() => normalizeOptions(repairOptions.canalesContacto, CONTACT_CHANNELS), [repairOptions.canalesContacto]);
  const authorizationOptions = useMemo(() => normalizeOptions(repairOptions.metodosAutorizacion, AUTHORIZATION_METHODS), [repairOptions.metodosAutorizacion]);
  const accessoryOptions = useMemo(() => normalizeOptions(repairOptions.accesorios, ACCESSORIES), [repairOptions.accesorios]);
  const conditionOptions = useMemo(() => normalizeOptions(repairOptions.condicionesFisicas, PHYSICAL_CONDITIONS), [repairOptions.condicionesFisicas]);
  const paymentOptions = useMemo(() => normalizeOptions(repairOptions.metodosPago, PAYMENT_METHODS), [repairOptions.metodosPago]);
  const guaranteeOptions = useMemo(() => normalizeOptions(repairOptions.garantia, GUARANTEE_OPTIONS), [repairOptions.garantia]);

  const toNumber = (value) => Number(String(value || "").replace(/[^0-9.]/g, "")) || 0;
  const serviceCostNumber = toNumber(form.serviceCost);
  const hasAdvance = form.gaveAdvance === "si";
  const advanceNumber = hasAdvance ? toNumber(form.advanceAmount) : 0;
  const balanceDue = Math.max(serviceCostNumber - advanceNumber, 0);
  const advanceExceedsCost = hasAdvance && serviceCostNumber > 0 && advanceNumber > serviceCostNumber;
  const contactText = String(contactChannelOptions.find((item) => item.value === form.contactChannel)?.label || form.contactChannel).toLowerCase();
  const canUseWhatsapp = contactText.includes("whatsapp") || contactText.includes("ambos");
  const canUseEmail = contactText.includes("gmail") || contactText.includes("correo") || contactText.includes("ambos");
  const warrantyText = String(guaranteeOptions.find((item) => item.value === form.warrantyApplies)?.label || form.warrantyApplies).toLowerCase();
  const warrantyDisabled = warrantyText.includes("no");

  useEffect(() => {
    let ignore = false;
    async function loadOptions() {
      try {
        const token = getToken();
        if (!token) return;
        const configResponse = await fetch(`${API_URL}/api/configuracion/opciones_reparacion`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (configResponse.ok) {
          const configData = await configResponse.json();
          if (!ignore && configData?.datos && Object.keys(configData.datos).length > 0) {
            setRepairOptions((current) => ({ ...current, ...configData.datos }));
          }
        }

        const response = await fetch(`${API_URL}/api/usuarios`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return;
        const data = await response.json();
        const users = Array.isArray(data.usuarios) ? data.usuarios : [];
        const next = users
          .filter((user) => user.activo !== false && ["tecnico", "admin", "gerencia"].includes(String(user.rol || "").toLowerCase()))
          .map((user) => ({ value: user.nombre || user.usuario, label: user.nombre || user.usuario }))
          .filter((item) => item.value);
        if (!ignore && next.length > 0) {
          setRepairOptions((current) => ({ ...current, tecnicos: next }));
        }
      } catch {}
    }
    loadOptions();
    return () => {
      ignore = true;
    };
  }, []);

  const deviceLabel = useMemo(() => {
    if (form.deviceType === "otro") return form.deviceOther.trim() || "Otro equipo";
    return deviceTypeOptions.find((item) => item.value === form.deviceType)?.label || "Equipo";
  }, [deviceTypeOptions, form.deviceOther, form.deviceType]);

  const brandLabel = useMemo(() => {
    if (form.brand === "Otro") return form.brandOther.trim();
    return form.brand.trim();
  }, [form.brand, form.brandOther]);

  const set = (field) => (event) => {
    const value = event.target.value;
    if (field === "dateIn" && value) {
      const today = new Date().toISOString().slice(0, 10);
      if (value < today && typeof window !== "undefined") {
        const ok = window.confirm("Estás colocando una fecha anterior a hoy. ¿Deseas continuar?");
        if (!ok) return;
      }
    }
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "gaveAdvance" && value === "no") {
        next.advanceAmount = "";
        next.paymentMethod = "por_definir";
        next.paymentNotes = "";
      }
      if (field === "serviceCost" && next.gaveAdvance === "si") {
        const nextCost = Number(String(value || "").replace(/[^0-9.]/g, "")) || 0;
        const currentAdvance = Number(String(next.advanceAmount || "").replace(/[^0-9.]/g, "")) || 0;
        if (nextCost > 0 && currentAdvance > nextCost) {
          next.advanceAmount = String(nextCost);
        }
      }
      if (field === "deviceType" && value !== "otro") {
        next.deviceOther = "";
      }
      if (field === "brand" && value !== "Otro") {
        next.brandOther = "";
      }
      return next;
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const setAdvanceAmount = (event) => {
    const value = event.target.value;
    const numericValue = toNumber(value);
    if (serviceCostNumber > 0 && numericValue > serviceCostNumber) {
      setForm((prev) => ({ ...prev, advanceAmount: String(serviceCostNumber) }));
      setErrors((prev) => ({
        ...prev,
        advanceAmount: "El anticipo no puede ser mayor al costo del servicio",
      }));
      return;
    }
    setForm((prev) => ({ ...prev, advanceAmount: value }));
    if (errors.advanceAmount) setErrors((prev) => ({ ...prev, advanceAmount: null }));
  };

  const toggleList = (field, id) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(id)
        ? prev[field].filter((item) => item !== id)
        : [...prev[field], id],
    }));
  };

  const handlePhotos = async (event) => {
    const files = Array.from(event.target.files || []);
    const photos = await Promise.all(files.map(fileToPhoto));

    setForm((prev) => {
      const merged = [...prev.receptionPhotos, ...photos];
      const seen = new Set();
      const unique = merged.filter((photo) => {
        const key = `${photo.name || photo.nombre || ""}-${photo.size || ""}-${photo.lastModified || ""}-${photo.dataUrl || ""}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      return { ...prev, receptionPhotos: unique };
    });

    event.target.value = "";
  };

  const validate = () => {
    const newErrors = {};
    if (!form.clientName.trim()) newErrors.clientName = "El nombre es requerido";
    if (canUseWhatsapp && !form.clientPhone.trim()) newErrors.clientPhone = "El teléfono es requerido para WhatsApp";
    if (canUseEmail && !form.clientEmail.trim()) newErrors.clientEmail = "El correo es requerido para Gmail";
    if (!form.deviceType) newErrors.deviceType = "Selecciona un tipo de equipo";
    if (form.deviceType === "otro" && !form.deviceOther.trim()) newErrors.deviceOther = "Escribe qué tipo de equipo es";
    if (!form.brand.trim()) newErrors.brand = "La marca es requerida";
    if (form.brand === "Otro" && !form.brandOther.trim()) newErrors.brandOther = "Escribe la marca del equipo";
    if (!form.model.trim()) newErrors.model = "El modelo es requerido";
    if (!form.problem.trim()) newErrors.problem = "Describe el problema reportado";
    if (!form.receivedBy.trim()) newErrors.receivedBy = "Indica quién recibió el equipo";
    if (!form.tech.trim()) newErrors.tech = "Asigna un encargado";
    if (form.gaveAdvance === "si" && !form.advanceAmount.trim()) newErrors.advanceAmount = "Indica el monto del anticipo";
    if (advanceExceedsCost) {
      newErrors.advanceAmount = "El anticipo no puede ser mayor al costo del servicio";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    const payload = {
      canalContacto: form.contactChannel,
      cliente: {
        nombre: sanitizeText(form.clientName, 120),
        telefono: sanitizePhone(form.clientPhone),
        correo: sanitizeEmail(form.clientEmail),
      },
      equipo: {
        tipo: deviceLabel,
        marca: sanitizeText(brandLabel, 80),
        modelo: sanitizeText(form.model, 100),
        serie: sanitizeText(form.serialNumber, 80),
        passwordEquipo: form.devicePassword.trim(),
        notas: form.observations.trim(),
      },
      fallaReportada: sanitizeMultiline(form.problem, 1800),
      tecnico: form.tech.trim(),
      recibidoPor: form.receivedBy.trim(),
      horaEntrada: form.entryTime,
      estadoFisico: form.physicalConditions,
      fotosRecepcion: form.receptionPhotos.map((photo) => ({ nombre: photo.nombre || photo.name, name: photo.name || photo.nombre, tipo: "recepcion", dataUrl: photo.dataUrl || photo.preview || photo.url || "" })),
      fechaIngreso: form.dateIn,
      fechaEntregaEstimada: form.dateEstimated,
      observacionesRecepcion: form.observations.trim(),
      accesorios: [
        ...form.accessories,
        ...(form.accessoryOther.trim() ? [form.accessoryOther.trim()] : []),
      ],
      anticipo: {
        dioAnticipo: hasAdvance,
        monto: advanceNumber,
        formaPago: hasAdvance ? form.paymentMethod : "Por definir",
      },
      pago: {
        costoServicio: serviceCostNumber,
        factura: form.invoiceRequired === "si",
        saldoPendiente: balanceDue,
      },
      autorizacion: {
        metodo: form.authorizationMethod,
        autorizadoPor: form.authorizedBy.trim(),
      },
      garantia: {
        aplica: form.warrantyApplies,
        dias: Number(form.warrantyDays || 0),
        notas: form.warrantyNotes.trim(),
      },
      fotos: [],
    };

    try {
      const response = await fetch(`${API_URL}/api/reparaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo crear la reparación");

      const repair = data.reparacion;
      const rawTrackingPath = data.seguimientoUrl || `/seguimiento/${repair.folio}`;
      const trackingUrl = /^https?:\/\//i.test(rawTrackingPath)
        ? rawTrackingPath
        : (typeof window !== "undefined" ? `${window.location.origin}${rawTrackingPath.startsWith("/") ? rawTrackingPath : `/${rawTrackingPath}`}` : rawTrackingPath);

      setCreatedRepair({
        folio: repair.folio,
        clientName: repair.cliente?.nombre || form.clientName,
        clientPhone: repair.cliente?.telefono || form.clientPhone,
        clientEmail: repair.cliente?.correo || form.clientEmail,
        contactChannel: form.contactChannel,
        device: `${repair.equipo?.tipo || deviceLabel} ${repair.equipo?.marca || brandLabel} ${repair.equipo?.modelo || form.model}`.trim(),
        tech: repair.tecnico || form.tech,
        receivedBy: form.receivedBy,
        entryTime: form.entryTime,
        balanceDue: repair.pago?.saldoPendiente ?? balanceDue,
        trackingUrl,
      });
    } catch (error) {
      setErrors((prev) => ({ ...prev, form: error.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdRepair) {
    const whatsappText = encodeURIComponent(
      `Hola ${createdRepair.clientName}, tu equipo fue registrado con el folio ${createdRepair.folio}. Puedes consultar el seguimiento aquí: ${createdRepair.trackingUrl}`
    );
    const cleanPhone = String(createdRepair.clientPhone || "").replace(/\D/g, "");
    const whatsappUrl = cleanPhone ? `https://wa.me/52${cleanPhone}?text=${whatsappText}` : "";
    const mailSubject = encodeURIComponent(`Seguimiento de reparación ${createdRepair.folio}`);
    const mailBody = encodeURIComponent(
      `Hola ${createdRepair.clientName},\n\nTu equipo fue registrado en CLICK.COM del Caribe con el folio ${createdRepair.folio}.\nPuedes consultar el seguimiento aquí:\n${createdRepair.trackingUrl}\n\nCLICK.COM del Caribe`
    );
    const canSendWhatsapp = Boolean(cleanPhone);
    const copyTrackingLink = async () => {
      try {
        await navigator.clipboard.writeText(createdRepair.trackingUrl);
        alert("Link copiado al portapapeles");
      } catch {
        window.prompt("Copia este link:", createdRepair.trackingUrl);
      }
    };
    const showWhatsapp = createdRepair.contactChannel === "whatsapp" || createdRepair.contactChannel === "ambos";
    const showEmail = createdRepair.contactChannel === "gmail" || createdRepair.contactChannel === "ambos";

    return (
      <div className="max-w-5xl space-y-5 animate-fade-in">
        <section className="rounded-[26px] border border-[#C9D8E5] bg-gradient-to-br from-[#F8FBFD] via-[#EEF5FA] to-[#E5F0F7] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#B45F22]">Orden creada</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-4xl font-black tracking-[-0.04em] text-[#102033]">{createdRepair.folio}</h2>
              <p className="mt-2 text-sm font-bold text-[#526174]">El folio quedó listo para compartir con el cliente.</p>
            </div>
            <span className="inline-flex w-fit rounded-full border border-[#B9E8CD] bg-[#E8F8EF] px-4 py-2 text-sm font-black text-[#15803D]">
              Folio registrado
            </span>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[24px] border border-[#C9D8E5] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
            <h3 className="text-xl font-black text-[#102033]">Resumen de la orden</h3>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#D5E2EC] bg-[#F8FBFD] p-4">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#526174]">Cliente</p>
                <p className="mt-1 font-black text-[#102033]">{createdRepair.clientName}</p>
                <p className="text-sm text-[#526174]">{createdRepair.clientPhone || createdRepair.clientEmail}</p>
              </div>
              <div className="rounded-2xl border border-[#D5E2EC] bg-[#F8FBFD] p-4">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#526174]">Equipo</p>
                <p className="mt-1 font-black text-[#102033]">{createdRepair.device || "Equipo registrado"}</p>
              </div>
              <div className="rounded-2xl border border-[#D5E2EC] bg-[#F8FBFD] p-4">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#526174]">Recepción</p>
                <p className="mt-1 font-black text-[#102033]">{createdRepair.receivedBy}</p>
                <p className="text-sm text-[#526174]">Entrada: {createdRepair.entryTime}</p>
              </div>
              <div className="rounded-2xl border border-[#D5E2EC] bg-[#F8FBFD] p-4">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#526174]">Encargado</p>
                <p className="mt-1 font-black text-[#102033]">{createdRepair.tech}</p>
                <p className="text-sm text-[#526174]">Saldo: ${money(createdRepair.balanceDue)}</p>
              </div>
              <div className="rounded-2xl border border-[#D5E2EC] bg-[#F8FBFD] p-4 sm:col-span-2">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#526174]">Link privado</p>
                <p className="mt-1 break-all text-sm font-bold text-[#0077B6]">{createdRepair.trackingUrl}</p>
                <button type="button" onClick={copyTrackingLink} className="mt-3 rounded-xl border border-[#A8DDF1] bg-white px-4 py-2 text-sm font-black text-[#0077B6] transition hover:bg-[#E3F5FC]">Copiar link</button>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#C9D8E5] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
            <h3 className="text-xl font-black text-[#102033]">Siguiente paso</h3>
            <p className="mt-2 text-sm leading-6 text-[#526174]">Comparte el seguimiento por el canal elegido o imprime la orden para el control interno.</p>
            <div className="mt-5 grid grid-cols-1 gap-3">
              {showWhatsapp && (
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-2xl bg-[#22A06B] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#15803D]">Enviar por WhatsApp</a>
              )}
              {showEmail && (
                <a href={`mailto:${createdRepair.clientEmail || ""}?subject=${mailSubject}&body=${mailBody}`} className="rounded-2xl border border-[#A8DDF1] bg-[#E3F5FC] px-5 py-3 text-center text-sm font-black text-[#0077B6] transition hover:bg-[#D5F0FB]">Enviar por Gmail</a>
              )}
              {showWhatsapp && showEmail && (
                <p className="rounded-2xl border border-[#D5E2EC] bg-[#F8FBFD] px-4 py-3 text-xs font-bold leading-5 text-[#526174]">Usa ambos botones para dejar constancia por WhatsApp y correo.</p>
              )}
              <button type="button" onClick={() => router.push(`/admin/reparaciones/${createdRepair.folio}?print=1`)} className="rounded-2xl border border-[#F0C391] bg-[#FFF1E3] px-5 py-3 text-sm font-black text-[#B45309] transition hover:bg-[#FFE4C4]">Imprimir ficha completa</button>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => router.push("/admin/reparaciones")} className="rounded-2xl border border-[#C9D8E5] bg-[#EEF5FA] px-4 py-3 text-sm font-black text-[#334155] transition hover:bg-white">Ver listado</button>
                <button type="button" onClick={() => { setForm(createInitialState()); setCreatedRepair(null); }} className="rounded-2xl border border-[#C9D8E5] bg-[#EEF5FA] px-4 py-3 text-sm font-black text-[#334155] transition hover:bg-white">Nueva orden</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl space-y-5">
      <FormSection title="Datos del cliente" description="Información de contacto para ligar el folio al historial del cliente">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField id="client-name" label="Nombre del cliente" placeholder="Nombre completo del cliente" value={form.clientName} onChange={set("clientName")} required error={errors.clientName} />
          <SelectField id="contact-channel" label="Canal de envío" value={form.contactChannel} onChange={set("contactChannel")} options={contactChannelOptions} required />
          <InputField id="client-phone" label="Teléfono" type="tel" placeholder="Ej: 984 123 4567" value={form.clientPhone} onChange={set("clientPhone")} required={canUseWhatsapp} error={errors.clientPhone} />
          <InputField id="client-email" label="Correo electrónico" type="email" placeholder="Ej: cliente@email.com" value={form.clientEmail} onChange={set("clientEmail")} required={canUseEmail} error={errors.clientEmail} />
        </div>
      </FormSection>

      <FormSection title="Datos del equipo" description="Información técnica mínima para identificar el dispositivo sin repetir capturas">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField id="device-type" label="Tipo de equipo" value={form.deviceType} onChange={set("deviceType")} options={deviceTypeOptions} placeholder="Seleccionar tipo..." required error={errors.deviceType} />
          {form.deviceType === "otro" && (
            <InputField id="device-other" label="Especificar equipo" placeholder="Ej: monitor, proyector, punto de venta" value={form.deviceOther} onChange={set("deviceOther")} required error={errors.deviceOther} />
          )}
          <SearchableChoiceField
            id="device-brand"
            label="Marca"
            placeholder="Busca o escribe la marca"
            value={form.brand}
            onChange={set("brand")}
            required
            error={errors.brand}
            options={brandOptions}
            allowCustom
            customLabel="Otro"
          />
          {form.brand === "Otro" && (
            <InputField
              id="brand-other"
              label="Especificar marca"
              placeholder="Escribe la marca del equipo"
              value={form.brandOther}
              onChange={set("brandOther")}
              required
              error={errors.brandOther}
            />
          )}
          <InputField id="device-model" label="Modelo" placeholder="Ej: Inspiron 15 3520" value={form.model} onChange={set("model")} required error={errors.model} />
          <InputField id="device-serial" label="Número de serie" placeholder="Ej: SN-XXXXX-XXXXX" value={form.serialNumber} onChange={set("serialNumber")} />
        </div>
      </FormSection>

      <FormSection title="Falla o solicitud reportada" description="Qué reporta el cliente al dejar el equipo. El diagnóstico real se definirá después.">
        <TextAreaField id="problem" label="Falla o solicitud reportada" value={form.problem} onChange={set("problem")} required error={errors.problem} placeholder="Ej: no enciende, pila no retiene carga, limpieza de CPU, instalación de Office, revisión general..." rows={4} />
      </FormSection>

      <FormSection title="Recepción interna" description="Datos para saber quién recibió, quién autoriza y quién queda encargado">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField id="received-by" label="Recibió el equipo" placeholder="Ej: Ericka" value={form.receivedBy} onChange={set("receivedBy")} required error={errors.receivedBy} />
          <InputField id="entry-time" label="Hora de entrada" type="time" value={form.entryTime} onChange={set("entryTime")} />
          <InputField id="authorized-by" label="Autoriza servicio" placeholder="Nombre de quien autoriza" value={form.authorizedBy} onChange={set("authorizedBy")} />
          <SelectField id="authorization-method" label="Medio de autorización" value={form.authorizationMethod} onChange={set("authorizationMethod")} options={authorizationOptions} />
          <SearchableChoiceField
            id="repair-tech"
            label="Encargado del servicio"
            value={form.tech}
            onChange={set("tech")}
            options={techOptions}
            placeholder="Seleccionar encargado..."
            required
            error={errors.tech}
          />
        </div>
      </FormSection>

      <FormSection title="Estado físico y evidencia" description="Selecciona lo visible al recibir y agrega fotos para evitar reclamos posteriores.">
        <div className="flex flex-wrap gap-3">
          {conditionOptions.map((item) => (
            <CheckChip key={item.id} id={`condition-${item.id}`} label={item.label} checked={form.physicalConditions.includes(item.id)} onChange={() => toggleList("physicalConditions", item.id)} />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TextAreaField id="observations" label="Observaciones de recepción" value={form.observations} onChange={set("observations")} placeholder="Ej: equipo rayado, bisagra floja, no trae cargador, pantalla golpeada..." rows={5} />
          <PhotoDropPreview files={form.receptionPhotos} onChange={handlePhotos} />
        </div>
      </FormSection>

      <FormSection title="Accesorios recibidos" description="Elementos entregados junto con el equipo">
        <div className="flex flex-wrap gap-3">
          {accessoryOptions.map((item) => (
            <CheckChip key={item.id} id={`accessory-${item.id}`} label={item.label} checked={form.accessories.includes(item.id)} onChange={() => toggleList("accessories", item.id)} />
          ))}
        </div>
        <div className="mt-4 max-w-md">
          <InputField id="accessory-other" label="Otro accesorio" placeholder="Ej: funda, adaptador, memoria USB" value={form.accessoryOther} onChange={set("accessoryOther")} />
        </div>
      </FormSection>

      <div className="overflow-hidden rounded-[18px] border border-[#DDEAF2] bg-[#F8FAFC] shadow-[0_18px_44px_rgba(15,50,80,0.10)]">
        <div className="flex items-center gap-3 border-b border-[#E5EEF6] bg-white/70 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF8FE] font-black text-[#0077B6]">$</div>
          <div>
            <h3 className="m-0 text-[15px] font-black text-[#0F172A]">Pago y anticipo</h3>
            <p className="m-0 mt-1 text-xs font-bold text-[#64748B]">Registro inicial del costo, anticipo y forma de pago</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField id="service-cost" label="Costo del servicio" type="number" min="0" step="0.01" placeholder="Ej: 1200.00" value={form.serviceCost} onChange={set("serviceCost")} light />
            <SelectField id="gave-advance" label="Dio anticipo" value={form.gaveAdvance} onChange={set("gaveAdvance")} options={YES_NO_OPTIONS} light />
            <InputField id="advance-amount" label="Monto de anticipo" type="number" min="0" step="0.01" placeholder="Ej: 500.00" value={form.advanceAmount} onChange={setAdvanceAmount} disabled={!hasAdvance} required={hasAdvance} error={errors.advanceAmount} max={form.serviceCost || undefined} light />
            <SelectField id="payment-method" label="Cómo se pagó" value={form.paymentMethod} onChange={set("paymentMethod")} options={paymentOptions} disabled={!hasAdvance} light />
            <SelectField id="invoice-required" label="Factura" value={form.invoiceRequired} onChange={set("invoiceRequired")} options={YES_NO_OPTIONS} light />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px]">
            <TextAreaField id="payment-notes" label="Notas de pago" value={form.paymentNotes} onChange={set("paymentNotes")} placeholder={hasAdvance ? "Referencia, transferencia, pago con tarjeta, etc." : "Se activa cuando hay anticipo"} rows={3} disabled={!hasAdvance} />
            <div className="rounded-2xl border border-[rgba(180,95,34,0.22)] bg-[#F7F2EC] p-4 shadow-[0_0_24px_rgba(180,95,34,0.08)]">
              <p className="m-0 text-[11px] font-black uppercase tracking-[0.12em] text-[#64748B]">Saldo pendiente</p>
              <p className="m-0 mt-2 text-3xl font-black text-[#B45F22]">${money(balanceDue)}</p>
              <p className="m-0 mt-2 text-xs font-bold leading-5 text-[#64748B]">Se calcula con costo del servicio menos anticipo.</p>
            </div>
          </div>
        </div>
      </div>

      <FormSection title="Garantía e información adicional" description="Datos que ayudan al técnico, a la entrega y al cierre del folio">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <PasswordVisibleField id="device-password" label="Contraseña del equipo" placeholder="Opcional" value={form.devicePassword} onChange={set("devicePassword")} />
          <InputField id="date-in" label="Fecha de ingreso" type="date" value={form.dateIn} onChange={set("dateIn")} required />
          <InputField id="date-estimated" label="Fecha entrega estimada" type="date" value={form.dateEstimated} onChange={set("dateEstimated")} />
          <SelectField id="warranty-applies" label="Garantía" value={form.warrantyApplies} onChange={set("warrantyApplies")} options={guaranteeOptions} />
          <InputField id="warranty-days" label="Días de garantía" type="number" min="0" placeholder="Ej: 7" value={form.warrantyDays} onChange={set("warrantyDays")} disabled={warrantyDisabled} />
          <InputField id="warranty-notes" label="Nota de garantía" placeholder="Ej: no aplica por software" value={form.warrantyNotes} onChange={set("warrantyNotes")} />
        </div>
      </FormSection>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={() => router.push("/admin/reparaciones")}>Cancelar</Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting} id="save-repair-btn">Guardar reparación</Button>
      </div>
    </form>
  );
}








