export interface ITask {
    _id: string;
    title: string;
    description: string;
    topic: string;
    day: string; // ID of the Day
    order: number;
    status: 'not_started' | 'started' | 'completed';
}

export interface IDay {
    _id: string;
    title: string;
    order: number;
    tasks: ITask[];
}

export interface IAnswer {
    _id: string;
    task: string; // ID of the Task
    userId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}
