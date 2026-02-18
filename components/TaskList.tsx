'use client';

import { useState } from 'react';
import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';
import BulkImportForm from './BulkImportForm';
import { ITask } from '@/types';

type Status = 'not_started' | 'started' | 'completed';

interface TaskListProps {
    initialTasks: ITask[];
    dayId: string;
}

export default function TaskList({ initialTasks, dayId }: TaskListProps) {
    const [tasks, setTasks] = useState(initialTasks);

    function handleStatusChange(id: string, status: Status) {
        setTasks((prev) =>
            prev.map((t) => (t._id === id ? { ...t, status } : t))
        );
    }

    function handleDelete(id: string) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
    }

    const notStarted = tasks.filter((t) => t.status === 'not_started');
    const started = tasks.filter((t) => t.status === 'started');
    const completed = tasks.filter((t) => t.status === 'completed');

    return (
        <div>
            {/* Action bar */}
            <div className="flex items-center gap-3 mb-4">
                <AddTaskForm dayId={dayId} />
                <BulkImportForm dayId={dayId} />
            </div>

            {/* Progress bar */}
            {tasks.length > 0 && (
                <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{completed.length} of {tasks.length} completed</span>
                        <span>{Math.round((completed.length / tasks.length) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                            style={{ width: `${(completed.length / tasks.length) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {tasks.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-4xl mb-3">📋</p>
                    <p className="font-medium">No tasks yet</p>
                    <p className="text-sm mt-1">Add a task or bulk import a list above</p>
                </div>
            )}

            {/* In Progress */}
            {started.length > 0 && (
                <section className="mb-4">
                    <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2 px-1">
                        In Progress ({started.length})
                    </h3>
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl divide-y divide-blue-100">
                        {started.map((task) => (
                            <TaskItem
                                key={task._id}
                                task={task as any}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Not Started */}
            {notStarted.length > 0 && (
                <section className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                        To Do ({notStarted.length})
                    </h3>
                    <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
                        {notStarted.map((task) => (
                            <TaskItem
                                key={task._id}
                                task={task as any}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Completed */}
            {completed.length > 0 && (
                <section>
                    <h3 className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2 px-1">
                        Completed ({completed.length})
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl divide-y divide-gray-100">
                        {completed.map((task) => (
                            <TaskItem
                                key={task._id}
                                task={task as any}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
