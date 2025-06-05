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
- Update delivery status (PICKED_UP, DELIVERED)
- Track delivery requests with optional status filtering


### 📦 Customers
- Submit delivery requests
- View their own requests

### 👨‍💼 Admins
- Approve pending transporter accounts

## 🛰️ Delivery Tracking

Customers can view all their delivery requests using:
 ### Example Endpoints:
 ```http
 GET /api/deliveries/track
 They can also filter by status:
 GET /api/deliveries/track?status=DELIVERED
 ```

## ⚙️ Tech Stack
- Java 17
- Spring Boot
- PostgreSQL
- Maven
- JWT (JSON Web Token) for Authentication

## 🔒 Security Note

Make sure `src/main/resources/application.properties` is excluded from Git and not pushed to the repository. Use `application.properties.example` to share safe default configurations.


## 🛠️ Setup

```bash
git clone https://github.com/mohamed-kadi/deliveryhub.git
cd deliveryhub
./mvnw spring-boot:run
