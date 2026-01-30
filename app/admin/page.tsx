import { ShieldCheck, LogOut, LayoutGrid, Tags, MessageSquare } from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { CategoryManager } from "@/components/admin/category-manager";
import { ProjectManager } from "@/components/admin/project-manager";
import { ReviewManager } from "@/components/admin/review-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      year: true,
      creators: true,
      link: true,
      categoryId: true,
      video: true,
      cover: true,
    }
  });

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto py-10 px-4 md:px-6" dir="ltr">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-zinc-500">Manage exhibition projects and categories</p>
          </div>
        </div>

        <form action={logout}>
          <Button variant="outline" size="sm" className="gap-2 font-bold">
            Sign Out
            <LogOut className="w-4 h-4" />
          </Button>
        </form>
      </div>

      <Tabs defaultValue="projects" className="space-y-8" suppressHydrationWarning>
        <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl inline-flex w-auto min-w-full md:min-w-0">
            <TabsTrigger value="projects" className="rounded-xl px-4 md:px-6 py-2 md:py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:shadow-sm transition-all font-bold text-xs md:text-sm whitespace-nowrap">
              <LayoutGrid className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="categories" className="rounded-xl px-4 md:px-6 py-2 md:py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:shadow-sm transition-all font-bold text-xs md:text-sm whitespace-nowrap">
              <Tags className="w-4 h-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-xl px-4 md:px-6 py-2 md:py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:shadow-sm transition-all font-bold text-xs md:text-sm whitespace-nowrap">
              <MessageSquare className="w-4 h-4 mr-2" />
              Reviews
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="projects" className="focus-visible:outline-none ring-offset-white dark:ring-offset-zinc-950">
          <ProjectManager projects={projects} categories={categories} />
        </TabsContent>

        <TabsContent value="categories" className="focus-visible:outline-none ring-offset-white dark:ring-offset-zinc-950">
          <CategoryManager categories={categories} />
        </TabsContent>

        <TabsContent value="reviews" className="focus-visible:outline-none ring-offset-white dark:ring-offset-zinc-950">
          <ReviewManager reviews={reviews} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
