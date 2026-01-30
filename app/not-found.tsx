import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="space-y-6 max-w-md w-full">
        <h1 className="text-9xl font-bold text-zinc-200 dark:text-zinc-800">404</h1>
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">الصفحة غير موجودة</h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          عذراً، يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link href="/">
            <Button className="w-full sm:w-auto gap-2">
              <Home className="w-4 h-4" />
              الرئيسية
            </Button>
          </Link>
          <Link href="/projects">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              المشاريع
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
