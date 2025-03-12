# Lebanese University Masters Senior Project

This is a full-stack web application using **Express.js** for the backend and **React.js** with Vite for the frontend.

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Recommended: LTS version)
- [npm](https://www.npmjs.com/) (Comes with Node.js)

To check if you have them installed, run:

```sh
node -v
npm -v
```

## Backend Setup (Express.js)

1. Open Terminal inside the root directory of the project

2. Install dependencies:

   ```sh
   npm install
   ```

3. Run the backend server:

   ```sh
   npm run dev
   ```
-
   The backend server will run on `http://localhost:8000`

## Frontend Setup (React + Vite)

1. Navigate to the client folder:

   ```sh
   cd ./client
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the frontend development server:

   ```sh
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` by default.

## Running the Full Stack Application

To run both backend and frontend simultaneously:

- Open two terminals:
  - One for the backend: Run `npm run dev` inside the backend directory.
  - One for the frontend: Run `npm run dev` inside the client directory.


## Notes

- The backend is using **Nodemon** for auto-reloading during development.
- The frontend uses **Vite** for fast builds and development.
- Ensure that the backend API URL is properly configured in the frontend (e.g., using an `.env` file in the client folder).

---

This guide ensures you have everything set up to start developing and running the full-stack application efficiently.

