# 📚 Library Management API

A **Library Management System** built using **Express**, **TypeScript**, and **MongoDB (Mongoose)**.
This API allows you to manage books, borrow records, and track availability with proper schema validation, middleware, and aggregation.

---

## 🚀 Features

- **Book Management**: Create, update, delete, and view books.
- **Borrowing System**: Borrow books with availability checks.
- **Aggregation**: Summarized borrowed book data with total quantities.
- **Schema Validation**: Enforced using Mongoose with enums, required fields, and constraints.
- **Business Logic**: Automatic availability status updates when stock runs out.
- **Middleware**: Pre and post-save hooks for Mongoose models.
- **Filtering & Sorting**: Get books with filtering by genre, sorting, and limiting results.

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Validation**: Mongoose schema validation
- **Environment Management**: dotenv

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/nahidbinwadood/library-management.git
cd library-management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root with:

```env
PORT=7000
DATABASE_URL= Add your Database Url
```

### 4. Run the application

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

---

## 📌 API Endpoints

### 📚 Books

| Method | Endpoint             | Description                   |
| ------ | -------------------- | ----------------------------- |
| POST   | `/api/books`         | Create a new book             |
| GET    | `/api/books`         | Get all books (filter & sort) |
| GET    | `/api/books/:bookId` | Get a book by ID              |
| PUT    | `/api/books/:bookId` | Update a book                 |
| DELETE | `/api/books/:bookId` | Delete a book                 |

---

### 📖 Borrow

| Method | Endpoint      | Description                |
| ------ | ------------- | -------------------------- |
| POST   | `/api/borrow` | Borrow a book              |
| GET    | `/api/borrow` | Get borrowed books summary |

---

## 🔍 Query Parameters (Books)

- **`filter`**: Filter by genre (`FICTION`, `NON_FICTION`, `SCIENCE`, `HISTORY`, `BIOGRAPHY`, `FANTASY`)
- **`sort`**: Sorting order (`asc` or `desc`)
- **`sortBy`**: Field to sort by (e.g., `createdAt`, `title`)
- **`limit`**: Limit number of results (default: 10)

Example:

```
/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5
```

---

## 📄 Example Requests & Responses

### 1. Create Book

**POST** `/api/books`

```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5,
  "available": true
}
```

**Response**

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "68977450926a1eb88a975217",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2025-08-09T16:16:16.979Z",
    "updatedAt": "2025-08-09T16:16:16.979Z"
  }
}
```

---

### 2. Borrow a Book

**POST** `/api/borrow`

```json
{
  "book": "68977450926a1eb88a975217",
  "quantity": 1,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

**Response**

```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "_id": "68977582531756c36f8009a3",
    "book": "68977450926a1eb88a975217",
    "quantity": 1,
    "dueDate": "2025-07-18T00:00:00.000Z",
    "createdAt": "2025-08-09T16:21:22.371Z",
    "updatedAt": "2025-08-09T16:21:22.371Z"
  }
}
```

---

### 3. Borrowed Books Summary

**GET** `/api/borrow`

```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "Tales of the Ocean",
        "isbn": "9780451520018"
      },
      "totalQuantity": 4
    },
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 2
    }
  ]
}
```

---

## ⚠ Error Response Format

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a positive number",
        "name": "ValidatorError",
        "properties": {
          "message": "Copies must be a positive number",
          "type": "min",
          "min": 0
        },
        "kind": "min",
        "path": "copies",
        "value": -5
      }
    }
  }
}
```

---
