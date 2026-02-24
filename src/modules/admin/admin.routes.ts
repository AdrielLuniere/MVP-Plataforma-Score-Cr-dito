import { Router, Response } from 'express';
import { AdminService } from './admin.service';
import { authenticate } from '../../infra/http/middlewares/auth';
import { authorize } from '../../infra/http/middlewares/role';
import { PrismaClient } from '@prisma/client';

const adminRouter = Router();
const adminService = new AdminService();
const prisma = new PrismaClient();

// Middleware de Auditoria para Admin
const auditAdminAction = (action: string) => async (req: any, res: any, next: any) => {
  res.on('finish', async () => {
    if (res.statusCode < 400) {
      await prisma.auditLog.create({
        data: {
          userId: req.user.userId,
          action: `ADMIN_${action}`,
          resource: req.originalUrl,
          details: { method: req.method, timestamp: new Date().toISOString() },
          ipAddress: req.ip,
        },
      });
    }
  });
  next();
};

adminRouter.get('/users', authenticate, authorize(['ADMIN']), auditAdminAction('VIEW_USERS'), async (req: any, res: Response) => {
  try {
    const users = await adminService.listUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.get('/stats', authenticate, authorize(['ADMIN', 'AUDITOR']), auditAdminAction('VIEW_STATS'), async (req: any, res: Response) => {
  try {
    const stats = await adminService.getSystemStats();
    res.status(200).json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.post('/config-weights', authenticate, authorize(['ADMIN']), auditAdminAction('UPDATE_WEIGHTS'), async (req: any, res: Response) => {
  try {
    const config = await adminService.updateScoringWeights(req.body);
    res.status(200).json(config);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export { adminRouter };
