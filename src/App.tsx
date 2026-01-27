import { useState, useMemo } from 'react';
import { JobCard } from './components/JobCard';
import { FilterSidebar } from './components/FilterSidebar';
import { mockJobs } from './data/mockJobs';

function App() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [visaSponsorshipOnly, setVisaSponsorshipOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCountryChange = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    );
  };

  const handleTechStackChange = (tech: string) => {
    setSelectedTechStack((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleClearFilters = () => {
    setSelectedCountries([]);
    setSelectedTechStack([]);
    setSelectedLevels([]);
    setVisaSponsorshipOnly(false);
    setSearchQuery('');
  };

  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.company.toLowerCase().includes(query);
        const matchesLocation = job.location.toLowerCase().includes(query);
        
        if (!matchesTitle && !matchesCompany && !matchesLocation) {
          return false;
        }
      }

      // Country filter
      if (
        selectedCountries.length > 0 &&
        !selectedCountries.includes(job.country)
      ) {
        return false;
      }

      // Tech stack filter
      if (selectedTechStack.length > 0) {
        const hasMatchingTech = job.techStack?.some((tech) =>
          selectedTechStack.includes(tech)
        );
        if (!hasMatchingTech) return false;
      }

      // Experience level filter
      if (
        selectedLevels.length > 0 &&
        job.experienceLevel &&
        !selectedLevels.includes(job.experienceLevel)
      ) {
        return false;
      }

      // Visa sponsorship filter
      if (visaSponsorshipOnly && !job.visaSponsorship) {
        return false;
      }

      return true;
    });
  }, [
    searchQuery,
    selectedCountries,
    selectedTechStack,
    selectedLevels,
    visaSponsorshipOnly,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">DevJobs MENA</h1>
          <p className="text-gray-600 mt-2">
            Software developer jobs across the Middle East & North Africa
          </p>
          
          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by job title, company, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <FilterSidebar
              selectedCountries={selectedCountries}
              selectedTechStack={selectedTechStack}
              selectedLevels={selectedLevels}
              visaSponsorshipOnly={visaSponsorshipOnly}
              onCountryChange={handleCountryChange}
              onTechStackChange={handleTechStackChange}
              onLevelChange={handleLevelChange}
              onVisaSponsorshipChange={setVisaSponsorshipOnly}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="mb-6">
              <p className="text-gray-700">
                Showing <span className="font-semibold">{filteredJobs.length}</span> of{' '}
                <span className="font-semibold">{mockJobs.length}</span> jobs
              </p>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600 text-lg mb-2">
                  No jobs match your search or filters.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;