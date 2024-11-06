// prisma/seed.ts

import { PrismaClient, Role, JobStatus, ApplicationStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Clear Existing Data (Optional)
//   await prisma.notification.deleteMany();
//   await prisma.shift.deleteMany();
//   await prisma.application.deleteMany();
//   await prisma.job.deleteMany();
//   await prisma.user.deleteMany();
//   await prisma.skill.deleteMany();

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
      name: 'Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
      bio: 'Administrator user',
      experience: 10,
      certifications: [],
    },
  });

  console.log(`Created admin user: ${adminUser.email}`);

  // 4. Create Nurse Users
  const nurseUsers = [];

  for (let i = 0; i < 20; i++) {
    const userPassword = await bcrypt.hash('userpassword', 10); // Hash the password

    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: userPassword,
        role: Role.USER,
        bio: faker.lorem.sentence(),
        experience: faker.number.int({ min: 1, max: 20 }),
        certifications: faker.helpers.arrayElements(['BLS', 'ACLS', 'PALS', 'NCC', 'CCRN'], {
          min: 1,
          max: 3,
        }),
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

  // 5. Create Job Postings
  const departments = ['Intensive Care', 'Emergency', 'Pediatrics', 'Surgery', 'Oncology'];
  const shiftTypes = ['Day', 'Night', 'Swing'];

  const jobs = [];

  for (let i = 0; i < 10; i++) {
    const job = await prisma.job.create({
      data: {
        title: faker.person.jobTitle(),
        description: faker.lorem.paragraph(),
        facility: faker.company.name(),
        department: faker.helpers.arrayElement(departments),
        shiftType: faker.helpers.arrayElement(shiftTypes),
        startDateTime: faker.date.future(),
        endDateTime: faker.date.future(),
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

  // 6. Create Applications
  for (const job of jobs) {
    // Each job gets applications from 5 random nurses
    const applicants = faker.helpers.arrayElements(nurseUsers, 5);

    for (const nurse of applicants) {
      // Calculate a random matching score
      const matchingScore = faker.number.int({ min: 50, max: 100 });

      await prisma.application.create({
        data: {
          user: { connect: { id: nurse.id } },
          job: { connect: { id: job.id } },
          status: faker.helpers.arrayElement(Object.values(ApplicationStatus)),
          matchingScore,
        },
      });
    }
  }

  console.log(`Created applications for jobs.`);

  // 7. Create Notifications
  for (const nurse of nurseUsers) {
    const notifications = [];

    for (let i = 0; i < 3; i++) {
      const notification = await prisma.notification.create({
        data: {
          user: { connect: { id: nurse.id } },
          message: faker.lorem.sentence(),
          timestamp: faker.date.recent(),
        },
      });

      notifications.push(notification);
    }
  }

  console.log(`Created notifications for nurses.`);

  // 8. Create Shifts
  for (const nurse of nurseUsers) {
    const shifts = [];

    for (let i = 0; i < 2; i++) {
      const shift = await prisma.shift.create({
        data: {
          user: { connect: { id: nurse.id } },
          facility: faker.company.name(),
          date: faker.date.future(),
          time: `${faker.number.int({ min: 6, max: 9 })}:00 AM - ${faker.number.int({
            min: 5,
            max: 11,
          })}:00 PM`,
        },
      });

      shifts.push(shift);
    }
  }

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
