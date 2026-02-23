import { PrismaClient, RiskLevel } from '@prisma/client';

const prisma = new PrismaClient();

export class CreditScoreService {
  async calculateAndSave(userId: string) {
    const profile = await prisma.financialProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error('Financial profile not found. Complete profile before scoring.');
    }

    const score = this.calculateScore(profile);
    const riskLevel = this.determineRiskLevel(score);

    const creditScore = await prisma.creditScore.upsert({
      where: { userId },
      update: {
        score,
        riskLevel,
        lastCalculated: new Date(),
      },
      create: {
        userId,
        score,
        riskLevel,
      },
    });

    // Registrar histórico
    await prisma.scoreHistory.create({
      data: {
        creditScoreId: creditScore.id,
        score,
        reason: 'PROFILE_UPDATE_OR_MANUAL_RECALC',
      },
    });

    return creditScore;
  }

  async getScore(userId: string) {
    return prisma.creditScore.findUnique({
      where: { userId },
      include: {
        history: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
    });
  }

  private calculateScore(profile: any): number {
    let finalScore = 0;

    // 1. Renda Líquida (40% - 400 pts)
    const netIncome = profile.income - profile.monthlyExpenses;
    if (netIncome > 5000) finalScore += 400;
    else if (netIncome > 2000) finalScore += 250;
    else if (netIncome > 0) finalScore += 100;

    // 2. Relação Dívida/Renda (30% - 300 pts)
    const debtRatio = profile.totalDebt / (profile.income || 1);
    if (debtRatio < 0.1) finalScore += 300;
    else if (debtRatio < 0.5) finalScore += 150;
    else if (debtRatio < 1) finalScore += 50;

    // 3. Estabilidade de Emprego (20% - 200 pts)
    const contractWeights: Record<string, number> = {
      'PERMANENT': 200,
      'INDETERMINATE': 150,
      'TEMPORARY': 50,
      'NOT_APPLICABLE': 0,
    };
    finalScore += contractWeights[profile.contractType] || 0;

    // 4. Tipo de Ocupação (10% - 100 pts)
    const occupationWeights: Record<string, number> = {
      'FULL_TIME': 100,
      'SELF_EMPLOYED': 70,
      'FREELANCE': 50,
      'PART_TIME': 40,
      'RETIRED': 30,
      'UNEMPLOYED': 0,
    };
    finalScore += occupationWeights[profile.employmentType] || 0;

    return Math.min(1000, Math.max(0, finalScore));
  }

  private determineRiskLevel(score: number): RiskLevel {
    if (score >= 700) return 'LOW';
    if (score >= 500) return 'MEDIUM';
    if (score >= 300) return 'HIGH';
    return 'VERY_HIGH';
  }
}
