import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Day from '@/models/Day';
import Task from '@/models/Task';

export async function GET() {
    await dbConnect();

    try {
        // Clear existing data (optional, be careful in prod)
        // await Day.deleteMany({});
        // await Task.deleteMany({});

        // Check if data exists
        const dayCount = await Day.countDocuments();
        if (dayCount > 0) {
            return NextResponse.json({ message: 'Data already exists', success: true });
        }

        // Create Days
        const day1 = await Day.create({ title: 'Day 1', order: 1 });
        const day2 = await Day.create({ title: 'Day 2', order: 2 });
        const day3 = await Day.create({ title: 'Day 3', order: 3 });

        // Create Tasks
        const tasksData = [
            {
                title: 'Learn React Fundamentals',
                description: 'Understand Components, JSX, Props, and State.',
                topic: 'React',
                day: day1._id,
                order: 1
            },
            {
                title: 'Two Sum',
                description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
                topic: 'DSA',
                day: day1._id,
                order: 2
            },
            {
                title: 'Event Loop',
                description: 'Explain how the Event Loop works in JavaScript.',
                topic: 'JavaScript',
                day: day2._id,
                order: 1
            }
        ];

        const tasks = await Task.insertMany(tasksData);

        // Update Days with Tasks
        await Day.findByIdAndUpdate(day1._id, { $push: { tasks: [tasks[0]._id, tasks[1]._id] } });
        await Day.findByIdAndUpdate(day2._id, { $push: { tasks: [tasks[2]._id] } });

        return NextResponse.json({ success: true, message: 'Seeded successfully' });
    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ success: false, error: 'Failed to seed' }, { status: 500 });
    }
}
