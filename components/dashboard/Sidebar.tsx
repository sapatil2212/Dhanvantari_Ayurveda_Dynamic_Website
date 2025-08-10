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
  XCircle
} from 'lucide-react';
import { hasPermission, Permission, Role } from '@/lib/permissions';
import { useSession, signOut } from 'next-auth/react';

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
    if (item.permission && userRole) {
      return hasPermission(userRole, item.permission);
    }
    if (item.roles && userRole) {
      return item.roles.includes(userRole);
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
      if (child.permission && userRole) {
        return hasPermission(userRole, child.permission);
      }
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

  const RoleIcon = userRole ? getRoleIcon(userRole) : User;

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
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {filteredMenuItems.map(item => renderMenuItem(item))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="space-y-2">
          {!collapsed && (
            <>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Support
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Documentation
              </Button>
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


