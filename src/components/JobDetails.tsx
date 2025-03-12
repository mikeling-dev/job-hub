"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface Job {
  id: string;
  title: string;
  job_type: string;
  company: string;
  company_logo: string;
  location: string;
  salary: string;
  tags: string[];
  publication_date: string;
  link: string;
  description: string;
}

interface JobDetailsProp {
  job: Job;
}

function formatDescription(text: string) {
  // Convert markdown-style bold to spans with bold class
  return text.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>');
}

export default function JobDetails({ job }: JobDetailsProp) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shortDescription = job.description.slice(0, 600);
  const shouldTruncate = job.description.length > 600;
  return (
    <div className="p-8 w-full flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <div className="flex flex-row gap-2 align-bottom text-end">
            <img src={job.company_logo} alt="logo" height={60} width={60} />
            <p className="self-end">
              {job.company} - {job.location}
            </p>
          </div>
        </div>
        <Card className="w-full md:w-1/3 p-3 text-xs flex flex-col gap-1">
          <CardTitle>Details</CardTitle>
          <CardDescription>Type: {job.job_type}</CardDescription>

          {job.salary ? (
            <CardDescription>Salary: {job.salary}</CardDescription>
          ) : (
            ""
          )}

          <CardDescription>Location: {job.location}</CardDescription>
          <div className="flex flex-wrap gap-1">
            <CardDescription>Skills: </CardDescription>
            {job.tags.map((tag, index) => (
              <Badge key={index}>{tag}</Badge>
            ))}
          </div>
        </Card>
      </div>
      <p
        className="whitespace-pre-line text-base leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: formatDescription(
            isExpanded
              ? job.description
              : shouldTruncate
              ? shortDescription + "..."
              : job.description
          ),
        }}
      />
      {shouldTruncate && (
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4"
        >
          {isExpanded ? "Show Less" : "See Full Description"}
        </Button>
      )}
      <Button className="w-full">
        <a href={job.link} target="_blank" className="w-full">
          Apply Now!
        </a>
      </Button>
    </div>
  );
}
