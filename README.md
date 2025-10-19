# 🧩 Microservices E-Commerce System

This project is a **Microservices-based E-Commerce Application** built using **Node.js**, **Express.js**, **MongoDB**, **RabbitMQ**, and **Docker Compose**.  
It demonstrates communication between services via **REST APIs** and **Message Queues**, ensuring scalability and fault isolation.

---

## 📁 Architecture Overview

The system consists of the following services:

| Service Name     | Description                                      | Port  |
|------------------|--------------------------------------------------|--------|
| **Gateway**      | API Gateway that routes requests to microservices | 3000   |
| **User Service** | Handles user registration, login, and profiles    | 3101   |
| **Product Service** | Manages product inventory and stock reservation | 3102   |
| **Order Service** | Handles order creation and publishes events to RabbitMQ | 3103   |
| **MongoDB**      | Centralized database for microservices            | 27017  |
| **RabbitMQ**     | Message broker for async communication            | 5672 / 15672 (web UI) |

---

## 🏗️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Message Broker:** RabbitMQ  
- **Containerization:** Docker, Docker Compose  
- **Communication:**
  - REST API between services
  - RabbitMQ for async messaging

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/mirzajalilovravshanbek/microservices-ecommerce.git
cd microservices-ecommerce
```

### 2️⃣ Build and run all services with Docker
```bash
docker-compose up --build
```

This command will automatically start all microservices and required dependencies.

---

## 🧠 Environment Variables

Each service reads its configuration from environment variables defined in `docker-compose.yml`.

Example (for `order-service`):

```yaml
environment:
  - PORT=3103
  - MONGO_URL=mongodb://mongo:27017/orderdb
  - RABBITMQ_URL=amqp://rabbitmq:5672
  - PRODUCT_SERVICE_URL=http://product-service:3102
```

---

## 🔄 Services Overview

### 🛒 Product Service
Manages products and stock.
```bash
POST /products           # Add new product
GET  /products           # List all products
POST /reserve            # Reserve product stock
```

### 📦 Order Service
Handles order creation and emits events to RabbitMQ.
```bash
POST /create             # Create new order
GET  /list               # List all orders
```

### 👤 User Service
Handles user registration and authentication (future extension).

### 🌐 Gateway
Single entry point for the frontend or API clients.

---

## 🧩 RabbitMQ Integration

- `order-service` → Publishes events to queue: **order_events**
- `product-service` or other consumers can subscribe to these events for async processing.

RabbitMQ Management UI is available at:
```
http://localhost:15672
username: guest
password: guest
```

---

## 🧪 Testing the System

Once all services are running:
1. Create a product via Product Service:
   ```bash
   POST http://localhost:3102/products
   {
     "name": "Laptop",
     "price": 1500,
     "stock": 10
   }
   ```
2. Create an order via Order Service:
   ```bash
   POST http://localhost:3103/create
   {
     "userId": "12345",
     "items": [{ "productId": "<your_product_id>", "qty": 2 }]
   }
   ```

If the stock is available, the order will be successfully created and an event will be sent to RabbitMQ.

---

## 🧰 Useful Commands

### View logs for a specific service
```bash
docker-compose logs order-service
```

### Access MongoDB shell
```bash
docker exec -it ms_mongo mongosh
```

### Access RabbitMQ Management
Open in browser: [http://localhost:15672](http://localhost:15672)

---

## 📸 Example Architecture Diagram

```text
             +---------------------- +
             |      Gateway (3000)  |
             +----------+-----------+
                        |
        -------------------------------------
        |                |                  |
+---------------+ +---------------+ +----------------+
| User Service  | | Product Svc   | | Order Service  |
| Port: 3101    | | Port: 3102    | | Port: 3103     |
+---------------+ +---------------+ +----------------+
        \______________________|___________________/
                        |
                    RabbitMQ (5672)
                        |
                   MongoDB (27017)
```

---

## 🚀 Future Improvements
- JWT-based authentication between services  
- API rate limiting and caching  
- Notification service integration  
- Kubernetes deployment  

---

## 🧑‍💻 Author

**Ravshanbek Mirzajalilov**  
💼 Full Stack Developer — Node.js | Vue.js | PostgreSQL  
📧 your.email@example.com  
🌍 [LinkedIn](https://linkedin.com/in/your-profile)

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
