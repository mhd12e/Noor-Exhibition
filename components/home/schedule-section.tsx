"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Info } from "lucide-react";

const schedule = [
  {
    day: "اليوم الأول",
    date: "2 فبراير",
    time: "9:30 صباحاً",
    events: [
      {
        title: "عرض المشاريع المتميزة",
        location: "منطقة الاستقبال (Reception)",
        description: "استعراض لأفضل الابتكارات المختارة في المدخل الرئيسي للمدرسة."
      },
      {
        title: "بقية مشاريع الطلاب",
        location: "المكتبة (Library)",
        description: "عرض شامل لجميع مشاريع الطلاب المبتكرة في مختلف المجالات."
      }
    ]
  },
  {
    day: "اليوم الثاني",
    date: "3 فبراير",
    time: "9:30 صباحاً",
    events: [
      {
        title: "عرض جميع المشاريع",
        location: "المكتبة (Library)",
        description: "يستمر العرض في منطقة المكتبة لاستقبال الزوار والمقيمين."
      }
    ]
  },
  {
    day: "اليوم الثالث",
    date: "4 فبراير",
    time: "9:30 صباحاً",
    events: [
      {
        title: "اليوم الختامي للمشاريع",
        location: "المكتبة (Library)",
        description: "الفرصة الأخيرة لمشاهدة الابتكارات والتفاعل مع الطلاب المبدعين."
      }
    ]
  }
];

export function ScheduleSection() {
  return (
    <section id="schedule" className="py-24 px-6 bg-transparent">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-3xl font-bold md:text-4xl text-zinc-900 dark:text-zinc-50">
            الجدول <span className="text-blue-600">الزمني</span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            انضموا إلينا على مدار ثلاثة أيام من الإبداع والابتكار. يبدأ الاستقبال يومياً من الساعة 9:30 صباحاً.
          </p>
        </motion.div>

        <div className="grid gap-8">
          {schedule.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative p-8 rounded-3xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none"
            >
              <div className="flex flex-col md:flex-row gap-8">
                {/* Date Side */}
                <div className="md:w-1/4 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-bold">
                    <Calendar className="w-4 h-4" />
                    {item.date}
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{item.day}</h3>
                  <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    {item.time}
                  </div>
                </div>

                {/* Events Side */}
                <div className="md:w-3/4 space-y-6">
                  {item.events.map((event, eIdx) => (
                    <div key={eIdx} className="space-y-2 group">
                      <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-2 text-blue-500 text-sm font-bold">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg flex items-start gap-4"
        >
          <div className="p-2 rounded-full bg-white/20">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-lg mb-1">هل تحتاج إلى مساعدة؟</h4>
            <p className="text-blue-50/90 leading-relaxed">
              يمكنكم التوجه إلى مكتب الاستقبال عند الوصول، حيث سيتواجد الموظفون لإرشادكم ومساعدتكم في الوصول إلى مناطق العرض المختلفة.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
