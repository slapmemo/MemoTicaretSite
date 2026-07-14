const prisma = require('../config/db');
const { addItemSchema, updateItemSchema } = require('../validators/cartValidators');

async function getOrCreateCart(userId) {
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }
  return cart;
}

async function getCart(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: true },
    });
    res.json({ id: cart.id, items });
  } catch (err) {
    next(err);
  }
}

async function addItem(req, res, next) {
  try {
    const parsed = addItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const { productId, quantity } = parsed.data;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı' });
    }

    const cart = await getOrCreateCart(req.user.id);

    const existing = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    const item = existing
      ? await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + quantity },
        })
      : await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

async function updateItem(req, res, next) {
  try {
    const itemId = parseInt(req.params.id, 10);
    const parsed = updateItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const cart = await getOrCreateCart(req.user.id);
    const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!item || item.cartId !== cart.id) {
      return res.status(404).json({ error: 'Sepet öğesi bulunamadı' });
    }

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: parsed.data.quantity },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function removeItem(req, res, next) {
  try {
    const itemId = parseInt(req.params.id, 10);
    const cart = await getOrCreateCart(req.user.id);
    const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!item || item.cartId !== cart.id) {
      return res.status(404).json({ error: 'Sepet öğesi bulunamadı' });
    }

    await prisma.cartItem.delete({ where: { id: itemId } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addItem, updateItem, removeItem, getOrCreateCart };
