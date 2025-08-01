import prisma from "@/lib/prisma"
import { clerkUserPayload } from "@/types/clerk";

export const createUser = async (user: clerkUserPayload) => {
  const newUser = await prisma.user.create({ data: user });
  console.log("New user created:", newUser);

  return newUser;
}

export const updateuser = async (clerkId: string, user: clerkUserPayload) => {
  const updatedUser = await prisma.user.update({
    data: user,
    where: { clerkId }
  })
  console.log("User updated:", updatedUser);

  return updatedUser;
}

export const deleteUser = async (clerkId: string) =>{
  const deletedUser = await prisma.user.delete({
    where: { clerkId }
  })
  console.log("User deleted:", deletedUser);

  return deletedUser;
}