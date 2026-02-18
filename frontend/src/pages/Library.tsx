import { useState, useMemo, useEffect } from 'react';
import { Select, Modal, Badge, Button, CardSkeleton } from '../components/ui';
import { IPCard } from '../components/IPCard';
import {
  MOCK_IPS,
  filterByGenre,
  filterByTier,
  searchIPs,
  sortIPs,
  type MockIP,
} from '../data/mockIPs';
import { listingsApi, type Listing } from '../lib/api';
import { Search, Heart, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToastHelpers } from '../components/ui';

// Extend MockIP with optional slug for real API listings
type MockIPWithSlug = MockIP & { slug?: string };

// Convert real API listing to MockIP shape for display
function listingToMockIP(listing: Listing): MockIPWithSlug {
  return {
    id: listing.id,
    creatorId: listing.creator_id,
    creatorName: 'Creator',
    title: listing.title,
    genre: listing.genre,
    format: listing.format,
    tier: (listing.tier || 'hidden-gem') as MockIP['tier'],
    tagline: listing.tagline || '',
    logline: listing.logline || '',
    description: listing.description,
    period: listing.period || '',
    location: listing.location || '',
    worldType: listing.world_type || '',
    themes: listing.themes || [],
    targetAudience: listing.target_audience || '',
    comparables: listing.comparables || [],
    availableRights: listing.available_rights || [],
    availableTerritories: listing.available_territories || [],
    slug: listing.slug,
    posterUrl: listing.poster_url || '',
    aiScore: listing.ai_score ?? 0,
    aiStrengths: listing.ai_strengths || [],
    aiImprovements: listing.ai_improvements || [],
    viewCount: listing.view_count,
    saveCount: listing.save_count,
    inquiryCount: listing.inquiry_count,
    status: 'published',
    episodeCount: 0,
  };
}

export function Library() {
  const { user } = useAuth();
  const toast = useToastHelpers();

  // Real listings from API
  const [apiListings, setApiListings] = useState<MockIPWithSlug[]>([]);
  const [apiLoading, setApiLoading] = useState(true);

  useEffect(() => {
    listingsApi.list({ status: 'published', limit: 100 })
      .then((listings) => setApiListings(listings.map(listingToMockIP)))
      .catch(() => {})
      .finally(() => setApiLoading(false));
  }, []);

  // Combine: real listings first, then mock (deduplicated by title)
  const allIPs = useMemo(() => {
    const apiTitles = new Set(apiListings.map((ip) => ip.title.toLowerCase()));
    const filteredMock = MOCK_IPS.filter((ip) => !apiTitles.has(ip.title.toLowerCase()));
    return [...apiListings, ...filteredMock];
  }, [apiListings]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'alphabetical'>('popular');

  // Modal
  const [selectedIP, setSelectedIP] = useState<MockIP | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Apply filters
  const filteredIPs = useMemo(() => {
    let result = allIPs;
    if (searchQuery) result = searchIPs(result, searchQuery);
    if (selectedGenre) result = filterByGenre(result, selectedGenre);
    if (selectedTier) result = filterByTier(result, selectedTier);
    result = sortIPs(result, sortBy);
    return result;
  }, [allIPs, searchQuery, selectedGenre, selectedTier, sortBy]);

  const handleViewDetails = (ip: MockIP) => {
    setSelectedIP(ip);
    setIsDetailModalOpen(true);
  };

  const handleSaveIP = () => {
    if (!user) {
      toast.warning('Please sign in to save IPs');
      return;
    }
    toast.success('IP saved to your list!');
  };

  const handleSendInquiry = () => {
    if (!user) {
      toast.warning('Please sign in to send inquiries');
      return;
    }
    toast.info('Inquiry sent! The creator will be notified.');
  };

  // Genre options
  const genreOptions = [
    { value: '', label: 'All Genres' },
    { value: 'Action', label: 'Action' },
    { value: 'Adventure', label: 'Adventure' },
    { value: 'Comedy', label: 'Comedy' },
    { value: 'Crime', label: 'Crime Drama' },
    { value: 'Cyberpunk', label: 'Cyberpunk' },
    { value: 'Drama', label: 'Drama' },
    { value: 'Fantasy', label: 'Fantasy' },
    { value: 'Historical Epic', label: 'Historical Epic' },
    { value: 'Horror', label: 'Horror' },
    { value: 'Paranormal', label: 'Paranormal' },
    { value: 'Post-Apocalyptic', label: 'Post-Apocalyptic' },
    { value: 'Romance', label: 'Romance' },
    { value: 'Sci-Fi', label: 'Sci-Fi' },
    { value: 'Spy', label: 'Spy / Thriller' },
    { value: 'Thriller', label: 'Thriller' },
  ];

  const tierOptions = [
    { value: '', label: 'All Tiers' },
    { value: 'flagship', label: 'Flagship' },
    { value: 'strong', label: 'Strong' },
    { value: 'hidden-gem', label: 'Hidden Gem' },
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest First' },
    { value: 'alphabetical', label: 'Alphabetical' },
  ];

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Browse IP Library</h1>
        <p className="text-warm-gray-600 text-lg">
          Discover curated intellectual properties from top creators
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-card p-4 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray-400" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search by title, genre, themes..."
                aria-label="Search IP listings"
                className="w-full pl-10 pr-4 py-2 border border-warm-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cmc-navy focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Genre */}
          <Select
            options={genreOptions}
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          />

          {/* Tier */}
          <Select
            options={tierOptions}
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
          />
        </div>

        {/* Sort & Results Count */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-warm-gray-200">
          <p className="text-sm text-warm-gray-600" aria-live="polite" aria-atomic="true">
            Showing <span className="font-semibold">{filteredIPs.length}</span> of{' '}
            <span className="font-semibold">{allIPs.length}</span> IPs
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-warm-gray-600">Sort by:</span>
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-auto"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {apiLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-label="Loading IP listings">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredIPs.length === 0 ? (
        <div className="text-center py-16" role="status">
          <p className="text-warm-gray-600 text-lg">
            No IPs found matching your filters.
          </p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('');
              setSelectedTier('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIPs.map((ip) => (
            <IPCard key={ip.id} ip={ip} onViewDetails={handleViewDetails} slug={(ip as MockIPWithSlug).slug} />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedIP && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          size="xl"
        >
          <IPDetailModal
            ip={selectedIP}
            onSave={handleSaveIP}
            onInquiry={handleSendInquiry}
            isAuthenticated={!!user}
          />
        </Modal>
      )}
    </div>
  );
}

