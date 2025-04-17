import Footer from "@/components/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="mx-auto max-w-2xl pt-10 md:pt-20">
			{children}
			<Footer />
		</div>
	);
}
