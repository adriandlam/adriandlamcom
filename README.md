# adriandlamcom

Personal website of Adrian Lam, built with Next.js and deployed on Vercel.

## Overview

This repository contains the source code for [adriandlam.com](https://adriandlam.com). It's designed to be easily customizable and can serve as a template for your own personal website.

## Features

- **Modern Stack**: Built with Next.js 15, React 19, TypeScript, and TailwindCSS 4
- **Blog with MDX**: Fully-featured blog with MDX support, including math notation via KaTeX
- **Responsive Design**: Mobile-first approach with elegant navigation for all device sizes
- **Dark Mode**: Seamless light/dark mode switching with next-themes (default is dark)
- **Photo Gallery**: Simple photo showcase with optimized image loading
- **shadcn/ui Components**: Customizable UI components with Radix UI primitives
- **GitHub Integration**: Display your GitHub activity chart on the homepage

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- pnpm (recommended) or npm or yarn

### Installation

1. Clone this repository to your local machine:

```bash
git clone https://github.com/adriandlam/adriandlamcom.git
```

2. Navigate to the project directory:

```bash
cd adriandlamcom
```

3. Install dependencies:

```bash
pnpm install
# or
npm install
# or
yarn
```

4. Start the development server with Turbopack:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

5. Open your browser and visit `http://localhost:3000`

## Customization

1. Edit your personal information in `app/page.tsx` and `app/layout.tsx`
2. Replace images in the `public` directory with your own (especially `me.jpg` for your avatar)
3. Add your own blog posts as MDX files in the `content/blog` directory
4. Place your photos in the `public/photos` directory
5. Customize colors and styling in `app/globals.css`

## Deployment

This project is optimized for deployment on Vercel. Simply push your repository to GitHub and connect it to Vercel for automatic deployments.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Usage as a Template

Feel free to use this repository as a template for your own personal website. If you do, please consider:

1. Giving appropriate credit
2. Removing my personal information (inside `data/resume.ts`) and replacing it with your own
3. Sharing your own improvements back with the community

## Contributing

Contributions are welcome! Feel free to submit a Pull Request for improvements, bug fixes, or new features.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautifully designed components
- [Next.js](https://nextjs.org/) for the React framework
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS
- Inspired by various personal websites in the developer community

---

Built with ❤️ by [Adrian Lam](https://adriandlam.com)