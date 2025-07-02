import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/projects">
          <ArrowLeft className="h-4 w-4" />
          Back to all projects
        </Link>
      </Button>
      <div className="prose prose-headings:mt-8 prose-headings:font-medium prose-headings:text-foreground prose-headings:tracking-tight prose-h1:mt-0 prose-h1:text-3xl prose-h1:mb-0 prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-span:text-muted-foreground prose-p:text-foreground prose-pre:bg-transparent prose-pre:shadow prose-pre:p-0 prose-pre:border prose-pre:m-0 prose-li:text-foreground prose-strong:text-foreground prose-strong:font-semibold prose-th:text-muted-foreground prose-th:font-medium prose-thead:border-border prose-td:text-foreground prose-code:rounded prose-a:text-cyan-500 prose-a:underline prose-a:font-normal prose-a:underline-offset-2 prose-li:marker:text-foreground">
        {children}
      </div>
    </div>
  );
}
