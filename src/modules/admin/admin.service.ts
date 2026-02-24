import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminService {
  async listUsers() {
    return prisma.user.findMany({
      include: {
        financialProfile: true,
        creditScore: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSystemStats() {
    const totalUsers = await prisma.user.count();
    const scores = await prisma.creditScore.findMany({ select: { score: true, riskLevel: true } });

    const avgScore = scores.length > 0 
      ? scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length 
      : 0;

    const riskDistribution = scores.reduce((acc: any, curr) => {
      acc[curr.riskLevel] = (acc[curr.riskLevel] || 0) + 1;
      return acc;
    }, {});

    return {
      totalUsers,
      averageScore: Math.round(avgScore),
      riskDistribution,
    };
  }

  async updateScoringWeights(weights: any) {
    return prisma.systemConfig.upsert({
      where: { key: 'SCORING_WEIGHTS' },
      update: { value: weights },
      create: { key: 'SCORING_WEIGHTS', value: weights },
    });
  }
}
