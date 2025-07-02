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
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/projects">
          <ChevronLeft className="h-4 w-4" />
          Back to all projects
        </Link>
      </Button>

      {children}
    </div>
  );
}
