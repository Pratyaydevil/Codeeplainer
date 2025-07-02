const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 7860;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ✅ Serve index.html for GET /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API: POST /explain
app.post("/explain", async (req, res) => {
  const code = req.body.code;

  if (!code || code.trim() === "") {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    const prompt = `Explain the following code in simple English:\n\n${code}`;
    const result = await model.generateContent(prompt);
    const explanation = result.response.text();
    res.json({ explanation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at: http://localhost:${port}`);
});
