# Locknload Project Guide

## Overview

Locknload is an nx-based project that includes two main applications:

1. **Frontend** - An Angular project.
1. **Backend** - A Node.js project.

This guide provides instructions on how to set up and run both projects.

## Prerequisites

Ensure that you have the following installed on your machine:

1. **Node.js** (version 14 or higher)
1. **npm** (Node Package Manager)
1. **nx** (NX CLI)
1. **Angular CLI**

You can install NX CLI globally using:

```shell
npm install -g nx
```

You can install Angular CLI globally using:

```shell
npm install -g @angular/cli
```

## Setup

1. Clone the repository:

   ```shell
   git clone https://github.com/JosePessoa23/desofs2024_M1A_7
   cd locknload
   ```

2. Install the dependencies:

   ```shell
   npm install
   ```

## Running the Frontend (Angular)

The frontend application is located in the `apps/frontend` directory.

### Development Server

To start the development server:

1. Navigate to the project root directory.

1. Run the following command:

   ```shell
   npx nx run frontend:serve
   ```

This will compile the Angular project and start a local development server. You can access it in your browser at `http://localhost:4200`.

### Production Build

To create a production build of the frontend:

1. Navigate to the project root directory.

1. Run the following command:

   ```shell
   npx nx run frontend:build --prod
   ```

The production build will be stored in the `dist/apps/frontend` directory.

## Running the Backend (Node.js)

The backend application is located in the `apps/backend` directory.

### Development Server

To start the backend server in development mode:

1. Navigate to the project root directory.

1. Run the following command:

   ```shell
   npx nx run backend:start
   ```

This will start the Node.js server, and you can access it at `http://localhost:3000`.

### Production Build

To create a production build of the backend:

1. Navigate to the project root directory.

1. Run the following command:

   ```shell
   npx nx run backend:build
   ```

The production build will be stored in the `dist/apps/backend` directory.

### Running the Production Build

To run the backend in production mode:

1. After building the backend, navigate to the `dist/apps/backend` directory.

1. Run the following command:

   ```shell
   node main.js
   ```

This will start the backend server in production mode.