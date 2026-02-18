import dbConnect from '@/lib/db';
import Answer from '@/models/Answer';
import { ok, err, handleOptions } from '@/lib/cors';

export function OPTIONS() {
    return handleOptions();
}

/**
 * POST /api/answers
 * Body: { task, userId, content }
 * Upserts — one answer per user per task.
 */
export async function POST(request: Request) {
    await dbConnect();

    try {
        const body = await request.json();
        const { task, userId, content } = body;

        if (!task || !userId || !content) {
            return err('task, userId, and content are required', 400);
        }

        const answer = await Answer.findOneAndUpdate(
            { task, userId },          // filter: find by task + user
            { content },               // update: only content changes
            {
                new: true,             // return updated doc
                upsert: true,          // create if not found
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        );

        return ok(answer, 'Answer saved successfully', 200);
    } catch (error) {
        return err('Failed to save answer', 400);
    }
}

/**
 * GET /api/answers?taskId=&userId=
 * Returns the answer for a specific task + user combination.
 */
export async function GET(request: Request) {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    const userId = searchParams.get('userId');

    if (!taskId || !userId) {
        return err('taskId and userId query params are required', 400);
    }

    try {
        const answer = await Answer.findOne({ task: taskId, userId });

        if (!answer) {
            return ok(null, 'No answer found for this task and user');
        }

        return ok(answer, 'Answer fetched successfully');
    } catch (error) {
        return err('Failed to fetch answer', 500);
    }
}
