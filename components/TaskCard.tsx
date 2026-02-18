import { ITask } from '@/types';
// Force refresh

import AnswerEditor from './AnswerEditor';

interface TaskCardProps {
    task: ITask;
}

export default function TaskCard({ task }: TaskCardProps) {
    return (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {task.topic}
                </span>
            </div>
            <p className="text-gray-600 mb-6">{task.description}</p>

            <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Your Answer</h4>
                <AnswerEditor taskId={task._id} />
            </div>
        </div>
    );
}
