import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { analyzeIngredients, analyzeText } from './geminiService';
import { validateAnalyzeIngredients, validateAnalyzeText } from './validation';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // For image data

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    code: 429
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/', limiter);

// Routes
app.post('/api/analyze-ingredients', validateAnalyzeIngredients, async (req, res) => {
  try {
    const { imageBuffer, profile } = req.body;
    const result = await analyzeIngredients(imageBuffer, profile);
    res.json(result);
  } catch (error) {
    console.error('Error analyzing ingredients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/analyze-text', validateAnalyzeText, async (req, res) => {
  try {
    const { text, profile } = req.body;
    const result = await analyzeText(text, profile);
    res.json(result);
  } catch (error) {
    console.error('Error analyzing text:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
