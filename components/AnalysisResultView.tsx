
import React from 'react';
import { ScanResult, Verdict, RiskLevel, IngredientAnalysis } from '../types';
import { COLORS, STATUS_ICONS } from '../constants';

interface AnalysisResultViewProps {
  result: ScanResult;
  onReset: () => void;
}

const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ result, onReset }) => {
  const verdictStyle = 
    result.overallVerdict === Verdict.SAFE ? COLORS.safe :
    result.overallVerdict === Verdict.CAUTION ? COLORS.caution :
    COLORS.avoid;

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Verdict */}
      <div className={`p-8 rounded-[2rem] border text-center ${verdictStyle} shadow-sm`}>
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-white/80 rounded-full">
            {STATUS_ICONS[result.overallVerdict]}
          </div>
        </div>
        <h2 className="text-3xl font-black tracking-tight mb-2 uppercase italic">
          {result.overallVerdict}
        </h2>
        {result.productName && (
          <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-3">
            {result.productName}
          </p>
        )}
        <p className="text-base font-medium leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Ingredient Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Ingredient Breakdown</h3>
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
            {result.ingredients.length} ITEMS
          </span>
        </div>

        <div className="space-y-3">
          {/* Use proper component with key in map */}
          {result.ingredients.map((ing, idx) => (
            <IngredientCard key={idx} ingredient={ing} />
          ))}
        </div>
      </section>

      <button 
        onClick={onReset}
        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold tracking-wide shadow-lg active:scale-95 transition-all"
      >
        SCAN NEW LABEL
      </button>

      <div className="text-center pt-4 pb-8">
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
          LabelIQ provides general informational intelligence based on product labeling. 
          Consult a medical professional for clinical dietary decisions.
        </p>
      </div>
    </div>
  );
};

// Fixed: Using React.FC allows React to recognize this as a component that accepts standard props like 'key'
const IngredientCard: React.FC<{ ingredient: IngredientAnalysis }> = ({ ingredient }) => {
  const riskColor = 
    ingredient.riskLevel === RiskLevel.LOW ? 'bg-emerald-500' :
    ingredient.riskLevel === RiskLevel.MEDIUM ? 'bg-amber-500' :
    'bg-rose-500';

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <h4 className="font-bold text-slate-900 text-base leading-tight">
            {ingredient.name}
          </h4>
          {ingredient.technicalName && (
            <p className="text-xs text-slate-400 font-medium italic mt-0.5">
              {ingredient.technicalName}
            </p>
          )}
        </div>
        <div className={`w-2 h-2 rounded-full mt-1.5 ${riskColor}`} title={`Risk Level: ${ingredient.riskLevel}`} />
      </div>

      <div className="space-y-2 mt-3">
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 mt-0.5 text-slate-300">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-xs text-slate-600 leading-normal">
            <span className="font-bold text-slate-800">Purpose:</span> {ingredient.purpose}
          </p>
        </div>

        {ingredient.warning && (
          <div className="flex items-start gap-2 p-2.5 bg-rose-50/50 rounded-xl border border-rose-100/50">
            <div className="w-4 h-4 mt-0.5 text-rose-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-[11px] text-rose-700 font-medium leading-normal">
              {ingredient.warning}
            </p>
          </div>
        )}

        {ingredient.regulatoryNote && (
          <p className="text-[10px] text-slate-400 font-medium pl-6 italic">
            Note: {ingredient.regulatoryNote}
          </p>
        )}
      </div>
    </div>
  );
};

export default AnalysisResultView;
