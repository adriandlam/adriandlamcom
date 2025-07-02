"use client";

import {
  Camera,
  FolderGit2,
  House,
  Mail,
  NotebookPen,
  Quote,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";

interface Tab {
  name: string;
  icon: React.ReactNode;
  href: string;
}

const tabs: Tab[] = [
  { name: "home", icon: <House />, href: "/" },
  { name: "blog", icon: <NotebookPen />, href: "/blog" },
  { name: "projects", icon: <FolderGit2 />, href: "/projects" },
  { name: "photos", icon: <Camera />, href: "/photos" },
];

export default function Nav() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>(tabs[0].name);

  useEffect(() => {
    const tab = tabs.find((tab) => tab.href === pathname);
    if (tab) setActiveTab(tab.name);
  }, [pathname]);

  return (
    <nav className="fixed left-0 bottom-4 px-4 w-full flex justify-center z-10">
      <TooltipProvider>
        <div className="p-1 bg-background shadow-xl rounded-lg border h-full flex justify-center max-w-xl">
          <ul className="flex items-center gap-1">
            {tabs.map((tab) => (
              <li key={tab.name}>
                <Tooltip delayDuration={500}>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" asChild>
                      <Link
                        href={tab.href}
                        className={cn(
                          "text-foreground opacity-35 hover:opacity-100",
                          activeTab === tab.name &&
                            "text-primary bg-secondary opacity-100"
                        )}
                      >
                        {tab.icon}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-background text-foreground">
                    <p>
                      {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </li>
            ))}
            <Separator orientation="vertical" className="min-h-6!" />
            <li>
              <Tooltip delayDuration={500}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    asChild
                    className="text-muted-foreground opacity-75 hover:opacity-100"
                  >
                    <Link href="mailto:me@adriandlam.com">
                      <Mail />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-background text-foreground">
                  <p>Email</p>
                </TooltipContent>
              </Tooltip>
            </li>
            {/* <li>
						<Button
							size="icon"
							variant="ghost"
							asChild
							className="text-muted-foreground"
						>
							<Link href="https://x.com/adrianlam_dev" target="_blank">
								<XIcon />
							</Link>
						</Button>
					</li> */}
            <li>
              <Tooltip delayDuration={500}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    asChild
                    className="text-muted-foreground opacity-75 hover:opacity-100"
                  >
                    <Link
                      href="https://www.github.com/adriandlam"
                      target="_blank"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="currentColor"
                      >
                        <title>GitHub</title>
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-background text-foreground">
                  <p>GitHub</p>
                </TooltipContent>
              </Tooltip>
            </li>
          </ul>
        </div>
      </TooltipProvider>
    </nav>
  );
}

const XIcon = () => (
  <svg
    viewBox="0 0 300 301"
    className="text-foreground w-3! h-3!"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_174_240)">
      <path d="M178.57 127.15L290.27 0H263.81L166.78 110.38L89.34 0H0L117.13 166.93L0 300.25H26.46L128.86 183.66L210.66 300.25H300M36.01 19.54H76.66L263.79 281.67H223.13" />
    </g>
    <defs>
      <clipPath id="clip0_174_240">
        <rect width="300" height="301" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
