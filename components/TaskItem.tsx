'use client';

import { useState } from 'react';

type Status = 'not_started' | 'started' | 'completed';

interface TaskItemProps {
    task: {
        _id: string;
        title: string;
        description?: string;
        topic?: string;
        status: Status;
    };
    onStatusChange: (id: string, status: Status) => void;
    onDelete: (id: string) => void;
}

const STATUS_CONFIG: Record<Status, { label: string; icon: string; classes: string; next: Status }> = {
    not_started: {
        label: 'Not Started',
        icon: '○',
        classes: 'text-gray-400 hover:text-blue-500',
        next: 'started',
    },
    started: {
        label: 'In Progress',
        icon: '◑',
        classes: 'text-blue-500 hover:text-green-500',
        next: 'completed',
    },
    completed: {
        label: 'Completed',
        icon: '●',
        classes: 'text-green-500 hover:text-gray-400',
        next: 'not_started',
    },
};

export default function TaskItem({ task, onStatusChange, onDelete }: TaskItemProps) {
    const [loading, setLoading] = useState(false);
    const config = STATUS_CONFIG[task.status];

    async function cycleStatus() {
        setLoading(true);
        try {
            await fetch(`/api/tasks/${task._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: config.next }),
            });
            onStatusChange(task._id, config.next);
        } finally {
            setLoading(false);
        }
    }

    async function markCompleted() {
        setLoading(true);
        try {
            await fetch(`/api/tasks/${task._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'completed' }),
            });
            onStatusChange(task._id, 'completed');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm(`Delete "${task.title}"?`)) return;
        await fetch(`/api/tasks/${task._id}`, { method: 'DELETE' });
        onDelete(task._id);
    }

    const isCompleted = task.status === 'completed';

    return (
        <div className={`group flex items-start gap-3 p-3 rounded-lg transition-colors ${isCompleted ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
            {/* Status toggle button */}
            <button
                onClick={cycleStatus}
                disabled={loading}
                title={`Status: ${config.label} — click to advance`}
                className={`mt-0.5 text-xl leading-none flex-shrink-0 transition-colors ${config.classes} disabled:opacity-40`}
            >
                {config.icon}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium leading-snug ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.title}
                </p>
                {task.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{task.description}</p>
                )}
                {task.topic && (
                    <span className="inline-block mt-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        {task.topic}
                    </span>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.status === 'completed' ? 'bg-green-100 text-green-700' :
                    task.status === 'started' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-500'
                    }`}>
                    {config.label}
                </span>

                {/* One-click Complete button — hidden once already done */}
                {!isCompleted && (
                    <button
                        onClick={markCompleted}
                        disabled={loading}
                        title="Mark as completed"
                        className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-full hover:bg-green-100 hover:border-green-400 transition-colors disabled:opacity-40"
                    >
                        ✓ Done
                    </button>
                )}

                <button
                    onClick={handleDelete}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all text-sm"
                    title="Delete task"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
