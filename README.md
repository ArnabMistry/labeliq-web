# LABELIQ

**LABELIQ** is a consumer-focused food transparency platform designed to help people make informed decisions about what they eat. It decodes complex ingredient labels and translates them into clear, actionable health insights.

---

## 🎯 Who It’s For

LABELIQ is built for:
- Health-conscious individuals
- People with medical conditions or food allergies
- First responders, pilots, athletes, and frequent travelers
- Anyone who needs to stay physically and mentally fit
- Users who want awareness and control over packaged food consumption

---

## 🧩 The Problem

Packaged and processed foods often contain:
- Adulterated or harmful ingredients  
- Preservatives and chemical codes that are hard to understand  
- Substances that may trigger allergies, affect weight, or increase long-term health risks  

Ingredient labels are legally compliant but **not human-friendly**.  
Understanding them currently requires searching, cross-checking, and medical knowledge—an unrealistic expectation for most users.

---

## 💡 The Solution

LABELIQ simplifies food label analysis by:
- Scanning ingredient labels (via camera or image upload)
- Identifying and decoding complex ingredient names and codes
- Providing a clear, concise overview of each ingredient
- Flagging safety concerns, allergens, and potential health risks
- Helping users evaluate products based on personal health goals and medical background

The goal is **awareness, clarity, and better everyday food choices**.

---

## 📱 Platform Direction (Decision Pending)

LABELIQ is being designed **mobile-first**, as real-world usage primarily happens on phones.

Two possible directions:
- **Mobile App**:  
  - Built with **React Native**  
  - Accompanied by a lightweight web landing page for app distribution
- **Web App**:  
  - Built with **React / Next.js**, Tailwind CSS  
  - Optimized for mobile browsers with app-like UX

The final decision will be made based on scalability, performance, camera access, and long-term product vision.

---

## 🛠️ Engineering & Tech Philosophy

LABELIQ is being built with **industry-standard engineering practices**, focusing on:
- Clean architecture and separation of concerns
- Scalable and maintainable system design
- Performance optimization and reliability
- **Security-first approach**: Rate limiting, input validation, secure API key handling
- High code quality and collaboration readiness
- Building in public with transparency and iteration

The project prioritizes **long-term sustainability over short-term hacks**.

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP to prevent abuse
- **Input Validation**: Schema-based validation using Joi for all user inputs
- **Secure API Handling**: Gemini API key stored server-side only, never exposed to client
- **CORS Protection**: Configured to allow only frontend origin
- **Error Handling**: Graceful 429 responses for rate limits, detailed validation errors

---

## 🚧 Project Status

- Web version: **In active development**
- Mobile app: **Under evaluation**
- Architecture & tech decisions: **Ongoing**

---

**LABELIQ** aims to make food labels honest, understandable, and useful—without requiring users to be scientists.
