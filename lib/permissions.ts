export enum Permission {
  // Patient Management
  VIEW_PATIENTS = 'view_patients',
  CREATE_PATIENTS = 'create_patients',
  EDIT_PATIENTS = 'edit_patients',
  DELETE_PATIENTS = 'delete_patients',
  EXPORT_PATIENTS = 'export_patients',
  
  // Appointment Management
  VIEW_APPOINTMENTS = 'view_appointments',
  CREATE_APPOINTMENTS = 'create_appointments',
  EDIT_APPOINTMENTS = 'edit_appointments',
  DELETE_APPOINTMENTS = 'delete_appointments',
  RESCHEDULE_APPOINTMENTS = 'reschedule_appointments',
  CANCEL_APPOINTMENTS = 'cancel_appointments',
  
  // Prescription Management
  VIEW_PRESCRIPTIONS = 'view_prescriptions',
  CREATE_PRESCRIPTIONS = 'create_prescriptions',
  EDIT_PRESCRIPTIONS = 'edit_prescriptions',
  DELETE_PRESCRIPTIONS = 'delete_prescriptions',
  SHARE_PRESCRIPTIONS = 'share_prescriptions',
  
  // Billing & Invoices
  VIEW_INVOICES = 'view_invoices',
  CREATE_INVOICES = 'create_invoices',
  EDIT_INVOICES = 'edit_invoices',
  DELETE_INVOICES = 'delete_invoices',
  PROCESS_PAYMENTS = 'process_payments',
  VIEW_PAYMENTS = 'view_payments',
  
  // Medical Records
  VIEW_MEDICAL_RECORDS = 'view_medical_records',
  CREATE_MEDICAL_RECORDS = 'create_medical_records',
  EDIT_MEDICAL_RECORDS = 'edit_medical_records',
  DELETE_MEDICAL_RECORDS = 'delete_medical_records',
  
  // Analytics & Reports
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_REPORTS = 'export_reports',
  VIEW_FINANCIAL_REPORTS = 'view_financial_reports',
  
  // User Management
  VIEW_USERS = 'view_users',
  CREATE_USERS = 'create_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',
  MANAGE_ROLES = 'manage_roles',
  
  // System Settings
  MANAGE_SETTINGS = 'manage_settings',
  VIEW_LOGS = 'view_logs',
  MANAGE_BACKUPS = 'manage_backups',
  
  // Notifications
  SEND_NOTIFICATIONS = 'send_notifications',
  MANAGE_NOTIFICATIONS = 'manage_notifications',
  
  // API Access
  API_ACCESS = 'api_access',
  WEBHOOK_MANAGEMENT = 'webhook_management',
  
  // Inventory Management
  VIEW_INVENTORY = 'view_inventory',
  CREATE_INVENTORY = 'create_inventory',
  EDIT_INVENTORY = 'edit_inventory',
  DELETE_INVENTORY = 'delete_inventory',
  MANAGE_PURCHASE_ORDERS = 'manage_purchase_orders',
  VIEW_SUPPLIERS = 'view_suppliers',
  MANAGE_SUPPLIERS = 'manage_suppliers'
}

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  PHARMACIST = 'PHARMACIST',
  ACCOUNTANT = 'ACCOUNTANT',
  PATIENT = 'PATIENT',
  OTHER = 'OTHER'
}

