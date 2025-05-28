# WisPerMed Search Engine

A video tutorial can be found on YouTube: [https://www.youtube.com/watch?v=NIGeFzJA96Y](https://www.youtube.com/watch?v=NIGeFzJA96Y)
> **Note:** We have no connection with the person who created the video, and we did not ask them to create it nor guide them on the search engine.


## 📦 Architecture Overview

- **Elasticsearch**: Stores and indexes PubMed documents for efficient search and retrieval.
- **MongoDB**: Used for storing application-related data and metadata.
- **Server (Backend)**: Interfaces with Elasticsearch and MongoDB, processes search queries and returns results.
- **Client (Frontend)**: A web interface for users to interact with the search engine.

---

## 🔧 Deployment Requirements

### 1. Elasticsearch

Ensure you have an Elasticsearch instance running and indexed with the PubMed documents.

### 2. MongoDB

A MongoDB instance is required to store non-search-related data such as user data or logs.

---

## 🖥️ Backend Server Configuration

The backend service uses environment variables to configure connections to Elasticsearch and MongoDB.

### Required Environment Variables

```env
# Elasticsearch Configuration
ELASTIC_HOST=your-elasticsearch-host
ELASTIC_PORT=your-elasticsearch-port
ELASTIC_USERNAME=your-elasticsearch-username
ELASTIC_PASSWORD=your-elasticsearch-password
INDEX_NAME=your-elasticsearch-index-name

# MongoDB Configuration
DB=your-mongodb-connection-string
```

---

## 🌐 Client (Frontend) Configuration
The frontend is built with React and requires an environment variable to point to the backend server.

### Required Environment Variable
```
REACT_APP_API_URL=http://<backend-ip>:<port>
```
Example:
```
REACT_APP_API_URL=http://192.168.1.10:5000
```

---

## 📁 Project Structure
```
wispermed/
├── server/         # Backend application
├── client/         # Frontend React application
├── README.md
└── .env            # Environment variable configurations (not committed)
```
