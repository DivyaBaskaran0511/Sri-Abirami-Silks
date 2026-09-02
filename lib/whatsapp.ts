import { WHATSAPP_NUMBER } from './supabase';

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildProductEnquiryMessage(opts: {
  name: string;
  code: string;
  price: number;
  url: string;
}): string {
  return [
    `Hello ${'Sri Abirami Silks & Sarees'},`,
    ``,
    `I'm interested in this saree:`,
    `Name: ${opts.name}`,
    `Code: ${opts.code}`,
    `Price: ₹${opts.price.toLocaleString('en-IN')}`,
    `Link: ${opts.url}`,
    ``,
    `Could you please share more details?`,
  ].join('\n');
}

export function buildCartCheckoutMessage(items: {
  name: string;
  code: string;
  price: number;
  quantity: number;
}[]): string {
  const lines = [
    `Hello ${'Sri Abirami Silks & Sarees'},`,
    ``,
    `I'd like to enquire about the following items:`,
    ``,
  ];
  let total = 0;
  items.forEach((item, idx) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    lines.push(
      `${idx + 1}. ${item.name} (${item.code}) - Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')} = ₹${subtotal.toLocaleString('en-IN')}`
    );
  });
  lines.push('');
  lines.push(`Total: ₹${total.toLocaleString('en-IN')}`);
  lines.push('');
  lines.push('Please confirm availability and delivery details.');
  return lines.join('\n');
}
