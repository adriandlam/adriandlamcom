import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResumePage() {
	return (
		<main>
			<div className="flex items-center justify-between gap-6">
				<div>
					<h1 className="text-3xl font-semibold tracking-tight">Resume</h1>
					<p className="font-mono mt-2">
						A little bit into my professional life
					</p>
				</div>
			</div>

			<div className="mt-10"></div>
		</main>
	);
}
