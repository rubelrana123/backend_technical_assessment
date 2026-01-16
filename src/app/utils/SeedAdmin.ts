import { PrismaClient, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const seedAdmin = async () => {
  try {
    console.log("🌱 Seeding Super Admin...");

    const email = process.env.SUPER_ADMIN_EMAIL as string;
    const password = process.env.SUPER_ADMIN_PASSWORD as string;
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUND) || 10;

    if (!email || !password) {
      throw new Error("SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD missing");
    }

    // 🔍 Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("⚠️  Super Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ✅ Transaction for atomicity
    await prisma.$transaction(async (tx) => {
      // 1️⃣ Create User
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
        },
      });

      // 2️⃣ Create User Profile
      await tx.userProfile.create({
        data: {
          userId: user.id,
          name: "Super Admin",
          phone: "+1234567890",
          address: "System Generated",
          profilePhoto:
            "https://res.cloudinary.com/dddbgbwmk/image/upload/v1763059574/file-1763059572353-78202584.jpg",
        },
      });
    });

    console.log("✅ Super Admin seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding Super Admin:", error);
  } finally {
    await prisma.$disconnect();
  }
};
