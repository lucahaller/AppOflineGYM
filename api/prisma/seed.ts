import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const now = new Date();
const oneDay = 1000 * 60 * 60 * 24;

async function main() {
  await prisma.notifications.deleteMany();
  await prisma.users.deleteMany();

  await prisma.users.createMany({
    data: [
      {
        name: "Usuario Verde",
        email: "verde@example.com",
        payment_status: "verde",
        last_payment: new Date("2025-06-10"),
        payment_expiration: new Date("2025-07-28"),
        payment_amount: 10000,
      },
      {
        name: "Usuario Amarillo (vence en 3 días)",
        email: "amarillo@example.com",
        payment_status: "amarillo",
        last_payment: new Date("2025-06-01"),
        payment_expiration: new Date(now.getTime() + 3 * oneDay),
        payment_amount: 9000,
      },
      {
        name: "Usuario Rojo (vencido)",
        email: "rojo@example.com",
        payment_status: "rojo",
        last_payment: new Date("2025-05-01"),
        payment_expiration: new Date("2025-06-01"),
        payment_amount: 7000,
      },
      {
        name: "Usuario sin pago",
        email: "sinpago@example.com",
        payment_status: "rojo",
      },
      {
        name: "Usuario reciente (vence en 5 días)",
        email: "reciente@example.com",
        payment_status: "amarillo",
        last_payment: now,
        payment_expiration: new Date(now.getTime() + 5 * oneDay),
        payment_amount: 12000,
      },
    ],
  });

  console.log("✅ Seed ejecutado correctamente (solo usuarios)");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
