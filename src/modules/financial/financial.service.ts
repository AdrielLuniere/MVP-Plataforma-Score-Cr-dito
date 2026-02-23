import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { encrypt } from '../../shared/utils/encryption';
import { ConsentService } from '../gdpr/consent.service';
import { CreditScoreService } from '../credit-score/credit-score.service';

const prisma = new PrismaClient();
const consentService = new ConsentService();
const creditScoreService = new CreditScoreService();

export const EmploymentTypeEnum = z.enum([
  'FULL_TIME',
  'PART_TIME',
  'FREELANCE',
  'SELF_EMPLOYED',
  'UNEMPLOYED',
  'RETIRED',
]);

export const ContractTypeEnum = z.enum([
  'PERMANENT',
  'TEMPORARY',
  'INDETERMINATE',
  'NOT_APPLICABLE',
]);

export const financialProfileSchema = z.object({
  income: z.number().min(0).max(1000000),
  employmentType: z.string().transform((val: string) => val.trim().toUpperCase()).pipe(EmploymentTypeEnum),
  contractType: z.string().transform((val: string) => val.trim().toUpperCase()).pipe(ContractTypeEnum),
  monthlyExpenses: z.number().min(0).max(1000000),
  totalDebt: z.number().min(0).max(10000000),
});

export type CreateFinancialProfileDTO = z.infer<typeof financialProfileSchema>;

export class FinancialService {
  async upsertProfile(userId: string, data: CreateFinancialProfileDTO) {
    const hasConsent = await consentService.hasConsent(userId);
    if (!hasConsent) {
      throw new Error('GDPR consent required to process financial data. Please visit /gdpr/consent/agree');
    }

    const validatedData = financialProfileSchema.parse(data);

    // Encrypt sensitive data for storage
    const sensitiveJson = JSON.stringify(validatedData);
    const encryptedData = encrypt(sensitiveJson);

    const profile = await prisma.financialProfile.upsert({
      where: { userId },
      update: {
        income: validatedData.income,
        employmentType: validatedData.employmentType,
        contractType: validatedData.contractType,
        monthlyExpenses: validatedData.monthlyExpenses,
        totalDebt: validatedData.totalDebt,
        encryptedData: encryptedData,
      },
      create: {
        userId,
        income: validatedData.income,
        employmentType: validatedData.employmentType,
        contractType: validatedData.contractType,
        monthlyExpenses: validatedData.monthlyExpenses,
        totalDebt: validatedData.totalDebt,
        encryptedData: encryptedData,
      },
    });

    // Auditoria básica
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'FINANCIAL_PROFILE_UPSERT',
        resource: `FinancialProfile:${profile.id}`,
        details: { timestamp: new Date().toISOString() },
      },
    });

    // Recalcular Score automaticamente
    await creditScoreService.calculateAndSave(userId);

    return profile;
  }

  async getProfile(userId: string) {
    return prisma.financialProfile.findUnique({
      where: { userId },
    });
  }
}
