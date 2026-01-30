import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { VideoPlayer } from "@/components/projects/video-player";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) return { title: "المشروع غير موجود" };

  return {
    title: `${project.title} | تفاصيل المشروع`,
    description: project.description,
  };
}

export default async function ProjectVideoPage({ params }: Props) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!project) {
    notFound();
  }

  const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  const videoUrl = project.video ? `${publicUrl}/videos/${project.id}.mp4` : null;

  return (
    <VideoPlayer 
      src={videoUrl} 
      title={project.title} 
      category={project.category.name} 
      year={project.year}
      creators={project.creators}
      link={project.link}
      hasVideo={project.video}
    />
  );
}