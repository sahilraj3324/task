'use client';

import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { useRouter } from 'next/navigation';

export default function AddDayButton() {
    const { mutate } = useSWRConfig();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) { setError('Title is required'); return; }

        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/days', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title.trim() }),
            });
            const json = await res.json();
            if (!json.success) { setError(json.message || 'Failed'); return; }

            setTitle('');
            setOpen(false);
            // Re-fetch the days list in the sidebar
            mutate('/api/days');
            // Navigate to the newly created day so the task panel switches to it
            router.push(`/?dayId=${json.data._id}`);
        } catch {
            setError('Network error. Try again.');
        } finally {
            setLoading(false);
        }
    }

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="w-full mt-4 flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
                <span className="text-base leading-none">+</span> New Day
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
            <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Day title, e.g. Day 4"
                className="w-full text-sm border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
            {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 text-xs bg-blue-600 text-white rounded-md py-1.5 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Saving…' : 'Create'}
                </button>
                <button
                    type="button"
                    onClick={() => { setOpen(false); setError(''); setTitle(''); }}
                    className="flex-1 text-xs text-gray-500 border border-gray-300 rounded-md py-1.5 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
