export default function MdxLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="container mx-auto space-y-4">
			<div className="prose max-w-none prose-span:text-muted-foreground prose-p:text-foreground prose-p:my-2 prose-p:leading-relaxed prose-pre:bg-transparent prose-pre:shadow prose-pre:p-0 prose-pre:border prose-pre:m-0 prose-strong:text-foreground prose-strong:font-medium prose-th:text-muted-foreground prose-th:font-medium prose-thead:border-border prose-td:text-foreground prose-code:rounded prose-a:text-muted-foreground prose-a:hover:text-foreground prose-a:underline prose-a:font-normal prose-a:underline-offset-4 prose-li:marker:text-foreground prose-li:text-foreground prose-ul:list prose-ol:list prose-a:link prose-li:my-0.5">
				{children}
			</div>
		</div>
	);
}
