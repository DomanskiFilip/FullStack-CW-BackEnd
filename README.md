# FullStack-CW-BackEnd

This is the backend for the FullStack Coursework project.  
It is a Node.js/Express API connected to a MongoDB Atlas database and deployed on [Render.com](https://render.com/).

## Features

- RESTful API for lessons, cart, and orders
- MongoDB Atlas for persistent data storage
- CORS enabled for frontend integration
- Deployed on Render.com with HTTPS

## Tech Stack

- Node.js
- Express
- MongoDB Atlas

## Deployment

The backend is live at:  
**https://fullstack-cw-backend-d2z9.onrender.com/lessons**

## API Endpoints

- `GET /lessons` — List/search lessons
- `PUT /lesson/:id` — Update lesson (e.g., available places)
- `GET /cart?userId=...` — Get user's cart
- `POST /cart` — Update user's cart
- `POST /order` — Place an order

## Environment Variables

Create a `.env` file with:

```
MONGODB_URI=your-mongodb-atlas-uri
PORT=8080
```

## Running Locally

```bash
npm install
node server.js
```

---
