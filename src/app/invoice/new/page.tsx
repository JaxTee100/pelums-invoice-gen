'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const availableItems = [
  { description: 'Jollof rice (pck)', price: 2000 },
  { description: 'White rice (pck)', price: 1800 },
  { description: 'Fried rice (pck)', price: 2200 },
  { description: 'Ofada rice (pck)', price: 2500 },
  { description: 'Vegetable (prt)', price: 1000 },
  { description: 'Egusi (prt)', price: 1200 },
  { description: 'Beef (pcs)', price: 800 },
  { description: 'Chicken (pcs)', price: 1000 },
  { description: 'Egg (pcs)', price: 300 },
  { description: 'Fish (pcs)', price: 900 },
];

const baseApi = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function NewInvoicePage() {
  const router = useRouter();
  const [form, setForm] = useState<InvoiceForm>({
    customerName: '',
    customerEmail: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    dueDate: '',
  });

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...form.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setForm({ ...form, items: newItems });
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { description: '', quantity: 1, price: 0 }] });
  };

  const removeItem = (index: number) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = form.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const payload = { ...form, totalAmount };

    try {
      const res = await fetch(`${baseApi}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/invoice/${data._id}`);
      } else {
        const data = await res.json();
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Something went wrong.');
      console.error(err);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <motion.h1
        className="text-3xl font-extrabold text-pink-600 mb-8 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Create New Invoice
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6 bg-pink-50 p-6 rounded-lg shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Customer Name */}
        <div>
          <label className="block font-semibold text-pink-700 mb-1">Customer Name</label>
          <input
            type="text"
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            className="w-full p-2 border border-pink-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
        </div>

        {/* Customer Email */}
        <div>
          <label className="block font-semibold text-pink-700 mb-1">Customer Email</label>
          <input
            type="email"
            value={form.customerEmail}
            onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
            className="w-full p-2 border border-pink-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
        </div>

        {/* Items */}
        <AnimatePresence>
          {form.items.map((item, index) => (
            <motion.div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <select
                value={item.description}
                onChange={(e) => {
                    const selected = availableItems.find(i => i.description === e.target.value);
                    if (selected) {
                      const newItems = [...form.items];
                      newItems[index] = {
                        ...newItems[index],
                        description: selected.description,
                        price: selected.price,
                      };
                      setForm({ ...form, items: newItems });
                    }
                  }}
                  
                className="sm:col-span-2 p-2 border border-pink-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              >
                <option value="">Select Item</option>
                {availableItems.map((menuItem, idx) => (
                  <option key={idx} value={menuItem.description}>
                    {menuItem.description} - ₦{menuItem.price}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min={1}
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                className="p-2 border border-pink-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={item.price}
                readOnly
                className="p-2 border bg-pink-100 text-pink-800 rounded"
              />

              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-pink-600 hover:text-pink-800 font-bold text-xl"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <div>
          <button
            type="button"
            onClick={addItem}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded transition"
          >
            + Add Item
          </button>
        </div>

        {/* Due Date */}
        <div>
          <label className="block font-semibold text-pink-700 mb-1">Due Date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="w-full p-2 border border-pink-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-pink-700 transition w-full sm:w-auto"
        >
          Create Invoice
        </motion.button>
      </motion.form>
    </main>
  );
}
