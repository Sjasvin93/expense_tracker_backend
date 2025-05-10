const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db.config');
const { sendApiResponse } = require('./src/config/api_response');
const router = require('./src/routes/index.route');

dotenv.config();
connectDB();

const app = express();
const httpServer = http.createServer(app);

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // your frontend origin
  credentials: false
}));
app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser());

// Static Files
app.use(express.static('public'));
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static('src/uploads'));



app.use('/api/v1', router);

// Welcome Route
app.get('/api/v1', (req, res) => {
  sendApiResponse(res, 'Welcome to Integration Tools Service');
});

// Handle Invalid Routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Invalid API Path',
    message: `The path '${req.originalUrl}' does not exist`,
  });
});

// Start Server
const PORT = process.env.PORT || 8090;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  httpServer.close(() => {
    console.log('Server shut down gracefully');
    process.exit(0);
  });
});

module.exports = { app };
