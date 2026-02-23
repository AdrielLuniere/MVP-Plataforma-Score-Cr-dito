import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ConsentService {
  async registerConsent(userId: string, agreed: boolean, ipAddress?: string) {
    return prisma.consent.create({
      data: {
        userId,
        agreed,
        consentType: 'GDPR_DATA_PROCESSING',
        version: 'v1.0.0',
        ipAddress,
      },
    });
  }

  async hasConsent(userId: string): Promise<boolean> {
    const lastConsent = await prisma.consent.findFirst({
      where: { userId, consentType: 'GDPR_DATA_PROCESSING' },
      orderBy: { timestamp: 'desc' },
    });

    return !!lastConsent?.agreed;
  }
}
