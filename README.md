# FullStack-CW-BackEnd

This is the backend for the FullStack Coursework project.  
It is a Node.js/Express API connected to a MongoDB Atlas database and deployed on [Render.com](https://render.com/).

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

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

frontend repository:
**https://github.com/DomanskiFilip/FullStack-CW-FrontEnd**

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

## MongoDB Classes
mongo db classes as of 19.11.2025 are stored in database classes folder

## Link to Postman Testing
https://domanskifilip-4251709.postman.co/workspace/267eb865-1914-4b58-89e7-36460d6b6c61/documentation/50005428-caf0238b-1644-4f0b-8fba-38753b49533c
