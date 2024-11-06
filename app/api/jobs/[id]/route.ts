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
    description: string;
    responsibilities: string[];
    facilityInfo: {
        name: string;
        address: string;
        image: string;
    };
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
        description:
            'We are seeking a dedicated ICU Registered Nurse to join our team. The ideal candidate will have experience in critical care and be able to provide high-quality patient care.',
        responsibilities: [
            'Monitor patient vital signs',
            'Administer medications',
            'Collaborate with the healthcare team',
            'Provide emotional support to patients and families',
            'Maintain accurate patient records',
        ],
        facilityInfo: {
            name: 'Farrer Park Hospital',
            address: '1 Farrer Park Station Rd, Singapore 217562',
            image: '/images/farrer-park-hospital.jpg',
        },
    },
];

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get('id');
    const jobId = parseInt(idParam ?? '', 10);

    if (isNaN(jobId)) {
        return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 });
    }

    try {
        const job = jobListings.find((job) => job.id === jobId) || null;

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json(job, { status: 200 });
    } catch (error) {
        console.error('Error fetching job:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
