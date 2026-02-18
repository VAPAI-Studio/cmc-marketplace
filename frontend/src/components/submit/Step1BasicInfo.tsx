import { useState } from 'react';
import { Button, Input, Textarea } from '../ui';
import type { SubmitFormData } from '../../pages/SubmitProject';

interface Step1Props {
  formData: SubmitFormData;
  updateFormData: (data: Partial<SubmitFormData>) => void;
  onNext: () => void;
}

const GENRES = ['Drama', 'Comedy', 'Action', 'Thriller', 'Horror', 'Sci-Fi', 'Fantasy', 'Romance', 'Mystery', 'Adventure', 'Historical', 'Crime'];
const FORMATS = ['Series', 'Film', 'Limited Series', 'Short'];

export function Step1BasicInfo({ formData, updateFormData, onNext }: Step1Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    }

    if (!formData.genre) {
      newErrors.genre = 'Genre is required';
    }

    if (!formData.format) {
      newErrors.format = 'Format is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (!formData.logline.trim()) {
      newErrors.logline = 'Logline is required';
    } else if (formData.logline.length < 20) {
      newErrors.logline = 'Logline must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-cmc-navy mb-2">Basic Information</h2>
      <p className="text-warm-gray-600 mb-6">
        Tell us about your project. This information will be visible to buyers.
      </p>

      <div className="space-y-6">
        {/* Title */}
        <Input
          label="Project Title"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          placeholder="e.g., Nippur de Lagash"
          required
          error={errors.title}
        />

        {/* Tagline */}
        <Input
          label="Tagline"
          value={formData.tagline}
          onChange={(e) => updateFormData({ tagline: e.target.value })}
          placeholder="A catchy one-liner (optional)"
          helperText="Optional: A short, memorable phrase to hook readers"
        />

        {/* Genre & Format */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full">
            <label className="label">Genre <span className="text-red-500">*</span></label>
            <select
              className={`input ${errors.genre ? 'input-error' : ''}`}
              value={formData.genre}
              onChange={(e) => updateFormData({ genre: e.target.value })}
            >
              <option value="">Select genre</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            {errors.genre && <p className="mt-1 text-sm text-red-600">{errors.genre}</p>}
          </div>

          <div className="w-full">
            <label className="label">Format <span className="text-red-500">*</span></label>
            <select
              className={`input ${errors.format ? 'input-error' : ''}`}
              value={formData.format}
              onChange={(e) => updateFormData({ format: e.target.value })}
            >
              <option value="">Select format</option>
              {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            {errors.format && <p className="mt-1 text-sm text-red-600">{errors.format}</p>}
          </div>
        </div>

        {/* Logline */}
        <Textarea
          label="Logline"
          value={formData.logline}
          onChange={(e) => updateFormData({ logline: e.target.value })}
          placeholder="A one or two sentence summary of your story..."
          rows={2}
          required
          error={errors.logline}
          helperText="A brief, compelling summary that captures the essence of your story"
        />

        {/* Description */}
        <Textarea
          label="Full Description"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="Provide a detailed description of your project, including plot, characters, themes, and what makes it unique..."
          rows={8}
          required
          error={errors.description}
          helperText={`${formData.description.length} characters (minimum 50)`}
        />

        {/* Navigation */}
        <div className="flex justify-end pt-4">
          <Button onClick={handleNext} size="lg">
            Next Step
          </Button>
        </div>
      </div>
    </div>
  );
}
