import { Button } from '../ui';
import type { SubmitFormData } from '../../pages/SubmitProject';
import { Upload, FileText, Image } from 'lucide-react';

interface Step2Props {
  formData: SubmitFormData;
  updateFormData: (data: Partial<SubmitFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2Upload({ formData, updateFormData, onNext, onBack }: Step2Props) {
  const handleScriptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData({ scriptFile: file });
    }
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData({ posterFile: file });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-cmc-navy mb-2">Upload Files</h2>
      <p className="text-warm-gray-600 mb-6">
        Upload your script and poster (both optional for now)
      </p>

      <div className="space-y-6">
        {/* Script Upload */}
        <div className="border-2 border-dashed border-warm-gray-300 rounded-lg p-8 text-center">
          <FileText className="w-12 h-12 text-cmc-navy mx-auto mb-4" />
          <h3 className="font-semibold text-cmc-navy mb-2">Script (PDF)</h3>
          <p className="text-sm text-warm-gray-600 mb-4">
            Upload your script in PDF format (max 10MB)
          </p>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf"
              onChange={handleScriptUpload}
              className="hidden"
            />
            <span className="inline-block bg-cmc-navy text-white px-4 py-2 rounded hover:bg-cmc-navy-700 transition">
              <Upload className="w-4 h-4 inline mr-2" />
              Choose File
            </span>
          </label>
          {formData.scriptFile && (
            <p className="text-sm text-cmc-gold mt-2">✓ {formData.scriptFile.name}</p>
          )}
        </div>

        {/* Poster Upload */}
        <div className="border-2 border-dashed border-warm-gray-300 rounded-lg p-8 text-center">
          <Image className="w-12 h-12 text-cmc-navy mx-auto mb-4" />
          <h3 className="font-semibold text-cmc-navy mb-2">Poster Image</h3>
          <p className="text-sm text-warm-gray-600 mb-4">
            Upload a poster or concept art (JPG, PNG, max 10MB)
          </p>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePosterUpload}
              className="hidden"
            />
            <span className="inline-block bg-cmc-navy text-white px-4 py-2 rounded hover:bg-cmc-navy-700 transition">
              <Upload className="w-4 h-4 inline mr-2" />
              Choose Image
            </span>
          </label>
          {formData.posterFile && (
            <p className="text-sm text-cmc-gold mt-2">✓ {formData.posterFile.name}</p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} size="lg">
            Next Step
          </Button>
        </div>
      </div>
    </div>
  );
}
