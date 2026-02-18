import { Button, Badge } from '../ui';
import type { SubmitFormData } from '../../pages/SubmitProject';
import { FileText, Image, Check } from 'lucide-react';

interface Step4Props {
  formData: SubmitFormData;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function Step4Review({ formData, onBack, onSubmit, isSubmitting }: Step4Props) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-cmc-navy mb-2">Review & Submit</h2>
      <p className="text-warm-gray-600 mb-6">
        Please review your information before submitting
      </p>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="border border-warm-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-cmc-navy mb-4">Basic Information</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-warm-gray-500">Title</dt>
              <dd className="text-cmc-navy font-semibold">{formData.title}</dd>
            </div>
            {formData.tagline && (
              <div>
                <dt className="text-sm font-medium text-warm-gray-500">Tagline</dt>
                <dd className="text-warm-gray-700">{formData.tagline}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-warm-gray-500">Genre & Format</dt>
              <dd className="flex gap-2 mt-1">
                <Badge variant="navy">{formData.genre}</Badge>
                <Badge variant="gold">{formData.format}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-warm-gray-500">Logline</dt>
              <dd className="text-warm-gray-700">{formData.logline}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-warm-gray-500">Description</dt>
              <dd className="text-warm-gray-700 line-clamp-3">{formData.description}</dd>
            </div>
          </dl>
        </div>

        {/* Files */}
        <div className="border border-warm-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-cmc-navy mb-4">Uploaded Files</h3>
          <div className="space-y-2">
            {formData.scriptFile ? (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-cmc-navy" />
                <span className="text-warm-gray-700">{formData.scriptFile.name}</span>
                <Check className="w-4 h-4 text-green-600" />
              </div>
            ) : (
              <p className="text-sm text-warm-gray-500">No script uploaded</p>
            )}
            {formData.posterFile ? (
              <div className="flex items-center gap-2 text-sm">
                <Image className="w-4 h-4 text-cmc-navy" />
                <span className="text-warm-gray-700">{formData.posterFile.name}</span>
                <Check className="w-4 h-4 text-green-600" />
              </div>
            ) : (
              <p className="text-sm text-warm-gray-500">No poster uploaded</p>
            )}
          </div>
        </div>

        {/* Additional Details */}
        {(formData.period || formData.location || formData.worldType || formData.targetAudience) && (
          <div className="border border-warm-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-cmc-navy mb-4">Project Details</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-warm-gray-500">Tier</dt>
                <dd>
                  <Badge variant="default" className="capitalize">{formData.tier}</Badge>
                </dd>
              </div>
              {formData.period && (
                <div>
                  <dt className="text-sm font-medium text-warm-gray-500">Period</dt>
                  <dd className="text-warm-gray-700">{formData.period}</dd>
                </div>
              )}
              {formData.location && (
                <div>
                  <dt className="text-sm font-medium text-warm-gray-500">Location</dt>
                  <dd className="text-warm-gray-700">{formData.location}</dd>
                </div>
              )}
              {formData.targetAudience && (
                <div>
                  <dt className="text-sm font-medium text-warm-gray-500">Target Audience</dt>
                  <dd className="text-warm-gray-700">{formData.targetAudience}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Themes */}
        {formData.themes.length > 0 && (
          <div className="border border-warm-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-cmc-navy mb-4">Themes</h3>
            <div className="flex flex-wrap gap-2">
              {formData.themes.map((theme) => (
                <Badge key={theme} variant="default">{theme}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Rights & Territories */}
        {(formData.availableRights.length > 0 || formData.availableTerritories.length > 0 || formData.rightsHolder) && (
          <div className="border border-warm-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-cmc-navy mb-4">Rights & Territories</h3>
            <dl className="space-y-3">
              {formData.availableRights.length > 0 && (
                <div>
                  <dt className="text-sm font-medium text-warm-gray-500">Available Rights</dt>
                  <dd className="flex flex-wrap gap-2 mt-1">
                    {formData.availableRights.map((r) => (
                      <Badge key={r} variant="navy" size="sm">{r}</Badge>
                    ))}
                  </dd>
                </div>
              )}
              {formData.availableTerritories.length > 0 && (
                <div>
                  <dt className="text-sm font-medium text-warm-gray-500">Territories</dt>
                  <dd className="flex flex-wrap gap-2 mt-1">
                    {formData.availableTerritories.map((t) => (
                      <Badge key={t} variant="default" size="sm">{t}</Badge>
                    ))}
                  </dd>
                </div>
              )}
              {formData.comparables.length > 0 && (
                <div>
                  <dt className="text-sm font-medium text-warm-gray-500">Comparables</dt>
                  <dd className="text-warm-gray-700">{formData.comparables.join(', ')}</dd>
                </div>
              )}
              {formData.rightsHolder && (
                <div>
                  <dt className="text-sm font-medium text-warm-gray-500">Rights Holder</dt>
                  <dd className="text-warm-gray-700">
                    {formData.rightsHolder}
                    {formData.rightsHolderContact && ` · ${formData.rightsHolderContact}`}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Submit Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>What happens next:</strong> Your project will be saved as a draft and queued for AI analysis. Once analyzed, it will be reviewed before publishing to the marketplace.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="ghost" onClick={onBack} disabled={isSubmitting}>
            Back
          </Button>
          <Button onClick={onSubmit} size="lg" loading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Project'}
          </Button>
        </div>
      </div>
    </div>
  );
}
