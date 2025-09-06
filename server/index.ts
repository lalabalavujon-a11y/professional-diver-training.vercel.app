import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import dotenv from "dotenv";

// Error handling for unhandled rejections and exceptions
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION', err);
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION', err);
  process.exit(1);
});

// Load environment variables from parent directory
dotenv.config({ path: '../.env.local' });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple request logging
app.use((req, _res, next) => { 
  console.log(`${req.method} ${req.url}`); 
  next(); 
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(`${new Date().toLocaleTimeString()} [express] ${logLine}`);
    }
  });

  next();
});

// Health check endpoint
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

async function main() {
  console.log(`🔧 Using local SQLite database for development`);
  // await db.connect()   // if this throws, you'll see it
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // VITE COMPLETELY REMOVED - PURE EXPRESS API SERVER ONLY
  const port = Number(process.env.PORT) || 5000;
  const host = process.env.HOST || '127.0.0.1';
  const serverInstance = app.listen(port, host, () => {
    const addr = serverInstance.address();
    console.log(`[express] serving on http://${host}:${port}`);
  });
}

main().catch((e) => {
  console.error('FATAL BOOT ERROR', e);
  process.exit(1);
});
