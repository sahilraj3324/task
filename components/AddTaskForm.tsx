'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddTaskFormProps {
    dayId: string;
    /** Called after a task is successfully created so the page can refresh */
    onSuccess?: () => void;
}

export default function AddTaskForm({ dayId, onSuccess }: AddTaskFormProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        title: '',
        description: '',
        topic: '',
        order: '',
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (!form.title || !form.description || !form.topic || !form.order) {
            setError('All fields are required.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    topic: form.topic,
                    order: Number(form.order),
                    day: dayId,
                }),
            });

            const json = await res.json();

            if (!json.success) {
                setError(json.message || 'Failed to create task.');
                return;
            }

            // Reset form and close
            setForm({ title: '', description: '', topic: '', order: '' });
            setOpen(false);
            onSuccess?.();
            router.refresh(); // re-run the server component to show new task
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
                <span className="text-lg leading-none">+</span> Add Task
            </button>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold text-gray-900">New Task</h3>
                <button
                    onClick={() => { setOpen(false); setError(''); }}
                    className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                    aria-label="Close"
                >
                    ✕
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="e.g. Build a Flutter ListView"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="What should the learner do or understand?"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>

                {/* Topic + Order side by side */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Topic <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="topic"
                            value={form.topic}
                            onChange={handleChange}
                            placeholder="e.g. Flutter, React, MongoDB"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="w-28">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Order <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="order"
                            type="number"
                            min={1}
                            value={form.order}
                            onChange={handleChange}
                            placeholder="1"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <div className="flex justify-end gap-3 pt-1">
                    <button
                        type="button"
                        onClick={() => { setOpen(false); setError(''); }}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Saving…' : 'Create Task'}
                    </button>
                </div>
            </form>
        </div>
    );
}
