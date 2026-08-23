# Noise to Poise

Welcome to the Noise to Poise codebase. The repository is structured as a monorepo containing both the frontend client and the backend server.

## Directory Structure

- **`frontend/`**: The Next.js web application.
- **`backend/`**: A Node.js and Express API server.

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

Install dependencies for all workspaces (root, frontend, and backend) by running from the root directory:

```bash
npm install
```

### Running the Development Environment

To run both the frontend and backend servers concurrently, execute:

```bash
npm run dev
```

This will run:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

### Running Separately

If you prefer to run the components individually:

- **Frontend only**:
  ```bash
  npm run dev:frontend
  ```
  or
  ```bash
  cd frontend && npm run dev
  ```

- **Backend only**:
  ```bash
  npm run dev:backend
  ```
  or
  ```bash
  cd backend && npm run dev
  ```

## Production Build

To build the client or server:

- **Frontend build**:
  ```bash
  npm run build:frontend
  ```
- **Backend build**:
  ```bash
  npm run build:backend
  ```
