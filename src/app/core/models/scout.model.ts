export interface ScoutCandidate {
  objectName: string;
  nObs: number;
  arc: string;
  h: string;
  caDist: string | null;
  vinf: string | null;
  rating: number;
  score: number;
  phaFlag?: string;
  lastRun?: string;
  hazardAssessment?: 'Low Risk' | 'Monitored' | 'Elevated Alert';
}

export interface ScoutApiResponse {
  signature: {
    source: string;
    version: string;
  };
  count: string;
  data: ScoutCandidate[];
}
