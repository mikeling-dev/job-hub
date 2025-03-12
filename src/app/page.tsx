"use client";
import JobCard from "@/components/JobCard";
import PaginationComponent from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchRemotiveJobs } from "@/lib/fetchJobs";
import { useCallback, useEffect, useState } from "react";

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

export default function Home() {
  const [query, setQuery] = useState("");
  const [loadedJobs, setLoadedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [sortBy, setSortBy] = useState<
    "title" | "company" | "date" | "Sort By"
  >("Sort By");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 8;
  const totalPages = Math.ceil(loadedJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = loadedJobs.slice(startIndex, startIndex + jobsPerPage);

  const sortJobs = (jobs: Job[]) => {
    return [...jobs].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "company":
          return a.company.localeCompare(b.company);
        case "date":
          return (
            new Date(b.publication_date).getTime() -
            new Date(a.publication_date).getTime()
          );
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [query, sortBy]);

  useEffect(() => {
    if (!query.trim()) {
      setLoadedJobs(sortJobs(allJobs));
      return;
    }
    const filteredJobs = allJobs.filter((job: Job) => {
      return (
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase()) ||
        job.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      );
    });
    setLoadedJobs(sortJobs(filteredJobs));

    // set states...
  }, [query, sortBy]);

  useEffect(() => {
    const fetchJobs = async () => {
      const jobs = await fetchRemotiveJobs();
      setLoadedJobs(jobs);
      setAllJobs(jobs);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-lg">Loading jobs...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="grid gap-4 p-8 w-full">
      <div className="flex flex-row w-full gap-2">
        <Input
          placeholder="Search for company or positions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-3/4 text-sm"
        ></Input>
        <Select
          onValueChange={(value: "title" | "company" | "date") =>
            setSortBy(value)
          }
          defaultValue=""
        >
          <SelectTrigger className="w-1/4">
            <SelectValue className="text-sm" placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="company">Company</SelectItem>
            <SelectItem value="date">Date</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {paginatedJobs.map((job: Job) => (
        <JobCard key={job.id} job={job} />
      ))}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
      ;
    </div>
  );
}
