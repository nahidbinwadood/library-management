# 📚 Library Management API

A **Library Management System** built using **Express**, **TypeScript**, and **MongoDB (Mongoose)**.
This API allows you to manage books, borrow records, and track availability with proper schema validation, middleware, and aggregation.

---

## 🚀 Features

- **Book Management**: Create, update, delete, and view books.
- **Advanced Filtering & Search**: Filter by genre, free-text search, sorting, and pagination.
- **Borrowing System**: Borrow books with availability checks and detailed analytics.
- **Enhanced Analytics**: Comprehensive statistics and insights for both books and borrowing patterns.
- **Aggregation Pipeline**: Advanced MongoDB aggregation for performance and detailed summaries.
- **Schema Validation**: Enforced using Mongoose with enums, required fields, and constraints.
- **Business Logic**: Automatic availability status updates when stock runs out.
- **Middleware**: Pre and post-save hooks for Mongoose models.
- **Pagination Support**: Efficient data pagination with metadata.

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

## 🔍 Enhanced Query Parameters

### Books Endpoint (`/api/books`)

- **`filter`**: Filter by genre (`FICTION`, `NON_FICTION`, `SCIENCE`, `HISTORY`, `BIOGRAPHY`, `FANTASY`, `all`)
- **`search`**: Free-text search in book titles (case-insensitive)
- **`sort`**: Sorting order (`asc` or `desc`)
- **`sortBy`**: Field to sort by (e.g., `createdAt`, `title`, `author`, `copies`)
- **`page`**: Page number for pagination (default: 1)
- **`limit`**: Number of results per page (default: 10)

**Example:**

```
/api/books?filter=FANTASY&search=dragon&sortBy=createdAt&sort=desc&page=1&limit=5
```

### Borrow Endpoint (`/api/borrow`)

- **`sort`**: Sorting order (`asc` or `desc`)
- **`sortBy`**: Field to sort by (`totalQuantity`, `book.title`)
- **`page`**: Page number for pagination (default: 1)
- **`limit`**: Number of results per page (default: 10)

**Example:**

```
/api/borrow?sortBy=totalQuantity&sort=desc&page=1&limit=10
```

---

## 📄 Enhanced API Responses

### 1. Get All Books (Enhanced)

**GET** `/api/books?filter=SCIENCE&page=1&limit=5`

```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [
    {
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
  ],
  "pagination": {
    "total": 15,
    "totalPages": 3,
    "currentPage": 1,
    "pageSize": 5
  },
  "stats": {
    "totalBooks": 15,
    "totalCopies": 75,
    "borrowed": 23,
    "availableBooks": 52
  }
}
```

### 2. Create Book

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

### 3. Borrow a Book

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

### 4. Enhanced Borrowed Books Summary

**GET** `/api/borrow?sortBy=totalQuantity&sort=desc&page=1&limit=5`

```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "id": "68977450926a1eb88a975217",
        "title": "Tales of the Ocean",
        "isbn": "9780451520018"
      },
      "totalQuantity": 4
    },
    {
      "book": {
        "id": "68977450926a1eb88a975218",
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 2
    }
  ],
  "pagination": {
    "total": 8,
    "totalPages": 2,
    "currentPage": 1,
    "pageSize": 5
  },
  "stats": {
    "uniqueTitlesBorrowed": 8,
    "totalBorrowedCopies": 23,
    "averageCopiesPerBook": 2,
    "mostPopularBook": "Tales of the Ocean",
    "mostPopularBookCopies": 4
  }
}
```

---

## 🎯 New Features Explained

### 📊 Enhanced Analytics

**Books Statistics:**

- **Total Books**: Count of all books in the library
- **Total Copies**: Sum of all book copies available
- **Borrowed**: Number of copies currently borrowed
- **Available Books**: Number of copies currently available

**Borrowing Analytics:**

- **Unique Titles Borrowed**: Number of different book titles borrowed
- **Total Borrowed Copies**: Total number of book copies borrowed
- **Average Copies Per Book**: Average borrowing rate per book
- **Most Popular Book**: Book with highest borrowing count

### 🔍 Advanced Search & Filtering

- **Genre Filtering**: Filter books by specific genres or view all
- **Free-text Search**: Search books by title with case-insensitive matching
- **Flexible Sorting**: Sort by any field in ascending or descending order
- **Smart Pagination**: Efficient data pagination with comprehensive metadata

### 🚀 Performance Optimizations

- **MongoDB Aggregation**: Uses advanced aggregation pipelines for efficient data processing
- **Faceted Search**: Single query returns data, count, and statistics
- **Optimized Queries**: Reduced database calls through intelligent query design

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

## 📚 Usage Examples

### Search for Fantasy Books

```bash
GET /api/books?filter=FANTASY&sortBy=title&sort=asc
```

### Find Books with "Dragon" in Title

```bash
GET /api/books?search=dragon&limit=5
```

### Get Most Borrowed Books

```bash
GET /api/borrow?sortBy=totalQuantity&sort=desc
```

### Paginated Book List

```bash
GET /api/books?page=2&limit=10&sortBy=createdAt&sort=desc
```
