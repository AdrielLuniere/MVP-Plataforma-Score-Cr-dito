import { CreditScoreService } from './credit-score.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CreditScoreSimulator {
  private creditScoreService: CreditScoreService;

  constructor() {
    this.creditScoreService = new CreditScoreService();
  }

  async simulate(userId: string, changes: { 
    income?: number; 
    totalDebt?: number; 
    monthlyExpenses?: number;
    contractType?: string;
    employmentType?: string;
  }) {
    const currentProfile = await prisma.financialProfile.findUnique({
      where: { userId },
    });

    // We allow simulation even if profile doesn't exist by using defaults
    const baseProfile = currentProfile || {
      income: 0,
      totalDebt: 0,
      monthlyExpenses: 0,
      contractType: 'TEMPORARY',
      employmentType: 'FREELANCE'
    };

    // Merge actual data or defaults with simulated changes
    const simulatedProfile = {
      ...baseProfile,
      income: changes.income !== undefined ? changes.income : Number(baseProfile.income),
      totalDebt: changes.totalDebt !== undefined ? changes.totalDebt : Number(baseProfile.totalDebt),
      monthlyExpenses: changes.monthlyExpenses !== undefined ? changes.monthlyExpenses : Number(baseProfile.monthlyExpenses),
      contractType: changes.contractType !== undefined ? changes.contractType : baseProfile.contractType,
      employmentType: changes.employmentType !== undefined ? changes.employmentType : baseProfile.employmentType,
    };

    // Use internal calculateScore from CreditScoreService
    // Since calculateScore is private, we'll need to make it public or use it here
    // For now, I'll use the service instance if I make it accessible
    return await this.creditScoreService.calculateScore(simulatedProfile);
  }
}
