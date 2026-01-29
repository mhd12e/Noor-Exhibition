import { ProjectsView } from "@/components/projects/projects-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "المشاريع | معرض الابتكار 2026",
  description: "تصفح المشاريع المبتكرة لطلاب مدرسة النور الدولية",
};

export default function ProjectsPage() {
  return <ProjectsView />;
}
