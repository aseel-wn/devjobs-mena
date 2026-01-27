import { JobCard } from './components/JobCard';
import { mockJobs } from './data/mockJobs';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            DevJobs MENA
          </h1>
          <p className="text-gray-600 mt-2">
            Software developer jobs across the Middle East & North Africa
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Showing {mockJobs.length} jobs
          </p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;