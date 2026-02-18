import dbConnect from '@/lib/db';
import Day from '@/models/Day';
import Task from '@/models/Task';
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
        const day = await Day.findById(id).populate({
            path: 'tasks',
            model: Task,
            options: { sort: { order: 1 } },
        });

        if (!day) {
            return err('Day not found', 404);
        }

        return ok(day, 'Day fetched successfully');
    } catch (error) {
        return err('Failed to fetch day', 500);
    }
}
