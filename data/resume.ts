const RESUME = {
	name: "Adrian Lam",
	avatar_path: "/me.jpeg",
	bio: {
		intro: "intern @ vercel, math student @ ubc.",
		about: "TODO: move bio here",
	},
	experience: [
		{
			company: "Vercel",
			role: "Software Engineer Intern",
			description: "",
			start_date: "2025-09-01",
			end_date: "2025-12-01",
			location: "San Francisco, CA",
			company_website: "https://vercel.com",
		},
	],
	education: {
		institution: "University of British Columbia",
		degree: "Bachelor of Science",
		major: "Mathematics",
		start_year: "2022",
		end_year: "2026",
		location: "Vancouver, BC",
	},
	projects: [
		{
			featured: true,
			slug: "workflow-devkit",
			name: "Workflow DevKit",
			description: "Open source TypeScript framework for durable execution.",
			notes: [
				"Founding member and core contributor of the Workflow Development Kit",
				"Built and launched useworkflow.dev docs, generating 73,000+ unique visitors and 200,000+ views within 2 weeks",
				"Created framework integrations for Bun, Hono, Remix + React Router, and SvelteKit",
			],
			url: "https://useworkflow.dev",
			inProgress: false,
			year: 2025,
		},
		{
			slug: "ubc-webring",
			name: "UBC Webring",
			description: "A webring for UBC students to share their websites.",
			notes: [
				"Built community platform connecting UBC student personal websites",
				"Promotes student portfolios and personal branding",
			],
			url: "https://ubcwebring.com",
			inProgress: false,
			year: 2025,
		},
		{
			featured: true,
			slug: "spec2mcp",
			name: "Spec2MCP",
			description: "Convert OpenAPI specs to MCP server schemas instantly.",
			notes: [
				"Converts API documentation to MCP schemas in seconds",
				"Top 3 at Y Combinator MCP Hackathon",
			],
			url: "https://devpost.com/software/openapi-schema-to-mcp-server?ref_content=my-projects-tab&ref_feature=my_projects",
			inProgress: false,
			year: 2025,
		},
		{
			slug: "obsidian-vercel",
			name: "Obsidian Vercel",
			description:
				"A tool for Obsidian users to avoid paying for publish/sync and host their notes on Vercel via a CI/CD pipeline.",
			notes: [
				"Free alternative to Obsidian Publish ($10+/month)",
				"Automated CI/CD pipeline for seamless note publishing",
				"Full LaTeX and Markdown support",
			],
			url: "http://obsidian-vercel-umber.vercel.app/",
			inProgress: true,
			year: 2025,
		},
		{
			featured: true,
			slug: "ubc-purity-test",
			name: "UBC Purity Test",
			description:
				"Fun survey platform for UBC students to test their innocence.",
			notes: [
				"12.2K unique visitors, 13.3K visits, and 33.8K views",
				"Viral UBC student survey platform",
				"Multiple faculty-specific test versions (General, Sauder, Sciences)",
				"Built with Ryan Haraki",
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
			description:
				"Unified interface for 220+ AI models, document intelligence, and knowledge graphs.",
			notes: [
				"Unified interface supporting 220+ AI models (Claude, GPT-4, OpenRouter)",
				"Enterprise-grade security with end-to-end encryption",
				"Knowledge graph for persistent memory across conversations",
				"Document intelligence for PDF and spreadsheet analysis",
			],
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
			description:
				"Neural network built from scratch achieving 98.32% accuracy on MNIST.",
			notes: [
				"98.32% accuracy on MNIST handwritten digit classification",
				"Built neural network from scratch using only NumPy",
				"Custom implementation of backpropagation and optimization algorithms",
			],
			url: "https://github.com/adriandlam/mnist-classifier",
			year: 2024,
		},
		{
			slug: "contextual-retrieval",
			name: "Contextual Retrieval System",
			description:
				"A hybrid retrieval system combining semantic search and BM25 with context enrichment, achieving (a naive) 2.92/3.0 average accuracy on complex queries.",
			notes: [
				"2.92/3.0 average accuracy on complex queries",
				"Hybrid approach combining semantic search with BM25 lexical search",
				"AI-powered context enrichment inspired by Anthropic's research",
			],
			url: "https://github.com/adriandlam/contextual-retrieval",
			year: 2024,
		},
		{
			slug: "ubc-metrics",
			name: "UBC Metrics",
			description:
				"Course difficulty prediction system with 4.84% error rate based on historical grade distributions.",
			notes: [
				"4.84% error rate in predicting course difficulty",
				"Analyzes historical grade distributions across UBC courses",
				"Helps students make informed course planning decisions",
			],
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
			description:
				"A wellbeing analyzer that [only] supports sleep analysis (just for me!) to track and improve sleep patterns.",
			notes: [
				"Personal sleep tracking and analysis tool for Garmin watch data",
				"Sleep quality scoring and trend visualization",
				"Correlation analysis with daily activities",
			],
			year: 2024,
		},
		{
			slug: "chess-engine-cpp",
			name: "Chess Engine C++",
			description:
				"A chess engine written in C++ that implements minimax algorithm with alpha-beta pruning for efficient move calculation.",
			notes: [
				"Chess engine built from scratch in C++",
				"Implements minimax algorithm with alpha-beta pruning",
				"Includes position evaluation and move generation",
			],
			url: "https://github.com/adriandlam/chess_engine",
			inProgress: true,
			year: 2024,
		},
	],
};

export default RESUME;
