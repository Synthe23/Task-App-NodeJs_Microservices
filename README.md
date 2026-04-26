# Task-App-NodeJs_Microservices
# 🧩 Task Management App – Node.js Microservices Architecture

This project is a backend-focused task management system built using a microservices architecture with Node.js. The goal was to design a scalable and modular system where each core functionality is handled by an independent service.

The application is divided into multiple services such as User Service, Task Service, and Notification Service, each responsible for a specific domain. These services communicate asynchronously using a message broker, allowing loose coupling and better scalability.

To support this architecture, the project uses:
- MongoDB for data persistence  
- RabbitMQ for inter-service communication  
- Docker & Docker Compose for containerization and easy local setup  

Each service runs independently in its own container, making the system easier to develop, test, and scale. The notification service listens for events (like task creation or updates) and reacts accordingly, demonstrating event-driven design in practice.

This project is a hands-on exploration of how real-world backend systems are structured using microservices, focusing on separation of concerns, scalability, and maintainability.

---

### 🚀 Key Features
- Microservices-based architecture  
- Event-driven communication using RabbitMQ  
- Containerized setup with Docker  
- Scalable and modular design  
- Independent services for users, tasks, and notifications  

---

### 📦 Tech Stack
- Node.js  
- Express.js  
- MongoDB  
- RabbitMQ  
- Docker  

---

### 💡 Purpose
This project was built to understand and implement core concepts of microservices, including service separation, asynchronous communication, and containerized deployments.
