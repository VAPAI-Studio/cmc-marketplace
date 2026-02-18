import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listingsApi, favoritesApi, type Listing } from '../lib/api';
import { Badge, Button, Spinner } from '../components/ui';
import { Heart, Mail, ArrowLeft, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToastHelpers } from '../components/ui';
import { InquiryModal } from '../components/InquiryModal';

export function IPDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const toast = useToastHelpers();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);

  useEffect(() => {
    if (!slug) return;
    listingsApi.getBySlug(slug)
      .then((l) => {
        setListing(l);
        if (user) {
          favoritesApi.getIds().then((ids) => setSaved(ids.includes(l.id))).catch(() => {});
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug, user]);

  async function handleSave() {
    if (!listing) return;
    // Optimistic update
    const wasSaved = saved;
    setSaved(!wasSaved);
    setListing((prev) => prev ? {
      ...prev,
      save_count: prev.save_count + (wasSaved ? -1 : 1),
    } : prev);
    setSavingLoading(true);
    try {
      if (wasSaved) {
        await favoritesApi.unsave(listing.id);
        toast.success('Removed from saved list');
      } else {
        await favoritesApi.save(listing.id);
        toast.success('Saved to your list!');
      }
    } catch {
      // Revert on error
      setSaved(wasSaved);
      setListing((prev) => prev ? {
        ...prev,
        save_count: prev.save_count + (wasSaved ? 1 : -1),
      } : prev);
      toast.error('Failed to update saved status');
    } finally {
      setSavingLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container-custom py-24 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (notFound || !listing) {
    return (
      <div className="container-custom py-24 text-center">
        <h2 className="text-2xl font-bold text-cmc-navy mb-4">IP not found</h2>
        <Link to="/library">
          <Button variant="primary">Back to Library</Button>
        </Link>
      </div>
    );
  }

  const tierColors: Record<string, string> = {
    flagship: 'gold',
    strong: 'navy',
    'hidden-gem': 'default',
  };

  return (
    <div className="container-custom py-12">
      {/* Back */}
      <Link to="/library" className="inline-flex items-center gap-2 text-warm-gray-500 hover:text-cmc-navy mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Library
      </Link>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left column */}
        <div className="lg:col-span-1">
          {/* Poster */}
          <div className="aspect-[2/3] bg-gradient-to-br from-cmc-navy to-cmc-navy-700 rounded-xl overflow-hidden mb-6 shadow-elevated">
            {listing.poster_url ? (
              <img src={listing.poster_url} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-white/60 text-center p-6">
                <div>
                  <div className="text-3xl font-bold mb-2">{listing.title}</div>
                  <div className="text-lg opacity-70">{listing.genre}</div>
                </div>
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant={tierColors[listing.tier] as any} className="capitalize">{listing.tier}</Badge>
              <Badge variant="navy">{listing.genre}</Badge>
              <Badge variant="default">{listing.format}</Badge>
            </div>

            {listing.period && (
              <div className="text-sm">
                <span className="font-medium text-warm-gray-500">Period</span>
                <p className="text-warm-gray-700">{listing.period}</p>
              </div>
            )}
            {listing.location && (
              <div className="text-sm">
                <span className="font-medium text-warm-gray-500">Location</span>
                <p className="text-warm-gray-700">{listing.location}</p>
              </div>
            )}
            {listing.target_audience && (
              <div className="text-sm">
                <span className="font-medium text-warm-gray-500">Target Audience</span>
                <p className="text-warm-gray-700">{listing.target_audience}</p>
              </div>
            )}
            <div className="text-sm">
              <span className="font-medium text-warm-gray-500">Stats</span>
              <p className="text-warm-gray-700">{listing.view_count} views · {listing.save_count} saves</p>
            </div>

            {/* AI Score */}
            {listing.ai_score != null && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-cmc-gold fill-cmc-gold" />
                  <span className="font-semibold text-cmc-navy">AI Score: {listing.ai_score}/10</span>
                </div>
                {listing.ai_strengths.length > 0 && (
                  <ul className="text-sm text-warm-gray-700 space-y-1">
                    {listing.ai_strengths.map((s, i) => (
                      <li key={i} className="flex gap-1"><span className="text-green-600">✓</span>{s}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Rights */}
            {listing.available_rights.length > 0 && (
              <div className="text-sm">
                <span className="font-medium text-warm-gray-500">Available Rights</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {listing.available_rights.map((r) => (
                    <Badge key={r} variant="default" size="sm">{r}</Badge>
                  ))}
                </div>
              </div>
            )}
            {listing.available_territories.length > 0 && (
              <div className="text-sm">
                <span className="font-medium text-warm-gray-500">Territories</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {listing.available_territories.map((t) => (
                    <Badge key={t} variant="default" size="sm">{t}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold text-cmc-navy mb-2">{listing.title}</h1>
          {listing.tagline && (
            <p className="text-xl text-warm-gray-500 mb-6 italic">{listing.tagline}</p>
          )}

          {listing.logline && (
            <div className="bg-cmc-navy text-white rounded-lg p-5 mb-8">
              <p className="text-lg leading-relaxed">{listing.logline}</p>
            </div>
          )}

          <section className="mb-8">
            <h2 className="text-xl font-bold text-cmc-navy mb-3">About the Project</h2>
            <p className="text-warm-gray-700 leading-relaxed whitespace-pre-line">{listing.description}</p>
          </section>

          {listing.themes.length > 0 && (
            <section className="mb-8">
              <h3 className="font-semibold text-cmc-navy mb-3">Themes</h3>
              <div className="flex flex-wrap gap-2">
                {listing.themes.map((t) => (
                  <Badge key={t} variant="default">{t}</Badge>
                ))}
              </div>
            </section>
          )}

          {listing.comparables.length > 0 && (
            <section className="mb-8">
              <h3 className="font-semibold text-cmc-navy mb-2">Comparable Titles</h3>
              <p className="text-warm-gray-700">{listing.comparables.join(' · ')}</p>
            </section>
          )}

          {listing.rights_holder && (
            <section className="mb-8 border-t border-warm-gray-200 pt-6">
              <h3 className="font-semibold text-cmc-navy mb-2">Rights Holder</h3>
              <p className="text-warm-gray-700">{listing.rights_holder}</p>
            </section>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-warm-gray-200">
            <Button
              variant="primary"
              size="lg"
              icon={<Mail className="w-5 h-5" aria-hidden="true" />}
              onClick={() => user ? setShowInquiry(true) : toast.warning('Please sign in to send inquiries')}
              aria-label={user ? `Request info about ${listing.title}` : 'Sign in to request info'}
            >
              {user ? 'Request Info' : 'Sign in to Request Info'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={<Heart className={`w-5 h-5 ${saved ? 'fill-cmc-gold text-cmc-gold' : ''}`} aria-hidden="true" />}
              onClick={() => user ? handleSave() : toast.warning('Please sign in to save')}
              disabled={savingLoading}
              aria-label={saved ? `Remove ${listing.title} from saved list` : `Save ${listing.title} to your list`}
              aria-pressed={saved}
            >
              {saved ? 'Saved' : user ? 'Save to List' : 'Sign in to Save'}
            </Button>
          </div>

          {showInquiry && listing && (
            <InquiryModal
              listingId={listing.id}
              listingTitle={listing.title}
              onClose={() => setShowInquiry(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
