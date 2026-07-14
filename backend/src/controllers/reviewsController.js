const prisma = require('../config/db');
const { createReviewSchema } = require('../validators/reviewValidators');

async function list(req, res, next) {
  try {
    const productId = parseInt(req.params.id, 10);
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const productId = parseInt(req.params.id, 10);
    const parsed = createReviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı' });
    }

    // Yalnızca ürünü satın almış (iptal edilmemiş bir siparişte yer alan) kullanıcı yorum yapabilir.
    const purchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: { userId: req.user.id, status: { not: 'cancelled' } },
      },
    });
    if (!purchased) {
      return res
        .status(403)
        .json({ error: 'Yalnızca satın aldığınız ürünlere yorum yapabilirsiniz' });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: req.user.id,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
      },
      include: { user: { select: { id: true, name: true } } },
    });

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Bu ürüne zaten yorum yaptınız' });
    }
    next(err);
  }
}

module.exports = { list, create };
