import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '../components/ui';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    features: [
      'Blockchain Registration + Certificate',
      'AI-generated Poster',
      'Access to General Library',
    ],
    cta: 'Get Started',
    ctaVariant: 'secondary' as const,
    highlighted: false,
  },
  {
    name: 'Standard',
    price: '$15',
    period: '/mes',
    features: [
      'Blockchain Registration + Certificate',
      'Full Pitch Deck: Tag line, Story line, Script polish, Character profiles, Credits',
      'AI-generated general references',
      'AI-generated Poster',
      'Priority access to General Library',
    ],
    cta: 'Choose Standard',
    ctaVariant: 'secondary' as const,
    highlighted: false,
  },
  {
    name: 'Business',
    price: '$50',
    period: '/mes',
    features: [
      'Blockchain Registration + Certificate',
      'Full Pitch Deck: Tag line, Story line, Script correction, Profiles, Bible, Credits',
      'AI-generated location breakdown',
      'AI-generated professional mood board',
      'AI-generated storyboard',
      'AI-generated library poster',
      'Access to Library Special Edition',
    ],
    cta: 'Choose Business',
    ctaVariant: 'secondary' as const,
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$100',
    period: '/mes',
    features: [
      'Blockchain Registration + Certificate',
      'Full Pitch Deck: Tag line, Story line, Script correction, Profiles, Bible, Credits',
      'AI-generated location breakdown',
      'AI-generated professional mood board',
      'AI-generated storyboard',
      'AI-generated full budget breakdown',
      'AI-generated premium library poster',
      'AI-generated 3-minute trailer',
      'Exclusive access to Library VIP Section',
      'Direct connection with global buyers',
    ],
    cta: 'Choose Professional',
    ctaVariant: 'primary' as const,
    highlighted: true,
  },
];

export function Pricing() {
  return (
    <div className="container-custom py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-cmc-navy mb-4">Plans</h1>
        <p className="text-xl text-warm-gray-600 max-w-xl mx-auto">
          Choose your level. In all cases we register your work and deliver materials according to the plan.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border-2 p-6 flex flex-col h-full ${
              plan.highlighted
                ? 'border-cmc-navy bg-white shadow-elevated'
                : 'border-warm-gray-200 bg-white'
            }`}
          >
            {/* Plan name & price */}
            <div className="mb-6">
              <h2 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-cmc-navy' : 'text-warm-gray-900'}`}>
                {plan.name}
              </h2>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-bold ${plan.highlighted ? 'text-cmc-navy' : 'text-warm-gray-900'}`}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-warm-gray-500 text-lg">{plan.period}</span>
                )}
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex gap-2 text-sm text-warm-gray-700">
                  <Check className="w-4 h-4 text-cmc-navy shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link to="/register">
              <Button
                variant={plan.ctaVariant}
                className={`w-full ${plan.highlighted ? 'bg-cmc-navy text-white hover:bg-cmc-navy-700' : ''}`}
              >
                {plan.cta}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
