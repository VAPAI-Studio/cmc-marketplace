import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge, CardSkeleton } from '../components/ui';
import { Film, Sparkles, Users, Zap, Star } from 'lucide-react';
import { listingsApi, type Listing } from '../lib/api';

export function Home() {
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    listingsApi.featured(4)
      .then(setFeatured)
      .catch(() => {})
      .finally(() => setFeaturedLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-cmc-navy to-cmc-navy-700 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Where Stories Find Their Stage
            </h1>
            <p className="text-xl text-warm-gray-200 mb-8">
              The global IP marketplace connecting LATAM creators with buyers worldwide.
              Submit your script, get AI-powered pitch materials, connect with industry leaders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="gold" size="lg">
                  <Film className="w-5 h-5" />
                  Submit Your Project
                </Button>
              </Link>
              <Link to="/library">
                <Button variant="secondary" size="lg" className="bg-white">
                  Browse Library
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-cmc-navy-100 text-cmc-navy rounded-full flex items-center justify-center mx-auto mb-4">
                <Film className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Submit Your IP</h3>
              <p className="text-warm-gray-600">
                Upload your script, synopsis, and basic info. Quick and simple.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-cmc-gold-100 text-cmc-gold-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
              <p className="text-warm-gray-600">
                Our AI analyzes your script and generates professional pitch materials automatically.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-cmc-navy-100 text-cmc-navy rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Connect with Buyers</h3>
              <p className="text-warm-gray-600">
                Your IP goes live in our curated marketplace. Buyers reach out directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured IPs */}
      <section className="py-16 bg-warm-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="mb-1">Featured IPs</h2>
              <p className="text-warm-gray-600">Top projects available for licensing</p>
            </div>
            <Link to="/library">
              <Button variant="secondary">View All</Button>
            </Link>
          </div>

          {featuredLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" aria-busy="true" aria-label="Loading featured IPs">
              {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : featured.length === 0 ? (
            <p className="text-center text-warm-gray-500 py-8">No featured IPs yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((ip) => (
                <Link key={ip.id} to={`/library/${ip.slug}`} className="group">
                  <div className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-elevated transition-shadow h-full flex flex-col">
                    <div className="aspect-video bg-gradient-to-br from-cmc-navy to-cmc-navy-700 relative">
                      {ip.poster_url && !imgErrors[ip.id] ? (
                        <img
                          src={ip.poster_url}
                          alt={ip.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={() => setImgErrors((prev) => ({ ...prev, [ip.id]: true }))}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-white/60 text-center p-3">
                          <div className="font-bold text-sm">{ip.title}</div>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge variant="gold" className="capitalize text-xs">{ip.tier}</Badge>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h4 className="font-bold text-cmc-navy mb-1 group-hover:text-cmc-gold transition-colors line-clamp-1">{ip.title}</h4>
                      <p className="text-xs text-warm-gray-500 line-clamp-2 flex-1">{ip.tagline}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-warm-gray-100">
                        <Badge variant="navy" size="sm">{ip.genre}</Badge>
                        {ip.ai_score && (
                          <div className="flex items-center gap-1 text-xs text-warm-gray-500">
                            <Star className="w-3 h-3 fill-cmc-gold text-cmc-gold" />
                            <span>{ip.ai_score}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-center mb-12">Why CMC?</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <Zap className="w-6 h-6 text-cmc-gold flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">AI-Powered Pitch Materials</h4>
                <p className="text-warm-gray-600">
                  Get professional one-pagers, pitch decks, and analysis in minutes, not weeks.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Users className="w-6 h-6 text-cmc-gold flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Direct Buyer Access</h4>
                <p className="text-warm-gray-600">
                  No middlemen. Connect directly with Netflix, Amazon, studios, and producers.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Film className="w-6 h-6 text-cmc-gold flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Curated Quality</h4>
                <p className="text-warm-gray-600">
                  Every IP is reviewed for quality. Your work is presented professionally.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Sparkles className="w-6 h-6 text-cmc-gold flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Protected IP</h4>
                <p className="text-warm-gray-600">
                  Blockchain timestamps protect your authorship. Your work is safe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-cmc-navy text-white">
        <div className="container-custom text-center">
          <h2 className="text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-warm-gray-200 mb-8 max-w-2xl mx-auto">
            Join hundreds of creators already showcasing their work to global buyers.
          </p>
          <Link to="/register">
            <Button variant="gold" size="lg">
              Submit Your First Project
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
