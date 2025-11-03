import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="container mx-auto space-y-4">
			<Button asChild variant="ghost" size="sm">
				<Link href="/blog">
					<ChevronLeft />
					Back to all posts
				</Link>
			</Button>
			<div className="prose max-w-none prose-headings:mt-8 prose-headings:!font-normal prose-headings:text-foreground prose-h1:mt-0 prose-h1:text-2xl prose-h1:font-medium prose-h1:mb-0 prose-h2:text-xl prose-h3:text-lg prose-span:text-muted-foreground prose-p:text-foreground prose-p:my-4 prose-p:leading-relaxed prose-pre:bg-transparent prose-pre:shadow prose-pre:p-0 prose-pre:border prose-pre:m-0 prose-strong:text-foreground prose-strong:font-medium prose-th:text-muted-foreground prose-th:font-medium prose-thead:border-border prose-td:text-foreground prose-code:rounded prose-a:text-muted-foreground prose-a:hover:text-foreground prose-a:underline prose-a:font-normal prose-a:underline-offset-4 prose-li:marker:text-foreground prose-ul:list-disc prose-ul:list-inside">
				{children}
			</div>
		</div>
	);
}
