import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { authRouter } from './modules/identity/auth.routes';
import { financialRouter } from './modules/financial/financial.routes';
import { consentRouter } from './modules/gdpr/consent.routes';
import { privacyRouter } from './modules/gdpr/privacy.routes';
import { creditScoreRouter } from './modules/credit-score/credit-score.routes';
import { adminRouter } from './modules/admin/admin.routes';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/auth', authRouter);
app.use('/financial', financialRouter);
app.use('/gdpr/consent', consentRouter);
app.use('/gdpr/privacy', privacyRouter);
app.use('/credit-score', creditScoreRouter);
app.use('/admin', adminRouter);

// Documentação Swagger (Simples para MVP)
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'European Credit Score Platform API',
    version: '1.0.0',
    description: 'API for managing financial data, GDPR compliance, and credit scoring.'
  },
  servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
  paths: {
    '/auth/register': { post: { summary: 'Register a new user', tags: ['Auth'] } },
    '/auth/login': { post: { summary: 'Login and get JWT', tags: ['Auth'] } },
    '/financial/profile': { 
      post: { summary: 'Upsert financial profile', tags: ['Financial'], security: [{ bearerAuth: [] }] },
      get: { summary: 'Get financial profile', tags: ['Financial'], security: [{ bearerAuth: [] }] }
    },
    '/financial/sync': { post: { summary: 'Sync via Open Banking (PSD2 Mock)', tags: ['Financial'], security: [{ bearerAuth: [] }] } },
    '/credit-score': { get: { summary: 'Get current credit score', tags: ['CreditScore'], security: [{ bearerAuth: [] }] } },
    '/credit-score/simulate': { post: { summary: 'Simulate score changes', tags: ['CreditScore'], security: [{ bearerAuth: [] }] } },
    '/gdpr/consent/agree': { post: { summary: 'Register GDPR consent', tags: ['GDPR'], security: [{ bearerAuth: [] }] } },
    '/gdpr/privacy/export': { get: { summary: 'Export user data', tags: ['GDPR'], security: [{ bearerAuth: [] }] } },
    '/admin/stats': { get: { summary: 'Get system stats (Admin only)', tags: ['Admin'], security: [{ bearerAuth: [] }] } }
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start Server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
