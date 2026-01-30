"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/lib/types";

export async function createCategory(name: string): Promise<ActionResponse> {
  try {
    await prisma.category.create({ data: { name } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, name: string): Promise<ActionResponse> {
  try {
    await prisma.category.update({ where: { id }, data: { name } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string): Promise<ActionResponse> {
  try {
    const projectCount = await prisma.project.count({
      where: { categoryId: id },
    });

    if (projectCount > 0) {
      return { error: "Cannot delete category because it has projects linked to it." };
    }

    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete category. Please try again." };
  }
}
