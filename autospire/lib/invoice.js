export const VAT_RATE = 0.05; // UAE VAT is 5%; prices are treated as VAT-inclusive

// "AED 1,850" or 1850  ->  1850
export function toNumber(value) {
  return parseFloat(String(value ?? "").replace(/[^\d.]/g, "")) || 0;
}

// 1850  ->  "AED 1,850.00"
export function money(amount) {
  return "AED " + amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// makes the same invoice number every time for the same entry
function makeNumber(entry) {
  const text = `${entry.title}${entry.date}`;
  let hash = 0;
  for (const letter of text) hash = (hash * 31 + letter.charCodeAt(0)) % 100000;
  return "KRV-" + String(hash).padStart(5, "0");
}

// entry   = one timeline / service history item
// vehicle = { name, plate } of the selected vehicle
export function buildInvoice(entry, vehicle) {
  // use the entry's own list of parts if it has one, otherwise show a single line
  const items = entry.items?.length
    ? entry.items.map((item) => ({ name: item.name, qty: item.qty ?? 1, price: toNumber(item.price) }))
    : [{ name: entry.title, qty: 1, price: toNumber(entry.amount) }];

  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const subtotal = total / (1 + VAT_RATE);

  return {
    number: entry.invoiceNo || makeNumber(entry),
    title: entry.title,
    date: entry.date,
    garage: entry.garage,
    vehicleName: vehicle?.name || "",
    plate: vehicle?.plate || "",
    items,
    subtotal,
    vat: total - subtotal,
    total,
  };
}