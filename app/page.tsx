import dbConnect from '@/lib/db';
import Day from '@/models/Day';
import Task from '@/models/Task';
import TaskList from '@/components/TaskList';
import { ITask } from '@/types';

async function getTasks(dayId: string | undefined): Promise<ITask[]> {
  if (!dayId) return [];
  await dbConnect();
  const tasks = await Task.find({ day: dayId }).sort({ order: 1 }).lean();
  return tasks.map((task: any) => ({
    _id: task._id.toString(),
    title: task.title,
    description: task.description || '',
    topic: task.topic || '',
    day: task.day?.toString() || '',
    order: task.order ?? 0,
    status: task.status || 'not_started',
  })) as ITask[];
}

async function getDayTitle(dayId: string | undefined) {
  if (!dayId) return null;
  await dbConnect();
  const day = await Day.findById(dayId).lean();
  return day ? (day as any).title : null;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const dayId = resolvedSearchParams.dayId as string;

  const tasks = await getTasks(dayId);
  const dayTitle = await getDayTitle(dayId);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {!dayId ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <p className="text-5xl mb-4">📅</p>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Task Tracker</h1>
          <p className="text-gray-500 text-base mb-6">
            Select a day from the sidebar, or create a new one to get started.
          </p>
          <div className="p-5 bg-blue-50 rounded-xl border border-blue-100 max-w-sm">
            <p className="text-blue-700 font-medium text-sm">👈 Click a day on the left, or use <strong>+ New Day</strong> at the bottom of the sidebar</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-6 border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">{dayTitle || 'Selected Day'}</h1>
            <p className="text-gray-400 text-sm mt-1">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
          </div>

          {/* Task list with bulk import, status management, progress */}
          <TaskList initialTasks={tasks} dayId={dayId} />
        </>
      )}
    </div>
  );
}
