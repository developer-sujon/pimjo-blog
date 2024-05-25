# Pimjo Blog API

**Version:** 1.0.0  
**Date:** 23/May/2024

## Table of Contents

1. [Introduction](#1-introduction)
2. [Customer Support](#2-customer-support)
3. [Api Documentation and ER Diagram](#3-api-documentation)
4. [Running The Application Locally](#4-running-the-application-locally)

## 1. Introduction

This simple blog API application allows users to create accounts, log in, and publish articles that are publicly visible. It provides robust authentication, thorough error handling, and complete testing, making it a reliable and user-friendly platform for blogging.

### 2 Customer Support

For support, please contact [muhammad.sujon.cse@gmail.com](mailto:muhammad.sujon.cse@gmail.com).

### 3 Api Documentation

### 3.1 Swagger Documentation

API documentation for Pimjo Blog API can be found at [API Swagger Documentation](https://app.swaggerhub.com/apis/DEVOLOPERSUJON/pimjo-blog-api/1.0.0).

### 3.2 ER Diagram

ER Diagram for Pimjo Blog API can be found at [ER Diagram.drawio](https://drive.google.com/file/d/1OlHWHY4lbwEHLU4EMQIU9lDhmM7LAyO1/view?usp=sharing).

---

## 4 Running the Application Locally

Follow these steps to set up and run the Pimjo Blog API on your local machine:

### Prerequisites

Before you begin, ensure that you have the following prerequisites installed:

- [Node.js](https://nodejs.org/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)

### 1. Clone the Project

Clone the project repository from GitHub using the following command:

```bash
git clone https://github.com/developer-sujon/pimjo-blog.git

```

### 2. Navigate to the Project Directory

Change your working directory to the project folder:

```
cd pimjo-blog

```

### 3. Install Project Dependencies

Change your working directory to the project folder:

```bash
yarn install
```

## Set Up Environment Variables

Create an .env file in the root directory of the project and configure the necessary environment variables. Here's an example of the required variables:

```env
#port
PORT=8080

# Postgres Configuration
DB_CONNECTION_URL="postgresql://postgres:postgres@localhost:5433/pimjo-blog-api?schema=public"

# JWT Secret Key
ACCESS_TOKEN_SECRET=your-secret-key
```

## 5. Run the Database Seed Command

## 6. Start the Application

## 6.1. Test the Application with jest

```bash
yarn start:test
```

## 6.2. Start the Application with nodemon

```bash
yarn start:dev
```

## 6.3. Start the Application with pm2

```bash
yarn start:prod
```

## 7. Access the Application

Demo Credentials

```bash
email: user@example.com
password: 123456@
```

Open a web browser and go to the following URL to access the locally/production running Pimjo Blog API application health:

## 7.1. Access the Application locally

```
http://localhost:8080/health

```

You can also explore the Swagger API documentation at:

```
http://localhost:8080/docs

```
