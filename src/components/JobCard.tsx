import type { Job } from '../types/job';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {job.title}
          </h3>
          <p className="text-gray-600 mt-1">{job.company}</p>
        </div>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {job.source}
        </span>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <span>📍 {job.location}</span>
        <span>📅 {job.postedDate}</span>
        {job.salary && <span>💰 {job.salary}</span>}
      </div>
      
      {job.techStack && job.techStack.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.techStack.map(tech => (
            <span 
              key={tech} 
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
      
      {job.visaSponsorship && (
        <div className="mb-4">
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            ✓ Visa Sponsorship
          </span>
        </div>
      )}
      
      <a 
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Apply Now →
      </a>
    </div>
  );
}