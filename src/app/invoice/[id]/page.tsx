'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion } from 'framer-motion';

type InvoiceItem = {
  description: string;
  quantity: number;
  price: number;
};

type Invoice = {
  _id: string;
  customerName: string;
  customerEmail: string;
  dueDate: string;
  items: InvoiceItem[];
  totalAmount: number;
};

const baseApi = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function InvoiceDetailPage() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  const generatePDF = (): Blob | undefined => {
    if (!invoice) return;

    const doc = new jsPDF();

    doc.setFont('times', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(40, 40, 40);
    doc.text('INVOICE', 14, 22);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice from: Elite Kitchen`, 150, 22, { align: 'right' });

    doc.text(`Invoice to: ${invoice.customerName}`, 14, 35);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 150, 35, { align: 'right' });
    doc.text(`Invoice Number: ${invoice._id}`, 150, 42, { align: 'right' });
    doc.text(`Email: ${invoice.customerEmail}`, 14, 42);

    autoTable(doc, {
      startY: 55,
      head: [['DESCRIPTION', 'PRICE', 'QUANTITY', 'SUBTOTAL']],
      body: invoice.items.map((item) => [
        item.description,
        `N${item.price.toFixed(2)}`,
        item.quantity.toString(),
        `N${(item.price * item.quantity).toFixed(2)}`,
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [255, 204, 229],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
      bodyStyles: {
        fillColor: [255, 229, 242],
        textColor: [50, 50, 50],
      },
      styles: {
        font: 'helvetica',
        fontSize: 10,
        halign: 'center',
      },
      columnStyles: {
        0: { halign: 'left' },
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFillColor(255, 204, 229);
    doc.rect(140, finalY, 60, 30, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text(`Sub-total: N${invoice.totalAmount.toFixed(2)}`, 145, finalY + 8);
    doc.text(`Total: N${invoice.totalAmount.toFixed(2)}`, 145, finalY + 24);

    doc.setFontSize(10);
    doc.setFont('times', 'italic');
    doc.text('Thank you for your business', 14, 285);

    return doc.output('blob');
  };

  const sendEmail = async () => {
    if (!invoice) return;
    const pdfBlob = generatePDF();
    if (!pdfBlob) return alert('Failed to generate the PDF.');

    const formData = new FormData();
    formData.append('pdf', pdfBlob, `invoice-${invoice._id}.pdf`);

    try {
      const res = await fetch(`${baseApi}/email/${invoice._id}/send`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('Invoice sent via email!');
      } else {
        alert('Error sending email: ' + data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong while sending the email.');
    }
  };

  const downloadPDF = () => {
    const pdfBlob = generatePDF();
    if (!pdfBlob) return alert('Failed to generate the PDF.');

    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = `invoice-${invoice?._id ?? 'unknown'}.pdf`;
    link.click();
  };

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const res = await fetch(`${baseApi}/invoices/${id}`);
        const data = await res.json();
        setInvoice(data);
      } catch (err) {
        console.error('Failed to fetch invoice:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  if (loading) return <p className="p-6 text-center text-pink-500 font-semibold">Loading...</p>;
  if (!invoice) return <p className="p-6 text-center text-red-400">Invoice not found.</p>;

  return (
    <motion.main
      className="max-w-3xl mx-auto p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-extrabold text-pink-600 mb-4">Invoice Details</h1>

      <div className="border border-pink-300 p-4 rounded-lg bg-pink-50 shadow-md mb-6">
        <p><strong className="text-pink-800">Customer:</strong> {invoice.customerName}</p>
        <p><strong className="text-pink-800">Email:</strong> {invoice.customerEmail}</p>
        <p><strong className="text-pink-800">Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
        <p><strong className="text-pink-800">Total Amount:</strong> N{invoice.totalAmount.toFixed(2)}</p>
      </div>

      <h2 className="text-xl font-semibold text-pink-700 mb-2">Items</h2>
      <div className="overflow-x-auto rounded-md border border-pink-200 shadow-sm">
        <table className="w-full table-auto bg-white">
          <thead className="bg-pink-100 text-pink-900">
            <tr>
              <th className="p-2 border border-pink-200">Description</th>
              <th className="p-2 border border-pink-200">Quantity</th>
              <th className="p-2 border border-pink-200">Price</th>
              <th className="p-2 border border-pink-200">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="text-center hover:bg-pink-50 transition"
              >
                <td className="p-2 border">{item.description}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">N{item.price.toFixed(2)}</td>
                <td className="p-2 border">N{(item.quantity * item.price).toFixed(2)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <button
          onClick={sendEmail}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          📧 Send via Email
        </button>
        <button
          onClick={downloadPDF}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg shadow transition"
        >
          ⬇️ Download PDF
        </button>
        <button
          onClick={() => router.push('/invoice/new')}
          className="bg-white border border-pink-300 text-pink-700 hover:bg-pink-100 px-4 py-2 rounded-lg shadow transition"
        >
          ➕ Create New Invoice
        </button>
      </div>
    </motion.main>
  );
}
