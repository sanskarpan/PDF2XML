# PDF-to-XML Converter Web Application

A fast, scalable web application that converts PDF files to XML while preserving document structure and formatting.

## Technical Stack

- **Frontend**: Next.js with Tailwind CSS and Shadcn components
- **Backend**: NestJS
- **File Upload**: Uploadthing
- **Database**: Cloud-based (PostgreSQL with Prisma)
- **Authentication**: Clerk
- **Error Detection**: Sentry
- **Deployment**: Vercel

## Project Structure

This is a monorepo containing:

- `frontend/`: Next.js application
- `backend/`: NestJS application

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Git

### Installation

1. Clone the repository
   ```
   git clone https://github.com/sanskarpan/PDF2XML.git
   cd PDF2XML
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start development servers
   ```
   npm run dev
   ```

## Development Levels

The project is built incrementally in the following levels:

1. **Level 1 – Basic Implementation**: Authentication, file upload, basic conversion, history
2. **Level 2 – Intermediate Implementation**: Enhanced conversion, UI improvements, profile management
3. **Level 3 – Advanced Implementation**: Complex formatting, interactive viewers, responsive design
4. **Level 4 – Ultra Advanced Implementation**: Testing, validation, CI/CD, accessibility
5. **Post-Level 4**: Analytics, caching, rate limiting

## Documentation

Detailed documentation for setup, API endpoints, and usage can be found in the respective directories.

## License

[MIT](LICENSE)
