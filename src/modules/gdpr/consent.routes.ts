import { Router, Response } from 'express';
import { ConsentService } from './consent.service';
import { authenticate } from '../../infra/http/middlewares/auth';

const consentRouter = Router();
const consentService = new ConsentService();

consentRouter.post('/agree', authenticate, async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const { agreed } = req.body;
    
    if (typeof agreed !== 'boolean') {
      return res.status(400).json({ error: 'Field "agreed" must be a boolean.' });
    }

    const consent = await consentService.registerConsent(userId, agreed, req.ip);
    res.status(201).json(consent);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

consentRouter.get('/status', authenticate, async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const hasConsent = await consentService.hasConsent(userId);
    res.status(200).json({ hasConsent });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { consentRouter };
