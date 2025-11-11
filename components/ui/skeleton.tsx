"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="skeleton"
			className={cn("relative overflow-hidden bg-muted", className)}
			{...props}
		>
			<motion.div
				className="absolute inset-0 bg-linear-to-r from-transparent via-primary/20 to-transparent"
				initial={{ x: "-100%" }}
				animate={{ x: "100%" }}
				transition={{
					repeat: Infinity,
					duration: 1.5,
					ease: "easeInOut",
				}}
			/>
		</div>
	);
}

export { Skeleton };
