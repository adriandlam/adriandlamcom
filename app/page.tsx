"use client";

import ProjectCard from "@/components/project-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import RESUME from "@/data/resume";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import GitHubCalendar, { Activity } from "react-github-calendar";

export default function Home() {
  return (
    <main>
      {/* Intro Section */}
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-medium tracking-tight">{RESUME.name}</h1>
          <p className="mt-2 opacity-80">{RESUME.bio}</p>
        </div>
        <Avatar className="w-28 h-28">
          <AvatarImage src={RESUME.avatar_path} alt="Avatar" />
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
      </div>

      {/* GitHub Recent Activity */}
      <div className="mt-10">
        <h2 className="text-2xl font-medium tracking-tight">
          Recent GitHub Activity
        </h2>
        <div className="mt-4">
          <GitHubCalendar
            username="adriandlam"
            colorScheme="dark"
            transformData={(data) => selectLastNMonths(data, 10)}
            labels={{
              totalCount: "{{count}} contributions in the last 10 months",
            }}
            fontSize={14}
            errorMessage="Error loading GitHub contributions"
            theme={{
              dark: ["#262626", "#0d4429", "#016d32", "#26a641", "#3ad353"],
            }}
          />
        </div>
        <p className="mt-2.5 text-muted-foreground text-xs text-center">
          Psssst, can you tell when my exams are?
        </p>
      </div>

      {/* About Me Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-medium tracking-tight">About Me</h2>
        <p className="mt-2 opacity-80">
          I'm a Mathematics student at the University of British Columbia, set
          to graduate in 2026. I have a strong background in software
          development, with experience in full-stack development, machine
          learning, and data analysis.
        </p>
      </div>

      {/* Experience Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-medium tracking-tight">Experience</h2>
        <div className="mt-2">
          {RESUME.experience.map((experience) => (
            <div key={experience.company} className="mt-2">
              <div className="flex justify-between items-end">
                <h3 className="font-medium tracking-tight">
                  {experience.company}
                </h3>
                <p className="text-sm">
                  {new Date(experience.start_date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(experience.end_date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              {/* <p className="text-sm mt-0.5 text-muted-foreground">
                {experience.description}
              </p> */}
              <div className="flex justify-between items-end text-sm mt-0.5">
                <span className="text-muted-foreground">{experience.role}</span>
                <p className="text-muted-foreground">{experience.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-medium tracking-tight">Education</h2>
        <div className="mt-2">
          <div className="flex justify-between items-end">
            <h3 className="font-medium tracking-tight">
              {RESUME.education.institution}
            </h3>
            <p className="text-sm">
              {RESUME.education.start_year} - {RESUME.education.end_year}
            </p>
          </div>
          <div className="flex justify-between items-end text-sm mt-0.5">
            <span className="text-muted-foreground">
              {RESUME.education.degree}
            </span>
            <p className="text-muted-foreground">{RESUME.education.location}</p>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-medium tracking-tight">Projects</h2>
        <p className="mt-2 mb-6 opacity-80">
          Here are some of my notable projects that showcase my skills and
          interests:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RESUME.projects.slice(0, 4).map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/projects">
              View All Projects <ChevronRight />
            </Link>
          </Button>
        </div>
      </div>

      {/* Extra Section */}
      {/* <div className="mt-10">
				<h2 className="text-2xl font-medium tracking-tight">
					Some extra stuff
				</h2>
				<p className=" mt-2 mb-6">
				</p>
			</div> */}
    </main>
  );
}

const selectLastNMonths = (contributions: Activity[], n: number) => {
  const now = new Date();
  const cutoffDate = new Date(now);
  cutoffDate.setMonth(now.getMonth() - n);

  return contributions.filter((activity) => {
    const activityDate = new Date(activity.date);
    return activityDate >= cutoffDate && activityDate <= now;
  });
};
