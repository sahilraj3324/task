import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import Day from '@/models/Day';
import { ok, err, handleOptions } from '@/lib/cors';

export function OPTIONS() {
    return handleOptions();
}

export async function GET(request: Request) {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const dayId = searchParams.get('dayId');
    const topic = searchParams.get('topic');
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)));

    try {
        // Build filter dynamically
        const filter: Record<string, unknown> = {};
        if (dayId) filter.day = dayId;
        if (topic) filter.topic = { $regex: topic, $options: 'i' }; // case-insensitive

        const total = await Task.countDocuments(filter);
        const tasks = await Task.find(filter)
            .sort({ order: 1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return ok(
            { tasks, total, page, limit },
            'Tasks fetched successfully'
        );
    } catch (error) {
        return err('Failed to fetch tasks', 500);
    }
}

export async function POST(request: Request) {
    await dbConnect();

    try {
        const body = await request.json();

        // Support both single task and bulk array
        const isArray = Array.isArray(body);
        const items: any[] = isArray ? body : [body];

        if (items.length === 0) return err('No tasks provided', 400);

        // Validate every item has a title
        const missingTitle = items.some((item) => !item.title?.trim());
        if (missingTitle) return err('Every task must have a title', 400);

        // Auto-assign order starting after the last task in this day
        const dayId = items[0]?.day || null;
        let nextOrder = 1;
        if (dayId) {
            const lastTask = await Task.findOne({ day: dayId }).sort({ order: -1 });
            if (lastTask) nextOrder = (lastTask.order ?? 0) + 1;
        }

        const tasksToCreate = items.map((item: any, i: number) => {
            const doc: Record<string, unknown> = {
                title: item.title.trim(),
                description: item.description?.trim() || '',
                topic: item.topic?.trim() || '',
                order: item.order ?? nextOrder + i,
                status: item.status || 'not_started',
            };
            if (item.day) doc.day = item.day;
            return doc;
        });

        // Use create() for each task — more reliable than insertMany in Mongoose v9
        const tasks = await Promise.all(tasksToCreate.map((doc) => Task.create(doc)));

        // Add all task IDs to the parent Day
        if (dayId) {
            const ids = tasks.map((t: any) => t._id);
            await Day.findByIdAndUpdate(dayId, { $push: { tasks: { $each: ids } } });
        }

        return ok(isArray ? tasks : tasks[0], 'Task(s) created successfully', 201);
    } catch (error: any) {
        console.error('[POST /api/tasks] Error:', error?.message || error);
        return err(error?.message || 'Failed to create task(s)', 400);
    }
}
