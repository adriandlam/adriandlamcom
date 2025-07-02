const RESUME = {
  name: "Adrian Lam",
  avatar_path: "/me.jpg",
  bio: "Math student at UBC. Passionate about building things and helping people.",
  experience: [
    {
      icon: (
        <svg
          aria-label="Vercel logomark"
          height="64"
          role="img"
          viewBox="0 0 74 64"
          style={{ width: "auto", overflow: "visible" }}
        >
          <path
            d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z"
            fill="white"
          />
        </svg>
      ),
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
      slug: "spec2mcp",
      name: "Spec2MCP",
      description:
        "Turn any API docs (OpenAPI) into ready-to-use MCP server schemas—no deep technical setup needed. 🏆 Top 3 at YC MCP Hackathon.",
      longDescription:
        "Spec2MCP converts API docs (OpenAPI) into ready-to-use MCP server schemas in seconds, letting anyone build MCP tools without manual setup. Built with Next.js, TypeScript, TailwindCSS, Supabase, and FastAPI, it won top 3 at the Y Combinator MCP Hackathon. Users can upload/paste OpenAPI specs, preview live MCP schemas, and export instantly—abstracting technical details for a streamlined developer experience.",
      imagePath: "/projects/spec2mcp.png",
      liveUrl:
        "https://devpost.com/software/openapi-schema-to-mcp-server?ref_content=my-projects-tab&ref_feature=my_projects",
      stack: [
        "Next.js",
        "TypeScript",
        "TailwindCSS",
        "Supabase",
        "FastAPI",
        "Python",
      ],
      keyFeatures: [
        "Automatic OpenAPI → MCP schema conversion",
        "Live schema preview and validation",
        "File upload and clipboard support",
        "Developer-friendly, intuitive UI",
      ],
      collaborators: [
        {
          name: "Shreyas Goyal",
          portfolio: "",
          twitter: "https://x.com/xenshreyas",
        },
        {
          name: "Yash Arya",
          portfolio: "",
          twitter: "https://x.com/yashisbuilding",
        },
        {
          name: "Daniel Lima",
          portfolio: "",
          twitter: "https://x.com/LimaL310",
        },
      ],
      awards: ["🏆 Top 3 at Y Combinator MCP Hackathon (2025)"],
      inProgress: false,
      year: 2025,
    },
    {
      slug: "merin",
      name: "Merin",
      description:
        "An intelligent email platform reimagined for the AI era, designed to help users process emails faster with AI-powered assistance.",
      longDescription:
        "Merin is an intelligent email platform that transforms how users manage their inbox. It features AI-powered triage that automatically categorizes and prioritizes emails, contextual response generation, focus mode to eliminate distractions, and keyboard-first navigation for maximum efficiency. The platform helps users process hundreds of emails in minutes, with smart notifications that reduce interruptions by 85% and save 5+ hours per week. Built with a clean, minimal interface and seamless integrations with other productivity tools.",
      imagePath: "/projects/merin.png",
      liveUrl: "https://merin.ai",
      // githubUrl: "https://github.com/adriandlam/merin",
      stack: ["Next.js", "Supabase", "TypeScript", "TailwindCSS"],
      keyFeatures: [
        "Intelligent email triage with automatic categorization",
        "Context-aware AI assistance for quick responses",
        "Focus mode with distraction-free interface",
        "Keyboard-first design with customizable shortcuts",
        "Seamless integration with productivity tools",
        "Smart notifications for reduced interruptions",
      ],
      collaborators: [
        {
          name: "Michael Han",
          portfolio: "https://michaelhan.dev",
          twitter: "https://x.com/Mike_TheSolo",
        },
        {
          name: "Shubhaankar Sharma",
          portfolio: "https://spongeboi.com",
          twitter: "https://x.com/__spongeboi",
        },
      ],
      inProgress: true,
      year: 2025,
    },
    {
      slug: "obsidian-vercel",
      name: "Obsidian Vercel",
      description:
        "A tool for Obsidian users to avoid paying for publish/sync and host their notes on Vercel via a CI/CD pipeline.",
      longDescription:
        "Obsidian Vercel is a tool for Obsidian users to publish and sync their notes on the cloud with Vercel for free, avoiding the need to pay for publish/sync.",
      imagePath: "/projects/obsidian-vercel.png",
      liveUrl: "http://obsidian-vercel-umber.vercel.app/",
      githubUrl: "https://github.com/adriandlam/obsidian-vercel",
      stack: ["Next.js", "TypeScript", "TailwindCSS"],
      keyFeatures: [
        "Free hosting for Obsidian users",
        "Avoiding the need to pay for publish/sync",
        "Latex + Markdown support",
      ],
      inProgress: true,
      year: 2025,
    },
    {
      slug: "ubc-purity-test",
      name: "UBC Purity Test",
      description:
        "A fun platform that allows UBC students to test their innocence level with custom surveys for different faculties.",
      longDescription:
        "The UBC Purity Test is a fun self-graded survey platform that assesses how 'pure' or innocent a student's university experience has been. It features specialized versions for different faculties including the classic general test, a Business UBC Test for Sauder students, and a Sciences UBC Test for science majors and pre-med students. Scores range from 100% (completely pure) to 0% (not pure at all), calculated based on experiences the student has had during their time at UBC.",
      githubUrl: "https://github.com/adriandlam/ubc-purity-test",
      imagePath: "/projects/ubc-purity-test.png",
      liveUrl: "https://ubcpuritytest.com/",
      stack: ["Next.js", "TailwindCSS", "TypeScript", "Supabase"],
      collaborators: [
        {
          name: "Ryan Haraki",
          portfolio: "https://haraki.org/",
          twitter: "https://x.com/ryanharaki_",
        },
      ],
      keyFeatures: [],
      inProgress: false,
      year: 2025,
    },
    {
      slug: "heida",
      name: "Heida",
      description:
        "An AI command center that unifies 220+ AI models with your own API keys, featuring document intelligence, interactive tools, and persistent knowledge graphs.",
      longDescription:
        "Heida is a comprehensive AI interface designed for professionals to interact with multiple AI models through one elegant platform. It supports connection to 220+ AI models including OpenRouter models, Claude, and GPT-4 while allowing users to use their own API keys for cost control. The platform features document intelligence for analyzing PDFs and spreadsheets, interactive tools for visualizations and code execution, AI augmentation with web search capabilities, and a knowledge graph for persistent memory across conversations. Built with enterprise-grade security including end-to-end encryption.",
      imagePath: "/projects/heida.png",
      liveUrl: "https://heida.app",
      // githubUrl: "https://github.com/adriandlam/heida",
      stack: [
        "Next.js",
        "Supabase",
        "FastAPI",
        "Docker",
        "Redis",
        "Vector Embeddings",
        "TypeScript",
        "TailwindCSS",
      ],
      keyFeatures: [
        "Connection to 220+ AI models with perfect context retention",
        "Document intelligence for PDF and spreadsheet analysis",
        "Interactive tools for visualizations and code execution",
        "AI augmentation with real-time web search",
        "Knowledge graph for persistent memory across conversations",
        "Enterprise-grade security with end-to-end encryption",
      ],
      challenges:
        "The main challenge was efficiently implementing a caching layer for user details (like profiles and API kets) and model fetches in order to reduce latency on every chat conversation.",
      year: 2025,
    },
    {
      slug: "mnist-digit-classifier",
      name: "MNIST Digit Classifier",
      description:
        "Neural network implementation from scratch with 98.32% accuracy on the MNIST handwritten digit dataset.",
      longDescription:
        "This project implements a neural network from scratch using only NumPy and PyTorch (for matrix operations), achieving 98.32% accuracy on the MNIST handwritten digit classification task. I built the entire network architecture including forward propagation, backpropagation, and various optimization algorithms to understand the fundamental concepts behind neural networks before using higher-level frameworks.",
      githubUrl: "https://github.com/adriandlam/mnist-classifier",
      imagePath: "/projects/mnist.png",
      stack: [
        "Python",
        "NumPy",
        "PyTorch",
        "Neural Networks",
        "Machine Learning",
        "Computer Vision",
      ],
      keyFeatures: [
        "Custom implementation of backpropagation algorithm",
        "Multiple activation functions (ReLU, Softmax)",
        "Mini-batch gradient descent with momentum",
        "Learning rate scheduling",
        "Regularization techniques (ex. dropout)",
      ],
      challenges:
        "Implementing backpropagation from scratch was challenging, especially since there's so much going on (weight initializations, dropout rates, etc.), and ensuring correct gradient computation (that was done by hand, ouch). I verified my implementation by comparing results with PyTorch's autograd on simple cases.",
      year: 2024,
    },
    {
      slug: "contextual-retrieval",
      name: "Contextual Retrieval System",
      description:
        "A hybrid retrieval system combining semantic search and BM25 with context enrichment, achieving (a naive) 2.92/3.0 average accuracy on complex queries.",
      longDescription:
        "This project implements a hybrid document retrieval system that combines vector embeddings (semantic search) with BM25 (lexical search) to improve query results. The system uses a novel approach of enriching document chunks with AI-generated contextual descriptions before indexing, as guided by Anthropic's blog on Contextual Retrieval.The system processes documents by splitting them into manageable chunks, generating contextual descriptions for each chunk, and then creating both embeddings and BM25 indices. When a query arrives, both retrieval methods are used and results are combined using a rank fusion algorithm.",
      githubUrl: "https://github.com/adriandlam/contextual-retrieval",
      stack: [
        "Python",
        "NLP",
        "Sentence Transformers",
        "BM25",
        "OpenAI API",
        "Pandas",
        "NumPy",
        "NLTK",
      ],
      keyFeatures: [
        "Hybrid retrieval combining semantic search with BM25",
        "AI-powered context enrichment of document chunks",
        "Rank fusion algorithm for result combination",
        "Comprehensive token usage tracking and statistics",
      ],
      challenges:
        "The main challenge was balancing retrieval accuracy with computational efficiency. Context enrichment improved accuracy but added token overhead and processing time. I concluded that in real-world applications, the slight improvements in RAG accuracy from contextual embeddings were minimal compared to the much increased latency as a result of API calls to LLM providers on every chunk.",
      year: 2024,
    },
    {
      slug: "ubc-metrics",
      name: "UBC Metrics",
      description:
        "Course difficulty prediction system with 4.84% error rate based on historical grade distributions.",
      longDescription:
        "UBC Metrics analyzes historical grade distributions. The system helps students make informed decisions when planning their course schedules. Using regression models, it achieves a 4.84% error rate when predicting course difficulty.",
      githubUrl: "https://github.com/adriandlam/ubc-metrics",
      imagePath: "/projects/ubc-predictor.png",
      stack: [
        "Python",
        "Pandas",
        "Scikit-learn",
        "Seaborn",
        "NumPy",
        "NLP",
        "Web Scraping",
      ],
      keyFeatures: [
        "Course difficulty prediction based on multiple factors",
        "Historical grade distribution analysis",
        "Interactive visualization dashboard",
      ],
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
      longDescription:
        "The Wellbeing Analyzer is a personal project I built to track and analyze my sleep patterns from my Garmin watch. It provides insights on sleep quality and consistency. Although it's currently focused on sleep, I believe this can be easily adapted to other wellbeing metrics in the future.",
      githubUrl: "https://github.com/adriandlam/wellbeing_analyzer",
      imagePath: "/projects/wellbeing-analyzer.png",
      stack: [
        "Python",
        "Pandas",
        "NumPy",
        "Matplotlib",
        "Seaborn",
        "Time Series Analysis",
        "Data Visualization",
      ],
      keyFeatures: [
        "Sleep cycle detection and analysis",
        "Correlation analysis with daily activities",
        "Long-term trend visualization",
        "Sleep quality scoring algorithm",
      ],
      challenges:
        "Processing noisy sensor data from wearable devices was the main challenge. I implemented signal processing techniques including moving averages and outlier detection to clean the data before analysis.",
      year: 2024,
    },
    {
      slug: "chess-engine-cpp",
      name: "Chess Engine C++",
      description:
        "A chess engine written in C++ that implements minimax algorithm with alpha-beta pruning for efficient move calculation.",
      longDescription:
        "This chess engine is being built from scratch in C++ and implements standard chess rules along with advanced features like the minimax algorithm with alpha-beta pruning for efficient move calculation. The engine includes position evaluation, move generation, and a simple console-based UI for gameplay. Still in development with ongoing work on the perftest to fix move generation issues.",
      githubUrl: "https://github.com/adriandlam/chess_engine",
      stack: [
        "C++",
        "Chess",
        "Game Development",
        "Algorithms",
        "Data Structures",
      ],
      keyFeatures: [
        "Rules implementation including special moves",
        "Minimax algorithm with alpha-beta pruning",
        "Position evaluation heuristics",
        "Console-based UI for gameplay",
      ],
      challenges:
        "Currently debugging the move generation algorithm which has an error in the number of moves being generated. Perftest is showing inconsistencies that need to be fixed before I continue with optimizations.",
      inProgress: true,
      year: 2024,
    },
  ],
};

export default RESUME;
