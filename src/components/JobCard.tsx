import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";

type Job = {
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
};

export default function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`} target="_blank">
      <Card className="flex flex-row md:px-4 w-full hover:shadow-md h-32">
        <div className="h-full w-1/6 flex flex-col text-wrap text-center justify-center items-center p-2">
          <Image
            src={job.company_logo}
            height={60}
            width={60}
            alt="company_logo"
          />
        </div>

        <div className="p-4 justify-center w-1/2">
          {/* <CardHeader className="flex flex-row align-middle items-center content-center gap-3 h-8 p-0 mb-2"> */}
          <CardTitle className="text-xs md:text-sm">{job.title}</CardTitle>
          {/* </CardHeader> */}
          <CardContent className="flex flex-col px-0 gap-1">
            {job.salary ? (
              <p className="text-xs max-h-8 overflow-hidden">{job.salary}</p>
            ) : (
              ""
            )}
            <CardDescription className="text-xs md:text-sm">
              <span className="font-bold">{job.company}</span> - {job.location}
            </CardDescription>
          </CardContent>
        </div>

        <div className="flex flex-col gap-2 text-xs w-1/3 h-full p-2 overflow-auto">
          {job.tags.slice(0, 8).map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </Card>
    </Link>
  );
}
