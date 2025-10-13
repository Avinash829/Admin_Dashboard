"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiCheckCircle,
} from "react-icons/fi";
import {
    FiBriefcase,
    FiLayers,
    FiUser,
    FiUsers as FiTeam,
} from "react-icons/fi";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import { ClockIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

interface Meeting {
    _id: string;
    title: string;
    description?: string;
    dueDate?: string;
    status: "upcoming" | "pending" | "completed";
}

interface Stats {
    cases: number;
    partners: number;
    services: number;
    teams: number;
    users: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Meeting | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState<"pending" | "completed">("pending");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/dashboard/stats");
                setStats(res.data.data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error("Error fetching dashboard stats:", err.message);
                } else {
                    console.error("Unknown error fetching dashboard stats");
                }
            }
        };
        fetchStats();
    }, []);


    useEffect(() => {
        const fetchMeetings = async () => {
            const res = await api.get("/tasks");
            setMeetings(res.data.data);
        };
        fetchMeetings();
    }, []);

    const saveMeeting = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) {
            const res = await api.put(`/tasks/${editing._id}`, {
                title,
                description,
                dueDate,
                status,
            });
            setMeetings(prev =>
                prev.map(m => (m._id === editing._id ? res.data.data : m))
            );
        } else {
            const res = await api.post("/tasks", {
                title,
                description,
                dueDate,
                status,
            });
            setMeetings(prev => [res.data.data, ...prev]);
        }
        resetForm();
    };

    const deleteMeeting = async (id: string) => {
        await api.delete(`/tasks/${id}`);
        setMeetings(prev => prev.filter(m => m._id !== id));
    };

    const completeMeeting = async (id: string) => {
        const res = await api.put(`/tasks/${id}`, { status: "completed" });
        setMeetings(prev =>
            prev.map(m => (m._id === id ? res.data.data : m))
        );
    };

    const resetForm = () => {
        setShowForm(false);
        setEditing(null);
        setTitle("");
        setDescription("");
        setDueDate("");
        setStatus("pending");
    };

    const meetingStats = {
        total: meetings.length,
        pending: meetings.filter(m => m.status === "pending").length,
        completed: meetings.filter(m => m.status === "completed").length,
    };

    return (
        <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 bg-white p-6 rounded-xl shadow">
                {stats ? (
                    <>
                        <Card
                            title="Cases"
                            value={stats.cases}
                            icon={<FiBriefcase className="h-6 w-6 text-indigo-500" />}
                            bg="bg-gradient-to-r from-indigo-50 to-indigo-100"
                        />
                        <Card
                            title="Partners"
                            value={stats.partners}
                            icon={<HandThumbUpIcon className="h-6 w-6 text-green-500" />}
                            bg="bg-gradient-to-r from-green-50 to-green-100"
                        />
                        <Card
                            title="Services"
                            value={stats.services}
                            icon={<FiLayers className="h-6 w-6 text-purple-500" />}
                            bg="bg-gradient-to-r from-purple-50 to-purple-100"
                        />
                        <Card
                            title="Teams"
                            value={stats.teams}
                            icon={<FiTeam className="h-6 w-6 text-orange-500" />}
                            bg="bg-gradient-to-r from-orange-50 to-orange-100"
                        />
                        <Card
                            title="Users"
                            value={stats.users}
                            icon={<FiUser className="h-6 w-6 text-blue-500" />}
                            bg="bg-gradient-to-r from-blue-50 to-blue-100"
                        />
                    </>
                ) : (
                    <div className="flex justify-center items-center py-10 text-gray-500 align-middle col-span-5">
                        <FiPlus className="animate-spin mr-2" /> Loading stats...
                        </div>
               
               
            )}
                
            </div>

            <section className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Meetings</h2>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <FiPlus className="mr-2" /> Add Meeting
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="flex items-center p-4 bg-orange-100 rounded-lg">
                        <ClockIcon className="h-6 w-6 text-orange-600 mr-3" />
                        <div>
                            <p className="text-sm text-orange-700">Pending</p>
                            <p className="text-xl font-bold">{meetingStats.pending}</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-green-100 rounded-lg">
                        <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
                        <div>
                            <p className="text-sm text-green-700">Completed</p>
                            <p className="text-xl font-bold">{meetingStats.completed}</p>
                        </div>
                    </div>
                </div>

                <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">Title</th>
                            <th className="px-4 py-2 text-left">Description</th>
                            <th className="px-4 py-2 text-left">Due Date</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meetings.map(m => (
                            <tr key={m._id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{m.title}</td>
                                <td className="px-4 py-3">{m.description}</td>
                                <td className="px-4 py-3">
                                    {m.dueDate ? new Date(m.dueDate).toLocaleDateString() : "-"}
                                </td>
                                <td className="px-4 py-3 capitalize">{m.status}</td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    {m.status !== "completed" && (
                                        <button
                                            onClick={() => completeMeeting(m._id)}
                                            className="inline-flex items-center px-2 py-1 border rounded text-green-600 border-green-600 hover:bg-green-50"
                                        >
                                            <FiCheckCircle className="mr-1" /> Complete
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setEditing(m);
                                            setTitle(m.title);
                                            setDescription(m.description || "");
                                            setDueDate(m.dueDate ? m.dueDate.slice(0, 10) : "");
                                            setStatus(m.status as "pending" | "completed");
                                            setShowForm(true);
                                        }}
                                        className="inline-flex items-center px-2 py-1 border rounded text-blue-600 border-blue-600 hover:bg-blue-50"
                                    >
                                        <FiEdit2 className="mr-1" /> Edit
                                    </button>
                                    <button
                                        onClick={() => deleteMeeting(m._id)}
                                        className="inline-flex items-center px-2 py-1 border rounded text-red-600 border-red-600 hover:bg-red-50"
                                    >
                                        <FiTrash2 className="mr-1" /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {showForm && (
                <div className="fixed inset-0 bg-blue-100 bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">
                            {editing ? "Edit Meeting" : "Add Meeting"}
                        </h2>
                        <form onSubmit={saveMeeting} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="mt-1 block w-full border rounded-lg px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="mt-1 block w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Due Date</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={e => setDueDate(e.target.value)}
                                    className="mt-1 block w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Status</label>
                                <select
                                    value={status}
                                    onChange={e =>
                                        setStatus(
                                            e.target.value as "pending" | "completed"
                                        )
                                    }
                                    className="mt-1 block w-full border rounded-lg px-3 py-2"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="completed" className="text-green-400">Completed</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 bg-gray-200 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function Card({
    title,
    value,
    icon,
    bg,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    bg?: string;
}) {
    return (
        <div className={`p-6 rounded-xl shadow hover:shadow-md transition-shadow ${bg}`}>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                {icon}
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );
}
