import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '../components/ui';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    features: [
      'Registro Blockchain + Certificado',
      'Póster desarrollado con IA',
      'Acceso a General Library',
    ],
    cta: 'Elegir Free',
    ctaVariant: 'secondary' as const,
    highlighted: false,
  },
  {
    name: 'Standard',
    price: '$15',
    period: '/mes',
    features: [
      'Registro Blockchain + Certificado',
      'Full Pitch Deck: Tag line, Story line, Ajuste del guion, Perfil personajes, Credits',
      'Referencias generales desarrolladas con IA',
      'Póster desarrollado con IA',
      'Acceso prioritario en General Library',
    ],
    cta: 'Elegir Standard',
    ctaVariant: 'secondary' as const,
    highlighted: false,
  },
  {
    name: 'Business',
    price: '$50',
    period: '/mes',
    features: [
      'Registro Blockchain + Certificado',
      'Full Pitch Deck: Tag line, Story line, Corrección de guion, Perfiles, Biblia, Credits',
      'Desglose de locaciones desarrollado con IA',
      'Mood board profesional desarrollado con IA',
      'Storyboard desarrollado con IA',
      'Póster para library desarrollado con IA',
      'Acceso a Library Special Edition',
    ],
    cta: 'Elegir Business',
    ctaVariant: 'secondary' as const,
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$100',
    period: '/mes',
    features: [
      'Registro Blockchain + Certificado',
      'Full Pitch Deck: Tag line, Story line, Corrección de guion, Perfiles, Biblia, Credits',
      'Desglose de locaciones desarrollado con IA',
      'Mood board profesional desarrollado con IA',
      'Storyboard desarrollado con IA',
      'Budget Breakdown completo desarrollado con IA',
      'Póster premium para library desarrollado con IA',
      'Trailer de 3 minutos generado con IA',
      'Acceso exclusivo a Library VIP Section',
      'Conexión directa con buyers globales',
    ],
    cta: 'Elegir Professional',
    ctaVariant: 'primary' as const,
    highlighted: true,
  },
];

export function Pricing() {
  return (
    <div className="container-custom py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-cmc-navy mb-4">Planes</h1>
        <p className="text-xl text-warm-gray-600 max-w-xl mx-auto">
          Elegí tu nivel. En todos los casos registramos tu obra y devolvemos materiales según el plan.
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
