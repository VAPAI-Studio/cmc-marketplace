import { useState } from 'react';
import { Button, Input } from '../ui';
import { X } from 'lucide-react';
import type { SubmitFormData } from '../../pages/SubmitProject';

interface Step3Props {
  formData: SubmitFormData;
  updateFormData: (data: Partial<SubmitFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const THEME_OPTIONS = [
  'Redemption', 'Family', 'Identity', 'Power', 'Survival', 'Love',
  'Betrayal', 'Justice', 'War', 'Coming of Age', 'Corruption', 'Revenge',
  'Friendship', 'Loss', 'Freedom', 'Technology', 'Nature', 'Religion',
];

const RIGHTS_OPTIONS = [
  { value: 'Film', label: 'Film' },
  { value: 'TV', label: 'TV Series' },
  { value: 'Streaming', label: 'Streaming' },
  { value: 'Animation', label: 'Animation' },
  { value: 'Video Game', label: 'Video Game' },
  { value: 'Podcast', label: 'Podcast / Audio' },
  { value: 'Stage', label: 'Stage / Theater' },
  { value: 'Publishing', label: 'Publishing / Novel' },
];

const TERRITORY_OPTIONS = [
  'Worldwide', 'North America', 'Latin America', 'Europe', 'Asia Pacific',
  'Middle East & Africa', 'Brazil', 'Spain', 'United States',
];

export function Step3Details({ formData, updateFormData, onNext, onBack }: Step3Props) {
  const [themeInput, setThemeInput] = useState('');

  const toggleTheme = (theme: string) => {
    const current = formData.themes;
    const updated = current.includes(theme)
      ? current.filter((t) => t !== theme)
      : [...current, theme];
    updateFormData({ themes: updated });
  };

  const addCustomTheme = () => {
    const trimmed = themeInput.trim();
    if (trimmed && !formData.themes.includes(trimmed)) {
      updateFormData({ themes: [...formData.themes, trimmed] });
    }
    setThemeInput('');
  };

  const removeTheme = (theme: string) => {
    updateFormData({ themes: formData.themes.filter((t) => t !== theme) });
  };

  const toggleRight = (right: string) => {
    const current = formData.availableRights;
    const updated = current.includes(right)
      ? current.filter((r) => r !== right)
      : [...current, right];
    updateFormData({ availableRights: updated });
  };

  const toggleTerritory = (territory: string) => {
    const current = formData.availableTerritories;
    // If "Worldwide" selected, clear everything else
    if (territory === 'Worldwide') {
      updateFormData({ availableTerritories: current.includes('Worldwide') ? [] : ['Worldwide'] });
      return;
    }
    // If selecting specific territory, remove "Worldwide"
    const withoutWorldwide = current.filter((t) => t !== 'Worldwide');
    const updated = withoutWorldwide.includes(territory)
      ? withoutWorldwide.filter((t) => t !== territory)
      : [...withoutWorldwide, territory];
    updateFormData({ availableTerritories: updated });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-cmc-navy mb-2">Additional Details</h2>
      <p className="text-warm-gray-600 mb-6">
        Help buyers understand your project better (all fields optional)
      </p>

      <div className="space-y-8">
        {/* Tier */}
        <div className="w-full">
          <label className="label">Project Tier</label>
          <select
            className="input"
            value={formData.tier}
            onChange={(e) => updateFormData({ tier: e.target.value })}
          >
            <option value="flagship">Flagship — Premium, market-ready IP</option>
            <option value="strong">Strong — Solid concept with clear potential</option>
            <option value="hidden-gem">Hidden Gem — Unique story worth discovering</option>
          </select>
        </div>

        {/* Period & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Time Period"
            value={formData.period}
            onChange={(e) => updateFormData({ period: e.target.value })}
            placeholder="e.g., Ancient, Modern, Future"
          />
          <Input
            label="Location / Setting"
            value={formData.location}
            onChange={(e) => updateFormData({ location: e.target.value })}
            placeholder="e.g., Buenos Aires, Middle East"
          />
        </div>

        {/* World Type & Target Audience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="World Type"
            value={formData.worldType}
            onChange={(e) => updateFormData({ worldType: e.target.value })}
            placeholder="e.g., Historical, Contemporary, Fantasy"
          />
          <Input
            label="Target Audience"
            value={formData.targetAudience}
            onChange={(e) => updateFormData({ targetAudience: e.target.value })}
            placeholder="e.g., Adults 25-45, Young Adults"
          />
        </div>

        {/* Themes */}
        <div>
          <label className="label">Themes</label>
          <p className="text-sm text-warm-gray-500 mb-3">Select all that apply, or add your own</p>

          {/* Preset tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {THEME_OPTIONS.map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => toggleTheme(theme)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                  formData.themes.includes(theme)
                    ? 'bg-cmc-navy text-white border-cmc-navy'
                    : 'bg-white text-warm-gray-600 border-warm-gray-300 hover:border-cmc-navy hover:text-cmc-navy'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>

          {/* Custom theme input */}
          <div className="flex gap-2">
            <input
              type="text"
              className="input flex-1"
              placeholder="Add a custom theme..."
              value={themeInput}
              onChange={(e) => setThemeInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomTheme(); } }}
            />
            <Button variant="secondary" onClick={addCustomTheme} disabled={!themeInput.trim()}>
              Add
            </Button>
          </div>

          {/* Selected themes */}
          {formData.themes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.themes.map((theme) => (
                <span
                  key={theme}
                  className="flex items-center gap-1 px-3 py-1 bg-cmc-gold/20 text-cmc-navy rounded-full text-sm font-medium"
                >
                  {theme}
                  <button type="button" onClick={() => removeTheme(theme)} className="hover:text-red-500 transition">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Available Rights */}
        <div>
          <label className="label">Available Rights</label>
          <p className="text-sm text-warm-gray-500 mb-3">Which rights are you making available to buyers?</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {RIGHTS_OPTIONS.map(({ value, label }) => (
              <label
                key={value}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                  formData.availableRights.includes(value)
                    ? 'border-cmc-navy bg-cmc-navy/5 text-cmc-navy'
                    : 'border-warm-gray-200 hover:border-warm-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  className="accent-cmc-navy"
                  checked={formData.availableRights.includes(value)}
                  onChange={() => toggleRight(value)}
                />
                <span className="text-sm font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Territories */}
        <div>
          <label className="label">Available Territories</label>
          <p className="text-sm text-warm-gray-500 mb-3">Where can buyers license this IP?</p>
          <div className="flex flex-wrap gap-2">
            {TERRITORY_OPTIONS.map((territory) => (
              <button
                key={territory}
                type="button"
                onClick={() => toggleTerritory(territory)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  formData.availableTerritories.includes(territory)
                    ? 'bg-cmc-navy text-white border-cmc-navy'
                    : 'bg-white text-warm-gray-600 border-warm-gray-300 hover:border-cmc-navy hover:text-cmc-navy'
                }`}
              >
                {territory}
              </button>
            ))}
          </div>
        </div>

        {/* Comparables */}
        <Input
          label="Comparable Titles"
          value={formData.comparables.join(', ')}
          onChange={(e) =>
            updateFormData({
              comparables: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
            })
          }
          placeholder="e.g., Narcos, Money Heist, The Wire"
          helperText="Comma-separated list of similar TV shows or films"
        />

        {/* Rights Holder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Rights Holder"
            value={formData.rightsHolder}
            onChange={(e) => updateFormData({ rightsHolder: e.target.value })}
            placeholder="Your name or company"
          />
          <Input
            label="Rights Holder Contact"
            value={formData.rightsHolderContact}
            onChange={(e) => updateFormData({ rightsHolderContact: e.target.value })}
            placeholder="Email or phone"
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} size="lg">
            Review & Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
