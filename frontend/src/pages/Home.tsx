import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { Film, Sparkles, Users, Zap } from 'lucide-react';

export function Home() {
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

      {/* Features */}
      <section className="py-16 bg-warm-gray-50">
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
