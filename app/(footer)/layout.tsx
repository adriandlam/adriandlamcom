import Footer from "@/components/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="pt-10 md:pt-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
			{children}
			<Footer />
		</div>
	);
}
