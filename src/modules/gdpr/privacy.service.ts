import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PrivacyService {
  async exportUserData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        financialProfile: true,
        creditScore: true,
        scoreHistory: true,
        consents: true,
      },
    });

    if (!user) throw new Error('User not found');

    // Remove sensitive fields like password
    const { password, ...safeData } = user;
    return safeData;
  }

  async deleteUserData(userId: string) {
    // Cascaing deletes are handled by Prisma (onDelete: Cascade in schema)
    return prisma.user.delete({
      where: { id: userId },
    });
  }
}
