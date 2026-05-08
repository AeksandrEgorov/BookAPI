# 📚 Book API

---

## 📖 Description

Book API is a full-stack TypeScript project for managing books, authors, publishers, and reviews.

The project consists of:

* **Backend** — REST API built with Node.js, Express, Prisma, PostgreSQL, Zod, and Swagger
* **Frontend** — React application built with Vite, TypeScript, Tailwind CSS, Axios, and React Router

The backend supports two data sources:

* **Mock (faker)** — for testing without a database
* **Prisma (PostgreSQL)** — for working with a real database

### Features

* CRUD operations for books
* Filtering by title, language, year, author, and genre
* Pagination and sorting
* Book details page
* Reviews for books
* Average rating calculation
* Add book form in modal window
* Edit book form in modal window
* Add review form in modal window
* Delete confirmation modal
* Validation using Zod
* Unified error handling
* Swagger API documentation
* Easy switching between mock and database data sources

---

## 🔗 Project Links

Deploy töötab mock andmetega (Renderis on ka võimalus kasutada prisma, seal on postgre andmebaas tennus)

Render võtab laadimiseks aega, kuna see on tasuta plaan ja teenus läheb magama, kui seda kaua ei kasutata.

### Frontend deploy

[https://book-api-virid.vercel.app/books](https://book-api-virid.vercel.app/books)

### Backend deploy

[https://restapi-graphql.onrender.com/](https://restapi-graphql.onrender.com/)

### Swagger documentation

[https://restapi-graphql.onrender.com/api-docs](https://restapi-graphql.onrender.com/api-docs)

---
Backend

## 📸 Screenshots

![Swagger](./backend/images/swagger.png)
---
Frontend

![Books Page](./frontend/images/bookspage.png)
![Book Details Page](./frontend/images/bookdetail.png)
![Add book modal](./frontend/images/addbook.png)
![Add review modal](./frontend/images/bookrating.png)

---

## 🧰 Technologies Used

### Backend

* TypeScript
* Node.js / Express
* Prisma ORM
* PostgreSQL
* Zod
* Swagger / OpenAPI
* Faker
* CORS

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS v4
* Axios
* React Router
* AbortController

---

## 🗂 Project Structure

```
BookAPI/
├─ backend/
│  ├─ prisma/
│  │  ├─ migrations/
│  │  ├─ schema.prisma
│  │  └─ seed.ts
│  │
│  ├─ src/
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ data/
│  │  ├─ docs/
│  │  ├─ generated/
│  │  ├─ interfaces/
│  │  ├─ middleware/
│  │  ├─ models/
│  │  ├─ repositories/
│  │  ├─ routes/
│  │  ├─ services/
│  │  ├─ validators/
│  │  ├─ app.ts
│  │  └─ index.ts
│  │
│  ├─ images/
│  ├─ .env
│  ├─ .env.example
│  ├─ package.json
│  ├─ prisma.config.ts
│  └─ tsconfig.json
│
├─ frontend/
│  ├─ src/
│  │  ├─ api/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ types/
│  │  ├─ App.tsx
│  │  ├─ main.tsx
│  │  └─ index.css
│  │
│  ├─ .env
│  ├─ .env.example
│  ├─ index.html
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ vite.config.ts
│
├─ README.md
└─ .gitignore
```

---

## 🚀 Running the Project Locally

Install dependencies separately in both folders:

* `backend`
* `frontend`

---

# Backend

## ⚙️ Backend Setup & Configuration

### 1. Install dependencies

```
cd backend
npm install
```

---

### 2. Configure `.env`

Create a `.env` file inside the `backend` folder:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=bookapi"
DATA_SOURCE=prisma
```

Important:

* Schema in `DATABASE_URL` must match `schema.prisma`
* In this project, the schema name is: **bookapi**
* If you change schema name, also change:
  * `schemas = ["bookapi"]`
  * `@@schema("bookapi")`

Create schema in the database before migrations:

```
CREATE SCHEMA bookapi;
```

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

## ▶️ Run Backend

### Run with mock data

```
npm run dev:mock
```

or compiled mode:

```
npm run start:mock
```

### Run with Prisma and PostgreSQL

```
npm run dev:prisma
```

or compiled mode:

```
npm run start:prisma
```

After starting the backend locally:

* Server: [http://localhost:3000](http://localhost:3000)
* Swagger: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

# Frontend

## ⚙️ Frontend Setup & Configuration

### 1. Install dependencies

```
cd frontend
npm install
```

---

### 2. Configure `.env`

Create a `.env` file inside the `frontend` folder.

For local backend:

```
VITE_API_URL=http://localhost:3000/api/v1
```

For deployed backend:

```
VITE_API_URL=https://restapi-graphql.onrender.com/api/v1
```

---

## ▶️ Run Frontend

Development mode:

```
npm run dev
```

or compiled mode:

```
npm run preview
```

After starting the frontend locally:

[http://localhost:5173/books](http://localhost:5173/books)

---

## 🧪 Testing the API

You can test the backend API in several ways.

### 1. Swagger

Local Swagger:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Deployed Swagger:

[https://restapi-graphql.onrender.com/api-docs](https://restapi-graphql.onrender.com/api-docs)

---

### 2. Thunder Client or Postman

Send requests to local backend:

[http://localhost:3000](http://localhost:3000)

or deployed backend:

[https://restapi-graphql.onrender.com](https://restapi-graphql.onrender.com)

---

## 🔁 Data Source Switching

Backend data source is controlled by npm scripts.

* `npm run dev:mock` → uses mock data
* `npm run dev:prisma` → uses PostgreSQL through Prisma
* `npm run start:mock` → uses mock data in compiled mode
* `npm run start:prisma` → uses PostgreSQL in compiled mode

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

## 🖥 Frontend Features

### `/books`

* Books list as cards
* Filtering by:
  * title
  * year
  * language
* Sorting by:
  * title
  * year
* Pagination
* Add book modal
* View book button
* Delete confirmation modal
* Success and error messages

### `/books/:id`

* Full book details
* Average rating
* Reviews list
* Add review modal
* Edit book modal
* Delete confirmation modal
* Back button

---

## ❗ Error Handling

Example error response:

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
* Prisma errors:
  * P2002
  * P2003
  * P2025
* Internal server errors

---

## 📌 Notes

* Backend uses a custom Prisma schema: **bookapi**
* Mock mode allows running API without a database
* Frontend uses `VITE_API_URL` to connect to backend
* Frontend forms are implemented with modal windows
* Architecture supports easy switching between data sources
