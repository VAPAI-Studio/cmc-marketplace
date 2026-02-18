// Mock data for dashboard (creator and buyer views)

export interface CreatorProject {
  id: string;
  title: string;
  genre: string;
  status: 'draft' | 'pending' | 'analyzing' | 'ready' | 'published';
  aiStatus: 'not_started' | 'analyzing' | 'ready' | 'failed';
  viewCount: number;
  saveCount: number;
  inquiryCount: number;
  createdAt: string;
}

export interface BuyerSavedIP {
  id: string;
  title: string;
  creatorName: string;
  genre: string;
  savedAt: string;
}

export interface BuyerInquiry {
  id: string;
  ipId: string;
  ipTitle: string;
  creatorName: string;
  sentAt: string;
  status: 'sent' | 'responded';
  message: string;
}

// Mock creator projects
export const MOCK_CREATOR_PROJECTS: CreatorProject[] = [
  {
    id: 'proj-001',
    title: 'The Last Colony',
    genre: 'Sci-Fi Drama',
    status: 'published',
    aiStatus: 'ready',
    viewCount: 45,
    saveCount: 7,
    inquiryCount: 2,
    createdAt: '2026-02-10',
  },
  {
    id: 'proj-002',
    title: 'Shadows of Buenos Aires',
    genre: 'Crime Thriller',
    status: 'analyzing',
    aiStatus: 'analyzing',
    viewCount: 0,
    saveCount: 0,
    inquiryCount: 0,
    createdAt: '2026-02-14',
  },
  {
    id: 'proj-003',
    title: 'The Border',
    genre: 'Drama',
    status: 'draft',
    aiStatus: 'not_started',
    viewCount: 0,
    saveCount: 0,
    inquiryCount: 0,
    createdAt: '2026-02-15',
  },
];

// Mock buyer saved IPs
export const MOCK_BUYER_SAVED_IPS: BuyerSavedIP[] = [
  {
    id: 'nippur-001',
    title: 'Nippur de Lagash',
    creatorName: 'Robin Wood Estate',
    genre: 'Historical Epic',
    savedAt: '2026-02-12',
  },
  {
    id: 'martin-hel-001',
    title: 'Martín Hel',
    creatorName: 'Robin Wood Estate',
    genre: 'Paranormal Thriller',
    savedAt: '2026-02-13',
  },
  {
    id: 'dago-001',
    title: 'Dago',
    creatorName: 'Robin Wood Estate',
    genre: 'Historical Epic',
    savedAt: '2026-02-14',
  },
];

// Mock buyer inquiries
export const MOCK_BUYER_INQUIRIES: BuyerInquiry[] = [
  {
    id: 'inq-001',
    ipId: 'nippur-001',
    ipTitle: 'Nippur de Lagash',
    creatorName: 'Robin Wood Estate',
    sentAt: '2026-02-13',
    status: 'responded',
    message: 'Interested in discussing live-action TV rights for North America.',
  },
  {
    id: 'inq-002',
    ipId: 'martin-hel-001',
    ipTitle: 'Martín Hel',
    creatorName: 'Robin Wood Estate',
    sentAt: '2026-02-15',
    status: 'sent',
    message: 'Would like more information about production budget estimates.',
  },
];
