import "dotenv/config";
import { PrismaClient, Prisma } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedProducts } from "./seed-data";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const results = [];

  for (const product of seedProducts) {
    const upserted = await prisma.product.upsert({
      where: { id: product.id },
      update: {
        title: product.title,
        price: new Prisma.Decimal(product.price),
        tag: product.tag,
        category: product.category,
        stock: product.stock,
        description: product.description,
        images: product.images,
        active: product.active,
      },
      create: {
        id: product.id,
        title: product.title,
        price: new Prisma.Decimal(product.price),
        tag: product.tag,
        category: product.category,
        stock: product.stock,
        description: product.description,
        images: product.images,
        active: product.active,
      },
      select: { id: true, title: true },
    });
    results.push(upserted);
  }

  console.log(`Seed complete: ${results.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

