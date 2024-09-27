# CafeFlow+

## Overview

CafeFlow+ is a comprehensive cafe management system designed to streamline operations and enhance user experience. On hectic days, it can be time-consuming to get an order slip from the main shopkeeper due to the huge crowd standing at the front bar. The person taking the food order slip to the cook is often busy, resulting in delays as they must frequently leave the kitchen to collect the slips. This causes unnecessary waiting for customers and potential mix-ups where orders can be confused.

Additionally, customers often have to repeatedly ask the staff if their orders are ready, and the staff faces challenges calling out names for each food item. If a customer isn't present when their order is ready, the food may sit in a plastic chamber, causing it to cool down or lose its quality. 

**CafeFlow+ addresses these challenges by offering:**

- **Time-saving Solutions**: Customers can place their orders digitally, eliminating the need for physical slips and reducing wait times.
- **Order Notifications**: Customers receive notifications when their orders are ready.
- **Easy Management for Cafe Managers**: The system provides tools for menu management, order tracking, and reporting, allowing managers to oversee operations efficiently.

## Features

- **User Authentication**: Secure login and registration with hashed passwords using bcrypt.
- **JWT Access Tokens**: Implementation of JSON Web Tokens (JWT) for secure access to protected routes.
- **API Endpoints**: Custom-built API endpoints for managing cafe data, including menu items, orders, and user profiles.
- **Menu Management**: Admin functionality to add, update, and delete menu items.
- **Order Processing**: Users can place orders, view order history, and manage their profiles.

## Technologies Used
- **Backend**: Node.js and Express.js for server-side development.
- **Database**: MongoDB Atlas for storing user and cafe data.
- **Security**: Bcrypt for password hashing and JWT for secure token management.
