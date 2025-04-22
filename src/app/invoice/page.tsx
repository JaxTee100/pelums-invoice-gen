'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Invoice = {
  _id: string;
  customerName: string;
  customerEmail: string;
  dueDate: string;
  totalAmount: number;
  createdAt: string; // Add this field to the Invoice type
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

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>

      {loading ? (
        <p>Loading...</p>
      ) : invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Customer</th>
              <th className="p-2">Email</th>
              <th className="p-2">Due Date</th>
              <th className="p-2">Total</th>
              <th className="p-2">Created At</th> {/* Add Created At column */}
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id} className="border-t">
                <td className="p-2">{invoice.customerName}</td>
                <td className="p-2">{invoice.customerEmail}</td>
                <td className="p-2">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                <td className="p-2">N{invoice.totalAmount.toFixed(2)}</td>
                <td className="p-2">
                  {new Date(invoice.createdAt).toLocaleString()}
                </td>
                <td className="p-2">
                  <Link href={`/invoice/edit/${invoice._id}`} className="text-blue-500 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
