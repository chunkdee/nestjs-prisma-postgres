# My CRM

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/nest?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/p8bsUyUtHI)


## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve my-crm
```

To create a production bundle:

```sh
npx nx build my-crm
```

To see all available targets to run for a project, run:

```sh
npx nx show project my-crm
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/nest:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/node:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)


[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/nest?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

# My CRM

A modern CRM system built with NestJS, Prisma, and PostgreSQL.

## Features

- User Management & Authentication
- Company/Contact Management
- Lead Management
- Opportunity/Pipeline Management
- Activity Tracking
- Note Management
- File Attachments
- Tagging System
- Custom Fields
- Audit Logging

## Tech Stack

- NestJS - Backend Framework
- Prisma - ORM
- PostgreSQL - Database
- TypeScript
- JSON Server (for development)

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- Docker (optional)

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update DATABASE_URL in .env with your PostgreSQL connection string

5. Initialize the database:
```bash
npm run prisma:migrate
npm run prisma:generate
```

6. Seed the database:
```bash
npm run prisma:seed
```

## Development

### Available Scripts

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:format` - Format Prisma schema
- `npm run prisma:seed` - Seed the database with sample data
- `npm run generate:mock` - Generate mock data for JSON Server
- `npm run json-server` - Start JSON Server with mock data

### Using JSON Server for Development

1. Generate mock data:
```bash
npm run generate:mock
```

2. Start JSON Server:
```bash
npm run json-server
```

Access the mock API at `http://localhost:3000`

### Available Endpoints

The following REST endpoints are available:

#### Core Entities
- `GET/POST/PUT/DELETE /users` - User management
- `GET/POST/PUT/DELETE /companies` - Company management
- `GET/POST/PUT/DELETE /contacts` - Contact management
- `GET/POST/PUT/DELETE /opportunities` - Opportunity management
- `GET/POST/PUT/DELETE /leads` - Lead management
- `GET/POST/PUT/DELETE /activities` - Activity management

#### Supporting Entities
- `GET/POST/PUT/DELETE /pipeline` - Pipeline configuration
- `GET/POST/PUT/DELETE /stages` - Pipeline stages
- `GET/POST/PUT/DELETE /tags` - Tags management
- `GET/POST/PUT/DELETE /notes` - Notes management
- `GET/POST/PUT/DELETE /lineItems` - Line items for opportunities

#### Filtering Examples
```bash
# Filter contacts by company
GET /contacts?companyId=1

# Filter activities by type
GET /activities?type=MEETING

# Search companies by name
GET /companies?name_like=Acme

# Paginate results
GET /contacts?_page=1&_limit=10

# Sort opportunities by amount
GET /opportunities?_sort=amount&_order=desc
```

#### Embedding Relationships
```bash
# Get contacts with their company data
GET /contacts?_embed=company

# Get companies with their contacts
GET /companies?_embed=contacts

# Get opportunities with related entities
GET /opportunities?_embed=contact&_embed=company&_embed=lineItems

# Get activities with participants
GET /activities?_embed=activityParticipants

# Get opportunities with multiple levels
GET /opportunities?_embed=lineItems&_expand=contact&_expand=company

# Get contacts with their activities and company
GET /contacts?_embed=activities&_expand=company

# Get companies with full relationship tree
GET /companies?_embed=contacts&_embed=opportunities&_embed=activities
```

### Database Schema Visualization

The project includes ERD generation. After making schema changes:

1. Generate ERD:
```bash
npm run prisma:generate
```

2. View the diagram at `./prisma/erd/diagram.svg`

## Project Structure

```
my-crm/
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── seed.ts         # Database seeder
│   └── erd/           # Generated ERD diagrams
├── scripts/
│   └── generate-mock-data.ts  # Mock data generator
└── src/               # Application source code
```

## License

MIT
