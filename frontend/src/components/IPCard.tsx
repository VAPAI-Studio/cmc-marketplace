import { Link } from 'react-router-dom';
import { Card, Badge, Button } from './ui';
import { Eye, Heart } from 'lucide-react';
import type { MockIP } from '../data/mockIPs';

interface IPCardProps {
  ip: MockIP;
  onViewDetails: (ip: MockIP) => void;
  slug?: string;
}

export function IPCard({ ip, onViewDetails, slug }: IPCardProps) {
  const tierColors: Record<typeof ip.tier, 'gold' | 'navy' | 'default'> = {
    flagship: 'gold',
    strong: 'navy',
    'hidden-gem': 'default',
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-elevated transition-shadow duration-200 cursor-pointer group">
      {/* Poster Image */}
      <div
        className="relative aspect-video bg-gradient-to-br from-cmc-navy to-cmc-navy-700 overflow-hidden"
        onClick={() => onViewDetails(ip)}
      >
        {ip.posterUrl ? (
          <img
            src={ip.posterUrl}
            alt={ip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-white/60 text-center p-4">
              <div className="text-4xl font-bold mb-2">{ip.title}</div>
              <div className="text-sm">{ip.genre}</div>
            </div>
          </div>
        )}

        {/* Tier badge overlay */}
        <div className="absolute top-2 right-2">
          <Badge variant={tierColors[ip.tier]} className="capitalize">
            {ip.tier}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col" onClick={() => onViewDetails(ip)}>
        {/* Title */}
        <h3 className="text-xl font-bold text-cmc-navy mb-1 line-clamp-1 group-hover:text-cmc-gold transition-colors">
          {ip.title}
        </h3>

        {/* Tagline */}
        <p className="text-sm text-warm-gray-600 mb-3 line-clamp-2">
          {ip.tagline}
        </p>

        {/* Genre badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="navy" size="sm">{ip.genre}</Badge>
          <Badge variant="default" size="sm">{ip.format}</Badge>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-warm-gray-500 mt-auto pt-3 border-t border-warm-gray-100">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{ip.viewCount} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{ip.saveCount} saves</span>
          </div>
          <div className="ml-auto">
            <span className="font-medium">{ip.episodeCount} eps</span>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="p-4 pt-0">
        {slug ? (
          <Link to={`/library/${slug}`} className="block">
            <Button variant="primary" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        ) : (
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(ip);
            }}
          >
            View Details
          </Button>
        )}
      </div>
    </Card>
  );
}
