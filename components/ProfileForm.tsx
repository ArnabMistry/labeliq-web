
import React from 'react';
import { UserProfile } from '../types';

interface ProfileFormProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onSave: () => void;
}

const PROFESSIONS = [
  'General', 'Professional Athlete', 'Combat Sports Athlete', 'Pilot', 
  'First Responder', 'Medical Professional', 'Driver / Logistics'
];

const COMMON_ALLERGIES = [
  'Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Soy', 'Wheat', 'Shellfish', 'Fish'
];

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onUpdate, onSave }) => {
  const toggleAllergy = (allergy: string) => {
    const next = profile.allergies.includes(allergy)
      ? profile.allergies.filter(a => a !== allergy)
      : [...profile.allergies, allergy];
    onUpdate({ ...profile, allergies: next });
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Health Context</h2>
        <p className="text-sm text-slate-500">LabelIQ adapts results to your profile.</p>
      </div>

      <section className="space-y-4">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Profession</label>
        <div className="grid grid-cols-1 gap-2">
          {PROFESSIONS.map(p => (
            <button
              key={p}
              onClick={() => onUpdate({ ...profile, profession: p })}
              className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                profile.profession === p 
                ? 'border-slate-900 bg-slate-900 text-white shadow-md' 
                : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Common Allergies</label>
        <div className="flex flex-wrap gap-2">
          {COMMON_ALLERGIES.map(a => (
            <button
              key={a}
              onClick={() => toggleAllergy(a)}
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                profile.allergies.includes(a)
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-100 bg-white text-slate-500'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Additional Conditions</label>
        <textarea
          placeholder="e.g. Type 2 Diabetes, Gluten Sensitivity, High Blood Pressure"
          className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-white text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none min-h-[100px]"
          value={profile.conditions.join(', ')}
          onChange={(e) => onUpdate({ ...profile, conditions: e.target.value.split(',').map(s => s.trim()).filter(s => s !== "") })}
        />
      </section>

      <button 
        onClick={onSave}
        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold tracking-wide shadow-lg active:scale-95 transition-all"
      >
        SAVE PROFILE
      </button>
    </div>
  );
};

export default ProfileForm;
