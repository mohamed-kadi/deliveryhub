# DeliveryHub Deployment Guide 🚀

This guide provides instructions for deploying the complete DeliveryHub application, including the Spring Boot backend and React frontend.

## 📋 Prerequisites

- Docker & Docker Compose installed
- Git
- At least 4GB RAM available
- Ports 80, 8080, and 5432 available

## 🏗️ Architecture Overview

- **Frontend**: React with TypeScript, Tailwind CSS, served by Nginx
- **Backend**: Spring Boot with Java 17, PostgreSQL database
- **Database**: PostgreSQL 15
- **Real-time**: WebSocket support for chat functionality
- **Containerization**: Multi-stage Docker builds

## 🚀 Quick Deployment

### 1. Clone and Navigate
```bash
git clone https://github.com/mohamed-kadi/deliveryhub.git
cd deliveryhub
```

### 2. Environment Configuration
Create a `.env` file in the root directory (optional, for production):

```env
# Database Configuration
POSTGRES_DB=deliveryhub
POSTGRES_USER=deliveryhub
POSTGRES_PASSWORD=your-secure-password-here

# JWT Configuration (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-min-256-bits
JWT_EXPIRATION=86400000

# Application URLs
FRONTEND_URL=http://localhost
BACKEND_URL=http://localhost:8080
API_URL=http://localhost:8080/api
WS_URL=http://localhost:8080
```

### 3. Deploy with Docker Compose
```bash
# Build and start all services
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Access the Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api
- **Database**: localhost:5432

## 🔧 Development Setup

### Backend Development
```bash
# Run backend only with external database
docker-compose up database -d

# Run Spring Boot locally
./mvnw spring-boot:run
```

### Frontend Development
```bash
cd deliveryhub-frontend

# Install dependencies
npm install

# Start development server
npm start
```

## 🗄️ Database Setup

The application uses automatic database initialization via JPA/Hibernate with `ddl-auto: update`. The database schema will be created automatically on first run.

### Initial Admin User
You'll need to create an admin user manually or via the registration endpoint:

```bash
# Create admin user via API
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@deliveryhub.com",
    "password": "admin123",
    "fullName": "System Administrator",
    "role": "ADMIN"
  }'
```

## 🎯 Application Features

### For Customers
- Register and create delivery requests
- Track delivery status in real-time
- Chat with assigned transporters
- Multiple payment options (COD, PayPal, Stripe)

### For Transporters
- Apply for transporter account (requires admin approval)
- View and accept available delivery jobs
- Update delivery status (Assigned → Picked Up → Delivered)
- Chat with customers
- Configure custom pricing rates

### For Administrators
- Approve/reject transporter applications
- View comprehensive analytics dashboard
- Monitor platform performance
- Manage user accounts

## 🔒 Security Configuration

### Production Security Checklist
- [ ] Change default database passwords
- [ ] Set secure JWT secret (min 256 bits)
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up proper CORS origins
- [ ] Enable firewall rules
- [ ] Set up database backups
- [ ] Configure log monitoring

### Environment Variables for Production
```bash
# Strong JWT secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secure-jwt-secret-here

# Secure database credentials
POSTGRES_PASSWORD=your-secure-db-password

# Production URLs
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- **Backend**: http://localhost:8080/actuator/health
- **Frontend**: http://localhost/ (returns 200 if healthy)
- **Database**: Built-in PostgreSQL health checks

### Log Monitoring
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

## 🔄 Updates and Maintenance

### Updating the Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart services
docker-compose down
docker-compose up --build -d
```

### Database Backup
```bash
# Backup database
docker exec deliveryhub-db pg_dump -U deliveryhub deliveryhub > backup.sql

# Restore database
docker exec -i deliveryhub-db psql -U deliveryhub deliveryhub < backup.sql
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check port usage
   netstat -tulpn | grep :80
   netstat -tulpn | grep :8080
   netstat -tulpn | grep :5432
   ```

2. **Database Connection Issues**
   ```bash
   # Check database logs
   docker-compose logs database
   
   # Test database connection
   docker exec -it deliveryhub-db psql -U deliveryhub -d deliveryhub
   ```

3. **Frontend Build Issues**
   ```bash
   # Rebuild frontend
   docker-compose build --no-cache frontend
   ```

4. **Backend API Issues**
   ```bash
   # Check backend logs
   docker-compose logs backend
   
   # Test API endpoint
   curl -f http://localhost:8080/actuator/health
   ```

### Reset Everything
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v
docker system prune -a

# Rebuild from scratch
docker-compose up --build -d
```

## 🌐 Production Deployment Options

### Option 1: Cloud VPS (DigitalOcean, AWS EC2, etc.)
1. Launch a VPS with Docker support
2. Clone the repository
3. Configure environment variables
4. Set up domain and SSL certificates
5. Deploy with docker-compose

### Option 2: Docker Swarm/Kubernetes
- Scale services horizontally
- Load balancing and high availability
- Rolling updates

### Option 3: Platform-as-a-Service
- Deploy backend to Heroku, Railway, or similar
- Deploy frontend to Vercel, Netlify, or similar
- Use managed database service

## 📞 Support

For deployment issues:
1. Check the troubleshooting section above
2. Review application logs
3. Create an issue on GitHub with logs and error details

## 🔗 Useful Commands

```bash
# View running containers
docker-compose ps

# Scale services
docker-compose up --scale backend=2 -d

# Update single service
docker-compose up -d --no-deps backend

# Access database CLI
docker exec -it deliveryhub-db psql -U deliveryhub deliveryhub

# View real-time resource usage
docker stats

# Clean up unused resources
docker system prune -f
```

---

**🎉 Your DeliveryHub application should now be running successfully!**

Access the application at http://localhost and start connecting customers with transporters across Europe and Morocco.