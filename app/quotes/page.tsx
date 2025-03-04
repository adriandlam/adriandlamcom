"use client";

const quotes = [
	{
		text: "The happiness of your life depends upon the quality of your thoughts: therefore, guard accordingly, and take care that you entertain no notions unsuitable to virtue and reasonable nature.",
		author: "Marcus Aurelius, Meditations",
		date: "2025-03-04",
	},
];

export default function QuotesPage() {
	const sortedQuotes = quotes.sort(
		(a, b) => new Date(b.date) - new Date(a.date),
	);

	return (
		<main>
			<div className="relative">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512.5 512.5"
					className="text-muted w-14 h-14 absolute -z-10 -top-8 -left-10"
				>
					<g>
						<path
							fill="currentColor"
							d="M112.5,208.25c61.856,0,112,50.145,112,112s-50.144,112-112,112s-112-50.145-112-112l-0.5-16   c0-123.712,100.288-224,224-224v64c-42.737,0-82.917,16.643-113.137,46.863c-5.817,5.818-11.126,12.008-15.915,18.51   C100.667,208.723,106.528,208.25,112.5,208.25z M400.5,208.25c61.855,0,112,50.145,112,112s-50.145,112-112,112   s-112-50.145-112-112l-0.5-16c0-123.712,100.287-224,224-224v64c-42.736,0-82.918,16.643-113.137,46.863   c-5.818,5.818-11.127,12.008-15.916,18.51C388.666,208.723,394.527,208.25,400.5,208.25z"
						/>
					</g>
				</svg>
				<h1 className="text-3xl font-medium tracking-tight">Quotes</h1>
				<p className="font-mono mt-2">
					Some quotes ({quotes.length}) that I find interesting or inspiring.
				</p>
			</div>
			<ul className="mt-10 space-y-8">
				{sortedQuotes.map((quote, i) => (
					<li key={quote.text} className=" font-serif">
						<blockquote className="italic">{quote.text}</blockquote>
						<p className="text-muted-foreground mt-1">—{quote.author}</p>
					</li>
				))}
			</ul>
		</main>
	);
}
