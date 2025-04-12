# The Shennawy API
Welcome to the Shennawy API project, which is set up with MongoDB, Docker, ESLint, and Prettier for seamless development and deployment. This project provides a ready-to-go setup for building and running the API, ensuring clean code and efficient development workflows.

# Prerequisites
Before you get started, ensure you have the following installed on your machine:

- Git
- Docker
- Docker Compose

# Project Setup
To run the project locally, you'll use Docker for a streamlined environment setup.

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/your-repository.git

   cd your-repository
   ```

2. Set up environment variables
The project uses AWS credentials for certain operations. Before running the project, you need to configure your environment variables. Copy the contents of the `.env.example` file into a new `.env` file and fill in your AWS credentials (Access Key, Secret Key, etc.) and any other required values for your environment. Please note that you also need to set the AWS S3 Bucket CORS policy for the fronted to be able to upload files to the bucket.

3. Docker Setup
We have a docker-compose.yml file that sets up the API and MongoDB locally. To start both services (API and MongoDB) in one command, run:

   ```bash
   docker-compose up
   ```

   This will build the services, start the containers, and ensure your API is connected to the MongoDB instance. By default, the API should be available at http://localhost:8000.

4. API Documentation
You can access the API documentation at the `/docs` route. It should have the full API specification.

5. Linting and Formatting
This project uses ESLint and Prettier to enforce consistent code style. To run the linter, use the following npm script:

   ```bash
   npm run lint
   ```