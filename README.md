# Shopora

Full-stack e-commerce starter project.

## Stack
- Frontend: React + Vite
- Backend: Spring Boot 3.5.x, Java 21, Maven
- Database: MySQL
- Auth: JWT + BCrypt
- API: REST

## Run locally

### 1. MySQL
Create a database:
```sql
CREATE DATABASE shopora;
```

### 2. Backend
Open a terminal in `backend`:
```bash
mvnw.cmd spring-boot:run
```
or:
```bash
mvn spring-boot:run
```

Backend: http://localhost:8080

### 3. Frontend
Open another terminal in `frontend`:
```bash
npm install
npm run dev
```

Frontend: http://localhost:5173

## Default database configuration
Edit `backend/src/main/resources/application.properties` if your MySQL username/password differ.

## API
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/products`
- GET `/api/products/{id}`
- POST `/api/cart`
- GET `/api/cart`
- DELETE `/api/cart/{productId}`
- POST `/api/orders`
- GET `/api/orders/my`
- GET `/api/admin/orders` (ADMIN)
- POST `/api/admin/products` (ADMIN)
- PUT `/api/admin/products/{id}` (ADMIN)
- DELETE `/api/admin/products/{id}` (ADMIN)

The application seeds sample products on first run.
