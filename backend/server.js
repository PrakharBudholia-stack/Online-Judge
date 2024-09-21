require('dotenv').config();
const mongoose = require('mongoose');
const { app, config } = require('./app');
const { checkEnvironment } = require('./services/compilerService');

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Current environment:', process.env.NODE_ENV);
console.log('Using MongoDB URI:', config.MONGODB_URI);

let server;

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

// Function to start the server
const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
      console.log(`API is available at: http://localhost:${config.PORT}/api`);
    });
    server.on('error', (error) => {
      console.error('Server failed to start:', error);
    });
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

// Run environment check before starting the server
(async () => {
  try {
    console.log('Checking environment...');
    await checkEnvironment();
    console.log('Environment check completed successfully');
    await startServer();
  } catch (error) {
    console.error('Environment check failed:', error);
    process.exit(1);
  }
})();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  if (server) {
    server.close(() => {
      console.log('💥 Process terminated!');
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed.');
        process.exit(0);
      });
    });
  }
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('👋 SIGINT RECEIVED. Shutting down gracefully');
  if (server) {
    server.close(() => {
      console.log('💥 Process terminated!');
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed.');
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
});