// IP Detail Modal Component
function IPDetailModal({
  ip,
  onSave,
  onInquiry,
  isAuthenticated,
}: {
  ip: MockIP;
  onSave: () => void;
  onInquiry: () => void;
  isAuthenticated: boolean;
}) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Left: Image + Basic Info */}
      <div className="md:col-span-1">
        <div className="aspect-video bg-gradient-to-br from-cmc-navy to-cmc-navy-700 rounded overflow-hidden mb-4">
          {ip.posterUrl ? (
            <img src={ip.posterUrl} alt={ip.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-white/60 text-center p-4">
              <div>
                <div className="text-2xl font-bold mb-2">{ip.title}</div>
                <div className="text-sm">{ip.genre}</div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <Badge variant="gold" className="capitalize">
            {ip.tier}
          </Badge>
          <Badge variant="navy">{ip.genre}</Badge>
          <Badge variant="default">{ip.format}</Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <span className="font-semibold">Episodes:</span> {ip.episodeCount}
          </div>
          <div>
            <span className="font-semibold">Period:</span> {ip.period}
          </div>
          <div>
            <span className="font-semibold">Location:</span> {ip.location}
          </div>
          <div>
            <span className="font-semibold">Views:</span> {ip.viewCount}
          </div>
          <div>
            <span className="font-semibold">Saves:</span> {ip.saveCount}
          </div>
        </div>
      </div>

      {/* Right: Details */}
      <div className="md:col-span-2">
        <h1 className="mb-2">{ip.title}</h1>
        <p className="text-xl text-warm-gray-600 mb-6">{ip.tagline}</p>

        {/* Logline */}
        <section className="mb-6">
          <h3 className="mb-2">Logline</h3>
          <p className="text-warm-gray-700">{ip.logline}</p>
        </section>

        {/* Description */}
        <section className="mb-6">
          <h3 className="mb-2">Story</h3>
          <p className="text-warm-gray-700 whitespace-pre-line">{ip.description}</p>
        </section>

        {/* Themes */}
        {ip.themes.length > 0 && (
          <section className="mb-6">
            <h4 className="mb-2">Themes</h4>
            <div className="flex flex-wrap gap-2">
              {ip.themes.map((theme) => (
                <Badge key={theme} variant="default" size="sm">
                  {theme}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Comparables */}
        {ip.comparables.length > 0 && (
          <section className="mb-6">
            <h4 className="mb-2">Comparable Titles</h4>
            <p className="text-warm-gray-700">{ip.comparables.join(', ')}</p>
          </section>
        )}

        {/* AI Analysis */}
        <section className="mb-6 bg-blue-50 p-4 rounded-lg">
          <h4 className="mb-2">AI Analysis Score: {ip.aiScore}/10</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Strengths:</span>{' '}
              {ip.aiStrengths.join(', ')}
            </div>
            <div>
              <span className="font-semibold">Considerations:</span>{' '}
              {ip.aiImprovements.join(', ')}
            </div>
          </div>
        </section>

        {/* Rights */}
        <section className="mb-6">
          <h4 className="mb-2">Available Rights</h4>
          <p className="text-warm-gray-700 mb-2">{ip.availableRights.join(', ')}</p>
          <p className="text-sm text-warm-gray-600">
            <span className="font-semibold">Territories:</span>{' '}
            {ip.availableTerritories.join(', ')}
          </p>
        </section>

        {/* Creator */}
        <section className="mb-6">
          <h4 className="mb-2">Creator</h4>
          <p className="text-warm-gray-700">{ip.creatorName}</p>
        </section>

        {/* CTAs */}
        <div className="flex gap-4 pt-4 border-t border-warm-gray-200">
          <Button
            variant="primary"
            size="lg"
            icon={<Mail className="w-5 h-5" />}
            onClick={onInquiry}
          >
            {isAuthenticated ? 'Request Info' : 'Sign in to Request Info'}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            icon={<Heart className="w-5 h-5" />}
            onClick={onSave}
          >
            {isAuthenticated ? 'Save to List' : 'Sign in to Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}
