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
    'Registered Nurse',
    'ICU Experience',
    'Pediatric Care',
    'Emergency Response',
    'Phlebotomy',
    'Medication Administration',
    'Patient Assessment',
    'Wound Care',
    'IV Therapy',
    'Team Collaboration',
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
  const adminPassword = await bcrypt.hash('adminpassword', 10); // Hash the password

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: adminPassword,
      role: Role.ADMIN,
      bio: 'Administrator user with full access.',
      yearsOfExperience: 15,
      certifications: ['BLS', 'ACLS', 'CALS'],
      specializations: ['Emergency Response', 'Team Collaboration'],
      languages: ['English', 'Spanish'],
      shiftPreferences: ['Day Shift', 'Night Shift'],
      profilePictureUrl: faker.image.avatar(),
      skills: {
        connect: skills.map((skill) => ({ id: skill.id })),
      },
      address: faker.location.streetAddress(),
      contactNumber: faker.phone.number(),
      gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
      dob: faker.date.birthdate({ min: 1950, max: 1995, mode: 'year' }),
      licenseNumber: faker.string.alphanumeric(10).toUpperCase(),
      licenseExpiration: faker.date.future({ years: 5 }),
      education: faker.helpers.arrayElement([
        "Bachelor's Degree",
        "Master's Degree",
        'Doctorate',
        'Associate Degree',
        'Diploma',
      ]),
    },
  });

  console.log(`Created admin user: ${adminUser.email}`);

  // 4. Create Nurse Users
  const nurseUsers: any[] = []; // Using any[] temporarily to handle TypeScript typing issues

  for (let i = 0; i < 20; i++) {
    const userPassword = await bcrypt.hash('nursepassword', 10); // Hash the password

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const gender = faker.helpers.arrayElement(['Male', 'Female', 'Other']);
    const dob = faker.date.birthdate({ min: 1950, max: 2000, mode: 'year' });
    const contactNumber = faker.phone.number();
    const email = faker.internet.email({ firstName, lastName });
    const address = faker.location.streetAddress();
    const licenseNumber = faker.string.alphanumeric(10).toUpperCase();
    const licenseExpiration = faker.date.future({ years: 5 });
    const yearsOfExperience = faker.number.int({ min: 1, max: 40 });
    const education = faker.helpers.arrayElement([
      "Bachelor's Degree",
      "Master's Degree",
      'Doctorate',
      'Associate Degree',
      'Diploma',
    ]);
    const specializations = faker.helpers.arrayElements(
      ['ICU', 'ER', 'Pediatrics', 'Surgical', 'Oncology', 'Geriatrics'],
      faker.number.int({ min: 1, max: 3 })
    );
    const languages = faker.helpers.arrayElements(
      ['English', 'Mandarin', 'Malay', 'Tamil', 'Spanish', 'French'],
      faker.number.int({ min: 1, max: 3 })
    );
    const shiftPreferences = faker.helpers.arrayElements(
      ['Day Shift', 'Night Shift', 'Weekends', 'Overtime'],
      faker.number.int({ min: 1, max: 2 })
    );
    const bio = faker.lorem.sentence();
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
          max: 3,
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
            faker.number.int({ min: 3, max: 7 })
          ).map((skill) => ({ id: skill.id })),
        },
      },
    });

    nurseUsers.push(user);
  }

  console.log(`Created ${nurseUsers.length} nurse users.`);

  // 5. Create Experiences for Nurse Users
  const departments = ['Intensive Care', 'Emergency', 'Pediatrics', 'Surgery', 'Oncology', 'Geriatrics'];
  const positions = ['Registered Nurse', 'Senior Nurse', 'Charge Nurse', 'Clinical Nurse Specialist', 'Nurse Practitioner'];

  const experiencePromises = nurseUsers.map(async (nurse) => {
    const numExperiences = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < numExperiences; i++) {
      const startDate = faker.date.past({ years: 10 });
      const endDate = faker.helpers.arrayElement([faker.date.between({ from: startDate, to: new Date() }), null]); // null indicates current position

      await prisma.experience.create({
        data: {
          user: { connect: { id: nurse.id } },
          facilityName: faker.company.name(),
          position: faker.helpers.arrayElement(positions),
          department: faker.helpers.arrayElement(departments),
          startDate,
          endDate,
          responsibilities: faker.lorem.paragraph(),
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
      const numOtherDocs = faker.number.int({ min: 1, max: 2 });
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
  const jobDepartments = ['Intensive Care', 'Emergency', 'Pediatrics', 'Surgery', 'Oncology', 'Geriatrics'];
  const jobShiftTypes = ['Day', 'Night', 'Swing'];

  const jobs = [];

  for (let i = 0; i < 10; i++) {
    const startDate = faker.date.future({ years: 1 });
    const endDate = faker.date.future({ years: 1, refDate: startDate });

    const job = await prisma.job.create({
      data: {
        title: faker.person.jobTitle(),
        description: faker.lorem.paragraphs(2),
        facility: faker.company.name(),
        department: faker.helpers.arrayElement(jobDepartments),
        shiftType: faker.helpers.arrayElement(jobShiftTypes),
        startDateTime: startDate,
        endDateTime: endDate,
        payRate: `$${faker.number.int({ min: 25, max: 60 })}/hr`,
        urgent: faker.datatype.boolean(),
        status: faker.helpers.arrayElement(Object.values(JobStatus)),
        requiredSkills: {
          connect: faker.helpers.arrayElements(
            skills,
            faker.number.int({ min: 3, max: 6 })
          ).map((skill) => ({ id: skill.id })),
        },
      },
    });

    jobs.push(job);
  }

  console.log(`Created ${jobs.length} job postings.`);

  // 8. Create Applications
  const applicationPromises = jobs.map(async (job) => {
    // Each job gets applications from 5 random nurses
    const applicants = faker.helpers.arrayElements(nurseUsers, 5);

    const applicationCreationPromises = applicants.map(async (nurse) => {
      // Calculate a random matching score
      const matchingScore = faker.number.int({ min: 50, max: 100 });

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
            matchingScore,
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
    const numNotifications = faker.number.int({ min: 1, max: 5 });

    const notifications = [];

    for (let i = 0; i < numNotifications; i++) {
      notifications.push(
        prisma.notification.create({
          data: {
            user: { connect: { id: nurse.id } },
            message: faker.lorem.sentence(),
            timestamp: faker.date.recent({ days: 30 }),
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
    const numShifts = faker.number.int({ min: 1, max: 3 });

    const shifts = [];

    for (let i = 0; i < numShifts; i++) {
      const shiftDate = faker.date.future({ years: 1 });
      const startHour = faker.number.int({ min: 6, max: 12 });
      const endHour = faker.number.int({ min: 13, max: 22 });
      const startPeriod = startHour >= 12 ? 'PM' : 'AM';
      const endPeriod = endHour >= 12 ? 'PM' : 'AM';
      const time = `${startHour % 12 === 0 ? 12 : startHour % 12}:00 ${startPeriod} - ${
        endHour % 12 === 0 ? 12 : endHour % 12
      }:00 ${endPeriod}`;

      shifts.push(
        prisma.shift.create({
          data: {
            user: { connect: { id: nurse.id } },
            facility: faker.company.name(),
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