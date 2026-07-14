require('dotenv').config({ quiet: true });
const bcrypt = require('bcrypt');
const prisma = require('../src/config/db');

async function main() {
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
    },
  });

  const elektronik = await prisma.category.upsert({
    where: { slug: 'elektronik' },
    update: {},
    create: { name: 'Elektronik', slug: 'elektronik' },
  });

  const giyim = await prisma.category.upsert({
    where: { slug: 'giyim' },
    update: {},
    create: { name: 'Giyim', slug: 'giyim' },
  });

  await prisma.product.createMany({
    data: [
      {
        name: 'Kablosuz Kulaklık',
        description: 'Bluetooth 5.0, gürültü engelleme',
        price: 799.9,
        stock: 25,
        categoryId: elektronik.id,
      },
      {
        name: 'Akıllı Saat',
        description: 'Nabız ve uyku takibi',
        price: 1299.0,
        stock: 15,
        categoryId: elektronik.id,
      },
      {
        name: 'Pamuklu T-Shirt',
        description: '%100 pamuk, unisex',
        price: 199.5,
        stock: 50,
        categoryId: giyim.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed tamamlandı.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
