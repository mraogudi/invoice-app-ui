import { useParams } from "react-router-dom";
import InvoicePreview from "../pages/InvoicePreview";

export default function InvoicePublicView() {
  const { id } = useParams();

  return <InvoicePreview invoiceId={id} />;
}
