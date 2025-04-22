'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // ✅ Correct for App Router
import { useState } from 'react';

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

export default function NewInvoicePage() {
    const router = useRouter(); // ✅ Make sure it's inside the component body

    const [form, setForm] = useState<InvoiceForm>({
        customerName: '',
        customerEmail: '',
        items: [{ description: '', quantity: 1, price: 0 }],
        dueDate: '',
    });

    const handleItemChange = (
        index: number,
        field: keyof InvoiceItem,
        value: string | number
    ) => {
        const newItems = [...form.items];

        newItems[index] = {
            ...newItems[index],
            [field]: value,
        };

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

        const totalAmount = form.items.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
        );

        const payload = {
            ...form,
            totalAmount,
        };

        try {
            const res = await fetch('http://localhost:4000/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const data = await res.json();
                const invoiceId = data._id;

                router.push(`/invoice/${invoiceId}`);
            } else {
                const data = await res.json();
                alert('Error: ' + data.message);
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error('An unknown error occurred.');
            }
            alert('Something went wrong.');
        }
    };

    return (
        <main className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Create New Invoice</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Customer Name</label>
                    <input
                        type="text"
                        value={form.customerName}
                        onChange={(e) =>
                            setForm({ ...form, customerName: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">Customer Email</label>
                    <input
                        type="email"
                        value={form.customerEmail}
                        onChange={(e) =>
                            setForm({ ...form, customerEmail: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                {form.items.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-center">
                        <select
                            value={form.items[index].description}
                            onChange={(e) => {
                                const selected = availableItems.find(i => i.description === e.target.value);
                                if (selected) {
                                    const updatedItems = [...form.items];
                                    updatedItems[index] = {
                                        ...updatedItems[index],
                                        description: selected.description,
                                        price: selected.price,
                                    };
                                    setForm({ ...form, items: updatedItems });
                                }
                            }}
                            className="flex-1 p-2 border rounded"
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
                            readOnly
                            className="w-24 p-2 border rounded bg-gray-100"
                        />

                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-500"
                        >
                            ✕
                        </button>
                    </div>
                ))}
                <div className="mb-4">
                    <button
                        type="button"
                        onClick={addItem}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                        + Add Item
                    </button>
                </div>

                <div>
                    <label className="block font-medium">Due Date</label>
                    <input
                        type="date"
                        value={form.dueDate}
                        onChange={(e) =>
                            setForm({ ...form, dueDate: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Create Invoice
                </button>
            </form>
        </main>
    );
}
