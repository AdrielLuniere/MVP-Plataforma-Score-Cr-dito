import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

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
    const validatedData = financialProfileSchema.parse(data);

    const profile = await prisma.financialProfile.upsert({
      where: { userId },
      update: {
        income: validatedData.income,
        employmentType: validatedData.employmentType,
        contractType: validatedData.contractType,
        monthlyExpenses: validatedData.monthlyExpenses,
        totalDebt: validatedData.totalDebt,
      },
      create: {
        userId,
        income: validatedData.income,
        employmentType: validatedData.employmentType,
        contractType: validatedData.contractType,
        monthlyExpenses: validatedData.monthlyExpenses,
        totalDebt: validatedData.totalDebt,
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

    return profile;
  }

  async getProfile(userId: string) {
    return prisma.financialProfile.findUnique({
      where: { userId },
    });
  }
}
