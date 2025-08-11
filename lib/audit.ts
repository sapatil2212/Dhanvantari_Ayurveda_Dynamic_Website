import { prisma } from '@/lib/prisma';

type AuditParams = {
  userId: string;
  action: string; // CREATE, UPDATE, DELETE, ROLE_CHANGE, BACKUP, etc
  entityType: string; // User, SystemSetting, Backup, etc
  entityId?: string | null;
  oldValues?: unknown;
  newValues?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export async function recordAudit(params: AuditParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId ?? null,
        oldValues: params.oldValues ? (params.oldValues as any) : undefined,
        newValues: params.newValues ? (params.newValues as any) : undefined,
        ipAddress: params.ipAddress ?? null,
        userAgent: params.userAgent ?? null,
      },
    });
  } catch (e) {
    // Avoid breaking main flow due to audit failure
    console.error('Failed to record audit log:', e);
  }
}


