import express from 'express';
import path from 'path';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Importa as rotas
import { registerRoutes } from '../server/routes';
registerRoutes(app);

// Serve arquivos estáticos em produção
const distPath = path.resolve(__dirname, '..', 'dist', 'public');
app.use(express.static(distPath));

// Fall through para index.html
app.use('*', (_req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

export default app;

