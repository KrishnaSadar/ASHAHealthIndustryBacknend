# Water Health Backend API

This is the backend service for a water quality and public health monitoring application. It provides a RESTful API for managing villagers, complaints, ASHA workers, and health predictions.

Built with Node.js, Express, and MongoDB.

## Features

-   User & Worker Management
-   Patient & Dirty Water Complaint System
-   Zone-based Water Quality & Health Prediction
-   Scheduled Hourly Prediction Jobs (via Cron)
-   JWT Authentication for Workers
-   Static Token Authentication for Admin tasks
-   Request Validation and Error Handling
-   Production-ready logging, security headers, and rate limiting

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance
-   A text editor (e.g., [VS Code](https://code.visualstudio.com/))
-   A REST API client (e.g., [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/))

### 1. Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd water-health-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### 2. Environment Configuration

1.  Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```

2.  Open the `.env` file and fill in the required values:

    -   `PORT`: The port for the local server (e.g., 5001).
    -   `MONGO_URI`: Your MongoDB connection string.
    -   `JWT_SECRET`: A long, random, secret string for signing JWTs.
    -   `ADMIN_TOKEN`: A static secret token for accessing admin-protected routes. Generate a secure random string for this.
    -   `ENABLE_PREDICTION_JOB`: Set to `true` to enable the hourly prediction cron job.
    -   `PREDICTION_API_URL`: (Optional) The URL of your external machine learning API. If left blank, the system will use a simulated response.

### 3. Running Locally

To start the server for local development (with auto-restarting via nodemon):

```bash
npm run dev