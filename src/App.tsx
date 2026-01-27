import { useState, useMemo } from 'react';
import { JobCard } from './components/JobCard';
import { FilterSidebar } from './components/FilterSidebar';
import { mockJobs } from './data/mockJobs';

function App() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [visaSponsorshipOnly, setVisaSponsorshipOnly] = useState(false);

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
  };

  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) => {
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
                <p className="text-gray-600 text-lg">
                  No jobs match your filters. Try adjusting your criteria.
                </p>
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