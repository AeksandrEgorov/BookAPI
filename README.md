## 📚 Book API

---

## 📖 Description

Book API is a TypeScript REST API for managing books, authors, publishers, and reviews.

The project supports two data sources:

* Mock (faker) — for testing without a database
* Prisma (PostgreSQL) — for working with a real database

### Features

* CRUD operations for books
* Filtering (title, language, year, author, genre)
* Pagination and sorting
* Reviews for books
* Average rating calculation
* Validation using Zod
* Unified error handling
* Swagger API documentation
* Easy switching between data sources

---

## 📸 Screenshots

![Swagger](./backend/images/swagger.png)

---

## 🧰 Technologies Used

* TypeScript
* Node.js / Express
* Prisma ORM
* PostgreSQL
* Zod
* Swagger (OpenAPI)
* Faker

---

## ⚙️ Setup & Configuration

### 1. Install dependencies
```
npm install
```
---

### 2. Configure .env

Create a `.env` file:

DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=bookapi"

Important:

* Schema must match `schema.prisma`. !! schemas  = ["bookapi"] and @@schema("bookapi") must be changed according to your database schema.
* Schema name used in this project: **bookapi**
* Create schema in the database before migrations

Example:

CREATE SCHEMA bookapi;

---

### 3. Prisma setup

Generate Prisma Client:
```
npx prisma generate
```
Run migrations:
```
npx prisma migrate dev --name init
```
Seed the database:
```
npm run seed
```
---

## 🚀 Running the Project

Before running the project, you need to compile it. Otherwise use developer mode commands.

### Compile project
```
npm run build or tsc or npx tsc
```
### Run with Mock data
```
npm run start:mock
```
or developer mode
```
npm run dev:mock
```
---

### Run with Prisma (PostgreSQL)
```
npm run start:prisma
```
or developer mode
```
npm run dev:prisma
```
---

After starting the server you will see:

Server is running on [http://localhost:3000](http://localhost:3000)
Swagger docs: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🧪 Testing the API

You can test the API in several ways:

### 1. Swagger (recommended)

Open in browser:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

### 2. Thunder Client (VS Code)

* Install Thunder Client extension
* Send requests (GET, POST, PUT, DELETE) to:
  [http://localhost:3000](http://localhost:3000)

---

### 3. Local testing

You can also test endpoints directly in browser (GET requests)

---

## 🔁 Data Source Switching

Switching is handled automatically:

* `npm run start:mock` → uses mock data
* `npm run start:prisma` → uses PostgreSQL

---

## 📡 API Features

* CRUD operations for books
* Filtering:

  * title
  * language
  * year
  * author
  * genre
* Pagination
* Sorting
* Reviews
* Average rating

---

## ❗ Error Handling

Example:
```
{
"error": "Validation failed",
  "details": [
    {
    "field": "isbn",
    "message": "Book with this ISBN already exists"
    }
  ]
}
```
Handled errors:

* Zod validation errors
* Prisma errors (P2002, P2003, P2025)
* Internal server errors

---

## 🗂 Project Structure
```
BookAPI/
├─ prisma/
│  ├─ migrations/
│  ├─ schema.prisma
│  └─ seed.ts
├─ src/
│  ├─ config/
│  │  ├─ prisma.ts
│  │  └─ repositories.ts
│  ├─ data/
│  ├─ docs/
│  │  └─ swagger.ts
│  ├─ generated/
│  │  └─ prisma/
│  ├─ interfaces/
│  ├─ middleware/
│  ├─ models/
│  ├─ repositories/
│  ├─ routes/
│  ├─ services/
│  ├─ validators/
│  │
│  ├─ app.ts
│  └─ index.ts
│
├─ .env
├─ .env.example
├─ package.json
├─ prisma.config.ts
└─ tsconfig.json
```
---

## 📌 Notes

* Prisma uses custom schema: **bookapi**
* Mock mode allows running API without database
* Architecture supports easy switching between data sources
