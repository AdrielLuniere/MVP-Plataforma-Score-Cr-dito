import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ExternalApiService {
  /**
   * Simula a busca de dados bancários de um provedor de Open Banking (ex: Tink, TrueLayer).
   * Em um cenário real, isso envolveria OAuth2 e chamadas REST para o provedor.
   */
  async fetchMockBankingData(userId: string) {
    // Simulando delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Dados fictícios baseados no perfil europeu médio
    const mockData = {
      income: 3500.00,
      monthlyExpenses: 1200.00,
      totalDebt: 5000.00,
      employmentType: 'FULL_TIME',
      contractType: 'PERMANENT',
      provider: 'MockBank_EU',
      referenceId: `PSD2-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };

    return mockData;
  }

  /**
   * Sincroniza os dados do banco simulado com o perfil financeiro interno do usuário.
   */
  async syncAccount(userId: string) {
    const bankingData = await this.fetchMockBankingData(userId);

    const profile = await prisma.financialProfile.upsert({
      where: { userId },
      update: {
        income: bankingData.income,
        monthlyExpenses: bankingData.monthlyExpenses,
        totalDebt: bankingData.totalDebt,
        employmentType: bankingData.employmentType,
        contractType: bankingData.contractType,
      },
      create: {
        userId,
        income: bankingData.income,
        monthlyExpenses: bankingData.monthlyExpenses,
        totalDebt: bankingData.totalDebt,
        employmentType: bankingData.employmentType,
        contractType: bankingData.contractType,
      },
    });

    // Registrar log de auditoria da sincronização
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'OPEN_BANKING_SYNC',
        resource: `FinancialProfile:${profile.id}`,
        details: { provider: bankingData.provider, referenceId: bankingData.referenceId },
      }
    });

    return {
      message: 'Financial data successfully synced via Open Banking (Mock)',
      profile
    };
  }
}
