export default function MdxLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="prose prose-headings:mt-8 prose-headings:font-medium prose-headings:text-foreground prose-headings:tracking-tight prose-h1:mt-0 prose-h1:text-3xl prose-h1:mb-0 prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-span:text-muted-foreground prose-p:text-foreground prose-p:font-mono prose-pre:bg-transparent prose-pre:shadow prose-pre:p-0 prose-pre:border prose-pre:m-0 prose-li:text-foreground prose-li:font-mono prose-strong:text-foreground prose-strong:font-semibold prose-th:text-muted-foreground prose-th:font-medium prose-thead:border-border prose-td:text-foreground prose-code:rounded">
			{children}
		</div>
	);
}
