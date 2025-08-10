import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { Permission } from '@/lib/permissions';
import { checkPermission } from '@/lib/permissions';

// GET /api/inventory/reports - Get inventory reports and analytics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!checkPermission(session.user.role, Permission.VIEW_INVENTORY)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'overview'; // overview, stock_value, movements, categories
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    // Set default date range if not provided (last 30 days)
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter = {
        createdAt: {}
      };
      if (startDate) {
        dateFilter.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.createdAt.lte = new Date(endDate);
      }
    } else {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter = {
        createdAt: {
          gte: thirtyDaysAgo
        }
      };
    }

    switch (reportType) {
      case 'overview':
        return await getOverviewReport();
      
      case 'stock_value':
        return await getStockValueReport();
      
      case 'movements':
        return await getMovementsReport(dateFilter);
      
      case 'categories':
        return await getCategoriesReport();
      
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error generating inventory report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getOverviewReport() {
  // Get total counts and values
  const totalItems = await prisma.inventoryItem.count({
    where: { isActive: true }
  });

  const lowStockItems = await prisma.inventoryItem.count({
    where: {
      isActive: true,
      AND: [
        { currentStock: { gt: 0 } },
        { currentStock: { lte: { minStock: true } } }
      ]
    }
  });

  const outOfStockItems = await prisma.inventoryItem.count({
    where: {
      isActive: true,
      currentStock: 0
    }
  });

  // Calculate total stock value
  const items = await prisma.inventoryItem.findMany({
    where: { isActive: true },
    select: {
      currentStock: true,
      costPrice: true,
      sellingPrice: true
    }
  });

  const totalCostValue = items.reduce((sum, item) => {
    return sum + (Number(item.currentStock) * Number(item.costPrice));
  }, 0);

  const totalSellingValue = items.reduce((sum, item) => {
    return sum + (Number(item.currentStock) * Number(item.sellingPrice));
  }, 0);

  // Get recent transactions
  const recentTransactions = await prisma.inventoryTransaction.findMany({
    take: 10,
    orderBy: { transactionDate: 'desc' },
    include: {
      item: {
        select: { name: true, sku: true }
      },
      createdBy: {
        select: { name: true }
      }
    }
  });

  return NextResponse.json({
    overview: {
      totalItems,
      lowStockItems,
      outOfStockItems,
      totalCostValue,
      totalSellingValue,
      potentialProfit: totalSellingValue - totalCostValue
    },
    recentTransactions
  });
}

async function getStockValueReport() {
  // Get items with their stock values
  const items = await prisma.inventoryItem.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      sku: true,
      category: true,
      currentStock: true,
      costPrice: true,
      sellingPrice: true,
      minStock: true,
      maxStock: true
    },
    orderBy: { currentStock: 'desc' }
  });

  // Calculate values for each item
  const itemsWithValues = items.map(item => ({
    ...item,
    costValue: Number(item.currentStock) * Number(item.costPrice),
    sellingValue: Number(item.currentStock) * Number(item.sellingPrice),
    potentialProfit: (Number(item.currentStock) * Number(item.sellingPrice)) - (Number(item.currentStock) * Number(item.costPrice))
  }));

  // Group by category
  const categoryTotals = itemsWithValues.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = {
        totalItems: 0,
        totalCostValue: 0,
        totalSellingValue: 0,
        totalPotentialProfit: 0
      };
    }
    acc[item.category].totalItems++;
    acc[item.category].totalCostValue += item.costValue;
    acc[item.category].totalSellingValue += item.sellingValue;
    acc[item.category].totalPotentialProfit += item.potentialProfit;
    return acc;
  }, {} as any);

  return NextResponse.json({
    items: itemsWithValues,
    categoryTotals,
    summary: {
      totalItems: itemsWithValues.length,
      totalCostValue: itemsWithValues.reduce((sum, item) => sum + item.costValue, 0),
      totalSellingValue: itemsWithValues.reduce((sum, item) => sum + item.sellingValue, 0),
      totalPotentialProfit: itemsWithValues.reduce((sum, item) => sum + item.potentialProfit, 0)
    }
  });
}

async function getMovementsReport(dateFilter: any) {
  // Get transactions within date range
  const transactions = await prisma.inventoryTransaction.findMany({
    where: dateFilter,
    include: {
      item: {
        select: { name: true, sku: true, category: true }
      },
      createdBy: {
        select: { name: true }
      }
    },
    orderBy: { transactionDate: 'desc' }
  });

  // Group by type
  const movementsByType = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.type]) {
      acc[transaction.type] = [];
    }
    acc[transaction.type].push(transaction);
    return acc;
  }, {} as any);

  // Calculate totals by type
  const totalsByType = Object.keys(movementsByType).reduce((acc, type) => {
    acc[type] = movementsByType[type].reduce((sum: number, transaction: any) => {
      return sum + transaction.quantity;
    }, 0);
    return acc;
  }, {} as any);

  // Group by date for chart data
  const movementsByDate = transactions.reduce((acc, transaction) => {
    const date = transaction.transactionDate.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { IN: 0, OUT: 0, ADJUSTMENT: 0 };
    }
    acc[date][transaction.type] += transaction.quantity;
    return acc;
  }, {} as any);

  return NextResponse.json({
    transactions,
    movementsByType,
    totalsByType,
    movementsByDate: Object.entries(movementsByDate).map(([date, data]) => ({
      date,
      ...data
    }))
  });
}

async function getCategoriesReport() {
  // Get items grouped by category
  const items = await prisma.inventoryItem.findMany({
    where: { isActive: true },
    select: {
      category: true,
      currentStock: true,
      costPrice: true,
      sellingPrice: true,
      status: true
    }
  });

  // Group by category
  const categoryStats = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = {
        totalItems: 0,
        totalStock: 0,
        totalCostValue: 0,
        totalSellingValue: 0,
        statusCounts: {
          active: 0,
          low_stock: 0,
          out_of_stock: 0,
          expired: 0
        }
      };
    }

    acc[item.category].totalItems++;
    acc[item.category].totalStock += Number(item.currentStock);
    acc[item.category].totalCostValue += Number(item.currentStock) * Number(item.costPrice);
    acc[item.category].totalSellingValue += Number(item.currentStock) * Number(item.sellingPrice);
    acc[item.category].statusCounts[item.status as keyof typeof acc[item.category].statusCounts]++;

    return acc;
  }, {} as any);

  // Calculate averages and percentages
  const categoryReport = Object.entries(categoryStats).map(([category, stats]: [string, any]) => ({
    category,
    ...stats,
    averageStock: stats.totalItems > 0 ? Math.round(stats.totalStock / stats.totalItems) : 0,
    averageCostValue: stats.totalItems > 0 ? stats.totalCostValue / stats.totalItems : 0,
    averageSellingValue: stats.totalItems > 0 ? stats.totalSellingValue / stats.totalItems : 0,
    potentialProfit: stats.totalSellingValue - stats.totalCostValue
  }));

  return NextResponse.json({
    categories: categoryReport,
    summary: {
      totalCategories: categoryReport.length,
      totalItems: categoryReport.reduce((sum, cat) => sum + cat.totalItems, 0),
      totalStock: categoryReport.reduce((sum, cat) => sum + cat.totalStock, 0),
      totalCostValue: categoryReport.reduce((sum, cat) => sum + cat.totalCostValue, 0),
      totalSellingValue: categoryReport.reduce((sum, cat) => sum + cat.totalSellingValue, 0),
      totalPotentialProfit: categoryReport.reduce((sum, cat) => sum + cat.potentialProfit, 0)
    }
  });
}
