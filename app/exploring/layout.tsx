import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function ExploringLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="fixed inset-0 z-0 overflow-hidden">
			{children}
			<Button
				variant="outline"
				size="sm"
				className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 rounded-full backdrop-blur"
				asChild
			>
				<Link href="/">
					<HomeIcon />
					Back to home
				</Link>
			</Button>
		</div>
	);
}
