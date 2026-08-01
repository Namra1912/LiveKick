import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Scaffolding Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'LiveKick Backend API Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`LiveKick Server running on port ${PORT}`);
});
