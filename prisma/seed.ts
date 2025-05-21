import { PrismaClient, UserRole, ActivityType, CompanyStatus, ContactStatus, LeadStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper functions
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateCompanyData(createdById: string, updatedById: string) {
  return {
    name: faker.company.name(),
    industry: faker.company.buzzNoun(),
    website: faker.internet.url(),
    phone: faker.phone.number(),
    addressLine1: faker.location.streetAddress(),
    addressLine2: faker.location.secondaryAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    postalCode: faker.location.zipCode(),
    country: faker.location.country(),
    description: faker.company.catchPhrase(),
    annualRevenue: faker.number.float({ min: 100000, max: 10000000, fractionDigits: 2 }),
    numberOfEmployees: faker.number.int({ min: 10, max: 10000 }),
    status: randomItem(Object.values(CompanyStatus)),
    createdById,
    updatedById,
  };
}

function generateContactData(companyId: string, createdById: string, updatedById: string) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    phone: faker.phone.number(),
    jobTitle: faker.person.jobTitle(),
    leadSource: faker.helpers.arrayElement(['Website', 'Referral', 'Conference', 'Social Media', 'Direct']),
    description: faker.lorem.paragraph(),
    status: randomItem(Object.values(ContactStatus)),
    companyId,
    createdById,
    updatedById,
  };
}

async function main() {
  // Clean up existing data
  await prisma.$transaction([
    prisma.activityParticipant.deleteMany(),
    prisma.activity.deleteMany(),
    prisma.note.deleteMany(),
    prisma.lineItem.deleteMany(),
    prisma.quote.deleteMany(),
    prisma.opportunity.deleteMany(),
    prisma.contact.deleteMany(),
    prisma.company.deleteMany(),
    prisma.lead.deleteMany(),
    prisma.opportunityStage.deleteMany(),
    prisma.pipeline.deleteMany(),
    prisma.tag.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Create users with different roles
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: UserRole.ADMIN,
        phoneNumber: faker.phone.number(),
        profilePicture: faker.image.avatar(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'manager@example.com',
        password: await bcrypt.hash('manager123', 10),
        firstName: 'Sales',
        lastName: 'Manager',
        role: UserRole.SALES_MANAGER,
      },
    }),
    ...Array(3).fill(null).map(async (_, i) => prisma.user.create({
      data: {
        email: `sales${i + 1}@example.com`,
        password: await bcrypt.hash('sales123', 10),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: UserRole.SALES_REP,
        phoneNumber: faker.phone.number(),
        profilePicture: faker.image.avatar(),
      },
    })),
  ]);

  // Create default pipeline
  const pipeline = await prisma.pipeline.create({
    data: {
      name: 'Default Sales Pipeline',
      description: 'Standard sales process pipeline',
    },
  });

  // Create pipeline stages
  const stages = await Promise.all([
    prisma.opportunityStage.create({
      data: {
        name: 'Qualification',
        position: 1,
        pipelineId: pipeline.id,
      },
    }),
    prisma.opportunityStage.create({
      data: {
        name: 'Meeting Scheduled',
        position: 2,
        pipelineId: pipeline.id,
      },
    }),
    prisma.opportunityStage.create({
      data: {
        name: 'Proposal',
        position: 3,
        pipelineId: pipeline.id,
      },
    }),
    prisma.opportunityStage.create({
      data: {
        name: 'Negotiation',
        position: 4,
        pipelineId: pipeline.id,
      },
    }),
    prisma.opportunityStage.create({
      data: {
        name: 'Closed Won',
        position: 5,
        pipelineId: pipeline.id,
        isClosed: true,
        isWon: true,
      },
    }),
    prisma.opportunityStage.create({
      data: {
        name: 'Closed Lost',
        position: 6,
        pipelineId: pipeline.id,
        isClosed: true,
        isWon: false,
      },
    }),
  ]);

  // Create companies
  const companies = await Promise.all(
    Array(5).fill(null).map(() => 
      prisma.company.create({
        data: generateCompanyData(randomItem(users).id, randomItem(users).id),
      })
    )
  );

  // Create contacts
  const contacts = await Promise.all(
    Array(15).fill(null).map(() =>
      prisma.contact.create({
        data: generateContactData(
          randomItem(companies).id,
          randomItem(users).id,
          randomItem(users).id
        ),
      })
    )
  );

  // Create leads
  const leads = await Promise.all(
    Array(3).fill(null).map(() => prisma.lead.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        companyName: faker.company.name(),
        source: faker.helpers.arrayElement(['Website', 'Referral', 'Conference', 'Social Media', 'Direct']),
        description: faker.lorem.paragraph(),
        status: randomItem(Object.values(LeadStatus)),
        ownerId: randomItem(users).id,
        createdById: randomItem(users).id,
        updatedById: randomItem(users).id,
      },
    }))
  );

  // Create opportunities
  const opportunities = await Promise.all(
    Array(5).fill(null).map(() => prisma.opportunity.create({
      data: {
        name: faker.commerce.productName(),
        amount: faker.number.float({ min: 10000, max: 1000000, fractionDigits: 2 }),
        stageId: randomItem(stages).id,
        pipelineId: pipeline.id,
        ownerId: randomItem(users).id,
        companyId: randomItem(companies).id,
        contactId: randomItem(contacts).id,
        createdById: randomItem(users).id,
        updatedById: randomItem(users).id,
        closeDate: faker.date.future(),
      },
    }))
  );

  // Create activities
  await Promise.all(
    Array(20).fill(null).map(() => prisma.activity.create({
      data: {
        type: randomItem(Object.values(ActivityType)),
        subject: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        dueDate: faker.date.future(),
        isCompleted: faker.datatype.boolean(),
        contactId: randomItem(contacts).id,
        companyId: randomItem(companies).id,
        opportunityId: faker.datatype.boolean() ? randomItem(opportunities).id : null,
        createdById: randomItem(users).id,
        updatedById: randomItem(users).id,
      },
    }))
  );

  // Create tags with more variety
  const tags = await Promise.all(
    Array(5).fill(null).map(() => prisma.tag.create({
      data: {
        name: faker.word.sample(),
        color: faker.internet.color(),
      },
    }))
  );

  // Assign random tags to companies, contacts, and opportunities
  for (const company of companies) {
    await prisma.company.update({
      where: { id: company.id },
      data: { tags: { connect: [{ id: randomItem(tags).id }, { id: randomItem(tags).id }] } },
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
