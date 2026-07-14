const prisma = require('../config/db');
const { getOrCreateCart } = require('./cartController');
const { updateStatusSchema } = require('../validators/orderValidators');

async function createOrder(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Sepet boş' });
    }

    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          error: `"${item.product.name}" için yeterli stok yok (mevcut: ${item.product.stock})`,
        });
      }
    }

    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: req.user.id,
          total,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.price,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return created;
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

async function listMyOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

async function adminListOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } }, user: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(
      orders.map((o) => ({
        ...o,
        user: { id: o.user.id, name: o.user.name, email: o.user.email },
      })),
    );
  } catch (err) {
    next(err);
  }
}

async function adminUpdateStatus(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const parsed = updateStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const order = await prisma.order.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    res.json(order);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Sipariş bulunamadı' });
    }
    next(err);
  }
}

module.exports = { createOrder, listMyOrders, adminListOrders, adminUpdateStatus };
