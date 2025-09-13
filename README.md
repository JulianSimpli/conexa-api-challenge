# Conexa Challenge API

REST API developed with NestJS for movie management with automatic synchronization from SWAPI (Star Wars API).

## 🚀 Running the Project Locally

### Prerequisites
- Node.js 20 or higher
- npm or yarn

### Steps to run

1. **Clone the repository**
```bash
git clone <repository-url>
cd conexa-challenge
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

4. **Setup the database**
```bash
npx prisma generate
npx prisma migrate dev
```

5. **Run in development mode**
```bash
npm run start:dev
```

The application will be available at `http://localhost:3000`

## ⚙️ Environment Variables Configuration

Create a `.env` file based on `.env.example` with the following variables:

```env
# Runtime environment
NODE_ENV=development

# Server port
PORT=3000

# SQLite database
DATABASE_URL=file:./dev.db

# JWT configuration
JWT_SECRET=your_very_secure_jwt_secret_here
JWT_EXPIRES_IN=1h

# Initial admin user
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=admin123
```

### 🔑 Initial Admin User

**IMPORTANT**: When starting the application, an admin user is automatically created with the credentials configured in the environment variables:

- **Email**: `admin@admin.com` (configurable via `ADMIN_EMAIL`)
- **Password**: `admin123` (configurable via `ADMIN_PASSWORD`)

This user is automatically created when the application starts through the seeding system. You can use these credentials to:
- Access endpoints that require admin permissions
- Create, edit and delete movies
- Execute manual synchronization with SWAPI

## 📖 API Documentation

Once the application is running, you can access the interactive Swagger documentation at:
- **URL**: `http://localhost:3000/api`

## 📚 API Endpoints

### Authentication (`/auth`)

#### `POST /auth/signup`
- **Description**: Register a new user

#### `POST /auth/signin`
- **Description**: User sign in
- **Response**: JWT token and user information

### Movies (`/movies`)

#### `GET /movies`
- **Description**: Get all movies with pagination
- **Query Parameters**: `page`, `limit`

#### `GET /movies/:id`
- **Description**: Get movie by ID
- **Authentication**: Required (Admin)

#### `POST /movies`
- **Description**: Create a new movie
- **Authentication**: Required (Admin)

#### `PATCH /movies/:id`
- **Description**: Update an existing movie
- **Authentication**: Required (Admin)

#### `DELETE /movies/:id`
- **Description**: Delete a movie
- **Authentication**: Required (Admin)

#### `POST /movies/sync`
- **Description**: Manual synchronization of movies from SWAPI
- **Authentication**: Required (Admin)

## Cron Job System

### Automatic SWAPI Synchronization

The application includes an automatic synchronization system with the Star Wars API (SWAPI) that:

- **Current Status**: Disabled (commented code)
- **Original Frequency**: Every minute (`@Cron(CronExpression.EVERY_MINUTE)`)

## 🗄️ Database

### Configuration
- **Type**: SQLite (local file)
- **Location**: `./dev.db` (configurable via `DATABASE_URL`)
- **ORM**: Prisma
- **Migrations**: Automatic in development

## 🔄 CI/CD Pipeline

### GitHub Actions

The project includes an automated pipeline that runs on every push to `main`:

#### Workflow: `.github/workflows/test.yml`

**Triggers**:
- Push to `main` branch
- Run tests