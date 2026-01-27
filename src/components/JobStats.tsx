interface JobStatsProps {
  totalJobs: number;
  jobsByCountry: Record<string, number>;
  lastUpdated: string;
}

export function JobStats({ totalJobs, jobsByCountry, lastUpdated }: JobStatsProps) {
  const countries = Object.entries(jobsByCountry)
    .sort((a, b) => b[1] - a[1]) // Sort by count descending
    .slice(0, 5); // Top 5 countries

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            {totalJobs}+ Developer Jobs
          </h2>
          <p className="text-blue-100">
            Curated opportunities across the Middle East & North Africa
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {countries.map(([country, count]) => (
            <div key={country} className="text-center">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm text-blue-100">{country}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-blue-500">
        <p className="text-sm text-blue-100">
          Last updated: {lastUpdated}
        </p>
      </div>
    </div>
  );
}