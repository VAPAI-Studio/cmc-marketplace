import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, useToastHelpers } from '../components/ui';
import { listingsApi, filesApi } from '../lib/api';
import { ArrowLeft } from 'lucide-react';

// Import step components (we'll create these next)
import { Step1BasicInfo } from '../components/submit/Step1BasicInfo';
import { Step2Upload } from '../components/submit/Step2Upload';
import { Step3Details } from '../components/submit/Step3Details';
import { Step4Review } from '../components/submit/Step4Review';
import { StepProgress } from '../components/submit/StepProgress';

export interface SubmitFormData {
  // Step 1: Basic Info
  title: string;
  tagline: string;
  description: string;
  genre: string;
  format: string;
  logline: string;

  // Step 2: Files
  scriptFile?: File;
  posterFile?: File;
  scriptUrl?: string;
  posterUrl?: string;

  // Step 3: Details
  tier: string;
  period: string;
  location: string;
  worldType: string;
  themes: string[];
  targetAudience: string;
  comparables: string[];
  rightsHolder: string;
  rightsHolderContact: string;
  availableRights: string[];
  availableTerritories: string[];
}

const INITIAL_FORM_DATA: SubmitFormData = {
  title: '',
  tagline: '',
  description: '',
  genre: '',
  format: '',
  logline: '',
  tier: 'hidden-gem',
  period: '',
  location: '',
  worldType: '',
  themes: [],
  targetAudience: '',
  comparables: [],
  rightsHolder: '',
  rightsHolderContact: '',
  availableRights: [],
  availableTerritories: [],
};

const STEPS = [
  { number: 1, title: 'Basic Info', description: 'Title, genre, and synopsis' },
  { number: 2, title: 'Upload Files', description: 'Script and poster' },
  { number: 3, title: 'Details', description: 'Themes, rights, and market info' },
  { number: 4, title: 'Review', description: 'Review and submit' },
];

export function SubmitProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToastHelpers();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SubmitFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not creator
  if (user?.role !== 'creator') {
    navigate('/');
    return null;
  }

  const updateFormData = (data: Partial<SubmitFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // 1. Create listing
      const listing = await listingsApi.create({
        title: formData.title,
        tagline: formData.tagline || undefined,
        description: formData.description,
        genre: formData.genre,
        format: formData.format,
        logline: formData.logline || undefined,
        tier: formData.tier,
        period: formData.period || undefined,
        location: formData.location || undefined,
        world_type: formData.worldType || undefined,
        themes: formData.themes,
        target_audience: formData.targetAudience || undefined,
        comparables: formData.comparables,
        rights_holder: formData.rightsHolder || undefined,
        rights_holder_contact: formData.rightsHolderContact || undefined,
        available_rights: formData.availableRights,
        available_territories: formData.availableTerritories,
      });

      // 2. Upload script if provided
      if (formData.scriptFile) {
        await filesApi.upload(formData.scriptFile, listing.id, 'script');
      }

      // 3. Upload poster if provided
      if (formData.posterFile) {
        await filesApi.upload(formData.posterFile, listing.id, 'poster');
      }

      toast.success('Project submitted successfully! It will be reviewed before publishing.');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Failed to submit project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-cmc-navy hover:text-cmc-gold transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-cmc-navy mb-2">Submit Your Project</h1>
          <p className="text-warm-gray-600">
            Share your intellectual property with global buyers
          </p>
        </div>

        {/* Progress Indicator */}
        <StepProgress steps={STEPS} currentStep={currentStep} />

        {/* Form Steps */}
        <div className="max-w-3xl mx-auto mt-8">
          <Card>
            {currentStep === 1 && (
              <Step1BasicInfo
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
              />
            )}

            {currentStep === 2 && (
              <Step2Upload
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}

            {currentStep === 3 && (
              <Step3Details
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}

            {currentStep === 4 && (
              <Step4Review
                formData={formData}
                onBack={prevStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