export const RolePermissions: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: Object.values(Permission),
  
  [Role.ADMIN]: [
    Permission.VIEW_PATIENTS,
    Permission.CREATE_PATIENTS,
    Permission.EDIT_PATIENTS,
    Permission.DELETE_PATIENTS,
    Permission.EXPORT_PATIENTS,
    Permission.VIEW_APPOINTMENTS,
    Permission.CREATE_APPOINTMENTS,
    Permission.EDIT_APPOINTMENTS,
    Permission.DELETE_APPOINTMENTS,
    Permission.RESCHEDULE_APPOINTMENTS,
    Permission.CANCEL_APPOINTMENTS,
    Permission.VIEW_PRESCRIPTIONS,
    Permission.CREATE_PRESCRIPTIONS,
    Permission.EDIT_PRESCRIPTIONS,
    Permission.DELETE_PRESCRIPTIONS,
    Permission.SHARE_PRESCRIPTIONS,
    Permission.VIEW_INVOICES,
    Permission.CREATE_INVOICES,
    Permission.EDIT_INVOICES,
    Permission.DELETE_INVOICES,
    Permission.PROCESS_PAYMENTS,
    Permission.VIEW_PAYMENTS,
    Permission.VIEW_MEDICAL_RECORDS,
    Permission.CREATE_MEDICAL_RECORDS,
    Permission.EDIT_MEDICAL_RECORDS,
    Permission.DELETE_MEDICAL_RECORDS,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_REPORTS,
    Permission.VIEW_FINANCIAL_REPORTS,
    Permission.VIEW_USERS,
    Permission.CREATE_USERS,
    Permission.EDIT_USERS,
    Permission.DELETE_USERS,
    Permission.MANAGE_ROLES,
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_LOGS,
    Permission.MANAGE_BACKUPS,
    Permission.SEND_NOTIFICATIONS,
    Permission.MANAGE_NOTIFICATIONS,
    Permission.API_ACCESS,
    Permission.WEBHOOK_MANAGEMENT,
    Permission.VIEW_INVENTORY,
    Permission.CREATE_INVENTORY,
    Permission.EDIT_INVENTORY,
    Permission.DELETE_INVENTORY,
    Permission.MANAGE_PURCHASE_ORDERS,
    Permission.VIEW_SUPPLIERS,
    Permission.MANAGE_SUPPLIERS
  ],
  
  [Role.DOCTOR]: [
    Permission.VIEW_PATIENTS,
    Permission.CREATE_PATIENTS,
    Permission.EDIT_PATIENTS,
    Permission.VIEW_APPOINTMENTS,
    Permission.CREATE_APPOINTMENTS,
    Permission.EDIT_APPOINTMENTS,
    Permission.RESCHEDULE_APPOINTMENTS,
    Permission.CANCEL_APPOINTMENTS,
    Permission.VIEW_PRESCRIPTIONS,
    Permission.CREATE_PRESCRIPTIONS,
    Permission.EDIT_PRESCRIPTIONS,
    Permission.SHARE_PRESCRIPTIONS,
    Permission.VIEW_MEDICAL_RECORDS,
    Permission.CREATE_MEDICAL_RECORDS,
    Permission.EDIT_MEDICAL_RECORDS,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_REPORTS,
    Permission.SEND_NOTIFICATIONS,
    // Grant full System access for doctors per request
    Permission.VIEW_USERS,
    Permission.CREATE_USERS,
    Permission.EDIT_USERS,
    Permission.DELETE_USERS,
    Permission.MANAGE_ROLES,
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_LOGS,
    Permission.MANAGE_BACKUPS
  ],
  
  [Role.NURSE]: [
    Permission.VIEW_PATIENTS,
    Permission.EDIT_PATIENTS,
    Permission.VIEW_APPOINTMENTS,
    Permission.CREATE_APPOINTMENTS,
    Permission.EDIT_APPOINTMENTS,
    Permission.RESCHEDULE_APPOINTMENTS,
    Permission.VIEW_PRESCRIPTIONS,
    Permission.VIEW_MEDICAL_RECORDS,
    Permission.CREATE_MEDICAL_RECORDS,
    Permission.EDIT_MEDICAL_RECORDS,
    Permission.SEND_NOTIFICATIONS
  ],
  
  [Role.RECEPTIONIST]: [
    Permission.VIEW_PATIENTS,
    Permission.CREATE_PATIENTS,
    Permission.EDIT_PATIENTS,
    Permission.VIEW_APPOINTMENTS,
    Permission.CREATE_APPOINTMENTS,
    Permission.EDIT_APPOINTMENTS,
    Permission.RESCHEDULE_APPOINTMENTS,
    Permission.CANCEL_APPOINTMENTS,
    Permission.VIEW_INVOICES,
    Permission.CREATE_INVOICES,
    Permission.EDIT_INVOICES,
    Permission.PROCESS_PAYMENTS,
    Permission.VIEW_PAYMENTS,
    Permission.SEND_NOTIFICATIONS
  ],
  
  [Role.PHARMACIST]: [
    Permission.VIEW_PATIENTS,
    Permission.VIEW_PRESCRIPTIONS,
    Permission.EDIT_PRESCRIPTIONS,
    Permission.SHARE_PRESCRIPTIONS,
    Permission.VIEW_INVOICES,
    Permission.CREATE_INVOICES,
    Permission.EDIT_INVOICES,
    Permission.PROCESS_PAYMENTS,
    Permission.VIEW_PAYMENTS,
    Permission.VIEW_INVENTORY,
    Permission.CREATE_INVENTORY,
    Permission.EDIT_INVENTORY,
    Permission.MANAGE_PURCHASE_ORDERS,
    Permission.VIEW_SUPPLIERS
  ],
  
  [Role.ACCOUNTANT]: [
    Permission.VIEW_PATIENTS,
    Permission.VIEW_INVOICES,
    Permission.CREATE_INVOICES,
    Permission.EDIT_INVOICES,
    Permission.DELETE_INVOICES,
    Permission.PROCESS_PAYMENTS,
    Permission.VIEW_PAYMENTS,
    Permission.VIEW_FINANCIAL_REPORTS,
    Permission.EXPORT_REPORTS
  ],
  
  [Role.PATIENT]: [
    Permission.VIEW_PATIENTS, // Only their own record
    Permission.VIEW_APPOINTMENTS, // Only their own appointments
    Permission.VIEW_PRESCRIPTIONS, // Only their own prescriptions
    Permission.VIEW_INVOICES, // Only their own invoices
    Permission.VIEW_PAYMENTS // Only their own payments
  ],
  
  [Role.OTHER]: [
    // Minimal permissions for other users
    Permission.VIEW_PATIENTS, // Only their own record
    Permission.VIEW_APPOINTMENTS, // Only their own appointments
    Permission.VIEW_PRESCRIPTIONS, // Only their own prescriptions
    Permission.VIEW_INVOICES, // Only their own invoices
    Permission.VIEW_PAYMENTS // Only their own payments
  ]
};

