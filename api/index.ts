import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Importa as rotas
import { registerRoutes } from '../server/routes.js';
await registerRoutes(app);

// Serve arquivos estáticos em produção
const distPath = path.resolve(__dirname, '..', 'dist', 'public');
app.use(express.static(distPath));

// Fall through para index.html
app.use('*', (_req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

export default app;

