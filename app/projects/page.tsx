import { ProjectsView } from "@/components/projects/projects-view";
import { Metadata } from "next";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([
    prisma.project.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    })
  ]);

  // Extract unique years from projects
  const years = Array.from(new Set(projects.map(p => p.year))).sort((a, b) => b - a);

  const serializedProjects = projects.map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    category: project.category.name,
    year: project.year,
    cover: project.cover,
    video: project.video,
  }));

  const serializedCategories = categories.map(cat => ({
    id: cat.id,
    name: cat.name
  }));

  return (
    <ProjectsView 
      projects={serializedProjects} 
      categories={serializedCategories}
      years={years}
      publicUrl={process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ""}
    />
  );
}
