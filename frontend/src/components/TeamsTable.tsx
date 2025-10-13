"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

interface Team {
    _id: string;
    name: string;
    role: string;
}

export default function TeamsTable() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Team | null>(null);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            setLoading(true);
            const res = await api.get("/teams");
            setTeams(res.data);
            setError(null);
        } catch {
            setError("Failed to fetch team members.");
        } finally {
            setLoading(false);
        }
    };

    const deleteMember = async (id: string) => {
        if (!confirm("Are you sure you want to delete this member?")) return;
        try {
            await api.delete(`/teams/${id}`);
            setTeams((prev) => prev.filter((t) => t._id !== id));
        } catch {
            alert("Failed to delete member.");
        }
    };

    const openForm = (member?: Team) => {
        if (member) {
            setEditing(member);
            setName(member.name);
            setRole(member.role);
        } else {
            setEditing(null);
            setName("");
            setRole("");
        }
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            if (editing) {
                const res = await api.put(`/teams/${editing._id}`, { name, role });
                setTeams((prev) =>
                    prev.map((t) => (t._id === editing._id ? res.data : t))
                );
            } else {
                const res = await api.post("/teams", { name, role });
                setTeams((prev) => [res.data, ...prev]);
            }
            setShowForm(false);
            setEditing(null);
            setName("");
            setRole("");
        } catch {
            alert("Failed to save member.");
        }
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-bold">Team Members</h2>
                <button
                    onClick={() => openForm()}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <FiPlus className="mr-2" /> Add Member
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        {editing ? "Edit Member" : "Add Member"}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-800">Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200 text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-800">Role</label>
                            <input
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                                className="mt-1 w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200 text-gray-800"
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border rounded hover:bg-gray-50 text-gray-800"
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
                   <FiPlus className="animate-spin mr-2" />  Loading team members...
                </div>
            )}

            {error && (
                <div className="text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}


            {!loading && !teams.length && !error && (
                <div className="text-center py-10 text-gray-500">
                    No team members found.
                </div>
            )}

            {!loading && !!teams.length && (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full border border-gray-200">
                        <thead>
                            <tr className="bg-gray-50 text-sm text-gray-600">
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Role</th>
                                <th className="px-4 py-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {teams.map((t) => (
                                <tr key={t._id} className="hover:bg-gray-50 text-gray-800">
                                    <td className="px-4 py-3">{t.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{t.role}</td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <button
                                            onClick={() => openForm(t)}
                                            className="inline-flex items-center px-2 py-1 border rounded text-blue-600 border-blue-600 hover:bg-blue-50 transition"
                                        >
                                            <FiEdit2 className="mr-1" /> Edit
                                        </button>
                                        <button
                                            onClick={() => deleteMember(t._id)}
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
