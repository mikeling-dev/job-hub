interface RemotiveJob {
  id: string;
  title: string;
  job_type: string;
  company_name: string;
  company_logo: string;
  candidate_required_location: string;
  salary: string;
  tags: string[];
  publication_date: string;
  url: string;
  description: string;
}

function stripHtml(html: string): string {
  // Replace <br>, <br/>, <br /> with newline
  const withLineBreaks = html.replace(/<br\s*\/?>/gi, "\n");

  // Replace <strong> or <b> tags with markdown-style bold markers
  const withBold = withLineBreaks
    .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<b>(.*?)<\/b>/gi, "**$1**");

  // Remove other HTML tags
  const strippedHtml = withBold.replace(/<[^>]*>/g, "");

  // Replace HTML entities
  return strippedHtml
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n\s*\n/g, "\n\n"); // Convert multiple newlines to double newlines
}

export async function fetchRemotiveJobs() {
  const url = "https://remotive.com/api/remote-jobs";
  const response = await fetch(url);
  const startingIndex = 0;
  const endingIndex = 150;

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.jobs
    .slice(startingIndex, endingIndex)
    .map((job: RemotiveJob) => ({
      id: job.id,
      title: job.title,
      job_type: job.job_type,
      company: job.company_name,
      company_logo: job.company_logo,
      location: job.candidate_required_location || "Remote",
      salary: job.salary,
      tags: job.tags,
      publish_date: job.publication_date,
      link: job.url,
      description: stripHtml(job.description || "No description available"),
    }));
}
