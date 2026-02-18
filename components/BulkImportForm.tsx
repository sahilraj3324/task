'use client';

import { useState } from 'react';

interface BulkImportFormProps {
    dayId: string;
}

export default function BulkImportForm({ dayId }: BulkImportFormProps) {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState<string[]>([]);

    function parseLines(raw: string): string[] {
        return raw
            .split('\n')
            .map((l) => l.trim())
            // Remove empty lines and lines that look like section headers
            // (all caps, short, no question mark or period)
            .filter((l) => {
                if (!l) return false;
                // Skip pure section headers: ALL CAPS lines or lines with no letters
                if (/^[A-Z\s\(\)&]+$/.test(l) && l.length < 60) return false;
                // Skip lines that are just decorative or very short non-task lines
                if (l.length < 4) return false;
                return true;
            });
    }

    function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const val = e.target.value;
        setText(val);
        setPreview(parseLines(val));
    }

    async function handleImport() {
        const lines = parseLines(text);
        if (lines.length === 0) { setError('No valid tasks found.'); return; }

        setLoading(true);
        setError('');
        try {
            const tasks = lines.map((title) => ({ title, day: dayId }));
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tasks),
            });
            const json = await res.json();
            if (!json.success) { setError(json.message || 'Import failed'); return; }

            setText('');
            setPreview([]);
            setOpen(false);
            window.location.reload();
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
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
                <span className="text-base leading-none">⇪</span> Bulk Import
            </button>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold text-gray-900">Bulk Import Tasks</h3>
                <button onClick={() => { setOpen(false); setError(''); }} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <p className="text-xs text-gray-500 mb-3">
                Paste a list of tasks — one per line. Section headers (ALL CAPS) are automatically skipped.
            </p>

            <textarea
                value={text}
                onChange={handleTextChange}
                rows={10}
                placeholder={`What is JavaScript execution context?\nDifference between var, let, const\nWhat is hoisting?\n...`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-3"
            />

            {preview.length > 0 && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-xs font-medium text-blue-700 mb-2">
                        {preview.length} task{preview.length !== 1 ? 's' : ''} will be created:
                    </p>
                    <ul className="space-y-1 max-h-40 overflow-y-auto">
                        {preview.map((line, i) => (
                            <li key={i} className="text-xs text-blue-800 flex items-start gap-1.5">
                                <span className="text-blue-400 mt-0.5">•</span> {line}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

            <div className="flex justify-end gap-3">
                <button
                    onClick={() => { setOpen(false); setError(''); setText(''); setPreview([]); }}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                    Cancel
                </button>
                <button
                    onClick={handleImport}
                    disabled={loading || preview.length === 0}
                    className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Importing…' : `Import ${preview.length} Task${preview.length !== 1 ? 's' : ''}`}
                </button>
            </div>
        </div>
    );
}
