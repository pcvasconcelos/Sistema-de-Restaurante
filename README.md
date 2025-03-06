# Sistema-de-Restaurante
I am trying to build a system. Lets see if it works xD
🍽️ Restaurant Management System

📌 Project Overview

This is a Restaurant Management System built with Node.js, Express, SQLite3, and Electron. It allows restaurant employees to manage tables, orders, and payments efficiently. The system includes user authentication and a simple graphical interface using Electron.

🚀 Features

User Authentication (Login & Registration)

Table Management

Order Management

Bill Calculation & Payment Processing

Integration with SQLite3 Database

Electron-based Desktop Interface

🛠️ Technologies Used

Backend: Node.js, Express.js

Database: SQLite3

Frontend: HTML, CSS, JavaScript, Electron

📂 Project Structure

meu-sistema/
│── node_modules/
│── views/               # Frontend files (HTML, CSS, JavaScript)
│── database/            # Database logic (SQLite3)
│── main.js              # Electron entry point
│── server.js            # Express.js API Server
│── package.json         # Project metadata & dependencies
│── restaurante.db       # SQLite3 Database File

🔧 Installation & Setup

1️⃣ Clone the Repository

git clone [https://github.com/your-username/restaurant-system.git
cd restaurant-system](https://github.com/pcvasconcelos/Sistema-de-Restaurante)

2️⃣ Install Dependencies

npm install

3️⃣ Start the Server

node server.js

You should see:

🔥 Restaurant server running on port 4000!

4️⃣ Start the Electron App

npm start

🔥 API Endpoints

🔹 User Authentication

POST /login → Logs in a user

POST /register → Registers a new user

🔹 Order Management

POST /orders → Adds a new order

GET /orders/:tableId → Fetches orders for a table

🔹 Billing

POST /close-bill → Processes payment for a table

🛠️ Troubleshooting

If you encounter issues:

Check if the server is running

netstat -ano | findstr :4000

Ensure SQLite database is correctly connected

Disable firewall if necessary

Check error logs in the console

📜 License

This project is licensed under the MIT License.

🙌 Contributing

Feel free to fork the project and submit pull requests! 🚀

🔗 Follow me on GitHub:https://github.com/pcvasconcelos
