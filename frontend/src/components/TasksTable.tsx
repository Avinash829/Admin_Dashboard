"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

interface Task {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
}

export default function TasksTable() {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => { fetchTasks(); }, []);
    const fetchTasks = async () => {
        const res = await api.get("/tasks");
        setTasks(res.data.data);
    };
    const deleteTask = async (id: string) => {
        await api.delete(`/tasks/${id}`);
        setTasks(prev => prev.filter(t => t._id !== id));
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Tasks</h2>
                <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <FiPlus className="mr-2" /> Add Task
                </button>
            </div>

            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Title</th>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-left">Due Date</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(t => (
                        <tr key={t._id} className="border-t">
                            <td className="px-4 py-3 font-medium">{t.title}</td>
                            <td className="px-4 py-3">{t.description}</td>
                            <td className="px-4 py-3">{new Date(t.dueDate).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-right space-x-2">
                                <button className="inline-flex items-center px-2 py-1 border rounded text-blue-600 border-blue-600 hover:bg-blue-50">
                                    <FiEdit2 className="mr-1" /> Edit
                                </button>
                                <button
                                    onClick={() => deleteTask(t._id)}
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
    );
}
