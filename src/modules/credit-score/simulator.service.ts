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

    if (!currentProfile) {
      throw new Error('Profile not found for simulation');
    }

    // Merge actual data with simulated changes
    const simulatedProfile = {
      ...currentProfile,
      income: changes.income !== undefined ? changes.income : Number(currentProfile.income),
      totalDebt: changes.totalDebt !== undefined ? changes.totalDebt : Number(currentProfile.totalDebt),
      monthlyExpenses: changes.monthlyExpenses !== undefined ? changes.monthlyExpenses : Number(currentProfile.monthlyExpenses),
      contractType: changes.contractType !== undefined ? changes.contractType : currentProfile.contractType,
      employmentType: changes.employmentType !== undefined ? changes.employmentType : currentProfile.employmentType,
    };

    // Use internal calculateScore from CreditScoreService
    // Since calculateScore is private, we'll need to make it public or use it here
    // For now, I'll use the service instance if I make it accessible
    return await this.creditScoreService.calculateScore(simulatedProfile);
  }
}
