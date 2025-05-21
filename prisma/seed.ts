import { PrismaClient, UserRole, ActivityType, CompanyStatus, ContactStatus, LeadStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper function to generate random dates within a range
function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to get random item from array
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
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
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
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
        firstName: `Sales${i + 1}`,
        lastName: 'Representative',
        role: UserRole.SALES_REP,
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
    Array(5).fill(null).map((_, i) => prisma.company.create({
      data: {
        name: `Company ${i + 1}`,
        industry: randomItem(['Technology', 'Manufacturing', 'Healthcare', 'Finance', 'Retail']),
        status: randomItem(Object.values(CompanyStatus)),
        createdById: randomItem(users).id,
        updatedById: randomItem(users).id,
        website: `www.company${i + 1}.com`,
        phone: `+1-555-${String(i + 1).padStart(3, '0')}-0000`,
      },
    }))
  );

  // Create contacts
  const contacts = await Promise.all(
    Array(15).fill(null).map((_, i) => prisma.contact.create({
      data: {
        firstName: `Contact${i + 1}`,
        lastName: `LastName${i + 1}`,
        email: `contact${i + 1}@example.com`,
        phone: `+1-555-${String(i + 1).padStart(3, '0')}-1111`,
        companyId: randomItem(companies).id,
        status: randomItem(Object.values(ContactStatus)),
        createdById: randomItem(users).id,
        updatedById: randomItem(users).id,
      },
    }))
  );

  // Create leads
  const leads = await Promise.all(
    Array(3).fill(null).map((_, i) => prisma.lead.create({
      data: {
        firstName: `Lead${i + 1}`,
        lastName: `LeadLast${i + 1}`,
        email: `lead${i + 1}@example.com`,
        phone: `+1-555-${String(i + 1).padStart(3, '0')}-2222`,
        companyName: `Lead Company ${i + 1}`,
        status: randomItem(Object.values(LeadStatus)),
        ownerId: randomItem(users).id,
        createdById: randomItem(users).id,
        updatedById: randomItem(users).id,
      },
    }))
  );

  // Create opportunities
  const opportunities = await Promise.all(
    Array(5).fill(null).map((_, i) => prisma.opportunity.create({
      data: {
        name: `Opportunity ${i + 1}`,
        amount: Math.floor(Math.random() * 100000) + 10000,
        stageId: randomItem(stages).id,
        pipelineId: pipeline.id,
        ownerId: randomItem(users).id,
        companyId: randomItem(companies).id,
        contactId: randomItem(contacts).id,
        createdById: randomItem(users).id,
        updatedById: randomItem(users).id,
        closeDate: randomDate(new Date(), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)),
      },
    }))
  );

  // Create activities
  await Promise.all(
    Array(20).fill(null).map((_, i) => prisma.activity.create({
      data: {
        type: randomItem(Object.values(ActivityType)),
        subject: `Activity ${i + 1}`,
        description: `Description for activity ${i + 1}`,
        dueDate: randomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
        isCompleted: Math.random() > 0.7,
        contactId: randomItem(contacts).id,
        companyId: randomItem(companies).id,
        opportunityId: Math.random() > 0.5 ? randomItem(opportunities).id : null,
        createdById: randomItem(users).id,
        updatedById: randomItem(users).id,
      },
    }))
  );

  // Create tags
  const tags = await Promise.all([
    { name: 'Hot Lead', color: '#FF0000' },
    { name: 'VIP', color: '#FFD700' },
    { name: 'New', color: '#00FF00' },
    { name: 'Priority', color: '#0000FF' },
    { name: 'Follow-up', color: '#800080' },
  ].map(tag => prisma.tag.create({ data: tag })));

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
