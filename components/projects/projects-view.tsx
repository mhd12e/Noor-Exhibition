"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "@/components/projects/project-card";
import { Search, Filter, X, Calendar, Tags } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  year: number;
  cover: boolean;
  video: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface ProjectsViewProps {
  projects: Project[];
  categories: Category[];
  years: number[];
}

export function ProjectsView({ projects, categories, years }: ProjectsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || project.category === selectedCategory;
      const matchesYear = selectedYear === "all" || project.year.toString() === selectedYear;

      return matchesSearch && matchesCategory && matchesYear;
    });
  }, [projects, searchQuery, selectedCategory, selectedYear]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedYear("all");
  };

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "all" || selectedYear !== "all";

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16 space-y-4"
      >
        <h1 className="text-4xl font-medium text-zinc-900 dark:text-white sm:text-5xl tracking-tight">
          مشاريع <span className="text-blue-600">الطلاب</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          استخدم أدوات البحث والتصفية لاستكشاف الابتكارات حسب السنة أو المجال الدراسي.
        </p>
      </motion.div>

      {/* Filtering UI */}
      <div className="mb-12 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-zinc-900/50 p-4 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input
              placeholder="ابحث عن مشروع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pr-12 pl-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-transparent focus:ring-2 focus:ring-blue-500 transition-all text-right"
              dir="rtl"
            />
          </div>

          {/* Year Filter */}
          <div className="relative">
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full h-12 pr-10 pl-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-transparent focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium appearance-none text-right"
              dir="rtl"
            >
              <option value="all">جميع السنوات</option>
              {years.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Tags className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-12 pr-10 pl-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-transparent focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium appearance-none text-right"
              dir="rtl"
            >
              <option value="all">جميع التصنيفات</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Indicators */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between px-4"
            >
              <p className="text-sm text-zinc-500">
                تم العثور على <span className="font-bold text-blue-600">{filteredProjects.length}</span> مشاريع
              </p>
              <button 
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
                إلغاء جميع الفلاتر
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Projects Grid */}
      <div className="relative min-h-[400px]">
        {filteredProjects.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-4"
          >
            <div className="p-6 rounded-full bg-zinc-100 dark:bg-zinc-900">
              <Filter className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">لا توجد نتائج</h3>
              <p className="text-zinc-500">لم نجد أي مشاريع تطابق معايير البحث الحالية.</p>
            </div>
            <button 
              onClick={clearFilters}
              className="text-blue-600 font-bold hover:underline"
            >
              عرض جميع المشاريع
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
