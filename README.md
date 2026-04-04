# Smart Inventory & Order Management System (Backend)

A robust backend API for managing products, inventory, orders, and fulfillment workflows. Built with Node.js, Express, TypeScript, and MongoDB, it provides secure, scalable, and well-structured services for handling business logic and data operations.

---

---

## Features

### Authentication

- User signup and login
- JWT-based authentication
- Secure password handling
- Protected routes with middleware

---

### Product & Category Management

- Create and fetch product categories
- CRUD operations for products
- Product fields:
  - Name
  - Category (reference)
  - Price
  - Stock quantity
  - Minimum stock threshold
  - Status (Active / Out of Stock)
- Auto-update product status based on stock

---

### Order Management

- Create, update, cancel, and view orders
- Support for multiple products per order
- Automatic total price calculation
- Order statuses:
  - Pending
  - Confirmed
  - Shipped
  - Delivered
  - Cancelled

#### Validations

- Prevent duplicate products in a single order
- Prevent ordering inactive products
- Ensure stock availability before confirmation

---

### Stock Handling

- Deduct stock only when order is **confirmed**
- Restore stock when order is **cancelled**
- Auto-update product status when stock reaches zero

---

### Restock Queue (Low Stock Management)

- Automatically add products to restock queue when:
- stock < minimumStockThreshold
- Priority levels:
- High
- Medium
- Low
- Manual stock updates
- Remove items from queue after restocking

---

### Dashboard & Analytics

- Total orders today
- Revenue today
- Pending vs completed orders
- Low stock product count

---

### Activity Log

- Tracks system actions such as:
- Order creation
- Stock updates
- Restock events
- Stores recent activity history

---

### Search, Filter & Pagination

- Search products and orders
- Filter by status, category, or date
- Pagination support for large datasets

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT
- **Validation:** Zod

---

## Project Structure

- src/
- ├── modules/
- │ ├── auth/
- │ ├── product/
- │ ├── category/
- │ ├── order/
- │ ├── restock/
- │ ├── dashboard/
- │ ├── activity/
- │
- ├── middleware/
- ├── models/
- ├── services/
- ├── controllers/
- ├── routes/
- ├── utils/
- └── app.ts

---

## API Endpoints

- /auth
- POST /signup
- POST /login

- /products
- GET /
- POST /
- PATCH /:id
- DELETE /:id

- /categories
- GET /
- POST /

- /orders
- GET /
- POST /
- PATCH /:id
- PATCH /:id/cancel

- /restock
- GET /
- PATCH /:id

- /dashboard
- GET /

- /activity
- GET /

---

## Business Logic

- Stock is deducted **only when an order is confirmed**
- Prevent duplicate product entries in orders
- Prevent ordering inactive products
- Automatically update product status based on stock
- Automatically add low-stock items to restock queue

---

## Order Flow

PENDING → CONFIRMED → SHIPPED → DELIVERED
↓
CANCELLED

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/Mehedy-Tanvir/smart-inventory-backend.git
cd smart-inventory-backend
```

---

## Install Dependencies

```bash
npm install
# or
yarn install
```

---

## Setup Environment Variables

Create a `.env` file in the root directory:

```bash
PORT=5000
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## Run Locally

```bash
npm run dev
# or
yarn dev
```

Server will run on:

```bash
http://localhost:5000
```

## Database Models

### User

- email
- password
- role

### Category

- name

### Product

- name
- categoryId
- price
- stock
- minStockThreshold
- status

### Order

- customerName
- products (array)
- totalPrice
- status

### Restock Queue

- productId
- currentStock
- priority

### Activity Log

- message
- createdAt

## Validation & Error Handling

- Request validation using Zod
- Centralized error handling
- Proper HTTP status codes
- Clear error messages for client

## Testing

- API testing via Postman

## Covers:

- Authentication
- CRUD operations
- Edge cases (stock limits, duplicates)

## Deployment

- Backend: Vercel
- Database: MongoDB Atlas

## Integration

This backend is designed to work seamlessly with the frontend:

Frontend Repository:

`https://github.com/Mehedy-Tanvir/smart-inventory-frontend.git`

## Final Notes

- Clean separation of concerns (controller → service → model)
- Scalable modular architecture
- Focus on real-world inventory logic and edge cases
- Easy to extend with features like:
- Role-based access
- Notifications
- Advanced analytics
