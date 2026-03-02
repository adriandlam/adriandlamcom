const RESUME = {
	name: "Adrian Lam",
	bio: {
		intro: "math student @ ubc, incoming software intern @ cloudflare",
	},
	socials: {
		twitter: "adriandlam_",
		github: "adriandlam",
	},
	projects: [
		{
			featured: true,
			slug: "blocksmith",
			name: "Blocksmith - An Open-Source DNS Adblocker",
			shortDescription: "A private DNS adblocker.",
			description: "A fast, private DNS adblocker that respects your privacy.",
			url: "https://github.com/adriandlam/blocksmith",
			inProgress: false,
			year: 2026,
		},
		{
			featured: true,
			slug: "vercel-workflow-devkit",
			name: "Vercel Workflow DevKit",
			shortDescription: "TypeScript framework for durable execution.",
			description: "Open source TypeScript framework for durable execution.",
			notes: [
				"Founding member and core contributor",
				"73,000+ unique visitors and 200,000+ views in 2 weeks",
				"Integrations for Bun, Hono, Remix + React Router, and SvelteKit",
			],
			url: "https://useworkflow.dev",
			inProgress: false,
			year: 2025,
		},
		{
			slug: "ubc-webring",
			name: "UBC Webring",
			shortDescription: "A webring for UBC students to share websites.",
			description: "A webring for UBC students to share their websites.",
			notes: ["Community platform for UBC student websites"],
			url: "https://ubcwebring.com",
			inProgress: false,
			year: 2025,
		},
		{
			featured: true,
			slug: "spec2mcp",
			name: "Spec2MCP",
			shortDescription: "OpenAPI to MCP server schemas.",
			description: "Convert OpenAPI specs to MCP server schemas instantly.",
			notes: ["Top 3 at Y Combinator MCP Hackathon"],
			url: "https://devpost.com/software/openapi-schema-to-mcp-server?ref_content=my-projects-tab&ref_feature=my_projects",
			inProgress: false,
			year: 2025,
		},
		{
			slug: "obsidian-vercel",
			name: "Obsidian Vercel",
			shortDescription: "Free Obsidian publishing via Vercel CI/CD.",
			description:
				"A tool for Obsidian users to avoid paying for publish/sync and host their notes on Vercel via a CI/CD pipeline.",
			notes: ["Automated CI/CD pipeline for note publishing"],
			url: "http://obsidian-vercel-umber.vercel.app/",
			inProgress: true,
			year: 2025,
		},
		{
			featured: true,
			slug: "ubc-purity-test",
			name: "UBC Purity Test",
			shortDescription: "Viral survey platform for UBC students.",
			description:
				"Fun survey platform for UBC students to test their innocence.",
			notes: [
				"12.2K unique visitors, 13.3K visits, 33.8K views",
				"Multiple faculty-specific versions",
			],
			longDescription:
				"The UBC Purity Test is a fun self-graded survey platform that assesses how 'pure' or innocent a student's university experience has been. It features specialized versions for different faculties including the classic general test, a Business UBC Test for Sauder students, and a Sciences UBC Test for science majors and pre-med students. Scores range from 100% (completely pure) to 0% (not pure at all), calculated based on experiences the student has had during their time at UBC.",
			url: "https://ubcpuritytest.com/",
			inProgress: false,
			year: 2025,
		},
		{
			featured: true,
			slug: "heida",
			name: "Heida",
			shortDescription: "Unified interface for 220+ AI models.",
			description:
				"Unified interface for 220+ AI models, document intelligence, and knowledge graphs.",
			longDescription:
				"Heida is a comprehensive AI interface designed for professionals to interact with multiple AI models through one elegant platform. It supports connection to 220+ AI models including OpenRouter models, Claude, and GPT-4 while allowing users to use their own API keys for cost control. The platform features document intelligence for analyzing PDFs and spreadsheets, interactive tools for visualizations and code execution, AI augmentation with web search capabilities, and a knowledge graph for persistent memory across conversations. Built with enterprise-grade security including end-to-end encryption.",
			url: "https://heida.app",
			keyFeatures: [
				"Connection to 220+ AI models with perfect context retention",
				"Document intelligence for PDF and spreadsheet analysis",
			],
			year: 2025,
		},
		{
			featured: true,
			slug: "mnist-digit-classifier",
			name: "MNIST Digit Classifier",
			shortDescription: "Neural network from scratch, 98.32% accuracy.",
			description:
				"Neural network built from scratch achieving 98.32% accuracy on MNIST.",
			url: "https://github.com/adriandlam/mnist-classifier",
			year: 2024,
		},
		{
			slug: "contextual-retrieval",
			name: "Contextual Retrieval System",
			shortDescription: "Hybrid semantic + BM25 retrieval, 2.92/3.0 accuracy.",
			description:
				"A hybrid retrieval system combining semantic search and BM25 with context enrichment, achieving (a naive) 2.92/3.0 average accuracy on complex queries.",
			url: "https://github.com/adriandlam/contextual-retrieval",
			year: 2024,
		},
		{
			slug: "ubc-metrics",
			name: "UBC Metrics",
			shortDescription: "Course difficulty predictor with 4.84% error rate.",
			description:
				"Course difficulty prediction system with 4.84% error rate based on historical grade distributions.",
			url: "https://github.com/adriandlam/ubc-metrics",
			year: 2024,
		},
		// {
		// 	slug: "adrians-research-engine",
		// 	name: "Adrian's Research Engine",
		// 	description:
		// 		"An AI-powered research engine that helps you find relevant papers and insights for your research from natural language.",
		// 	longDescription:
		// 		"Adrian's Research Engine is a research assistant that helps you find relevant papers and insights for your research from natural language. It uses a hybrid retrieval system that combines light weight semantic search with BM25 to improve query results, with reranking in order to determine relevance.",
		// 	stack: [
		// 		"Next.js",
		// 		"Express",
		// 		"Redis",
		// 		"Vector Embeddings",
		// 		"TypeScript",
		// 		"TailwindCSS",
		// 	],
		// 	keyFeatures: [
		// 		"Hybrid retrieval combining light weight semantic search with BM25",
		// 		"Reranking in order to determine relevance",
		// 	],
		// 	inProgress: true,
		// 	year: 2025,
		// },
		{
			slug: "wellbeing-analyzer",
			name: "Wellbeing Analyzer",
			shortDescription: "Personal sleep tracking and analysis for Garmin data.",
			description:
				"A wellbeing analyzer that [only] supports sleep analysis (just for me!) to track and improve sleep patterns.",
			year: 2024,
		},
		{
			slug: "chess-engine-cpp",
			name: "Chess Engine C++",
			shortDescription: "C++ chess engine with minimax and alpha-beta pruning.",
			description:
				"A chess engine written in C++ that implements minimax algorithm with alpha-beta pruning for efficient move calculation.",
			url: "https://github.com/adriandlam/chess_engine",
			inProgress: true,
			year: 2024,
		},
	],
};

export default RESUME;
