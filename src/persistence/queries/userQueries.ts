import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      avatar: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      avatar: true,
      role: true,
      passwordHash: true,
      createdAt: true,
    },
  });
}

export async function createUser(
  email: string,
  name: string,
  password: string,
  phone?: string,
  role: 'CLIENT' | 'DRIVER' = 'CLIENT'
) {
  const passwordHash = await bcryptjs.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      name,
      phone,
      passwordHash,
      role,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function updateUser(
  id: string,
  data: {
    name?: string;
    phone?: string;
    avatar?: string;
  }
) {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      avatar: true,
      role: true,
    },
  });
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcryptjs.compare(plainPassword, hashedPassword);
}

export async function changePassword(id: string, newPassword: string) {
  const passwordHash = await bcryptjs.hash(newPassword, 10);
  return prisma.user.update({
    where: { id },
    data: { passwordHash },
  });
}

export async function updateUserRole(id: string, role: 'CLIENT' | 'DRIVER' | 'ADMIN') {
  return prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getAllUsers(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);

  return { users, total };
}

export async function getUsersByRole(role: 'CLIENT' | 'DRIVER' | 'ADMIN') {
  return prisma.user.findMany({
    where: { role },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}
