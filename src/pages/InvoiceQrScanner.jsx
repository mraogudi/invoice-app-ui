import { useState } from "react";
import { decryptInvoiceData } from "../utils/qrCrypto";

export default function InvoiceQrScanner() {
  const [invoice, setInvoice] = useState(null);

  const handleDecode = (text) => {
    try {
      const parsed = JSON.parse(text);

      const decrypted = decryptInvoiceData(parsed.data);

      setInvoice(decrypted);
    } catch (e) {
      alert("Invalid QR" + e);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Scan Invoice QR</h2>

      <input
        type="text"
        placeholder="Paste QR content here"
        onBlur={(e) => handleDecode(e.target.value)}
        style={{ width: 400 }}
      />

      {invoice && (
        <div style={{ marginTop: 30 }}>
          <h3>Invoice #{invoice.id}</h3>
          <p>Client: {invoice.client}</p>
          <p>Date: {invoice.date}</p>
          <p>Total: ₹{invoice.total}</p>

          <h4>Items</h4>

          {invoice.items.map((item, i) => (
            <div key={i}>
              {item.productName} — {item.quantity} × ₹{item.unitPrice}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
