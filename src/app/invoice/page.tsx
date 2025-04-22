'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { Trash2, Pencil } from 'lucide-react';

type Invoice = {
  _id: string;
  customerName: string;
  customerEmail: string;
  dueDate: string;
  totalAmount: number;
  createdAt: string;
};

const baseApi = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch(`${baseApi}/invoices`);
        const data = await res.json();
        setInvoices(data);
      } catch (err) {
        console.error('Failed to fetch invoices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this invoice?');
    if (!confirm) return;

    try {
      const res = await fetch(`${baseApi}/invoices/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete invoice');

      setInvoices((prev) => prev.filter((invoice) => invoice._id !== id));
      toast.success('Invoice deleted!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete invoice');
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Toaster />
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-pink-700 text-center sm:text-left">
        Invoices
      </h1>

      {loading ? (
        <p className="text-pink-500">Loading...</p>
      ) : invoices.length === 0 ? (
        <p className="text-pink-500">No invoices found.</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[600px] rounded-lg shadow-lg border border-pink-200 bg-pink-50">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-pink-100 text-pink-800 uppercase text-xs font-bold">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Created At</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {invoices.map((invoice) => (
                    <motion.tr
                      key={invoice._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-pink-200 hover:bg-pink-100 transition-colors"
                    >
                      <td className="px-4 py-3">{invoice.customerName}</td>
                      <td className="px-4 py-3">{invoice.customerEmail}</td>
                      <td className="px-4 py-3">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-pink-700 font-semibold">
                        ₦{invoice.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(invoice.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                          <Link
                            href={`/invoice/edit/${invoice._id}`}
                            className="flex items-center gap-1 text-pink-600 hover:text-pink-800 transition"
                          >
                            <Pencil size={16} />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(invoice._id)}
                            className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="mt-8 text-center">
        <Link href="/">
          <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all duration-200">
            Go Home
          </button>
        </Link>
      </div>
    </main>
  );
}
