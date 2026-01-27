interface FilterSidebarProps {
  selectedCountries: string[];
  selectedTechStack: string[];
  selectedLevels: string[];
  visaSponsorshipOnly: boolean;
  onCountryChange: (country: string) => void;
  onTechStackChange: (tech: string) => void;
  onLevelChange: (level: string) => void;
  onVisaSponsorshipChange: (checked: boolean) => void;
  onClearFilters: () => void;
}

export function FilterSidebar({
  selectedCountries,
  selectedTechStack,
  selectedLevels,
  visaSponsorshipOnly,
  onCountryChange,
  onTechStackChange,
  onLevelChange,
  onVisaSponsorshipChange,
  onClearFilters,
}: FilterSidebarProps) {
  const countries = ['Saudi Arabia', 'UAE', 'Kuwait', 'Egypt'];
  const techStacks = [
    'React',
    'TypeScript',
    'Node.js',
    'Python',
    'Java',
    'Flutter',
    'Vue.js',
    'Go',
    'AWS',
    'Docker',
  ];
  const levels = ['Junior', 'Mid', 'Senior'];

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear all
        </button>
      </div>

      {/* Country Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Country</h3>
        <div className="space-y-2">
          {countries.map((country) => (
            <label key={country} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCountries.includes(country)}
                onChange={() => onCountryChange(country)}
                className="mr-2 w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">{country}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tech Stack Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Tech Stack</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {techStacks.map((tech) => (
            <label key={tech} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTechStack.includes(tech)}
                onChange={() => onTechStackChange(tech)}
                className="mr-2 w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">{tech}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Experience Level</h3>
        <div className="space-y-2">
          {levels.map((level) => (
            <label key={level} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLevels.includes(level)}
                onChange={() => onLevelChange(level)}
                className="mr-2 w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Visa Sponsorship Filter */}
      <div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={visaSponsorshipOnly}
            onChange={(e) => onVisaSponsorshipChange(e.target.checked)}
            className="mr-2 w-4 h-4 text-blue-600"
          />
          <span className="text-gray-700 font-semibold">
            Visa Sponsorship Only
          </span>
        </label>
      </div>
    </div>
  );
}