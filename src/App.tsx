
import { JobCard } from './components/JobCard';
import { FilterSidebar } from './components/FilterSidebar';
//import { mockJobs } from './data/mockJobs';
import { useState, useMemo, useEffect } from 'react';
import type { Job } from './types/job';
import { JobStats } from './components/JobStats';
import { Footer } from './components/Footer';
import { JobCardSkeleton } from './components/JobCardSkeleton';

function App() {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [visaSponsorshipOnly, setVisaSponsorshipOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);


  // Fetch jobs on mount
  useEffect(() => {
    fetch('/data/jobs.json')
      .then(res => res.json())
      .then(data => {
        setAllJobs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading jobs:', err);
        setLoading(false);
      });
  }, []);

// Keyboard shortcuts
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClearFilters();
      setShowFilters(false); // Also close mobile filters
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []); // Empty dependency array is fine here

  // Calculate stats
const jobsByCountry = useMemo(() => {
  const counts: Record<string, number> = {};
  allJobs.forEach(job => {
    counts[job.country] = (counts[job.country] || 0) + 1;
  });
  return counts;
}, [allJobs]);

const lastUpdated = useMemo(() => {
  const now = new Date();
  const hours = now.getHours();
  
  if (hours < 6) {
    return 'Early this morning';
  } else if (hours < 12) {
    return 'This morning';
  } else if (hours < 18) {
    return 'This afternoon';
  } else {
    return 'This evening';
  }
}, []);

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
  // Don't filter if data hasn't loaded yet
  if (allJobs.length === 0) {
    return [];
  }

  return allJobs.filter((job) => {
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
  allJobs,
  searchQuery,
  selectedCountries,
  selectedTechStack,
  selectedLevels,
  visaSponsorshipOnly,
]);

if (loading) {
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
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

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
        <JobStats 
        totalJobs={allJobs.length}
        jobsByCountry={jobsByCountry}
        lastUpdated={lastUpdated}
        />
        <div className="flex gap-8">
          {/* Sidebar */}
        {/* Mobile filter toggle button */}
<div className="lg:hidden mb-4">
  <button
    onClick={() => setShowFilters(!showFilters)}
    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
  >
    <span className="font-semibold text-gray-900">
      Filters {(selectedCountries.length + selectedTechStack.length + selectedLevels.length + (visaSponsorshipOnly ? 1 : 0)) > 0 && 
        `(${selectedCountries.length + selectedTechStack.length + selectedLevels.length + (visaSponsorshipOnly ? 1 : 0)})`}
    </span>
    <svg
      className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
</div>

{/* Sidebar - hidden on mobile unless toggled */}
<aside className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block mb-4 lg:mb-0`}>
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
              <span className="font-semibold">{allJobs.length}</span> jobs
              </p>
            </div>  

            {filteredJobs.length === 0 ? (
  <div className="bg-white rounded-lg shadow p-12 text-center">
    <div className="text-6xl mb-4">🔍</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      No jobs found
    </h3>
    <p className="text-gray-600 mb-4">
      Try adjusting your filters or search terms
    </p>
    <button
      onClick={handleClearFilters}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Clear all filters
    </button>
  </div>
) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {filteredJobs.map((job, index) => (
    <div
      key={job.id}
      className="animate-fadeIn"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <JobCard job={job} />
    </div>
  ))}
</div>
            )}
          </main>
        </div>
      </div>
       <Footer />
    </div>
  );
}

export default App;