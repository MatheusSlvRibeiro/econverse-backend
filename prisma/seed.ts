import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const REFERENCE_PRODUCTS_URL =
  'https://app.econverse.com.br/teste-front-end/junior/tecnologia/lista-produtos/produtos.json';

interface ReferenceProduct {
  productName: string;
  descriptionShort: string;
  photo: string;
  price: number;
  oldPrice?: number;
  installmentValue?: number;
}

interface ReferenceProductsResponse {
  success: boolean;
  products: ReferenceProduct[];
}

async function main() {
  const response = await fetch(REFERENCE_PRODUCTS_URL);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch reference products: ${response.status} ${response.statusText}`,
    );
  }
  const { products }: ReferenceProductsResponse = await response.json();

  const category = await prisma.category.upsert({
    where: { slug: 'tecnologia' },
    update: {},
    create: { name: 'Tecnologia', slug: 'tecnologia' },
  });

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.productName,
        descriptionShort: product.descriptionShort,
        photo: product.photo,
        price: product.price,
        oldPrice: product.oldPrice,
        installmentValue: product.installmentValue,
        categoryId: category.id,
      },
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
