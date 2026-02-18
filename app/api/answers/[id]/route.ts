import dbConnect from '@/lib/db';
import Answer from '@/models/Answer';
import { ok, err, handleOptions } from '@/lib/cors';

export function OPTIONS() {
    return handleOptions();
}

/**
 * DELETE /api/answers/:id
 * Deletes an answer by its MongoDB _id.
 */
export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();

    const { id } = await params;

    try {
        const answer = await Answer.findByIdAndDelete(id);
        if (!answer) return err('Answer not found', 404);
        return ok(null, 'Answer deleted successfully');
    } catch (error) {
        return err('Failed to delete answer', 500);
    }
}
