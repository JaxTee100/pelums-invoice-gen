'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

type InvoiceItem = {
  description: string;
  quantity: number;
  price: number;
};

type InvoiceForm = {
  customerName: string;
  customerEmail: string;
  items: InvoiceItem[];
  dueDate: string;
};

const baseApi = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function EditInvoicePage() {
  const [form, setForm] = useState<InvoiceForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  

const { id } = useParams() as { id: string };


  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) return;

      const res = await fetch(`${baseApi}/invoices/${id}`);
      const data = await res.json();
      setForm({
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        items: data.items,
        dueDate: data.dueDate.split('T')[0],
      });
      setLoading(false);
    };

    fetchInvoice();
  }, [id]);

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    if (!form) return;
    const newItems = [...form.items];
    if (field === 'description') newItems[index].description = value as string;
    else if (field === 'quantity') newItems[index].quantity = Number(value);
    else if (field === 'price') newItems[index].price = Number(value);
    setForm({ ...form, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !id) return;

    setSaving(true);

    const totalAmount = form.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const payload = { ...form, totalAmount };

    const res = await fetch(`http://localhost:4000/api/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert('Invoice updated!');
      router.push('/invoices');
    } else {
      const data = await res.json();
      alert('Error: ' + data.message);
    }

    setSaving(false);
  };

  if (loading || !form) return <p>Loading...</p>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Invoice</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Customer Name</label>
          <input
            type="text"
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Customer Email</label>
          <input
            type="email"
            value={form.customerEmail}
            onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Items</label>
          {form.items.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleItemChange(index, 'description', e.target.value)
                }
                className="flex-1 p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, 'quantity', parseFloat(e.target.value))
                }
                className="w-20 p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, 'price', parseFloat(e.target.value))
                }
                className="w-24 p-2 border rounded"
                required
              />
            </div>
          ))}
        </div>
        <div>
          <label className="block font-medium">Due Date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Update Invoice'}
        </button>
      </form>
    </main>
  );
}
