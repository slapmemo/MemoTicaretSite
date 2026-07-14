const prisma = require('../config/db');

async function listUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function dashboard(req, res, next) {
  try {
    const [totalUsers, totalProducts, totalOrders, revenueResult] = await Promise.all([
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'cancelled' } },
      }),
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueResult._sum.total || 0,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, dashboard };
