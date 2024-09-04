# Installation Guide

## Prerequisites
- Node.js (v14+)
- MongoDB

## Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/yourproject.git
    cd yourproject
    ```

2. Install backend dependencies:
    ```bash
    cd backend
    npm install
    ```

3. Set up environment variables:
    ```bash
    cp .env.example .env
    ```

4. Install frontend dependencies:
    ```bash
    cd ../frontend
    npm install
    ```

5. Run the development server:
    ```bash
    cd ../backend
    npm run dev
    ```
