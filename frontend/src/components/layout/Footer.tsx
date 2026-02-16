import { Link } from 'react-router-dom';
import { Film, Mail, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cmc-navy text-white mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Film className="w-8 h-8 text-cmc-gold" />
              <span className="text-2xl font-bold">CMC</span>
            </div>
            <p className="text-warm-gray-300 text-sm">
              The global IP marketplace connecting creators with buyers.
            </p>
          </div>

          {/* For Creators */}
          <div>
            <h4 className="text-white font-semibold mb-4">For Creators</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/submit" className="text-warm-gray-300 hover:text-cmc-gold transition">
                  Submit Your Project
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-warm-gray-300 hover:text-cmc-gold transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-warm-gray-300 hover:text-cmc-gold transition">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* For Buyers */}
          <div>
            <h4 className="text-white font-semibold mb-4">For Buyers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/library" className="text-warm-gray-300 hover:text-cmc-gold transition">
                  Browse Library
                </Link>
              </li>
              <li>
                <Link to="/featured" className="text-warm-gray-300 hover:text-cmc-gold transition">
                  Featured IPs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-warm-gray-300 hover:text-cmc-gold transition">
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-warm-gray-300 hover:text-cmc-gold transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-warm-gray-300 hover:text-cmc-gold transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-warm-gray-300 hover:text-cmc-gold transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-warm-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-warm-gray-300">
            © {currentYear} Content Media Company. All rights reserved.
          </p>

          <div className="flex gap-4">
            <a
              href="mailto:hello@cmc.com"
              className="text-warm-gray-300 hover:text-cmc-gold transition"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com/cmc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-warm-gray-300 hover:text-cmc-gold transition"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/company/cmc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-warm-gray-300 hover:text-cmc-gold transition"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
