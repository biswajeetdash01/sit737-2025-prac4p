const express = require('express');
const winston = require('winston');
const app = express();
const port = 3000;

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'calculator-microservice' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Middleware for parameter validation
const validateNumbers = (req, res, next) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);

  if (isNaN(num1) || isNaN(num2)) {
    logger.error('Invalid parameters provided');
    return res.status(400).json({ error: 'Parameters must be valid numbers' });
  }
  
  req.numbers = { num1, num2 };
  next();
};

// API Endpoints
app.get('/add', validateNumbers, (req, res) => {
  const { num1, num2 } = req.numbers;
  const result = num1 + num2;
  logger.info(`Addition requested: ${num1} + ${num2} = ${result}`);
  res.json({ result });
});

app.get('/subtract', validateNumbers, (req, res) => {
  const { num1, num2 } = req.numbers;
  const result = num1 - num2;
  logger.info(`Subtraction requested: ${num1} - ${num2} = ${result}`);
  res.json({ result });
});

app.get('/multiply', validateNumbers, (req, res) => {
  const { num1, num2 } = req.numbers;
  const result = num1 * num2;
  logger.info(`Multiplication requested: ${num1} * ${num2} = ${result}`);
  res.json({ result });
});

app.get('/divide', validateNumbers, (req, res) => {
  const { num1, num2 } = req.numbers;
  if (num2 === 0) {
    logger.error('Division by zero attempted');
    return res.status(400).json({ error: 'Cannot divide by zero' });
  }
  const result = num1 / num2;
  logger.info(`Division requested: ${num1} / ${num2} = ${result}`);
  res.json({ result });
});

// Start server
app.listen(port, () => {
  console.log(`Calculator service running at http://localhost:${3000}`);
});