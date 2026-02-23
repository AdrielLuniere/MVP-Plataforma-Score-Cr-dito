import { Router, Response } from 'express';
import { CreditScoreService } from './credit-score.service';
import { authenticate } from '../../infra/http/middlewares/auth';

const creditScoreRouter = Router();
const creditScoreService = new CreditScoreService();

creditScoreRouter.get('/', authenticate, async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const score = await creditScoreService.getScore(userId);
    
    if (!score) {
      return res.status(404).json({ error: 'Credit score not found. Please complete profile first.' });
    }
    
    res.status(200).json(score);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

creditScoreRouter.post('/recalculate', authenticate, async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const score = await creditScoreService.calculateAndSave(userId);
    res.status(200).json(score);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export { creditScoreRouter };
