import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;
export default function DatabaseProvider() {
  if (!prisma) prisma = new PrismaClient();
  return prisma;
}

// DatabaseProvider();

// [
//   { id: 1, title: 'Product 1', description: 'This is the first product', price: 12.9, amount: 100, image: 'image.png' },
//   { id: 2, title: 'Product 2', description: 'This is the second product', price: 19.99, amount: 0, image: 'product2.png' },
//   { id: 3, title: 'Product 3', description: 'Description for product 3', price: 25.5, amount: 75, image: 'product3.jpg' },
//   { id: 4, title: 'Product 4', description: 'Description for product 4', price: 8.75, amount: 120, image: 'product4.png' },
//   { id: 5, title: 'Product 5', description: 'Description for product 5', price: 30.0, amount: 0, image: 'product5.jpg' },
//   { id: 6, title: 'Product 6', description: 'Description for product 6', price: 15.99, amount: 90, image: 'product6.png' },
//   { id: 7, title: 'Product 7', description: 'Description for product 7', price: 42.75, amount: 0, image: 'product7.jpg' },
//   { id: 8, title: 'Product 8', description: 'Description for product 8', price: 10.5, amount: 0, image: 'product8.png' },
//   { id: 9, title: 'Product 9', description: 'Description for product 9', price: 27.49, amount: 65, image: 'product9.jpg' },
//   { id: 10, title: 'Product 10', description: 'Description for product 10', price: 14.0, amount: 110, image: 'product10.png' },
// ].forEach(async (data) => {
//   await prisma.products.create({ data });
// });
