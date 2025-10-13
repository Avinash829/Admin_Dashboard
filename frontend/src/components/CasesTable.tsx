"use client";
import { useEffect, useState, ChangeEvent } from "react";
import api from "@/lib/api";
import { FiPlus, FiEdit2, FiTrash2, FiUpload } from "react-icons/fi";
import { PhotoIcon } from "@heroicons/react/24/outline";

interface Case {
    _id: string;
    title: string;
    description: string;
    images: string[];
}

export default function CasesTable() {
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Case | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            setLoading(true);
            const res = await api.get("/cases");
            setCases(res.data);
            setError(null);
        } catch {
            setError("Failed to fetch cases. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const deleteCase = async (id: string) => {
        if (!confirm("Are you sure you want to delete this case?")) return;
        try {
            await api.delete(`/cases/${id}`);
            setCases((prev) => prev.filter((c) => c._id !== id));
        } catch {
            alert("Failed to delete case.");
        }
    };

    const openForm = (c?: Case) => {
        if (c) {
            setEditing(c);
            setTitle(c.title);
            setDescription(c.description);
            setPreviewImages(c.images || []);
            setImages([]);
        } else {
            setEditing(null);
            setTitle("");
            setDescription("");
            setImages([]);
            setPreviewImages([]);
        }
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        setImages(files);

        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            images.forEach((img) => formData.append("images", img));


            if (editing) {
                const res = await api.put(`/cases/${editing._id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setCases((prev) =>
                    prev.map((c) => (c._id === editing._id ? res.data : c))
                );
            } else {
                const res = await api.post("/cases", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setCases((prev) => [res.data, ...prev]);
            }

            setEditing(null);
            setTitle("");
            setDescription("");
            setImages([]);
            setPreviewImages([]);
            setShowForm(false);
        } catch {
            alert("Failed to save case.");
        }
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-bold">Cases</h2>
                <button
                    onClick={() => openForm()}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <FiPlus className="mr-2" /> Add Case
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editing ? "Edit Case" : "Add Case"}
                    </h2>
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

                        <div>
                            <label className="block text-sm font-medium mb-1">Images</label>
                            <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                                <div className="text-center text-gray-400">
                                    <FiUpload className="mx-auto mb-1 h-6 w-6" />
                                    <span className="text-sm">
                                        Drag & drop images here or click to upload
                                    </span>
                                </div>
                            </label>
                            <div className="flex space-x-2 mt-2 flex-wrap">
                                {previewImages.map((url, idx) => (
                                    <div key={idx} className="relative">
                                        <img
                                            src={url}
                                            alt="preview"
                                            className="h-20 w-20 object-cover rounded border"
                                        />
                                    </div>
                                ))}
                            </div>
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
                <div className="flex justify-center items-center py-10 text-gray-500 bg-white rounded-lg shadow">
                    <FiPlus className="animate-spin mr-2" /> Loading cases...
                </div>
            )}

            {error && (
                <div className="text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {!loading && !cases.length && !error && (
                <div className="text-center py-10 text-gray-500">No cases found.</div>
            )}

            {!loading && !!cases.length && (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full border border-gray-200">
                        <thead>
                            <tr className="bg-gray-50 text-sm text-gray-600">
                                <th className="px-4 py-2 text-left">Title</th>
                                <th className="px-4 py-2 text-left">Description</th>
                                <th className="px-4 py-2 text-left">Images</th>
                                <th className="px-4 py-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {cases.map((c) => (
                                <tr key={c._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{c.title}</td>
                                    <td className="px-4 py-3 text-gray-600">{c.description}</td>
                                    <td className="px-4 py-3 flex space-x-2">
                                        {c.images?.length
                                            ? c.images.map((url) => (
                                                <img
                                                    key={url}
                                                    src={url}
                                                    className="h-10 w-10 rounded border object-cover"
                                                    alt="case"
                                                />
                                            ))
                                            : <PhotoIcon className="h-6 w-6 text-gray-300" />}
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <button
                                            onClick={() => openForm(c)}
                                            className="inline-flex items-center px-2 py-1 border rounded text-blue-600 border-blue-600 hover:bg-blue-50 transition"
                                        >
                                            <FiEdit2 className="mr-1" /> Edit
                                        </button>
                                        <button
                                            onClick={() => deleteCase(c._id)}
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
