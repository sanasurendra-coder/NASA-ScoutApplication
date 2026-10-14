export type HazardAssessment = 'Low Risk' | 'Monitored' | 'Elevated Alert';

export interface ScoutCandidate {
  objectName: string;
  nObs: number;
  arc: string | number;
  h: string | number;
  caDist: string | number | null;
  vinf: string | number | null;
  rating: number;
  score: number;
  phaFlag?: string;
  lastRun?: string;
  hazardAssessment?: HazardAssessment;
  [key: string]: any;
}

export interface ScoutApiResponse {
  signature: {
    source: string;
    version: string;
  };
  count: string;
  data: ScoutCandidate[];
}

export type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface ContactInquiry {
  name: string;
  email: string;
  company?: string;
  employeeCount?: string;
  message: string;
}
