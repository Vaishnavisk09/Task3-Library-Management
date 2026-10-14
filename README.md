# Book REST API

A clean, beginner-friendly REST API built with Node.js and Express.js that supports full CRUD operations on a collection of books stored in memory.

**Web Development Internship - Task 3**

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [API Reference](#api-reference)
- [Postman Testing Guide](#postman-testing-guide)
- [HTTP Status Codes](#http-status-codes)
- [Error Handling](#error-handling)
- [Troubleshooting](#troubleshooting)
- [GitHub Submission](#github-submission)

---

## Overview

This project implements a RESTful API that allows you to manage a collection of books. Each book has a unique ID, a title, and an author. Data is stored in a JavaScript array (in-memory), so no database is required.

---

## Features

- Get all books - returns the complete book list
- Add a new book - validates input and auto-generates a unique ID
- Update an existing book - updates title and author by ID
- Delete a book - removes a book by ID
- Input validation - catches missing fields and empty strings
- Error handling - clear JSON error messages for every failure case
- Unique IDs - never reuses IDs even after deletion
- Consistent JSON responses - every response has `success`, `message`, and `data`

---

## Technology Stack

| Technology | Purpose                                   |
|------------|-------------------------------------------|
| Node.js    | JavaScript runtime environment            |
| Express.js | Web framework for routing and middleware  |
| JavaScript | Programming language                      |
| JSON       | Request and response data format          |
| Postman    | API testing tool                          |

---

## Project Structure

```
Task3-Library Management/
├── server.js          <- Main server file with all API routes
├── package.json       <- Project metadata and npm scripts
├── package-lock.json  <- Auto-generated dependency lockfile
├── README.md          <- Project documentation (this file)
└── .gitignore         <- Files excluded from Git
```

---

## Installation and Setup

### Prerequisites

Make sure you have Node.js installed. You can check by running:

```bash
node --version
```

If Node.js is not installed, download it from https://nodejs.org

### Step 1 - Install Dependencies

```bash
npm install
```

This installs Express.js (the only required package).

### Step 2 - Start the Server

```bash
npm start
```

You should see:

```
-----------------------------------------
  Book REST API - Server is running
  URL : http://localhost:3000
  GET  http://localhost:3000/books
-----------------------------------------
```

### Development Mode (auto-restart on file change)

```bash
npm run dev
```

> Note: `npm run dev` uses Node.js built-in `--watch` flag. This requires Node.js v18.11.0 or later.

---

## API Reference

**Base URL:** `http://localhost:3000`

### Book Object Structure

```json
{
  "id": 1,
  "title": "The Alchemist",
  "author": "Paulo Coelho"
}
```

### Endpoints

| Method | Endpoint     | Description           | Success Code |
|--------|--------------|-----------------------|--------------|
| GET    | /books       | Get all books         | 200 OK       |
| POST   | /books       | Create a new book     | 201 Created  |
| PUT    | /books/:id   | Update a book by ID   | 200 OK       |
| DELETE | /books/:id   | Delete a book by ID   | 200 OK       |

---

### GET /books

Returns the complete list of all books.

**Request:**

```
GET http://localhost:3000/books
```

**Success Response - 200 OK:**

```json
{
  "success": true,
  "message": "Books retrieved successfully.",
  "count": 3,
  "data": [
    { "id": 1, "title": "The Alchemist",         "author": "Paulo Coelho"       },
    { "id": 2, "title": "To Kill a Mockingbird", "author": "Harper Lee"         },
    { "id": 3, "title": "The Great Gatsby",       "author": "F. Scott Fitzgerald" }
  ]
}
```

---

### POST /books

Creates a new book. Both `title` and `author` are required and must be non-empty strings.

**Request:**

```
POST http://localhost:3000/books
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Atomic Habits",
  "author": "James Clear"
}
```

**Success Response - 201 Created:**

```json
{
  "success": true,
  "message": "Book created successfully.",
  "data": {
    "id": 4,
    "title": "Atomic Habits",
    "author": "James Clear"
  }
}
```

**Error Response - 400 Bad Request (missing field):**

```json
{
  "success": false,
  "message": "Validation failed. Please check the request body.",
  "errors": [
    "\"author\" field is required."
  ]
}
```

---

### PUT /books/:id

Updates an existing book's title and author using its ID.

**Request:**

```
PUT http://localhost:3000/books/1
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Updated Book Title",
  "author": "Updated Author Name"
}
```

**Success Response - 200 OK:**

```json
{
  "success": true,
  "message": "Book updated successfully.",
  "data": {
    "id": 1,
    "title": "Updated Book Title",
    "author": "Updated Author Name"
  }
}
```

**Error Response - 404 Not Found:**

```json
{
  "success": false,
  "message": "Book with ID 999 was not found."
}
```

---

### DELETE /books/:id

Deletes a book by its ID.

**Request:**

```
DELETE http://localhost:3000/books/1
```

**Success Response - 200 OK:**

```json
{
  "success": true,
  "message": "Book deleted successfully.",
  "data": {
    "id": 1,
    "title": "The Alchemist",
    "author": "Paulo Coelho"
  }
}
```

**Error Response - 404 Not Found:**

```json
{
  "success": false,
  "message": "Book with ID 1 was not found."
}
```

---

## Postman Testing Guide

### Setup

1. Download Postman from https://www.postman.com/downloads
2. Start the server: `npm start`
3. Test each endpoint as described below.

---

### Test 1 - GET all books

| Setting | Value                          |
|---------|--------------------------------|
| Method  | GET                            |
| URL     | http://localhost:3000/books    |

Click **Send**. You should see a `200 OK` response with 3 pre-loaded books.

---

### Test 2 - POST a new book

| Setting | Value                          |
|---------|--------------------------------|
| Method  | POST                           |
| URL     | http://localhost:3000/books    |
| Body    | raw > JSON                     |

**Body:**

```json
{
  "title": "Atomic Habits",
  "author": "James Clear"
}
```

Click **Send**. You should see `201 Created` with the new book including its auto-generated ID.

---

### Test 3 - POST with missing fields (validation test)

Send an incomplete body:

```json
{
  "title": "Incomplete Book"
}
```

Expected result: `400 Bad Request` with `"author" field is required.`

---

### Test 4 - PUT (update a book)

| Setting | Value                            |
|---------|----------------------------------|
| Method  | PUT                              |
| URL     | http://localhost:3000/books/1    |
| Body    | raw > JSON                       |

**Body:**

```json
{
  "title": "Updated Book",
  "author": "Updated Author"
}
```

Expected result: `200 OK` with the updated book.

---

### Test 5 - PUT with a nonexistent ID

Change the URL to `http://localhost:3000/books/999` and send the same body.

Expected result: `404 Not Found`.

---

### Test 6 - DELETE a book

| Setting | Value                            |
|---------|----------------------------------|
| Method  | DELETE                           |
| URL     | http://localhost:3000/books/2    |

Expected result: `200 OK` with the deleted book's details.

---

### Test 7 - DELETE again (already deleted)

Send the same DELETE to `http://localhost:3000/books/2` again.

Expected result: `404 Not Found` because the book was already deleted.

---

## HTTP Status Codes

| Code | Meaning               | When It Occurs                              |
|------|-----------------------|---------------------------------------------|
| 200  | OK                    | GET all books, successful PUT, DELETE       |
| 201  | Created               | Successful POST                             |
| 400  | Bad Request           | Missing/empty fields, malformed JSON        |
| 404  | Not Found             | Book ID not found, unknown route            |
| 500  | Internal Server Error | Unexpected runtime error                    |

---

## Error Handling

The API handles the following error cases:

| Scenario                                | HTTP Code |
|-----------------------------------------|-----------|
| Missing title or author                 | 400       |
| Empty string for title or author        | 400       |
| Book ID does not exist                  | 404       |
| Invalid ID format (e.g., /books/abc)    | 400       |
| Unknown URL route                       | 404       |
| Malformed JSON body                     | 400       |

---

## Troubleshooting

**Problem: Cannot find module 'express'**
Solution: Run `npm install` first to install dependencies.

**Problem: Port 3000 is already in use**
Solution: Stop any other application using port 3000, or change `const PORT = 3000` in server.js to another port number (e.g., 3001).

**Problem: Postman shows "Could not get a response"**
Solution: Make sure the server is running. Check your terminal for the startup message.

**Problem: npm run dev shows an error**
Solution: Upgrade Node.js to v18.11.0 or later. Use `npm start` in the meantime.

**Problem: Book list resets on restart**
Explanation: This is expected. Data lives in memory by design - no database is used.

---

## GitHub Submission

### Step 1 - Initialize Git

```bash
git init
git add .
git commit -m "Initial commit: Book REST API with full CRUD"
```

### Step 2 - Create a GitHub Repository

1. Go to https://github.com/new
2. Name the repo: `Task3-Book-REST-API`
3. Leave it Public
4. Do NOT check "Initialize with README" (we already have one)
5. Click Create repository

### Step 3 - Push the Code

```bash
git remote add origin https://github.com/<your-username>/Task3-Book-REST-API.git
git branch -M main
git push -u origin main
```

### Step 4 - Screenshots to Capture as Proof

Take screenshots of:

1. Terminal showing the server startup message
2. Postman: GET /books returning 200 with the book list
3. Postman: POST /books returning 201 with the new book
4. Postman: PUT /books/1 returning 200 with updated data
5. Postman: DELETE /books/2 returning 200
6. Postman: PUT /books/999 returning 404
7. GitHub repository page showing your code

---

*Built with Node.js and Express.js - Web Development Internship Task 3*
