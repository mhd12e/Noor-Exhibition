import { Home, Info, Calendar, Lightbulb, Star } from "lucide-react";

export const APP_CONFIG = {
  MAX_COVER_SIZE: 3 * 1024 * 1024, // 3MB
  MAX_VIDEO_SIZE: 50 * 1024 * 1024, // 50MB
  START_YEAR: 2024,
  CURRENT_YEAR: new Date().getFullYear(),
};

export const NAV_ITEMS = [
  { name: "الرئيسية", href: "/", icon: Home },
  { name: "عن المعرض", href: "/#about", icon: Info },
  { name: "الجدول الزمني", href: "/#schedule", icon: Calendar },
  { name: "المشاريع", href: "/projects", icon: Lightbulb },
  { name: "قيمنا", href: "/rate", icon: Star },
];

export const REGEX = {
  STUDENT_NAME: /^[a-zA-Z\s\u0600-\u06FF]+$/,
};
