"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

interface Service {
    _id: string;
    title: string;
    description: string;
}

export default function ServicesTable() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Service | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const res = await api.get("/services");
            setServices(res.data);
            setError(null);
        } catch {
            setError("Failed to fetch services.");
        } finally {
            setLoading(false);
        }
    };

    const deleteService = async (id: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        try {
            await api.delete(`/services/${id}`);
            setServices((prev) => prev.filter((s) => s._id !== id));
        } catch {
            alert("Failed to delete service.");
        }
    };

    const openForm = (s?: Service) => {
        if (s) {
            setEditing(s);
            setTitle(s.title);
            setDescription(s.description);
        } else {
            setEditing(null);
            setTitle("");
            setDescription("");
        }
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            if (editing) {
                const res = await api.put(`/services/${editing._id}`, { title, description });
                setServices((prev) =>
                    prev.map((s) => (s._id === editing._id ? res.data : s))
                );
            } else {
                const res = await api.post("/services", { title, description });
                setServices((prev) => [res.data, ...prev]);
            }
            setShowForm(false);
            setEditing(null);
            setTitle("");
            setDescription("");
        } catch {
            alert("Failed to save service.");
        }
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Services</h2>
                <button
                    onClick={() => openForm()}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <FiPlus className="mr-2" /> Add Service
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {editing ? "Edit Service" : "Add Service"}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="mt-1 w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
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
                    Loading services...
                </div>
            )}

            {error && (
                <div className="text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {!loading && !services.length && !error && (
                <div className="text-center py-10 text-gray-500">
                    No services found.
                </div>
            )}

            {!loading && !!services.length && (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full border border-gray-200">
                        <thead>
                            <tr className="bg-gray-50 text-sm text-gray-600">
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Description</th>
                                <th className="px-4 py-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {services.map((s) => (
                                <tr key={s._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{s.title}</td>
                                    <td className="px-4 py-3 text-gray-600">{s.description}</td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <button
                                            onClick={() => openForm(s)}
                                            className="inline-flex items-center px-2 py-1 border rounded text-blue-600 border-blue-600 hover:bg-blue-50 transition"
                                        >
                                            <FiEdit2 className="mr-1" /> Edit
                                        </button>
                                        <button
                                            onClick={() => deleteService(s._id)}
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
