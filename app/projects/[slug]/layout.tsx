import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="border-t border-dashed px-4 py-4 flex items-center">
        <Button asChild variant="ghost" size="sm">
          <Link href="/projects">
            <ChevronLeft />
            Back to all projects
          </Link>
        </Button>
      </div>
      {children}
    </div>
  );
}
