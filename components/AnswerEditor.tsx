'use client';
// Force refresh


import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import ReactMarkdown from 'react-markdown';
import { IAnswer } from '@/types';
import clsx from 'clsx';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface AnswerEditorProps {
    taskId: string;
}

export default function AnswerEditor({ taskId }: AnswerEditorProps) {
    const { data, error } = useSWR<{ success: true; data: IAnswer }>(
        `/api/answers?taskId=${taskId}`,
        fetcher
    );

    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (data?.data) {
            setContent(data.data.content);
        } else {
            setContent(''); // Reset if no answer found (important when switching tasks)
        }
    }, [data]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/answers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: taskId, content }), // Add user_id here later
            });

            if (res.ok) {
                setIsEditing(false);
                mutate(`/api/answers?taskId=${taskId}`); // Revalidate SWR cache
            }
        } catch (err) {
            console.error('Failed to save answer', err);
        } finally {
            setIsSaving(false);
        }
    };

    if (error) return <div className="text-red-500">Error loading answer</div>;

    if (isEditing) {
        return (
            <div className="space-y-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="Write your answer here (Markdown supported)..."
                />
                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Answer'}
                    </button>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setContent(data?.data?.content || '');
                        }}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative">
            <div
                className={clsx(
                    "prose prose-sm max-w-none p-4 rounded-md min-h-[100px]",
                    content ? "bg-gray-50" : "bg-gray-100 italic text-gray-500"
                )}
            >
                {content ? <ReactMarkdown>{content}</ReactMarkdown> : 'No answer yet. Click to write one.'}
            </div>
            <button
                onClick={() => setIsEditing(true)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
                {content ? 'Edit Answer' : 'Write Answer'}
            </button>
        </div>
    );
}
