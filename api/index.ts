import express, { type Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
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
let initPromise: Promise<void> | null = null;

async function initialize() {
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    try {
      console.log('Initializing Vercel handler...');
      console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
      
      // Register API routes (creates HTTP server but we don't need to listen)
      await registerRoutes(app);
      console.log('Routes registered');
      
      // Serve static files in production
      const distPath = path.resolve(__dirname, '..', 'dist', 'public');
      
      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        
        // Fall through to index.html for SPA routing
        app.use('*', (_req, res) => {
          res.sendFile(path.resolve(distPath, 'index.html'));
        });
        console.log('Static files configured');
      } else {
        console.warn(`Static files not found at ${distPath}. Make sure to build the client first.`);
      }
      
      console.log('Initialization complete');
    } catch (error: any) {
      console.error('Initialization error:', error);
      console.error('Error stack:', error?.stack);
      initPromise = null; // Reset so we can retry
      throw error;
    }
  })();
  
  return initPromise;
}

// Vercel serverless function handler
export default async function handler(req: Request, res: Response) {
  try {
    // Ensure initialization completes before handling request
    await initialize();
    
    // Wrap Express handler in a Promise to ensure it completes
    return new Promise<void>((resolve, reject) => {
      let resolved = false;
      
      const cleanup = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };
      
      // Handle request completion
      res.on('finish', cleanup);
      res.on('close', cleanup);
      
      // Handle errors
      const errorHandler = (err: any) => {
        if (err && !resolved) {
          console.error('Express handler error:', err);
          if (!res.headersSent) {
            res.status(500).json({ message: 'Internal server error' });
          }
          resolved = true;
          reject(err);
        }
      };
      
      // Use Express app to handle request
      app(req, res, errorHandler);
    });
  } catch (error: any) {
    console.error('Handler error:', error);
    console.error('Error stack:', error?.stack);
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error?.message : undefined
      });
    }
    throw error;
  }
}

