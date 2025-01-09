# Task Management App - Backend

A robust backend service for the Task Management application built with Express.js and MongoDB. This service provides RESTful APIs for managing tasks with features like CRUD operations, task reordering, and status management.

## Features

- 📝 Complete CRUD operations for tasks
- 🔄 Task reordering functionality
- ✅ Task completion status management
- 🔗 Task relationship support
- 🚀 RESTful API architecture
- 💾 MongoDB integration
- 🔒 Error handling and validation
- 🌐 CORS support

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB
- **ODM:** Mongoose
- **API Testing:** Postman
- **Input Validation:** Type validation with TypeScript
- **Development:** Nodemon for hot reloading

## Prerequisites

Before starting, make sure you have:

- Node.js 18.0 or later
- MongoDB installed locally or MongoDB Atlas account
- npm or yarn
- Postman (for testing)

## Installation

1. Clone the repository

```bash
git clone https://github.com/ykkhmrdn/task-management-backend.git
cd task-management/backend
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/task-management
PORT=5001
```

4. Start the development server

```bash
npm run dev
```

The server will be running at `http://localhost:5001`

## Project Structure

```
backend/
├── src/
│   ├── models/
│   │   └── Task.ts     # MongoDB schema and model
│   ├── controllers/
│   │   └── taskController.ts
│   ├── routes/
│   │   └── taskRoutes.ts
│   └── index.ts        # Main application file
├── .env
└── tsconfig.json
```

## API Endpoints

### Tasks

```typescript
// Test route
GET /api/health

// Get all tasks
GET /tasks

// Create new task
POST /tasks
Body: {
  "title": string,
  "description": string
}

// Update task
PUT /tasks/:id
Body: {
  "title"?: string,
  "description"?: string,
  "isCompleted"?: boolean
}

// Delete task
DELETE /tasks/:id

// Reorder tasks
PUT /tasks/reorder
Body: {
  "tasks": [
    {
      "id": string,
      "order": number
    }
  ]
}
```

## Development

The application uses `nodemon` for development which automatically restarts the server when files change:

```bash
npm run dev
```

## MongoDB Schema

```typescript
interface ITask {
  title: string;
  description: string;
  isCompleted: boolean;
  order: number;
  relatedTasks: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
```

## API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}
```

## Error Handling

The API implements a standardized error response format:

```typescript
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Production Build

To create and run a production build:

```bash
npm run build
npm start
```

## Testing

You can test the APIs using Postman. Import the provided Postman collection:

```bash
Task-Management-API.postman_collection.json
```

## API Documentation

### Create Task

- URL: `/tasks`
- Method: `POST`
- Body:
  ```json
  {
    "title": "Task Title",
    "description": "Task Description"
  }
  ```

### Get Tasks

- URL: `/tasks`
- Method: `GET`
- Response:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "...",
        "title": "Task Title",
        "description": "Task Description",
        "isCompleted": false,
        "order": 0,
        "createdAt": "2025-01-08T...",
        "updatedAt": "2025-01-08T..."
      }
    ]
  }
  ```

### Update Task

- URL: `/tasks/:id`
- Method: `PUT`
- Body:
  ```json
  {
    "isCompleted": true
  }
  ```

### Delete Task

- URL: `/tasks/:id`
- Method: `DELETE`

### Reorder Tasks

- URL: `/tasks/reorder`
- Method: `PUT`
- Body:
  ```json
  {
    "tasks": [
      {
        "_id": "task1_id",
        "order": 0
      },
      {
        "_id": "task2_id",
        "order": 1
      }
    ]
  }
  ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Contact

zyxkoo - ykkhmrdn@gmail.com
Project Link: [https://github.com/ykkhmrdn/task-management-backend.git]

---
