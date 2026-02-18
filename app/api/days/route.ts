import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Day from '@/models/Day';
import Task from '@/models/Task';
import { ok, err, handleOptions } from '@/lib/cors';

export function OPTIONS() {
    return handleOptions();
}

export async function GET() {
    await dbConnect();

    try {
        const days = await Day.find({})
            .sort({ order: 1 })
            .populate({
                path: 'tasks',
                model: Task,
                options: { sort: { order: 1 } },
            });

        return ok(days, 'Days fetched successfully');
    } catch (error) {
        return err('Failed to fetch days', 500);
    }
}

export async function POST(request: Request) {
    await dbConnect();

    try {
        const body = await request.json();
        const { title } = body;

        if (!title?.trim()) {
            return err('Title is required', 400);
        }

        // Auto-assign order as next in sequence
        const lastDay = await Day.findOne({}).sort({ order: -1 });
        const order = lastDay ? lastDay.order + 1 : 1;

        const day = await Day.create({ title: title.trim(), order });
        return ok(day, 'Day created successfully', 201);
    } catch (error) {
        return err('Failed to create day', 400);
    }
}
