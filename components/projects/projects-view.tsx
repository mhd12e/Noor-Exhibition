"use client";

import { motion } from "framer-motion";
import { ProjectCard } from "@/components/projects/project-card";

const projects = [
  {
    title: "الروبوت الذكي المساعد",
    description: "روبوت مصمم لمساعدة كبار السن في تذكيرهم بمواعيد الأدوية ومراقبة حالتهم الصحية بشكل مستمر.",
    category: "الروبوتات",
    image: "/reception-room.png", // Demo image
  },
  {
    title: "نظام الري الذكي",
    description: "نظام يعتمد على انترنت الأشياء (IoT) للتحكم في ري المحاصيل بناءً على رطوبة التربة وحالة الطقس.",
    category: "الزراعة الذكية",
    image: "/reception-room.png",
  },
  {
    title: "تطبيق إعادة التدوير",
    description: "منصة تربط السكان بمراكز إعادة التدوير وتكافئهم بنقاط يمكن استبدالها بمنتجات صديقة للبيئة.",
    category: "البيئة",
    image: "/reception-room.png",
  },
  {
    title: "توليد الطاقة من المشي",
    description: "بلاط أرضيات ذكي يحول الطاقة الحركية للمشاة إلى طاقة كهربائية لتشغيل إنارة الممرات.",
    category: "الطاقة المتجددة",
    image: "/reception-room.png",
  },
  {
    title: "نظارة الواقع المعزز التعليمية",
    description: "نظارة تعرض معلومات تفاعلية ومجسمات ثلاثية الأبعاد للطلاب أثناء الدروس العلمية.",
    category: "التقنية التعليمية",
    image: "/reception-room.png",
  },
  {
    title: "تنقية المياه بالطاقة الشمسية",
    description: "جهاز محمول يستخدم الطاقة الشمسية لتقطير وتنقية المياه الملوثة وجعلها صالحة للشرب.",
    category: "الاستدامة",
    image: "/reception-room.png",
  },
];

export function ProjectsView() {
  return (
    <div className="container mx-auto px-6 py-12">
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
          اكتشف أحدث الابتكارات التي قدمها طلاب مدرسة النور الدولية، حيث يلتقي الإبداع بالتكنولوجيا لحل تحديات الواقع.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </div>
  );
}
