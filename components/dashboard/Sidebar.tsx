'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  DollarSign,
  Package,
  Settings,
  BarChart3,
  Bell,
  User,
  LogOut,
  Stethoscope,
  Pill,
  ClipboardList,
  Heart,
  Activity,
  Shield,
  Database,
  MessageSquare,
  HelpCircle,
  BookOpen,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';
import { hasPermission, Permission, Role } from '@/lib/permissions';
import { useSession, signOut } from 'next-auth/react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog';

interface SidebarProps {
  userRole?: Role;
}

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: MenuItem[];
  permission?: Permission;
  roles?: Role[];
}

export default function Sidebar({ userRole }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const effectiveRole = userRole ?? ((session?.user as any)?.role as Role | undefined);

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Patients',
      href: '/dashboard/patients',
      icon: Users,
      permission: Permission.VIEW_PATIENTS,
      children: [
        { title: 'All Patients', href: '/dashboard/patients', icon: Users },
        { title: 'Add Patient', href: '/dashboard/patients/new', icon: User },
        { title: 'Medical Records', href: '/dashboard/patients/records', icon: ClipboardList },
        { title: 'Family History', href: '/dashboard/patients/family-history', icon: Heart },
      ]
    },
    {
      title: 'Appointments',
      href: '/dashboard/appointments',
      icon: Calendar,
      permission: Permission.VIEW_APPOINTMENTS,
      children: [
        { title: 'All Appointments', href: '/dashboard/appointments', icon: Calendar },
        { title: 'New Appointment', href: '/dashboard/appointments/new', icon: Calendar },
        { title: 'Schedule', href: '/dashboard/appointments/schedule', icon: Clock },
        { title: 'Room Management', href: '/dashboard/appointments/rooms', icon: Activity },
      ]
    },
    {
      title: 'Prescriptions',
      href: '/dashboard/prescriptions',
      icon: FileText,
      permission: Permission.VIEW_PRESCRIPTIONS,
      children: [
        { title: 'All Prescriptions', href: '/dashboard/prescriptions', icon: FileText },
        { title: 'New Prescription', href: '/dashboard/prescriptions/new', icon: FileText },
        { title: 'Medicine Database', href: '/dashboard/prescriptions/medicines', icon: Pill },
        { title: 'Shared Prescriptions', href: '/dashboard/prescriptions/shared', icon: MessageSquare },
      ]
    },
    {
      title: 'Billing & Invoices',
      href: '/dashboard/invoices',
      icon: DollarSign,
      permission: Permission.VIEW_INVOICES,
      children: [
        { title: 'All Invoices', href: '/dashboard/invoices', icon: DollarSign },
        { title: 'New Invoice', href: '/dashboard/invoices/new', icon: DollarSign },
        { title: 'Payments', href: '/dashboard/payments', icon: CreditCard },
        { title: 'Financial Reports', href: '/dashboard/reports/financial', icon: TrendingUp },
      ]
    },
    {
      title: 'Inventory',
      href: '/dashboard/inventory',
      icon: Package,
      permission: Permission.VIEW_INVENTORY,
      children: [
        { title: 'All Items', href: '/dashboard/inventory', icon: Package },
        { title: 'Add Item', href: '/dashboard/inventory/add', icon: Package },
        { title: 'Purchase Orders', href: '/dashboard/inventory/purchase-orders', icon: ShoppingCart },
        { title: 'Stock Alerts', href: '/dashboard/inventory/alerts', icon: AlertTriangle },
        { title: 'Suppliers', href: '/dashboard/inventory/suppliers', icon: Users },
      ]
    },
    {
      title: 'Enquiries',
      href: '/dashboard/enquiries',
      icon: MessageCircle,
      permission: Permission.VIEW_PATIENTS, // Using patient permission for now
      children: [
        { title: 'All Enquiries', href: '/dashboard/enquiries', icon: MessageCircle },
        { title: 'New Enquiries', href: '/dashboard/enquiries?status=NEW', icon: Bell },
        { title: 'In Progress', href: '/dashboard/enquiries?status=IN_PROGRESS', icon: Clock },
        { title: 'Converted', href: '/dashboard/enquiries?status=CONVERTED', icon: CheckCircle },
      ]
    },
    {
      title: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      permission: Permission.VIEW_ANALYTICS,
      children: [
        { title: 'Overview', href: '/dashboard/analytics', icon: BarChart3 },
        { title: 'Patient Analytics', href: '/dashboard/analytics/patients', icon: Users },
        { title: 'Financial Analytics', href: '/dashboard/analytics/financial', icon: TrendingUp },
        { title: 'Performance Metrics', href: '/dashboard/analytics/performance', icon: Activity },
      ]
    },
    {
      title: 'Clinical Tools',
      href: '/dashboard/clinical',
      icon: Stethoscope,
      permission: Permission.VIEW_MEDICAL_RECORDS,
      children: [
        { title: 'Vital Signs', href: '/dashboard/clinical/vitals', icon: Activity },
        { title: 'Allergies', href: '/dashboard/clinical/allergies', icon: AlertTriangle },
        { title: 'Medical History', href: '/dashboard/clinical/history', icon: ClipboardList },
        { title: 'Lifestyle Assessment', href: '/dashboard/clinical/lifestyle', icon: Heart },
      ]
    },
    {
      title: 'System',
      href: '/dashboard/system',
      icon: Settings,
      permission: Permission.MANAGE_SETTINGS,
      children: [
        { title: 'Users & Roles', href: '/dashboard/system/users', icon: Shield },
        { title: 'System Settings', href: '/dashboard/system/settings', icon: Settings },
        { title: 'Audit Logs', href: '/dashboard/system/audit-logs', icon: Database },
        { title: 'Backup & Restore', href: '/dashboard/system/backup', icon: Database },
      ]
    },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!effectiveRole) {
      // Default deny when role is unknown
      return !item.permission && !item.roles;
    }
    // Show all sidebar items for doctors regardless of permissions/roles
    if (effectiveRole === Role.DOCTOR) {
      return true;
    }
    if (item.permission) {
      return hasPermission(effectiveRole, item.permission);
    }
    if (item.roles) {
      return item.roles.includes(effectiveRole);
    }
    return true;
  });

  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    // Initialize with active items expanded
    const activeItems = new Set<string>();
    menuItems.forEach(item => {
      if (pathname === item.href || pathname.startsWith(item.href + '/')) {
        activeItems.add(item.href);
      }
    });
    return activeItems;
  });

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.href);

    const filteredChildren = item.children?.filter(child => {
      if (!effectiveRole) return !child.permission && !child.roles;
      // Show all children for doctors regardless of permissions/roles
      if (effectiveRole === Role.DOCTOR) return true;
      if (child.permission) return hasPermission(effectiveRole, child.permission);
      if (child.roles) return child.roles.includes(effectiveRole);
      return true;
    });

    return (
      <div key={item.href} className="space-y-1">
        <div className="flex">
          <Link href={item.href} className="flex-1">
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                level > 0 && "ml-4",
                collapsed && "justify-center"
              )}
            >
              <item.icon className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Button>
          </Link>
          {hasChildren && !collapsed && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpandedItems(prev => {
                  const newSet = new Set(prev);
                  if (newSet.has(item.href)) {
                    newSet.delete(item.href);
                  } else {
                    newSet.add(item.href);
                  }
                  return newSet;
                });
              }}
            >
              <ChevronRight 
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded && "rotate-90"
                )}
              />
            </Button>
          )}
        </div>
        
        {hasChildren && filteredChildren && !collapsed && (
          <div className={cn("space-y-1", isExpanded ? "block" : "hidden")}>
            {filteredChildren.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const getRoleDisplayName = (role: Role) => {
    const roleNames = {
      [Role.SUPER_ADMIN]: 'Super Admin',
      [Role.ADMIN]: 'Administrator',
      [Role.DOCTOR]: 'Doctor',
      [Role.NURSE]: 'Nurse',
      [Role.RECEPTIONIST]: 'Receptionist',
      [Role.PHARMACIST]: 'Pharmacist',
      [Role.ACCOUNTANT]: 'Accountant',
      [Role.PATIENT]: 'Patient',
      [Role.OTHER]: 'User'
    };
    return roleNames[role] || role;
  };

  const getRoleIcon = (role: Role) => {
    const roleIcons = {
      [Role.SUPER_ADMIN]: Shield,
      [Role.ADMIN]: Shield,
      [Role.DOCTOR]: Stethoscope,
      [Role.NURSE]: Heart,
      [Role.RECEPTIONIST]: Users,
      [Role.PHARMACIST]: Pill,
      [Role.ACCOUNTANT]: DollarSign,
      [Role.PATIENT]: User,
      [Role.OTHER]: User
    };
    return roleIcons[role] || User;
  };

  const RoleIcon = effectiveRole ? getRoleIcon(effectiveRole) : User;

  return (
    <div className={cn(
      "flex flex-col border-r bg-background transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-primary"></div>
            <span className="font-semibold">Dhanvantari</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Profile */}
      {!collapsed && session?.user && (
        <div className="border-b p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session.user.name || session.user.email}
              </p>
              {userRole && (
                <div className="flex items-center space-x-1">
                  <RoleIcon className="h-3 w-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground truncate">
                    {getRoleDisplayName(userRole)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="space-y-2">
          {filteredMenuItems.map(item => renderMenuItem(item))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-3">
        <div className="space-y-1">
          {!collapsed && (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-gray-400 hover:text-gray-500">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help & Support
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Help & Support</DialogTitle>
                    <DialogDescription>
                      Contact our support team via phone or email.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-2 space-y-3">
                    <a href="tel:8830553868" className="flex items-center gap-3 text-sm hover:text-primary">
                      <Phone className="h-4 w-4" />
                      <span>8830553868</span>
                    </a>
                    <a href="mailto:saptechnoeditors@gmail.com" className="flex items-center gap-3 text-sm hover:text-primary">
                      <Mail className="h-4 w-4" />
                      <span>saptechnoeditors@gmail.com</span>
                    </a>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-gray-400 hover:text-gray-500">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Documentation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Documentation</DialogTitle>
                    <DialogDescription>
                      Quick access to key guides and references.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Appointments: booking, rescheduling, reminders</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Patients: profiles, history, vitals, encounters</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>Inventory: items, purchase orders, stock alerts</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>Invoices & Payments: billing flow and reports</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span>Notifications: real-time updates and email</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span>Users & Roles: permissions and access control</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span>System: settings, backup and restore</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>Enquiries: tracking and conversion</span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => signOut()}
          >
            <LogOut className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
            {!collapsed && "Sign Out"}
          </Button>
        </div>
      </div>
    </div>
  );
}


