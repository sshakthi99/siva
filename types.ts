
export interface IntelligenceSource {
  id: string;
  name: string;
  fullName: string;
  description: string;
  region: string;
  logo: string;
}

export interface GroundingMetadata {
  web?: {
    uri: string;
    title: string;
  };
}

export interface CrimeReport {
  summary: string;
  sources: GroundingMetadata[];
  timestamp: string;
  status: 'active' | 'archived';
}

export enum Agency {
  INTERPOL = 'interpol',
  FBI = 'fbi',
  MOSAD = 'mossad',
  CIA = 'cia',
  MI6 = 'mi6',
  RAW = 'raw',
  EUROPOL = 'europol'
}
