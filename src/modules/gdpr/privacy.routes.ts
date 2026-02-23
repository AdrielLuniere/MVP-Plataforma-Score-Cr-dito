import { Router, Response } from 'express';
import { PrivacyService } from './privacy.service';
import { authenticate } from '../../infra/http/middlewares/auth';

const privacyRouter = Router();
const privacyService = new PrivacyService();

privacyRouter.get('/export', authenticate, async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const data = await privacyService.exportUserData(userId);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

privacyRouter.delete('/delete', authenticate, async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    await privacyService.deleteUserData(userId);
    res.status(200).json({ message: 'User data successfully deleted.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { privacyRouter };
