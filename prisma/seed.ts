// prisma/seed.ts

import { PrismaClient, Role, Specialization, JobStatus, ApplicationStatus } from '@prisma/client';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Define the specialization to technical skills mapping
const specializationSkillsMap: { [key in Specialization]: string[] } = {
  [Specialization.EMERGENCY]: [
    'Emergency Protocols',
    'Advanced Cardiac Life Support (ACLS)',
    'Intravenous (IV) Insertion',
    'Patient Monitoring',
    'ECG Interpretation',
  ],
  [Specialization.CRITICAL_CARE]: [
    'Ventilator Management',
    'Medication Administration',
    'Patient Monitoring',
    'Catheterization',
    'Electronic Medical Records (EMR) Management',
  ],
  [Specialization.GERONTOLOGY]: [
    'Geriatric Care Techniques',
    'Wound Dressing',
    'Medication Administration',
    'Patient Monitoring',
    'Sterile Technique',
  ],
  [Specialization.COMMUNITY_HEALTH]: [
    'Patient Monitoring',
    'Medication Administration',
    'Wound Dressing',
    'Phlebotomy',
    'Electronic Medical Records (EMR) Management',
  ],
};

/**
 * Selects a random subset of skills from the provided list.
 * @param skills - Array of skill names to choose from.
 * @param min - Minimum number of skills to assign.
 * @param max - Maximum number of skills to assign.
 * @returns Array of randomly selected skill names.
 */
function getRandomSkills(skills: string[], min: number, max: number): string[] {
  const numberOfSkills = faker.number.int({ min, max });
  return faker.helpers.arrayElements(skills, numberOfSkills);
}

function getRandomApplicationStatus(): ApplicationStatus {
  const statuses: ApplicationStatus[] = [
    ApplicationStatus.APPLIED,
    ApplicationStatus.ACCEPTED,
    ApplicationStatus.REJECTED,
  ];
  return faker.helpers.arrayElement(statuses);
}


