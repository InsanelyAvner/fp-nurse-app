import type { NextApiRequest, NextApiResponse } from 'next';

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
            image: '/images/farrer-park-hospital.jpg', // Ensure this image exists in the public/images directory
        },
    },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const jobId = parseInt(id as string, 10);
    if (isNaN(jobId)) {
        return res.status(400).json({ error: "Invalid job ID" });
    }
    try {
        const job = jobListings.find((job) => job.id === jobId) || null;

        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        return res.status(200).json(job);
    } catch (error) {
        console.error("Error fetching job:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
