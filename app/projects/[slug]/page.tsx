"use client";

import { Separator } from "@/components/ui/separator";
import RESUME from "@/data/resume";
import { notFound, useParams } from "next/navigation";
import React from "react";

export default function Project() {
	const params = useParams();
	const slug = params.slug;

	const project = RESUME.projects.find((project) => project.slug === slug);
	if (!project) {
		return notFound();
	}

	return (
		<main>
			<div>
				<h1 className="text-3xl font-semibold tracking-tight">
					{project.name}
				</h1>
				<p className="font-mono mt-2">{project.description}</p>
			</div>
			<div className="my-10">
				<img
					alt={`${project.name} demo`}
					src={project.imagePath}
					className="rounded border shadow"
				/>
			</div>
		</main>
	);
}
