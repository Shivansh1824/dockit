# Docket: Team Task Management Platform

A full-stack, enterprise-grade team task management system built with Spring
Boot and React, featuring role-based access control, RESTful APIs, and modern UI
design.

## 🚀 Features

- **Authentication**: Secure login/registration with JWT (JSON Web Tokens).
- **Role-Based Access Control**: Distinguish between Admin, Manager, and
  Employee roles.
- **Project Management**:
  - Create, view, update, and delete projects.
  - Assign multiple managers to projects.
- **Task Management**:
  - Create, view, update, and delete tasks within projects.
  - Assign tasks to specific users.
- **RESTful APIs**: Well-documented endpoints for all core functionalities.
- **Modern UI**: Clean and intuitive user interface with React and Tailwind CSS.

## 💻 Tech Stack

### Backend

- **Core**: Java 17
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security (JWT)
- **Database**: PostgreSQL (or H2 for development)
- **ORM**: Spring Data JPA
- **API Documentation**: SpringDoc OpenAPI (Swagger)
- **Build Tool**: Maven

### Frontend

- **Framework**: React
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect, useContext)
- **API Client**: Axios
- **Build Tool**: Vite

## 📂 Project Structure

```
docket/
├── src/main/java/com/ethara/docket/       # Spring Boot Backend
│   ├── controller/      # REST API Controllers
│   ├── dto/             # Data Transfer Objects
│   ├── entity/          # JPA Entities
│   ├── repository/      # Spring Data Repositories
│   ├── security/        # Security Configurations (JWT, Auth)
│   ├── service/         # Business Logic
│   └── DocketApplication.java  # Main Application Class
├── src/main/resources/  # Configuration (application.properties)
├── src/main/webapp/     # Static Web Content (React)
│   ├── index.html
│   └── index.js
├── src/main/webapp/assets/   # Images, styles, fonts
├── src/main/webapp/components/ # Reusable UI Components
├── src/main/webapp/context/    # Global State (Auth Context)
├── src/main/webapp/services/   # API Service layer
├── src/main/webapp/screens/    # Main pages (Login, Projects, etc.)
├── src/main/webapp/App.js      # Root Component
└── docker-compose.yml         # Docker Configuration
```

## 🛠️ Prerequisites

- **Java 17** or higher
- **Node.js** 16.x or higher
- **npm** (or yarn)
- **Maven** (optional, for backend builds)
- **Docker** (optional, for containerized deployment)
- **PostgreSQL** (optional, for production database)

## 🏃‍♀️ Getting Started

### Option 1: Run with Docker (Recommended)

The `docker-compose.yml` file sets up both the backend and frontend services
automatically.

1. **Start the application**:
   ```bash
   docker compose up --build -d
   ```

2. **Access the app**:
   - **Frontend**: http://localhost:5173
   - **API Documentation**: http://localhost:8080/swagger-ui/index.html

3. **Stop the application**:
   ```bash
   docker compose down
   ```

### Option 2: Local Development

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd src/main/java/com/ethara/docket
   ```

2. Build the project:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on port 8080.

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd src/main/webapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will start on port 5173.

## 📂 Seed Data (Default Users)

After starting the application, you can log in with the following default
credentials:

| Role         | Email           | Password    | Description               |
| :----------- | :-------------- | :---------- | :------------------------ |
| **Admin**    | [EMAIL_ADDRESS] | admin123    | Full system access        |
| **Manager**  | [EMAIL_ADDRESS] | manager123  | Project & task management |
| **Employee** | [EMAIL_ADDRESS] | employee123 | View assigned tasks       |

## 🧩 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user profile

### Projects

- `GET /api/projects` - Get all projects (Admin/Manager)
- `POST /api/projects` - Create a new project (Admin/Manager)
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project (Admin only)
- `POST /api/projects/{id}/assign` - Assign managers to project

### Tasks

- `GET /api/tasks` - Get all tasks (Admin/Manager)
- `POST /api/tasks` - Create a new task (Admin/Manager)
- `GET /api/tasks/{id}` - Get task details
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `GET /api/tasks/user/{userId}` - Get tasks assigned to a user

## 🚀 Deployment

For production deployment, consider:

1. Using a production database (PostgreSQL/MySQL).
2. Configuring environment variables (`application.properties`).
3. Building optimized Docker images.
4. Setting up HTTPS with a reverse proxy (e.g., Nginx).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.
