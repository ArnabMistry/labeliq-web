# Security Hardening Plan for LabelIQ App

## Overview
Add a Node.js/Express backend to proxy Gemini API calls, implementing rate limiting, input validation, and secure API key handling without breaking existing functionality.

## Steps
- [ ] Create server directory and initialize Express app with TypeScript
- [ ] Install necessary dependencies (express, express-rate-limit, joi, cors, dotenv, @google/genai, etc.)
- [ ] Set up environment variables for API key on server-side
- [ ] Implement rate limiting middleware (IP-based with sensible defaults, 429 responses)
- [ ] Add input validation middleware using Joi schemas for user inputs
- [ ] Create API endpoints to proxy Gemini analyzeIngredients and analyzeText calls
- [ ] Update frontend to call backend endpoints instead of direct Gemini API
- [ ] Remove client-side API key exposure
- [ ] Test functionality and security measures
- [ ] Update README with security notes

## Security Features
- Rate limiting: 100 requests per 15 minutes per IP (configurable)
- Input validation: Schema-based validation for image buffers, text, and user profiles
- API key: Moved to server-side environment variables
- CORS: Configured for frontend origin
- Error handling: Graceful 429s and validation errors
