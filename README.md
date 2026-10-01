## 🐳 Docker Deployment (Zero-Setup Environment)

For evaluation purposes, this project includes a complete Docker Compose configuration. The orchestration automatically provisions the MySQL database, Laravel API, and Next.js frontend, handling all environment setup, database migrations, and initial seeding without manual intervention.

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine installed and running.

### 1. Boot the Application
Open your terminal in the root directory of the project and run:

```bash
docker-compose up -d --build
```
# Product Management System

A full-stack product management application built with Laravel and Next.js. This repository contains both the REST API backend and the Server-Side Rendered (SSR) frontend, designed to demonstrate scalable enterprise architecture, secure JWT authentication, and responsive UX.

email :- test@example.com
password :- password

## 🚀 Tech Stack

**Backend (API):**
* Laravel (Layered Architecture: Controllers, Services, Repositories)
* MySQL / SQLite
* JWT Authentication (`php-open-source-saver/jwt-auth`)
* PHPUnit for Feature & Unit Testing

**Frontend (Web):**
* Next.js (App Router, SSR)
* React & TypeScript
* Tailwind CSS for responsive styling
* Axios for data fetching & interceptors
* React Hot Toast / Sonner for global notifications

---

## ✨ Key Features

* **Role-Based Dashboards:** Distinct views for Public Users (read-only) and System Admins (full CRUD capabilities).
* **Asynchronous Image Processing:** Implements a two-step "upload-first" pattern. Images stream to the server asynchronously with real-time progress tracking before the final product record is saved.
* **Server-Side Rendering (SSR) & Filtering:** SEO-friendly detail pages and a master dashboard featuring server-side category and price range filtering.
* **Seamless UX:** Product creation and updates are handled via modal forms without page reloads, complete with inline API validation error mapping (HTTP 422).
* **Decoupled Architecture:** Strict separation of concerns on the backend using the Repository Pattern to interface with the database, and Service classes to handle business logic.

---

## 🛠️ Installation & Setup

### Prerequisites
* PHP 8.2+ and Composer
* Node.js 18+ and npm/yarn
* MySQL (or SQLite for quick testing)

### 1. Backend Setup (Laravel)
Open your terminal and navigate to the backend directory:

```bash
cd backend

# Install PHP dependencies
composer install

# Setup environment variables
cp .env.example .env

# Generate application and JWT secret keys
php artisan key:generate
php artisan jwt:secret

# Create the symbolic link for local image storage
php artisan storage:link