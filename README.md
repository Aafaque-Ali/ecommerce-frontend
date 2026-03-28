# E-Commerce Frontend

A React frontend for the e-commerce application, built with Vite and connected to a Spring Boot backend.

## Tech Stack
- React 18
- Vite
- React Router DOM
- Axios
- JavaScript (ES6+)

## Features
- User registration and login
- Browse products
- Add to cart with quantity controls
- View and manage cart
- Place orders
- View order history
- Protected routes — redirects to login if not authenticated

## Pages
- /login — Login page
- /register — Register page
- /products — Product listing
- /cart — Shopping cart
- /orders — Order history

## Setup
1. Clone the repository
2. Run `npm install`
3. Make sure the Spring Boot backend is running on port 8080
4. Run `npm run dev`
5. Open http://localhost:5173

## Backend
This frontend connects to the Spring Boot backend:
https://github.com/Aafaque-Ali/ecommerce-backend
