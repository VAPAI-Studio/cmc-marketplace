import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
}

export function StepProgress({ steps, currentStep }: StepProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                    transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-cmc-gold text-cmc-navy'
                        : isCurrent
                        ? 'bg-cmc-navy text-white ring-4 ring-cmc-navy-200'
                        : 'bg-warm-gray-200 text-warm-gray-500'
                    }
                  `}
                >
                  {isCompleted ? <Check className="w-6 h-6" /> : step.number}
                </div>

                {/* Step Info */}
                <div className="mt-3 text-center hidden md:block">
                  <p
                    className={`font-semibold text-sm ${
                      isCurrent ? 'text-cmc-navy' : 'text-warm-gray-600'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-warm-gray-500 mt-1">{step.description}</p>
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 h-1 mx-4 -mt-14">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isCompleted ? 'bg-cmc-gold' : 'bg-warm-gray-200'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
