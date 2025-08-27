# CasaCheiaApp

**CasaCheiaApp** is a full-stack mobile application designed to help families manage their household inventory in a collaborative way. Users can track missing items, add or remove products, and sync in real time with other family members. Built using modern technologies for both frontend and backend.

---

## Features

- Track missing household items
- Family group management (invite, join, view member lists)
- Visual notifications for unseen items
- Secure user authentication with JWT
- Rate limiting and backend protection
- Modern, gradient-based UI with rounded cards and navigation

---

## Tech Stack

### Frontend

- **React Native**
- **Expo Router**
- **TypeScript**
- **NativeWind (TailwindCSS for React Native)**
- **AsyncStorage**
- **React Navigation (Bottom Tabs)**
- **Lucide React Native Icons**


### Backend

- **Node.js**
- **Express.js**
- **MongoDB (with Mongoose)**
- **JWT (jsonwebtoken)**
- **BcryptJS** for password hashing
- **Rate Limiting (express-rate-limit)**

---

## Docker Setup

The project is fully containerized using Docker:

```bash
# Start the entire application
docker compose up --build
```

### Services:
- `backend`: Express.js API
- `mongo`: MongoDB database

---

## Project Structure

```
CasaCheiaApp/
├── frontend/           # Expo React Native app
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── contexts/
│   ├── types/
│   ├── utils/
│   └── ...
├── backend/            # Node.js + Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   ├── .env
│   └── app.js
│   └── ...
├── docker-compose.yml
└── README.md
```

---

## 🛡Security Notes

- Environment variables (e.g., DB credentials, JWT secret) are stored securely in `.env` and ignored by Git.
- Rate limiting is applied to sensitive routes (`/login`, `/create`).
- Tokens are stored using secure storage on the device.

---


## License

This project is licensed under the MIT License.
