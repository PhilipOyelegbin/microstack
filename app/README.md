# Polyglot Microservices Note-Taking Application

This production-ready architecture uses specialized ecosystem configurations split down into targeted domains to yield high system horizontal scalability.

---

## 📡 Microservice Environmental Architectures

### 1. Frontend UI (React)

- **Host Port**: `8000` (Mapped inside nginx standard `80`)
- **Key Environments**:
  - `REACT_APP_AUTH_URL`: Destination routing for the Auth API backend.
  - `REACT_APP_GIN_URL`: Destination routing for the core Notes API backend.

### 2. Core Notes Service (Go Gin)

- **Host Port**: `5002`
- **Key Environments**:
  - `PORT`: Execution host portal pointer.
  - `DATABASE_URL`: Master PostgreSQL transactional DSN pointer data.
  - `FLASK_SERVICE_URL`: Base service lookup path targeting text processing workers.

### 3. Identity Gateway Service (Express JS)

- **Host Port**: `5000`
- **Key Environments**:
  - `DATABASE_URL`: Connection configuration to PostgreSQL mapping schema users.
  - `JWT_SECRET`: Signature encoder passphrase for state credentials.

### 4. Natural Text Parser Service (Flask)

- **Host Port**: `5001`
- **Key Environments**:
  - `PORT`: Local routing interface portal.

---

## 🔄 Cross-Service Pipeline Dynamics

1. **Client Submission Flow**: React interface acts as the customer touchpoint triggering CRUD arrays target routing direct into the `Go Gin Engine`.
2. **Text Enhancement Processing**: Prior to persistence, the `Go Gin Engine` intercepts inputs, creating an internal JSON payload delivered straight into `Flask (/summarize)` sequentially parsing outputs back upstream into the main engine pipeline.
3. **Storage Engine Isolations**: Both `Go Gin` and `Express` establish persistence configurations accessing the shared single instance container `postgres-db`, isolating execution vectors down into modular table schemas (`notes`, `users`).

---

## 🚀 Initialization & Automated Operations Execution

### Running Unit Test Matrix Checkpoints

Ensure tests validate cleanly out of box across all individual services:

```bash
# Go Gin Service Tests
cd notes-service && go test -v ./...

# Node/Express Unit Tests
cd auth-service && npm run test

# Flask Target Testing
cd text-service && python -m unittest test_app.py

# Client Target Testing
cd frontend && npm run test
```

### Build Image Checkpoints

Build docker image across all individual services:

```bash
# Node/Express Image
cd auth-service && sudo docker build -t app-auth-service:latest .

# Go Gin Service Image
cd notes-service && sudo docker build -t app-notes-service:latest .

# Flask Target Image
cd text-service && sudo docker build -t app-text-service:latest .

# Client Target Image
cd frontend && sudo docker build -t app-frontend:latest .
```

---
