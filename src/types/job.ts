

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  postedDate: string;
  url: string;
  source: string;
  description?: string;
  salary?: string;
  techStack?: string[];
  experienceLevel?: 'Junior' | 'Mid' | 'Senior';
  visaSponsorship?: boolean;
}