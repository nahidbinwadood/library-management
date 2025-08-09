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
git clone https://github.com/yourusername/library-management-api.git
cd library-management-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root with:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/library
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
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

---

### 2. Borrow a Book

**POST** `/api/borrow`

```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

**Response**

```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "_id": "64bc4a0f9e1c2d3f4b5a6789",
    "book": "64ab3f9e2a4b5c6d7e8f9012",
    "quantity": 2,
    "dueDate": "2025-07-18T00:00:00.000Z",
    "createdAt": "2025-06-18T07:12:15.123Z",
    "updatedAt": "2025-06-18T07:12:15.123Z"
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
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    },
    {
      "book": {
        "title": "1984",
        "isbn": "9780451524935"
      },
      "totalQuantity": 3
    }
  ]
}
```

---

## ⚠ Error Response Format

```json
{
  "message": "Validation failed",
  "success": false,
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

## 🏆 Bonus Implementations

- Clean, maintainable code with clear naming conventions.
- Strictly matching API response formats.
- Proper error handling for 404s, invalid IDs, and validation errors.
- Professional README (this file).

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
