const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatBRL = (value: number) => brl.format(value);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

export const orderStatusLabel: Record<string, { label: string; className: string }> = {
  PENDING_PAYMENT: { label: 'Aguardando pagamento', className: 'bg-amber-100 text-amber-800' },
  PAID: { label: 'Pagamento aprovado', className: 'bg-green-100 text-green-800' },
  PAYMENT_FAILED: { label: 'Pagamento recusado', className: 'bg-red-100 text-red-800' },
  SHIPPED: { label: 'Enviado', className: 'bg-blue-100 text-blue-800' },
  CANCELLED: { label: 'Cancelado', className: 'bg-gray-200 text-gray-700' },
};
