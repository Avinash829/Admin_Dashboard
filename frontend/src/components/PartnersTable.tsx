"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

interface Partner {
    _id: string;
    name: string;
    website: string;
}

export default function PartnersTable() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Partner | null>(null);
    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            setLoading(true);
            const res = await api.get("/partners");
            setPartners(res.data);
            setError(null);
        } catch {
            setError("Failed to fetch partners.");
        } finally {
            setLoading(false);
        }
    };

    const deletePartner = async (id: string) => {
        if (!confirm("Are you sure you want to delete this partner?")) return;
        try {
            await api.delete(`/partners/${id}`);
            setPartners((prev) => prev.filter((p) => p._id !== id));
        } catch {
            alert("Failed to delete partner.");
        }
    };

    const openForm = (p?: Partner) => {
        if (p) {
            setEditing(p);
            setName(p.name);
            setWebsite(p.website);
        } else {
            setEditing(null);
            setName("");
            setWebsite("");
        }
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            if (editing) {
                const res = await api.put(`/partners/${editing._id}`, { name, website });
                setPartners((prev) =>
                    prev.map((p) => (p._id === editing._id ? res.data : p))
                );
            } else {
                const res = await api.post("/partners", { name, website });
                setPartners((prev) => [res.data, ...prev]);
            }
            setShowForm(false);
            setEditing(null);
            setName("");
            setWebsite("");
        } catch {
            alert("Failed to save partner.");
        }
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Partners</h2>
                <button
                    onClick={() => openForm()}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <FiPlus className="mr-2" /> Add Partner
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {editing ? "Edit Partner" : "Add Partner"}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Website</label>
                            <input
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                type="url"
                                required
                                className="mt-1 w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                {editing ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading && (
                <div className="flex justify-center items-center py-10 text-gray-500">
                    Loading partners...
                </div>
            )}

            {error && (
                <div className="text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {!loading && !partners.length && !error && (
                <div className="text-center py-10 text-gray-500">
                    No partners found.
                </div>
            )}

            {!loading && !!partners.length && (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full border border-gray-200">
                        <thead>
                            <tr className="bg-gray-50 text-sm text-gray-600">
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Website</th>
                                <th className="px-4 py-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {partners.map((p) => (
                                <tr key={p._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{p.name}</td>
                                    <td className="px-4 py-3 text-blue-600">
                                        <a href={p.website} target="_blank" rel="noreferrer">
                                            {p.website}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <button
                                            onClick={() => openForm(p)}
                                            className="inline-flex items-center px-2 py-1 border rounded text-blue-600 border-blue-600 hover:bg-blue-50 transition"
                                        >
                                            <FiEdit2 className="mr-1" /> Edit
                                        </button>
                                        <button
                                            onClick={() => deletePartner(p._id)}
                                            className="inline-flex items-center px-2 py-1 border rounded text-red-600 border-red-600 hover:bg-red-50 transition"
                                        >
                                            <FiTrash2 className="mr-1" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
