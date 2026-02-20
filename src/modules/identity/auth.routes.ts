import { Router, Request, Response } from 'express';
import { AuthService } from './auth.service';

const authRouter = Router();
const authService = new AuthService();

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export { authRouter };
