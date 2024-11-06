import { NextResponse } from 'next/server';

interface Job {
    id: number;
    title: string;
    facility: string;
    date: string;
    time: string;
    payRate: string;
    urgent: boolean;
    requiredSkills: string[];
    shiftType: string;
    department: string;
}

const jobListings: Job[] = [
    {
        id: 1,
        title: 'Registered Nurse - ICU',
        facility: 'Farrer Park Hospital',
        date: '2023-10-15',
        time: '07:00 - 19:00',
        payRate: '$50/hour',
        urgent: true,
        requiredSkills: ['ICU', 'Critical Care'],
        shiftType: 'Day Shift',
        department: 'Intensive Care Unit',
    },
    {
        id: 2,
        title: 'Registered Nurse - ER',
        facility: 'Farrer Park Hospital',
        date: '2023-10-16',
        time: '19:00 - 07:00',
        payRate: '$45/hour',
        urgent: false,
        requiredSkills: ['BLS', 'ACLS'],
        shiftType: 'Night Shift',
        department: 'Emergency Room',
    },
];

export async function GET() {
    return NextResponse.json(jobListings, { status: 200 });
}
