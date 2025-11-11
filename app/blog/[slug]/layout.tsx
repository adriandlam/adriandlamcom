export default function MdxLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="container mx-auto space-y-4">
			<div>{children}</div>
		</div>
	);
}