// Convenience wrapper used by API routes
export function checkPermission(userRole: Role | undefined, permission: Permission): boolean {
  if (!userRole) return false;
  return hasPermission(userRole, permission);
}

export function hasPermission(userRole: Role, permission: Permission): boolean {
  return RolePermissions[userRole]?.includes(permission) || false;
}

export function hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

export function hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

export function getPermissionsForRole(role: Role): Permission[] {
  return RolePermissions[role] || [];
}

export function canAccessResource(userRole: Role, resourceType: string, action: string): boolean {
  const permissionMap: Record<string, Record<string, Permission>> = {
    patients: {
      view: Permission.VIEW_PATIENTS,
      create: Permission.CREATE_PATIENTS,
      edit: Permission.EDIT_PATIENTS,
      delete: Permission.DELETE_PATIENTS,
      export: Permission.EXPORT_PATIENTS
    },
    appointments: {
      view: Permission.VIEW_APPOINTMENTS,
      create: Permission.CREATE_APPOINTMENTS,
      edit: Permission.EDIT_APPOINTMENTS,
      delete: Permission.DELETE_APPOINTMENTS,
      reschedule: Permission.RESCHEDULE_APPOINTMENTS,
      cancel: Permission.CANCEL_APPOINTMENTS
    },
    prescriptions: {
      view: Permission.VIEW_PRESCRIPTIONS,
      create: Permission.CREATE_PRESCRIPTIONS,
      edit: Permission.EDIT_PRESCRIPTIONS,
      delete: Permission.DELETE_PRESCRIPTIONS,
      share: Permission.SHARE_PRESCRIPTIONS
    },
    invoices: {
      view: Permission.VIEW_INVOICES,
      create: Permission.CREATE_INVOICES,
      edit: Permission.EDIT_INVOICES,
      delete: Permission.DELETE_INVOICES
    },
    payments: {
      view: Permission.VIEW_PAYMENTS,
      process: Permission.PROCESS_PAYMENTS
    },
    analytics: {
      view: Permission.VIEW_ANALYTICS,
      export: Permission.EXPORT_REPORTS
    },
    users: {
      view: Permission.VIEW_USERS,
      create: Permission.CREATE_USERS,
      edit: Permission.EDIT_USERS,
      delete: Permission.DELETE_USERS,
      manage: Permission.MANAGE_ROLES
    }
  };

  const resource = permissionMap[resourceType];
  if (!resource) return false;

  const permission = resource[action];
  if (!permission) return false;

  return hasPermission(userRole, permission);
}
