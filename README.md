# DeliveryHub 🛫📦

A Spring Boot project to connect customers in Europe with transporters for sending goods between Europe and Morocco.

## 📦 Initial Commit Summary

- ✅ Spring Boot project setup
- ✅ JWT login/auth with role-based access
- ✅ User registration (Admin, Customer, Transporter)
- ✅ Transporter admin approval flow
- ✅ Delivery request creation & assignment
- ✅ Secured endpoints with role checks

## 🔐 Features

### 👤 Users
- Register as Customer, Transporter, or Admin
- Login with JWT authentication
- Role-based access
- Transporter accounts require admin approval

### 🚚 Transporters
- View available delivery requests
- Accept delivery requests
- View assigned deliveries
- Update delivery status (soon)

### 📦 Customers
- Submit delivery requests
- View their own requests

### 👨‍💼 Admins
- Approve pending transporter accounts

## ⚙️ Tech Stack
- Java 17
- Spring Boot
- PostgreSQL
- Maven
- JWT (JSON Web Token) for Authentication

## 🛠️ Setup

```bash
git clone https://github.com/mohamed-kadi/deliveryhub.git
cd deliveryhub
./mvnw spring-boot:run
