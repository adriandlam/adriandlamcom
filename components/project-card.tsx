"use client";

import {
	Check,
	CircleDot,
	ExternalLink,
	Github,
	Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import Image from "next/image";

interface Project {
	name: string;
	slug: string;
	description: string;
	stack: string[];
	imagePath?: string;
	githubUrl?: string;
	liveUrl?: string;
	inProgress?: boolean;
	year: number;
}

export default function ProjectCard({ project }: { project: Project }) {
	return (
		<Link
			href={`/projects/${project.slug}`}
			className="cursor-pointer group border overflow-hidden hover:bg-muted/50 transition-all duration-200 ease-in-out"
		>
			<div className="p-4">
				<div className="w-full h-48 overflow-hidden group-hover:brightness-100 transition-all brightness-65 ease-in-out duration-200">
					{project.imagePath ? (
						<Image
							src={project.imagePath}
							alt={`${project.name} screenshot`}
							width={2000}
							height={2000}
							quality={100}
							className="w-full h-full object-cover object-top"
						/>
					) : (
						<div className="w-full h-48 bg-muted flex justify-center items-center">
							<ImageIcon className="w-10 h-10 text-muted-foreground" />
						</div>
					)}
				</div>
				<div>
					<div className="flex justify-between items-center mt-4">
						<h3 className="text-lg">{project.name}</h3>
						<Badge variant="secondary">{project.year}</Badge>
					</div>
					<p className="mt-2 text-sm flex-grow text-muted-foreground">
						{project.description}
					</p>
				</div>
			</div>
		</Link>
	);
}

//         <div classname="flex items-center justify-between mt-3">
//           <link
//             href={`/projects/${project.slug}`}
//             classname="text-sm font-medium text-cyan-500 hover:text-cyan-600 transition-colors"
//           >
//             view details
//           </link>
//           <div classname="flex gap-3 items-center">
//             {project.githuburl && (
//               <link
//                 href={project.githuburl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 classname="text-muted-foreground hover:text-primary transition-colors"
//                 legacybehavior={false}
//                 passhref
//               >
//                 <github size={18} />
//               </link>
//             )}
//             {project.liveurl && (
//               <link
//                 href={project.liveurl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 classname="text-muted-foreground hover:text-primary transition-colors"
//                 legacybehavior={false}
//                 passhref
//               >
//                 <externallink size={18} />
//               </link>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
