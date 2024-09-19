module.exports = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/your_dev_db',
    JWT_SECRET: process.env.JWT_SECRET || 'your_dev_secret',
    NODE_ENV: 'development'
  };