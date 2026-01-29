"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Lightbulb, Users, Trophy } from "lucide-react";

const features = [
  {
    title: "من نحن",
    description: "مدرسة النور الدولية هي منارة للعلم والمعرفة، تلتزم بتوفير تعليم متميز يجمع بين الأصالة والحداثة. نسعى جاهدين لبناء جيل واعي، مبدع، وقادر على مواجهة تحديات المستقبل بثقة واقتدار.",
    icon: Users,
    image: "/reception-room.png",
  },
  {
    title: "رؤيتنا للإبتكار",
    description: "نؤمن بأن الابتكار هو المحرك الأساسي للتطور. من خلال معرض الابتكار السنوي، نوفر لطلابنا منصة لعرض أفكارهم الخلاقة في مجالات العلوم، التكنولوجيا، والهندسة، مما يعزز روح البحث العلمي والاكتشاف.",
    icon: Lightbulb,
    image: "/reception-room.png", 
  },
  {
    title: "إنجازاتنا",
    description: "على مر السنين، حقق طلابنا مراكز متقدمة في المسابقات المحلية والدولية. هذا المعرض هو تتويج لجهود عام كامل من العمل الدؤوب، التعلم المستمر، والسعي نحو التميز الأكاديمي والشخصي.",
    icon: Trophy,
    image: "/reception-room.png", 
  },
];

export function StorySection() {
  return (
    <section id="about" className="py-24 px-6 bg-transparent overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-32">
        {features.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={cn(
              "flex flex-col gap-12 items-center",
              index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            )}
          >
            {/* Text Content Card */}
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <item.icon className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold md:text-4xl text-zinc-900 dark:text-zinc-50">
                {item.title}
              </h2>
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none">
                <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Image Card */}
            <div className="flex-1 w-full">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/50 dark:border-white/10 group">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Decorative Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
