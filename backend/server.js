const mongoose = require('mongoose');
const { app, config } = require('./app');
const { checkEnvironment } = require('./services/compilerService');

console.log('Current environment:', process.env.NODE_ENV);
console.log('Using MongoDB URI:', config.MONGODB_URI);

let server;

// Function to start the server
const startServer = () => {
  mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('MongoDB connected successfully');
      server = app.listen(config.PORT, () => {
        console.log(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
        console.log(`Try accessing the compile route at: http://localhost:${config.PORT}/api/compile`);
      });
      server.on('error', (error) => {
        console.error('Server failed to start:', error);
      });
    })
    .catch(err => {
      console.error('Error connecting to MongoDB:', err);
      process.exit(1);
    });
};

// Run environment check before starting the server
(async () => {
  try {
    console.log('Checking environment...');
    await checkEnvironment();
    console.log('Environment check completed successfully');
    startServer(process.env.PORT || 5000);
  } catch (error) {
    console.error('Environment check failed:', error);
    process.exit(1);
  }
})();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
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
    });
  }
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('👋 SIGINT RECEIVED. Shutting down gracefully');
  if (server) {
    server.close(() => {
      console.log('💥 Process terminated!');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});