async function main() {
  // 1. Clear Existing Data
  await prisma.notification.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.application.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();
  await prisma.skill.deleteMany(); // Clear skills

  // 2. Create Admin User
  const adminPassword = await bcrypt.hash('Admin@123', 10); // Secure password

  const adminUser = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@freelancenurse.com',
      password: adminPassword,
      role: Role.ADMIN,
      contactNumber: faker.phone.number({style:"international"}), // Singaporean phone number format
      gender: 'Male',
      postalCode: '123456',
      citizenship: 'Singaporean',
      race: 'Chinese',
      specialization: Specialization.EMERGENCY,
      availableWorkDays: 'Weekdays',
      frequencyOfWork: 7,
      preferredFacilityType: 'ICU',
      availableWorkTiming: 'No Preference',
      dob: faker.date.birthdate({ min: 30, max: 50, mode: 'age' }),
    },
  });

  console.log(`Created admin user: ${adminUser.email}`);

  // 3. Create Skills
  const skillNames = [
    'IV Therapy',
    'Ventilator Management',
    'Wound Dressing',
    'Pediatric Life Support',
    'Geriatric Care Techniques',
    'Emergency Protocols',
    'Medication Administration',
    'Patient Monitoring',
    'Electronic Medical Records (EMR) Management',
    'Phlebotomy',
    'ECG Interpretation',
    'Catheterization',
    'Advanced Cardiac Life Support (ACLS)',
    'Basic Life Support (BLS)',
    'Intravenous (IV) Insertion',
    'Sterile Technique',
  ];

  const skills = await Promise.all(
    skillNames.map((name) =>
      prisma.skill.create({
        data: { name },
      })
    )
  );

  console.log(`Created ${skills.length} skills.`);

  // 4. Read and Parse CSV Data
  const usersMap = new Map<string, any>(); // Map to store unique users
  const shiftsData: any[] = []; // Array to store shift data

  await new Promise<void>((resolve, reject) => {
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true,
    });

    createReadStream('data.csv')
      .pipe(parser)
      .on('data', (row: any) => {
        const uniqueIdRaw = row['Name (as per NRIC) - Replace with a unique identifier'].trim();
        const uniqueId = uniqueIdRaw.toLowerCase(); // Normalize to lowercase

        if (!usersMap.has(uniqueId)) {
          // Split the name into firstName and lastName
          const nameParts = uniqueIdRaw.split(' ');
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(' ') || '';

          usersMap.set(uniqueId, {
            firstName,
            lastName,
            citizenship: row['Singaporean/ Singapore PR'].trim() || 'Singaporean',
            race: row['Race'].trim(),
            gender: row['Gender'].trim(),
            specialization: row['Specialisation'].trim(),
            postalCode: row['Postal Code'].trim(),
            availableWorkDays: row['Available work days'].trim(),
            frequencyOfWork: row['Frequency of work'].trim(),
            preferredFacilityType: row['Inpatient Ward(IPS)/ Intensive Care (ICU)'].trim(),
            availableWorkTiming: row['Available work timing'].trim(),
            dob: faker.date.birthdate({ min: 22, max: 65, mode: 'age' }),
            // Removed skills from CSV parsing
          });
        }

        // Collect shift data
        shiftsData.push({
          uniqueId, // Already normalized to lowercase
          startDate: row['Start Date'].trim(),
          endDate: row['End Date'].trim(),
          startTime: row['Start Time'].trim(),
          endTime: row['End Time'].trim(),
          mealBreak: row['Meal Break'].trim().toLowerCase() === 'yes',
          assignedDepartment: row['Assigned Department'].trim(),
          assignedSupervisor: row['Assigned Supervisor'].trim(),
          supervisorRating: parseInt(row["Supervisor's rating on Locum Performance"].trim(), 10),
          commentsOnPerformance: row['Comments on Locum Performance'].trim(),
          recommendToRehire: row['Recommend to Rehire (Yes/No)'].trim().toLowerCase() === 'yes',
        });
      })
      .on('end', () => {
        resolve();
      })
      .on('error', (err: any) => {
        console.error('Error reading CSV file:', err);
        reject(err);
      });
  });

  console.log(`Parsed CSV data: ${usersMap.size} unique users found.`);

  // 5. Create Users and Experiences
  const userEntries = Array.from(usersMap.entries());

  for (const [uniqueId, userData] of userEntries) {
    const password = await bcrypt.hash('Nurse@123', 10); // Default password
    const email = faker.internet
      .email({
        firstName: userData.firstName,
        lastName: userData.lastName,
        provider: 'freelancenurse.com',
      })
      .toLowerCase(); // Normalize email to lowercase

    // Map specialization string to enum
    const specializationMap: { [key: string]: Specialization } = {
      'community health': Specialization.COMMUNITY_HEALTH,
      'critical care': Specialization.CRITICAL_CARE,
      'gerontology': Specialization.GERONTOLOGY,
      'emergency': Specialization.EMERGENCY,
      'intensive care': Specialization.CRITICAL_CARE,
      'neonatal icu': Specialization.CRITICAL_CARE,
      // Add more mappings as per your CSV data
    };

    const specializationEnum =
      specializationMap[userData.specialization.toLowerCase()] || Specialization.COMMUNITY_HEALTH;

    // Ensure unique email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log(`Email ${email} already exists. Skipping user creation.`);
      continue;
    }

    try {
      // Assign skills based on specialization
      const possibleSkills = specializationSkillsMap[specializationEnum];
      const assignedSkills = getRandomSkills(possibleSkills, 3, 5); // Assign between 3 to 5 skills

      const user = await prisma.user.create({
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email,
          password,
          role: Role.USER,
          contactNumber:
            userData.citizenship === 'Singaporean/ Singapore PR'
              ? faker.phone.number({style:"international"}) // Singaporean mobile number starts with '8' or '9'
              : faker.phone.number({style:"international"}), // Adjust as necessary
          gender: userData.gender,
          postalCode: userData.postalCode,
          citizenship: userData.citizenship,
          race: userData.race,
          specialization: specializationEnum,
          availableWorkDays: userData.availableWorkDays,
          frequencyOfWork: faker.number.int({ min: 2, max: 6 }),
          preferredFacilityType: userData.preferredFacilityType,
          availableWorkTiming: userData.availableWorkTiming,
          dob: userData.dob,
          skills: {
            connect: assignedSkills.map((skillName: string) => ({
              name: skillName,
            })),
          },
        },
      });

      // Create Experience (assuming one experience per user from CSV)
      await prisma.experience.create({
        data: {
          userId: user.id,
          facilityName: faker.company.name() + ' Hospital',
          position: 'Registered Nurse',
          department: userData.preferredFacilityType,
          startDate: faker.date.past({ years: 5 }),
          endDate: faker.date.recent({ days: 30 }),
          responsibilities: faker.lorem.paragraph(),
        },
      });

      console.log(`Created user: ${user.email}`);

      // Update the map with user ID for shift creation
      usersMap.set(uniqueId, { ...userData, id: user.id });
    } catch (error) {
      console.error(`Error creating user ${email}:`, error);
    }
  }

  console.log(`Created ${usersMap.size} users.`);

  // 6. Create Shifts with Feedback
  for (const shift of shiftsData) {
    const user = usersMap.get(shift.uniqueId);
    if (!user || !user.id) {
      console.error(`User with uniqueId "${shift.uniqueId}" not found. Skipping shift creation.`);
      continue;
    }

    // Parse dates. Assuming Start Date and End Date are in 'DD-MMM' format, e.g., '17-Jul'
    // We'll set the year to 2025 to ensure all shifts are in 2025

    const parseDate = (dateStr: string): Date => {
      // Handle cases where year might already be present
      const regex = /^(\d{1,2})-(\w{3})(?:-(\d{4}))?$/;
      const match = dateStr.match(regex);
      if (match) {
        const day = match[1];
        const month = match[2];
        const year = 2025; // **Set year to 2025 regardless of input**
        return new Date(`${month} ${day}, ${year}`); // e.g., "Jul 17, 2025"
      }
      // Fallback to January 1, 2025 if parsing fails
      console.warn(`Failed to parse date string "${dateStr}". Using 2025-01-01.`);
      return new Date('2025-01-01');
    };

    const startDate = parseDate(shift.startDate);
    const endDate = parseDate(shift.endDate);

    try {
      await prisma.shift.create({
        data: {
          userId: user.id,
          facility: faker.company.name() + ' Hospital',
          startDate,
          endDate,
          startTime: shift.startTime,
          endTime: shift.endTime,
          mealBreak: shift.mealBreak,
          assignedDepartment: shift.assignedDepartment,
          assignedSupervisor: shift.assignedSupervisor,
          supervisorRating: shift.supervisorRating,
          commentsOnPerformance: shift.commentsOnPerformance,
          recommendToRehire: shift.recommendToRehire,
        },
      });

      console.log(`Created shift for userId ${user.id}`);
    } catch (error) {
      console.error(`Error creating shift for userId ${user.id}:`, error);
    }
  }

  console.log(`Created ${shiftsData.length} shifts with feedback.`);

  // 7. Create Sample Job Postings
  const jobTitles = [
    'ICU Nurse',
    'Emergency Room Nurse',
    'Community Health Nurse',
    'Geriatric Nurse',
  ];

  const jobDepartments = ['ICU', 'ER', 'Community Health', 'Geriatrics'];
  const jobShiftTypes = ['Day', 'Night', 'Swing'];

  const facilities = [
    'Farrer Park Hospital',
    'Tan Tock Seng Hospital',
    'Singapore General Hospital',
    'Mount Elizabeth Hospital',
  ];

  // Define required technical skills per job title
  const jobRequiredSkillsMap: { [key: string]: string[] } = {
    'ICU Nurse': ['Ventilator Management', 'IV Therapy', 'Patient Monitoring'],
    'Emergency Room Nurse': ['Emergency Protocols', 'Advanced Cardiac Life Support (ACLS)', 'ECG Interpretation'],
    'Community Health Nurse': ['Patient Monitoring', 'Medication Administration', 'Phlebotomy'],
    'Geriatric Nurse': ['Geriatric Care Techniques', 'Wound Dressing', 'Medication Administration'],
  };

  for (let i = 0; i < 10; i++) {
    const title = faker.helpers.arrayElement(jobTitles);
    const requiredSkills = jobRequiredSkillsMap[title] || [];

    try {
      const job = await prisma.job.create({
        data: {
          title,
          description: faker.lorem.paragraphs(2),
          facility: faker.helpers.arrayElement(facilities),
          department: faker.helpers.arrayElement(jobDepartments),
          shiftType: faker.helpers.arrayElement(jobShiftTypes),
          startDateTime: faker.date.future({ years: 1 }),
          endDateTime: faker.date.future({ years: 1, refDate: new Date() }),
          payRate: `$${faker.number.int({ min: 30, max: 80 })}/hr`,
          urgent: faker.datatype.boolean(),
          status: JobStatus.ACTIVE,
          requiredSkills: {
            connect: requiredSkills.map((skillName) => ({
              name: skillName,
            })),
          },
        },
      });

      console.log(`Created job: ${job.title} at ${job.facility}`);
    } catch (error) {
      console.error(`Error creating job "${title}":`, error);
    }
  }

  console.log('Created sample job postings.');

  // 8. Create Applications
  // Randomly assign users to jobs
  const allJobs = await prisma.job.findMany();
  const allUsers = Array.from(usersMap.values());

  let hasAccepted = false; // Flag to track if an ACCEPTED status has been assigned
  const createdApplications: { userId: number; jobId: number }[] = []; // To store created applications for potential update

  for (const job of allJobs) {
    const numApplicants = faker.number.int({ min: 1, max: 5 });
    const applicants = faker.helpers.arrayElements(allUsers, numApplicants);

    for (const applicant of applicants) {
      try {
        // Check if application already exists
        const existingApplication = await prisma.application.findFirst({
          where: {
            userId: applicant.id,
            jobId: job.id,
          },
        });

        if (!existingApplication) {
          // Calculate a matching score based on specialization
          let matchingScore = 50;
          switch (applicant.specialization) {
            case Specialization.EMERGENCY:
              matchingScore = 80;
              break;
            case Specialization.CRITICAL_CARE:
              matchingScore = 85;
              break;
            case Specialization.GERONTOLOGY:
              matchingScore = 75;
              break;
            case Specialization.COMMUNITY_HEALTH:
              matchingScore = 70;
              break;
            default:
              matchingScore = 60;
          }

          // Assign status
          let status: ApplicationStatus = getRandomApplicationStatus();
          if (status === ApplicationStatus.ACCEPTED) {
            hasAccepted = true;
          }

          const application = await prisma.application.create({
            data: {
              userId: applicant.id,
              jobId: job.id,
              status,
              matchingScore,
            },
          });

          console.log(`Created application for userId ${applicant.id} to jobId ${job.id} with status ${status}`);

          // Store the application details
          createdApplications.push({ userId: applicant.id, jobId: job.id });
        }
      } catch (error) {
        console.error(`Error creating application for userId ${applicant.id} to jobId ${job.id}:`, error);
      }
    }
  }

  // After creating all applications, ensure at least one is ACCEPTED
  if (!hasAccepted && createdApplications.length > 0) {
    // Select a random application to update to ACCEPTED
    const randomIndex = faker.number.int({ min: 0, max: createdApplications.length - 1 });
    const { userId, jobId } = createdApplications[randomIndex];

    try {
      await prisma.application.updateMany({
        where: {
          userId,
          jobId,
        },
        data: {
          status: ApplicationStatus.ACCEPTED,
        },
      });

      console.log(`Updated application for userId ${userId} to jobId ${jobId} to status ACCEPTED`);
    } catch (error) {
      console.error(`Error updating application for userId ${userId} to jobId ${jobId}:`, error);
    }
  }

  console.log('Created applications for job postings.');

  // 9. Create Notifications
  for (const user of allUsers) {
    const numNotifications = faker.number.int({ min: 1, max: 10 });

    for (let i = 0; i < numNotifications; i++) {
      try {
        await prisma.notification.create({
          data: {
            userId: user.id,
            message: faker.lorem.sentence(),
            timestamp: faker.date.recent({ days: 60 }),
          },
        });

        console.log(`Created notification for userId ${user.id}`);
      } catch (error) {
        console.error(`Error creating notification for userId ${user.id}:`, error);
      }
    }
  }

  console.log('Created notifications for nurses.');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
