import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

// Helper function
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

async function generateMockData() {
  // Generate users
  const users = [
    {
      id: '1',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: 'ADMIN',
      isActive: true,
      phoneNumber: faker.phone.number(),
      profilePicture: faker.image.avatar(),
    },
    {
      id: '2',
      email: 'manager@example.com',
      password: await bcrypt.hash('manager123', 10),
      firstName: 'Sales',
      lastName: 'Manager',
      role: 'SALES_MANAGER',
      isActive: true,
    },
    ...Array(3).fill(null).map((_, i) => ({
      id: `${i + 3}`,
      email: `sales${i + 1}@example.com`,
      password: bcrypt.hashSync('sales123', 10),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: 'SALES_REP',
      isActive: true,
      phoneNumber: faker.phone.number(),
      profilePicture: faker.image.avatar(),
    })),
  ];

  // Generate companies
  const companies = Array(5).fill(null).map((_, i) => ({
    id: `${i + 1}`,
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
    status: randomItem(['ACTIVE', 'PROSPECT', 'CUSTOMER']),
    createdById: randomItem(users).id,
    updatedById: randomItem(users).id,
  }));

  // Generate contacts
  const contacts = Array(15).fill(null).map((_, i) => ({
    id: `${i + 1}`,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    jobTitle: faker.person.jobTitle(),
    companyId: randomItem(companies).id,
    status: randomItem(['NEW', 'QUALIFIED', 'CUSTOMER']),
    createdById: randomItem(users).id,
    updatedById: randomItem(users).id,
  }));

  // Create opportunities
  const opportunities = Array(5).fill(null).map((_, i) => ({
    id: `${i + 1}`,
    name: faker.commerce.productName(),
    amount: faker.number.float({ min: 10000, max: 1000000, fractionDigits: 2 }),
    status: randomItem(['OPEN', 'WON', 'LOST']),
    ownerId: randomItem(users).id,
    companyId: randomItem(companies).id,
    contactId: randomItem(contacts).id,
    createdById: randomItem(users).id,
    updatedById: randomItem(users).id,
    closeDate: faker.date.future(),
  }));

  // Generate activities
  const activities = Array(20).fill(null).map((_, i) => ({
    id: `${i + 1}`,
    type: randomItem(['CALL', 'MEETING', 'EMAIL', 'TASK']),
    subject: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    dueDate: faker.date.future(),
    isCompleted: faker.datatype.boolean(),
    priority: randomItem(['LOW', 'NORMAL', 'HIGH']),
    contactId: randomItem(contacts).id,
    companyId: randomItem(companies).id,
    opportunityId: Math.random() > 0.5 ? randomItem(opportunities).id : null,
    createdById: randomItem(users).id,
    updatedById: randomItem(users).id,
  }));

  // Generate pipeline and stages
  const pipeline = {
    id: '1',
    name: 'Default Sales Pipeline',
    description: 'Standard sales process pipeline',
  };

  const stages = [
    { id: '1', name: 'Qualification', position: 1, pipelineId: pipeline.id },
    { id: '2', name: 'Meeting Scheduled', position: 2, pipelineId: pipeline.id },
    { id: '3', name: 'Proposal', position: 3, pipelineId: pipeline.id },
    { id: '4', name: 'Negotiation', position: 4, pipelineId: pipeline.id },
    { id: '5', name: 'Closed Won', position: 5, pipelineId: pipeline.id, isClosed: true, isWon: true },
    { id: '6', name: 'Closed Lost', position: 6, pipelineId: pipeline.id, isClosed: true, isWon: false },
  ];

  // Generate leads
  const leads = Array(3).fill(null).map((_, i) => ({
    id: `${i + 1}`,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    companyName: faker.company.name(),
    status: randomItem(['NEW', 'QUALIFIED', 'CONTACTED', 'CONVERTED']),
    source: faker.helpers.arrayElement(['Website', 'Referral', 'Conference', 'Social Media']),
    description: faker.lorem.paragraph(),
    ownerId: randomItem(users).id,
    createdById: randomItem(users).id,
    updatedById: randomItem(users).id,
  }));

  // Generate tags
  const tags = [
    { id: '1', name: 'Hot Lead', color: '#FF0000' },
    { id: '2', name: 'VIP', color: '#FFD700' },
    { id: '3', name: 'New', color: '#00FF00' },
    { id: '4', name: 'Priority', color: '#0000FF' },
    { id: '5', name: 'Follow-up', color: '#800080' },
  ];

  // Generate notes
  const notes = Array(20).fill(null).map((_, i) => ({
    id: `${i + 1}`,
    content: faker.lorem.paragraph(),
    authorId: randomItem(users).id,
    companyId: Math.random() > 0.5 ? randomItem(companies).id : null,
    contactId: Math.random() > 0.5 ? randomItem(contacts).id : null,
    opportunityId: Math.random() > 0.5 ? randomItem(opportunities).id : null,
    leadId: Math.random() > 0.5 ? randomItem(leads).id : null,
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  }));

  // Generate line items
  const lineItems = opportunities.flatMap((opp, i) => 
    Array(faker.number.int({ min: 1, max: 3 })).fill(null).map((_, j) => ({
      id: `${i}-${j}`,
      opportunityId: opp.id,
      quantity: faker.number.int({ min: 1, max: 10 }),
      unitPriceAtPurchase: faker.number.float({ min: 1000, max: 50000, fractionDigits: 2 }),
      createdById: randomItem(users).id,
      updatedById: randomItem(users).id,
    }))
  );

  const mockData = {
    users,
    companies,
    contacts,
    opportunities,
    activities,
    pipeline,
    stages,
    leads,
    tags,
    notes,
    lineItems,
  };

  // Write to file
  fs.writeFileSync(
    path.join(__dirname, '../mock-data.json'),
    JSON.stringify(mockData, null, 2)
  );

  console.log('Mock data generated successfully!');
}

generateMockData().catch(console.error);
