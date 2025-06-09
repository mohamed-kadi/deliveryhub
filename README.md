# DeliveryHub 🛫📦

**DeliveryHub** is a Spring Boot application designed to connect **customers in Europe** with **transporters** who handle goods delivery between **Europe and Morocco**.

## ✅ Key Highlights

- 🔐 Secure JWT-based login/authentication
- 📦 Role-based access (Admin, Customer, Transporter)
- 🛠️ Admin dashboard for monitoring delivery performance
- 🚚 Real-time delivery status tracking
- ✅ Transporter approval workflow

## 🔐 Features by Role

### 👤 Users
- Register as Customer, Transporter, or Admin
- Login with JWT authentication
- Role-based access
- Transporter accounts require admin approval

### 🚚 Transporters
- View and accept available delivery requests
- Accept delivery requests
- View assigned deliveries
- Update delivery status (PICKED_UP, DELIVERED)
- Track delivery requests with optional status filtering


### 📦 Customers
- Create delivery requests
- Track delivery request history
- Filter by delivery status (e.g., `DELIVERED`, `ASSIGNED`)

### 👨‍💼 Admins
- Approve pending transporter accounts
- View all delivery requests and users
- Access dashboard insights:
  - Top pickup/drop-off cities
  - Delivery status percentages
  - Transporter performance
  - Delivery cancellation stats
  - Completion time analytics
  - Time-range trends

## 📈 Admin Dashboard Preview

- ✅ Total deliveries overview
- ✅ Top transporters and routes
- ✅ Completion time per transporter
- ✅ Cancelled delivery stats
- ✅ Weekly/Monthly/Yearly trends

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

## 🧪 Testing (coming soon)

- Unit tests and integration tests are in progress.  
- Stay tuned for updates!


## 👥 Contributors

- [@mohamed-kadi](https://github.com/mohamed-kadi)

## 💡 Next Steps

- ✅ Real-time chat between customers and transporters  
- ✅ Ratings & feedback system  
- ✅ Email notifications  
- ✅ Frontend dashboard (React or Angular)

## 🛠️ Setup

```bash
git clone https://github.com/mohamed-kadi/deliveryhub.git
cd deliveryhub
./mvnw spring-boot:run


## 📝 License

MIT License *(or specify your preferred license here)*