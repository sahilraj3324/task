import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import Day from '@/models/Day';
import { ok, err, handleOptions } from '@/lib/cors';

export function OPTIONS() {
    return handleOptions();
}

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();

    const { id } = await params;

    try {
        const task = await Task.findById(id);
        if (!task) return err('Task not found', 404);
        return ok(task, 'Task fetched successfully');
    } catch (error) {
        return err('Failed to fetch task', 500);
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();

    const { id } = await params;

    try {
        const body = await request.json();
        const task = await Task.findByIdAndUpdate(id, body, {
            new: true,       // return updated document
            runValidators: true,
        });

        if (!task) return err('Task not found', 404);
        return ok(task, 'Task updated successfully');
    } catch (error) {
        return err('Failed to update task', 400);
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();

    const { id } = await params;

    try {
        const task = await Task.findByIdAndDelete(id);
        if (!task) return err('Task not found', 404);

        // Remove reference from parent Day
        if (task.day) {
            await Day.findByIdAndUpdate(task.day, { $pull: { tasks: task._id } });
        }

        return ok(null, 'Task deleted successfully');
    } catch (error) {
        return err('Failed to delete task', 500);
    }
}
