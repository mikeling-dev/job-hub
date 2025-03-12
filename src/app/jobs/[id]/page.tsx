import JobDetails from "@/components/JobDetails";
import { fetchRemotiveJobs } from "@/lib/fetchJobs";

interface Job {
  id: string;
  title: string;
  company: string;
  company_logo: string;
  location: string;
  salary: string;
  tags: string[];
  publication_date: string;
  url: string;
  description: string;
}

export const dynamic = "force-dynamic";

export default async function JobDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const jobs = await fetchRemotiveJobs();
    const job = jobs.find((j: Job) => `${j.id}` === `${params.id}`);
    if (!job) return <div>Job not found</div>;
    return <JobDetails job={job} />;
  } catch (error) {
    console.error("Error scraping jobs:", error);
    return <div>Error loading job details. Please try again later.</div>;
  }
}
