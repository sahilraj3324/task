'use client';

import useSWR from 'swr';
import { IDay } from '@/types';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import AddDayButton from './AddDayButton';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DayList() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedDayId = searchParams.get('dayId');

    const { data, error, isLoading } = useSWR<{ success: true; data: IDay[] }>(
        '/api/days',
        fetcher
    );

    if (error) return <div className="p-4 text-red-500">Failed to load days</div>;
    if (isLoading) return <div className="p-4 text-gray-500">Loading days...</div>;

    return (
        <div className="w-64 bg-gray-50 h-screen border-r border-gray-200 p-4 fixed left-0 top-0 overflow-y-auto flex flex-col">
            <h2 className="text-xl font-bold mb-6 text-gray-800 tracking-tight">Daily Tasks</h2>
            <div className="space-y-2 flex-1">
                {data?.data.length === 0 && (
                    <p className="text-sm text-gray-400 text-center pt-8">No days yet.<br />Create your first day below.</p>
                )}
                {data?.data.map((day) => (
                    <button
                        key={day._id}
                        onClick={() => router.push(`/?dayId=${day._id}`)}
                        className={clsx(
                            'w-full text-left p-3 rounded-lg transition-all duration-200 font-medium',
                            selectedDayId === day._id
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'hover:bg-gray-200 text-gray-700 hover:pl-4'
                        )}
                    >
                        <div className="flex justify-between items-center">
                            <span>{day.title}</span>
                            <span className="text-xs opacity-70 bg-black/10 px-2 py-0.5 rounded-full">
                                {day.tasks?.length || 0}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
            <AddDayButton />
        </div>
    );
}
