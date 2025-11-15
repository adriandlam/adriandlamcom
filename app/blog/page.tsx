import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";

// Format date helper function
function formatDate(dateString: string) {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
	});
}

export default function BlogPage() {
	const posts = getBlogPosts();

	return (
		<main className="container mx-auto">
			<div>
				<h1>Blog</h1>
				<p className="mt-2 text-muted-foreground">
					A collection of articles and thoughts on software development and who
					I am as a person.
				</p>
			</div>
			<table className="mt-8 w-full">
				<thead>
					<tr className="border-b border-border">
						<th className="text-left py-2 px-0 text-xs text-muted-foreground font-normal font-mono tracking-wide">
							date
						</th>
						<th className="text-left py-2 px-6 text-xs text-muted-foreground font-normal font-mono tracking-wide">
							title
						</th>
						<th className="text-left py-2 px-4 text-xs text-muted-foreground font-normal hidden md:table-cell font-mono tracking-wide">
							summary
						</th>
						{/* TODO: add views */}
						{/* <th className="text-left py-2 px-4 text-sm text-muted-foreground/65 font-normal">
              views
            </th> */}
					</tr>
				</thead>
				<tbody className="divide-y divide-border">
					{posts.map((post) => (
						<tr
							key={post.slug}
							className="hover:bg-muted/50 transition-colors relative group"
						>
							<td className="py-2.5 px-0 text-sm text-muted-foreground whitespace-nowrap font-mono">
								{formatDate(post.publishedAt)}
							</td>
							<td className="py-2.5 px-6">
								<span className="line-clamp-1 w-38">{post.title}</span>
							</td>
							<td className="py-2.5 px-4 text-sm text-muted-foreground hidden md:table-cell">
								<span className="line-clamp-1">{post.summary}</span>
							</td>
							<Link
								href={`/blog/${post.slug}`}
								className="absolute inset-0 z-10"
								aria-label={`Read blog post: ${post.title}`}
							/>
						</tr>
					))}
				</tbody>
			</table>
		</main>
	);
}
