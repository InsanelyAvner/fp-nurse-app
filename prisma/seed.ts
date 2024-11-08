// prisma/seed.ts

import { PrismaClient, Role, JobStatus, ApplicationStatus, DocumentType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Clear Existing Data (Optional)
  // Uncomment the lines below if you want to reset your database before seeding
  /*
  await prisma.notification.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.application.deleteMany();
  await prisma.document.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.job.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();
  */

  // 2. Create Skills
  const skillNames = [
    'ICU Experience',
    'Pediatric Care',
    'Emergency Response',
    'Phlebotomy',
    'Medication Administration',
    'Patient Assessment',
    'Wound Care',
    'IV Therapy',
    'Electronic Medical Records (EMR)',
    'Geriatric Care',
    'Neonatal Care',
    'Surgical Assistance',
    'Cardiac Care',
    'Oncology Nursing',
    'Mental Health Nursing',
  ];

  const skills = await Promise.all(
    skillNames.map((name) =>
      prisma.skill.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  console.log(`Created ${skills.length} skills.`);

  // 3. Create Admin User
  const adminPassword = await bcrypt.hash('Admin@123', 10); // Secure password

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@freelancenurse.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@freelancenurse.com',
      password: adminPassword,
      role: Role.ADMIN,
      bio: 'Administrator with full access to the platform.',
      yearsOfExperience: 20,
      certifications: ['BLS', 'ACLS', 'CALS'],
      specializations: ['Emergency Response', 'Team Collaboration'],
      languages: ['English', 'Spanish'],
      shiftPreferences: ['Day Shift', 'Night Shift'],
      profilePictureUrl: faker.image.avatar(),
      skills: {
        connect: skills.map((skill) => ({ id: skill.id })),
      },
      address: faker.location.streetAddress(),
      contactNumber: faker.phone.number({ style: 'international' }),
      gender: faker.helpers.arrayElement(['Male', 'Female']),
      dob: faker.date.birthdate({ min: 1950, max: 1980, mode: 'year' }),
      licenseNumber: faker.string.alphanumeric(10).toUpperCase(),
      licenseExpiration: faker.date.future({ years: 5 }),
      education: "Doctorate",
    },
  });

  console.log(`Created admin user: ${adminUser.email}`);

  // 4. Create Nurse Users
  const nurseUsers: any[] = []; // Using any[] temporarily to handle TypeScript typing issues

  for (let i = 0; i < 50; i++) { // Increased number for a robust dataset
    const userPassword = await bcrypt.hash('Nurse@123', 10); // Secure password

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const gender = faker.helpers.arrayElement(['Male', 'Female']);
    const dob = faker.date.birthdate({ min: 1965, max: 2000, mode: 'year' });
    const contactNumber = faker.phone.number({ style: 'international' });
    const email = faker.internet.email({ firstName, lastName, provider: 'freelancenurse.com' });
    const address = faker.location.streetAddress();
    const licenseNumber = faker.string.alphanumeric(12).toUpperCase();
    const licenseExpiration = faker.date.future({ years: 5 });
    const yearsOfExperience = faker.number.int({ min: 1, max: 35 });
    const education = faker.helpers.arrayElement([
      "Bachelor's Degree in Nursing",
      "Master's Degree in Nursing",
      'Doctorate in Nursing',
      'Associate Degree in Nursing',
      'Diploma in Nursing',
    ]);
    const specializations = faker.helpers.arrayElements(
      ['ICU', 'Emergency', 'Pediatrics', 'Surgical', 'Oncology', 'Geriatrics', 'Neonatal', 'Cardiology', 'Neurology'],
      faker.number.int({ min: 1, max: 4 })
    );
    const languages = faker.helpers.arrayElements(
      ['English', 'Mandarin', 'Malay', 'Tamil', 'Spanish', 'French', 'Arabic', 'Hindi'],
      faker.number.int({ min: 1, max: 3 })
    );
    const shiftPreferences = faker.helpers.arrayElements(
      ['Day Shift', 'Night Shift', 'Weekends', 'Overtime', 'Flexible Hours'],
      faker.number.int({ min: 1, max: 3 })
    );
    const bio = faker.lorem.paragraph();
    const profilePictureUrl = faker.image.avatar();

    // Ensure unique email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log(`Email ${email} already exists. Skipping user creation.`);
      continue;
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: userPassword,
        role: Role.USER,
        bio,
        yearsOfExperience,
        certifications: faker.helpers.arrayElements(['BLS', 'ACLS', 'PALS', 'NCC', 'CCRN'], {
          min: 1,
          max: 4,
        }),
        specializations,
        languages,
        shiftPreferences,
        profilePictureUrl,
        address,
        contactNumber,
        gender,
        dob,
        licenseNumber,
        licenseExpiration,
        education,
        skills: {
          connect: faker.helpers.arrayElements(
            skills,
            faker.number.int({ min: 5, max: 10 })
          ).map((skill) => ({ id: skill.id })),
        },
      },
      include: {
        skills: true, // Include skills in the response
      },
    });

    nurseUsers.push(user);
  }

  console.log(`Created ${nurseUsers.length} nurse users.`);

  // 5. Create Experiences for Nurse Users
  const departments = ['Intensive Care Unit (ICU)', 'Emergency Room (ER)', 'Pediatrics', 'Surgery', 'Oncology', 'Geriatrics', 'Neonatal Intensive Care (NICU)', 'Cardiology', 'Neurology'];
  const positions = ['Registered Nurse', 'Senior Nurse', 'Charge Nurse', 'Clinical Nurse Specialist', 'Nurse Practitioner', 'Travel Nurse', 'Per Diem Nurse'];

  const experiencePromises = nurseUsers.map(async (nurse) => {
    const numExperiences = faker.number.int({ min: 1, max: 5 }); // Increased number for more detailed profiles

    for (let i = 0; i < numExperiences; i++) {
      const startDate = faker.date.past({ years: 10 });
      const endDate = faker.helpers.arrayElement([faker.date.between({ from: startDate, to: new Date() }), null]); // null indicates current position

      await prisma.experience.create({
        data: {
          user: { connect: { id: nurse.id } },
          facilityName: faker.company.name() + ' Hospital',
          position: faker.helpers.arrayElement(positions),
          department: faker.helpers.arrayElement(departments),
          startDate,
          endDate,
          responsibilities: faker.lorem.paragraphs(2),
        },
      });
    }
  });

  await Promise.all(experiencePromises);
  console.log(`Created work experiences for nurse users.`);

  // 6. Create Documents for Nurse Users
  const documentPromises = nurseUsers.map(async (nurse) => {
    // Resume
    await prisma.document.create({
      data: {
        user: { connect: { id: nurse.id } },
        type: DocumentType.RESUME,
        fileUrl: faker.internet.url(), // Replace with actual file URLs or paths as needed
      },
    });

    // Nursing License
    await prisma.document.create({
      data: {
        user: { connect: { id: nurse.id } },
        type: DocumentType.LICENSE,
        fileUrl: faker.internet.url(),
      },
    });

    // Certifications
    const certifications = nurse.certifications;
    for (const cert of certifications) {
      await prisma.document.create({
        data: {
          user: { connect: { id: nurse.id } },
          type: DocumentType.CERTIFICATION,
          fileUrl: faker.internet.url(),
        },
      });
    }

    // Other Documents (optional)
    if (faker.datatype.boolean()) { // 50% chance to add other documents
      const numOtherDocs = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < numOtherDocs; i++) {
        await prisma.document.create({
          data: {
            user: { connect: { id: nurse.id } },
            type: DocumentType.OTHER,
            fileUrl: faker.internet.url(),
          },
        });
      }
    }
  });

  await Promise.all(documentPromises);
  console.log(`Created documents for nurse users.`);

  // 7. Create Job Postings
  const jobDepartments = ['Intensive Care Unit (ICU)', 'Emergency Room (ER)', 'Pediatrics', 'Surgery', 'Oncology', 'Geriatrics', 'Neonatal Intensive Care (NICU)', 'Cardiology', 'Neurology'];
  const jobShiftTypes = ['Day', 'Night', 'Swing'];

  const facilities = [
    'Farrer Park Hospital'
  ];

  const jobs = await prisma.job.findMany({
    include: {
      requiredSkills: true,
    },
  });

  for (let i = 0; i < 30; i++) { // Increased number for a richer dataset
    const startDate = faker.date.future({ years: 1 });
    const endDate = faker.date.future({ years: 1, refDate: startDate });

    const requiredSkillCount = faker.number.int({ min: 3, max: 7 });
    const requiredSkills = faker.helpers.arrayElements(skills, requiredSkillCount);

    const jobTitleOptions = [
      'ICU Nurse',
      'Pediatric Nurse',
      'Emergency Room Nurse',
      'Surgical Nurse',
      'Oncology Nurse',
      'Geriatric Nurse',
      'Neonatal ICU Nurse',
      'Cardiology Nurse',
      'Neurology Nurse',
      'Clinical Nurse Specialist',
      'Nurse Practitioner - Primary Care',
      'Registered Nurse - Telehealth',
      'Labor and Delivery Nurse',
      'Trauma Nurse',
      'Mental Health Nurse',
      'Home Health Nurse',
      'Infection Control Nurse',
      'Case Management Nurse',
      'Rehabilitation Nurse',
      'Public Health Nurse',
    ];

    const job = await prisma.job.create({
      data: {
        title: faker.helpers.arrayElement(jobTitleOptions),
        description: faker.lorem.paragraphs(3),
        facility: faker.helpers.arrayElement(facilities),
        department: faker.helpers.arrayElement(jobDepartments),
        shiftType: faker.helpers.arrayElement(jobShiftTypes),
        startDateTime: startDate,
        endDateTime: endDate,
        payRate: `$${faker.number.int({ min: 30, max: 80 })}/hr`,
        urgent: faker.datatype.boolean(),
        status: faker.helpers.arrayElement(Object.values(JobStatus)),
        requiredSkills: {
          connect: requiredSkills.map((skill) => ({ id: skill.id })),
        },
      },
    });

    jobs.push({ ...job, requiredSkills });
  }

  console.log(`Created ${jobs.length} job postings.`);

  // 8. Create Applications
  const applicationPromises = jobs.map(async (job) => {
    // Each job gets applications from 5 to 15 random nurses
    const numApplicants = faker.number.int({ min: 5, max: 15 });
    const applicants = faker.helpers.arrayElements(nurseUsers, numApplicants);

    const applicationCreationPromises = applicants.map(async (nurse) => {
      // Calculate a random matching score based on overlapping skills
      const jobSkills: number[] = job.requiredSkills.map((skill: { id: number }) => skill.id);
      const nurseSkills: number[] = nurse.skills.map((skill: { id: number }) => skill.id);
      const matchingSkills = jobSkills.filter((skillId) => nurseSkills.includes(skillId));
      const matchingScore = Math.min((matchingSkills.length / jobSkills.length) * 100, 100);

      // Ensure that a nurse does not apply to the same job multiple times
      const existingApplication = await prisma.application.findUnique({
        where: {
          userId_jobId: {
            userId: nurse.id,
            jobId: job.id,
          },
        },
      });

      if (!existingApplication) {
        await prisma.application.create({
          data: {
            user: { connect: { id: nurse.id } },
            job: { connect: { id: job.id } },
            status: faker.helpers.arrayElement(Object.values(ApplicationStatus)),
            matchingScore: Math.round(matchingScore),
          },
        });
      }
    });

    await Promise.all(applicationCreationPromises);
  });

  await Promise.all(applicationPromises);
  console.log(`Created applications for jobs.`);

  // 9. Create Notifications
  const notificationPromises = nurseUsers.map(async (nurse) => {
    const numNotifications = faker.number.int({ min: 1, max: 10 });

    const notifications = [];

    for (let i = 0; i < numNotifications; i++) {
      notifications.push(
        prisma.notification.create({
          data: {
            user: { connect: { id: nurse.id } },
            message: faker.lorem.sentence(),
            timestamp: faker.date.recent({ days: 60 }), // Extended to cover more dates
          },
        })
      );
    }

    await Promise.all(notifications);
  });

  await Promise.all(notificationPromises);
  console.log(`Created notifications for nurses.`);

  // 10. Create Shifts
  const shiftPromises = nurseUsers.map(async (nurse) => {
    const numShifts = faker.number.int({ min: 2, max: 6 }); // Increased number for active freelancers

    const shifts = [];

    for (let i = 0; i < numShifts; i++) {
      const shiftDate = faker.date.future({ years: 1 });
      const startHour = faker.number.int({ min: 6, max: 20 }); // Shifts start between 6 AM to 8 PM
      const shiftDuration = faker.number.int({ min: 6, max: 12 }); // Shifts last between 6 to 12 hours
      const endHour = (startHour + shiftDuration) % 24;
      const startPeriod = startHour >= 12 ? 'PM' : 'AM';
      const endPeriod = endHour >= 12 ? 'PM' : 'AM';
      const formattedStartHour = startHour % 12 === 0 ? 12 : startHour % 12;
      const formattedEndHour = endHour % 12 === 0 ? 12 : endHour % 12;
      const time = `${formattedStartHour}:00 ${startPeriod} - ${formattedEndHour}:00 ${endPeriod}`;

      shifts.push(
        prisma.shift.create({
          data: {
            user: { connect: { id: nurse.id } },
            facility: faker.helpers.arrayElement(facilities),
            date: shiftDate,
            time,
          },
        })
      );
    }

    await Promise.all(shifts);
  });

  await Promise.all(shiftPromises);
  console.log(`Created upcoming shifts for nurses.`);
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });