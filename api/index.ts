import express, { type Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer } from 'http';
import { registerRoutes } from '../server/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error('Error:', err);
  if (!res.headersSent) {
    res.status(status).json({ message });
  }
});

// Initialize routes and static files
let initialized = false;

async function initialize() {
  if (initialized) return;
  
  try {
    // Create a dummy HTTP server for registerRoutes (it needs one but we won't use it)
    const dummyServer = createServer(app);
    
    // Register API routes (creates HTTP server but we don't need to listen)
    await registerRoutes(app);
    
    // Serve static files in production
    const distPath = path.resolve(__dirname, '..', 'dist', 'public');
    
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      
      // Fall through to index.html for SPA routing
      app.use('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    } else {
      console.warn(`Static files not found at ${distPath}. Make sure to build the client first.`);
    }
    
    initialized = true;
  } catch (error) {
    console.error('Initialization error:', error);
    throw error;
  }
}

// Vercel serverless function handler
export default async function handler(req: Request, res: Response) {
  try {
    await initialize();
    // Use the Express app to handle the request
    app(req, res);
  } catch (error: any) {
    console.error('Handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

