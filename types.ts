export interface GroundingSource {
  uri: string;
  title: string;
}

export interface AnalysisResult {
  isScam: boolean;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Unknown';
  explanation: string;
  confidenceScore: number;
  sources?: GroundingSource[];
}

export interface PasswordEntry {
  id: number;
  service: string;
  username: string;
  passwordHash: string;
}

export interface ScamReport {
  id: number;
  title: string;
  description: string;
  scamType: 'Phishing' | 'Impersonation' | 'Investment' | 'Job Offer' | 'Tech Support';
  tags: string[];
  upvotes: number;
  downvotes: number;
  shares: number;
  submittedBy: string;
  createdAt: string; // ISO string date
}

export interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
  password?: string; // For mock DB purposes
}

export interface DashboardStats {
  totalUsers: number;
  totalScans: number;
  scamDetectionRate: number;
  scansByType: { name: string; value: number }[];
  topReportedScams: { name: string; value: number }[];
}

// Types for the new Recovery Toolkit
export type ContactMethod = {
  type: 'website' | 'phone' | 'email';
  value: string;
  label: string;
};

export type RecoveryResource = {
  organization: string;
  description: string;
  contacts: ContactMethod[];
};

export type ResourceCategory = {
  categoryName: string;
  icon: 'CreditCard' | 'UserCircle' | 'BuildingLibrary' | 'Flag' | 'Lifebuoy';
  resources: RecoveryResource[];
};

export type RegionalResources = {
  [key: string]: ResourceCategory[];
};

export interface ReportingGuide {
  platform: string;
  domainKeywords: string[];
  reportingUrl: string;
  instructions: string[];
}

export interface TakedownResource {
  organization: string;
  description: string;
  link: string;
  linkText: string;
}