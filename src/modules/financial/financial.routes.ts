import { Router, Response } from 'express';
import { FinancialService } from './financial.service';
import { authenticate } from '../../infra/http/middlewares/auth';

const financialRouter = Router();
const financialService = new FinancialService();

financialRouter.post('/profile', authenticate, async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const profile = await financialService.upsertProfile(userId, req.body);
    res.status(200).json(profile);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

financialRouter.get('/profile', authenticate, async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const profile = await financialService.getProfile(userId);
    if (!profile) {
      return res.status(404).json({ error: 'Financial profile not found' });
    }
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { financialRouter };
