
import { IntelligenceSource } from './types';

export const AGENCIES: IntelligenceSource[] = [
  {
    id: 'interpol',
    name: 'INTERPOL',
    fullName: 'International Criminal Police Organization',
    description: 'Global law enforcement agency focusing on transnational crimes and fugitives.',
    region: 'Global',
    logo: '🌐'
  },
  {
    id: 'fbi',
    name: 'FBI',
    fullName: 'Federal Bureau of Investigation',
    description: 'The domestic intelligence and security service of the United States.',
    region: 'United States',
    logo: '🦅'
  },
  {
    id: 'mossad',
    name: 'MOSSAD',
    fullName: 'The Institute for Intelligence and Special Operations',
    description: 'Israel’s national intelligence agency.',
    region: 'Israel',
    logo: '🕍'
  },
  {
    id: 'cia',
    name: 'CIA',
    fullName: 'Central Intelligence Agency',
    description: 'US civilian foreign intelligence service.',
    region: 'United States',
    logo: '🌎'
  },
  {
    id: 'mi6',
    name: 'MI6',
    fullName: 'Secret Intelligence Service (SIS)',
    description: 'The foreign intelligence service of the United Kingdom.',
    region: 'United Kingdom',
    logo: '💂'
  },
  {
    id: 'raw',
    name: 'RAW',
    fullName: 'Research and Analysis Wing',
    description: 'The foreign intelligence agency of India.',
    region: 'India',
    logo: '🐅'
  }
];
