# DeliveryHub 🛫📦

**DeliveryHub** is a Spring Boot application designed to connect **customers in Europe** with **transporters** who handle goods delivery between **Europe and Morocco**.

## ✅ Key Highlights

- 🔐 Secure JWT-based login/authentication
- 👥 Role-based access (Admin, Customer, Transporter)
- 🚚 Delivery lifecycle management with real-time status updates
- 💬 Real-time chat between customers and transporters
- 💳 Weight-based payment calculation with multiple methods (COD, PayPal, Stripe)
- 📊 Advanced admin dashboard with transport analytics

## 🔐 Features by Role

### 👤 Users
- Register  & login as Customer, Transporter, or Admin
- Login with JWT authentication
- Role-based access
- Transporter accounts require admin approval

### 🚚 Transporters
- View & accept available delivery requests
- Update delivery status: `ASSIGNED`, `PICKED_UP`, `DELIVERED`
- Get assigned deliveries list
- Live chat with customers
- Receive payments (based on personalized weight pricing)


### 📦 Customers
- Create delivery requests
- Track delivery request history with optional filtering by status (e.g., `DELIVERED`, `ASSIGNED`)
- Chat directly with assigned transporters
- Choose payment method: `COD`, `PayPal`, `Stripe`

### 👨‍💼 Admins
- Approve or reject transporter registrations
- Access dashboard insights:
  - Top pickup/drop-off cities
  - Delivery status percentages
  - Transporter performance & reliability score
  - Delivery cancellation stats
  - Completion time analytics
  - Time-range trends

## 💬 Real-Time Chat

Fully integrated real-time chat system using WebSocket with these capabilities:

### ✅ Completed Features:
- Text messaging and file/image sharing
- Message delivery/read status (`✓`, `✓✓`)
- Secure download of uploaded files
- Pagination support for chat history
- Sender/receiver authorization validation

## 💳 Payment Module (NEW)

- Transporters configure their own pricing:
  - `ratePerKg`: Price per kg
  - `fixedPriceUnderThreshold`: Fixed rate under threshold (e.g., 10kg)
- Payment is automatically calculated based on weight and transporter
- Supports multiple payment methods: `COD`, `PAYPAL`, `STRIPE`
- Customers view detailed payment summary via:
GET /api/payment/{deliveryId}/summary

## 📈 Admin Dashboard Preview

- ✅ Total deliveries overview
- ✅ Transporter performance metrics
- ✅ Delivery time analytics
- ✅ Cancellation reason statistics
- ✅ Top pickup/drop-off cities
- ✅ Delivery status distribution
- ✅ Time range trends (daily, weekly, monthly)

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
- WebSocket (Chat)
- Role-Based Access Control (RBAC)


## 🔒 Security Note

Make sure `src/main/resources/application.properties` is **excluded** from Git and not pushed to the repository. Use `application.properties.example` to share safe default configurations.

## 🧪 Testing (coming soon)

- [ ] Unit tests for delivery, chat, and payment logic
- [ ] WebSocket integration tests
- [ ] Security & access control tests


## 👥 Contributors

- [@mohamed-kadi](https://github.com/mohamed-kadi)

## 💡 Next Steps

- [x] Real-time chat (complete)
- [x] Weight-based payment logic (complete)
- [x] Transporter rating & feedback system
- [ ] Email/Push notifications
- [ ] Frontend dashboard (React or Angular)

## 🛠️ Setup

```bash
git clone https://github.com/mohamed-kadi/deliveryhub.git
cd deliveryhub
./mvnw spring-boot:run


## 📝 License

MIT License *(or specify your preferred license here)*