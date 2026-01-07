const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const todoRoutes = require('./src/routes/todoRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Todo API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
