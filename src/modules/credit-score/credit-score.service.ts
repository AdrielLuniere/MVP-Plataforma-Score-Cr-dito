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

    const { score, factors } = this.calculateScore(profile);
    const riskLevel = this.determineRiskLevel(score);

    const creditScore = await prisma.creditScore.upsert({
      where: { userId },
      update: {
        score,
        riskLevel,
        factors,
        lastCalculated: new Date(),
      },
      create: {
        userId,
        score,
        riskLevel,
        factors,
      },
    });

    // Registrar histórico (campos conforme schema: userId, score, riskLevel, reason)
    await prisma.scoreHistory.create({
      data: {
        userId,
        score,
        riskLevel,
        reason: 'PROFILE_UPDATE_OR_MANUAL_RECALC',
      },
    });

    return creditScore;
  }

  async getScore(userId: string) {
    const score = await prisma.creditScore.findUnique({
      where: { userId },
    });

    const history = await prisma.scoreHistory.findMany({
      where: { userId },
      orderBy: { changeDate: 'desc' },
      take: 10,
    });

    return { ...score, history };
  }

  public calculateScore(profile: any): { score: number; factors: any } {
    let finalScore = 0;
    const factors: { positive: string[]; negative: string[] } = {
      positive: [],
      negative: [],
    };

    // 1. Renda Líquida (40% - 400 pts)
    const netIncome = Number(profile.income) - Number(profile.monthlyExpenses);
    if (netIncome > 5000) {
      finalScore += 400;
      factors.positive.push('High net monthly income');
    } else if (netIncome > 2000) {
      finalScore += 250;
      factors.positive.push('Stable net monthly income');
    } else if (netIncome > 0) {
      finalScore += 100;
    } else {
      factors.negative.push('Negative or very low net income');
    }

    // 2. Relação Dívida/Renda (30% - 300 pts)
    const debtRatio = Number(profile.totalDebt) / (Number(profile.income) || 1);
    if (debtRatio < 0.1) {
      finalScore += 300;
      factors.positive.push('Very low debt-to-income ratio');
    } else if (debtRatio < 0.5) {
      finalScore += 150;
      factors.positive.push('Manageable debt levels');
    } else if (debtRatio > 1) {
      factors.negative.push('Total debt exceeds annual income');
    }

    // 3. Estabilidade de Emprego (20% - 200 pts)
    const contractWeights: Record<string, number> = {
      'PERMANENT': 200,
      'INDETERMINATE': 150,
      'TEMPORARY': 50,
      'NOT_APPLICABLE': 0,
    };
    const cWeight = contractWeights[profile.contractType] || 0;
    finalScore += cWeight;
    
    if (profile.contractType === 'PERMANENT') factors.positive.push('Employment stability (Permanent contract)');
    else if (profile.contractType === 'TEMPORARY') factors.negative.push('Temporary contract contract reduces stability score');

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
    
    if (profile.employmentType === 'UNEMPLOYED') factors.negative.push('Current unemployment status');

    return { 
      score: Math.min(1000, Math.max(0, finalScore)), 
      factors 
    };
  }

  private determineRiskLevel(score: number): RiskLevel {
    if (score >= 700) return 'LOW';
    if (score >= 500) return 'MEDIUM';
    if (score >= 300) return 'HIGH';
    return 'VERY_HIGH';
  }
}
