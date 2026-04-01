import { ViewTransitions } from "next-view-transitions";
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { getBlogPostsForNav } from "@/lib/blog";
import { getProjectsForNav } from "@/lib/projects";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [blogPosts, projects] = await Promise.all([
		getBlogPostsForNav(),
		getProjectsForNav(),
	]);

	return (
		<ViewTransitions>
			<div className="max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto px-4">
				<Nav blogPosts={blogPosts} projects={projects} />
				<div
					className="pt-12 md:pt-18 lg:pt-20"
					style={{ viewTransitionName: "page-content" }}
				>
					{children}
				</div>
				<Footer />
			</div>
		</ViewTransitions>
	);
}
