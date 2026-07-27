import TrackingAccessGate from "@/components/TrackingAccessGate";
import TrackingPreview from "@/components/TrackingPreview";

export default function SeguimientoFolioPage({ params, searchParams }) {
  const folio = params?.folio || "";
  const token =
    typeof searchParams?.token === "string" ? searchParams.token.trim() : "";

  if (!token) {
    return <TrackingAccessGate folio={folio} />;
  }

  return <TrackingPreview folio={folio} />;
}
