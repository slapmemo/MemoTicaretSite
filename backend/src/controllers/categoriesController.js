const prisma = require('../config/db');
const { createCategorySchema, updateCategorySchema } = require('../validators/categoryValidators');

async function list(req, res, next) {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const parsed = createCategorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const category = await prisma.category.create({ data: parsed.data });
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Bu slug zaten kullanılıyor' });
    }
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const parsed = updateCategorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const category = await prisma.category.update({ where: { id }, data: parsed.data });
    res.json(category);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Kategori bulunamadı' });
    }
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Bu slug zaten kullanılıyor' });
    }
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.category.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Kategori bulunamadı' });
    }
    next(err);
  }
}

module.exports = { list, create, update, remove };
