# MERN Stack Chat Application

Welcome to the MERN Stack Chat Application! This project is a feature-rich real-time messaging platform built using the MERN stack (MongoDB, Express.js, React, Node.js) along with Socket.io for seamless and instantaneous communication.

## Features

- **User Authentication:**
  - Users can sign up and log in securely.
  
- **Chat Functionality:**
  - Create and join single or group chats effortlessly.
  - Real-time messaging using Socket.io for instant communication.

- **Group Management:**
  - Update group names for better organization.
  - Add and remove members from group chats.
  - Leave groups when needed.

## Tech Stack

### Frontend

- React.js for a dynamic and responsive user interface.
  
### Backend

- Express.js and Node.js for server-side development.
- MongoDB and Mongoose for efficient data storage and retrieval.

### Real-Time Communication

- Socket.io for enabling real-time, bidirectional, and event-based communication.

## Getting Started

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/MoazamAli45/Chat-Application
    cd Chat-Application
    ```

2. **Install Dependencies:**
    ```bash
    # Frontend
    cd frontend && npm install

    # Backend
    cd ../backend && npm install
    ```

3. **Set up MongoDB:**
    - Create a MongoDB Atlas account (if not already done) and configure your database connection in the backend's `.env` file.

4. **Run the Application:**
    ```bash
    # Frontend
    cd frontend && npm run dev

    # Backend
    cd ../backend && npm start
    ```

5. **Open in Browser:**
    - Open your browser and navigate to `http://localhost:3000` for backend and `http://localhost:5173` for frontend to access the chat application.

## Contributing

Contributions are welcome! Feel free to submit issues, pull requests, or suggestions.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- Special thanks to the MERN stack and Socket.io communities for providing powerful tools to build real-time applications.

Happy chatting! 🚀
