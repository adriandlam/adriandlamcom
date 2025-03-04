const RESUME = {
	name: "Adrian Lam",
	avatar_path: "/me.jpg",
	bio: "Math student at UBC. Passionate about building things and helping people.",
	education: {
		institution: "University of British Columbia",
		degree: "Bachelor of Science, Mathematics",
		duration: "2022 - 2026",
	},
	projects: [
		{
			slug: "heida",
			name: "Heida",
			description:
				"A complete end-2-end web application for AI-powered productivity",
			imagePath: "/projects/heida.png",
			stack: [
				"Next.js",
				"Supabase",
				"FastAPI",
				"Docker",
				"Redis",
				"Vector Embeddings",
			],
		},
		{
			slug: "mnist-digit-classifier",
			name: "MNIST Digit Classifier",
			description:
				"Neural network implementation from scratch with 98.32% accuracy",
			imagePath: "/projects/mnist.png",
			stack: ["Python", "NumPy", "PyTorch", "Neural Networks"],
		},
		{
			slug: "ubc-grade-analyzer",
			name: "UBC Grade Analyzer",
			description: "Course difficulty prediction system with 4.84% error rate",
			imagePath: "/projects/ubc-predictor.png",
			stack: ["Python", "Pandas", "Scikit-learn", "Seaborn", "NumPy"],
		},
	],
};

export default RESUME;
