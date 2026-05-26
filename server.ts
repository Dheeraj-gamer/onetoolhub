import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Set up Google GenAI
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined in environment variables. Falling back to key from process.env if any.");
    }
    return new GoogleGenAI({
      apiKey: apiKey || "dummy-key",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API helper to safely handle Gemini connection issues
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV, hasKey: !!process.env.GEMINI_API_KEY });
  });

  // API Route for Gemini AI Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const ai = getAi();
      
      // format history matching the strict contents array formatting of SDK
      // history items format: { role: 'user' | 'model', parts: [{ text: '...' }] }
      const contents = history && history.length > 0
        ? [...history, { role: "user", parts: [{ text: message }] }]
        : [{ role: "user", parts: [{ text: message }] }];

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: "You are the AI assistant inside 'OneTool Hub' - a premium all-in-one utility platform. Keep your answers extremely brief, practical, friendly, and structured. Perfect for showing on a utility website chat window.",
        }
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Gemini Chat Error:", error);
      res.status(500).json({ error: error.message || "An error occurred with Gemini AI." });
    }
  });

  // API Route for Translation
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLang, sourceLang } = req.body;
      const ai = getAi();
      const prompt = `Translate this text from ${sourceLang || 'auto-detect'} to ${targetLang}: "${text}"`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert translator. Translate the given text accurately. Return ONLY the translated text. Do not write any greetings, explanation, quote wrapper or thoughts. Just output translation directly."
        }
      });
      res.json({ translatedText: response.text });
    } catch (error: any) {
      console.error("Translation Error:", error);
      res.status(500).json({ error: error.message || "An error occurred during translation." });
    }
  });

  // API Route for Weather Info
  app.post("/api/weather", async (req, res) => {
    const { location } = req.body || {};
    try {
      const ai = getAi();
      const prompt = `Get the current weather and 3-day forecast details for local weather search: "${location || 'New York'}". Since weather requires real-time data, search Google to get it. Return the details in valid raw JSON form only.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT" as any,
            properties: {
              location: { type: "STRING" as any },
              temp: { type: "NUMBER" as any, description: "current temperature in Celsius as number" },
              condition: { type: "STRING" as any, description: "e.g. Sunny, Clear, Rainy, Cloudy, Thunderstorm" },
              humidity: { type: "NUMBER" as any, description: "humidity percentage as number" },
              wind: { type: "NUMBER" as any, description: "wind speed in km/h" },
              forecast: {
                type: "ARRAY" as any,
                items: {
                  type: "OBJECT" as any,
                  properties: {
                    day: { type: "STRING" as any, description: "e.g. Wed, Thu, Fri" },
                    temp: { type: "NUMBER" as any, description: "average day temperature" },
                    condition: { type: "STRING" as any, description: "weather condition short" }
                  },
                  required: ["day", "temp", "condition"]
                }
              }
            },
            required: ["location", "temp", "condition", "humidity", "wind", "forecast"]
          }
        }
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Weather API Error:", error);
      // Fallback response with beautiful mock weather in case of search limits/errors
      const loc = location || 'New York';
      res.json({
        location: loc,
        temp: 21,
        condition: "Mostly Sunny",
        humidity: 62,
        wind: 12,
        forecast: [
          { day: "Tomorrow", temp: 22, condition: "Partly Cloudy" },
          { day: "Thu", temp: 20, condition: "Scattered Rain" },
          { day: "Fri", temp: 24, condition: "Sunny" }
        ],
        isFallback: true
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
