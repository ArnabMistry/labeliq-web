
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import CameraScanner from './components/CameraScanner';
import AnalysisResultView from './components/AnalysisResultView';
import ProfileForm from './components/ProfileForm';
import { AppScreen, UserProfile, ScanResult } from './types';
import { analyzeIngredients, analyzeText } from './services/geminiService';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('home');
  const [profile, setProfile] = useState<UserProfile>({
    allergies: [],
    conditions: [],
    profession: 'General',
    goals: ['Health optimization']
  });
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [manualText, setManualText] = useState("");

  // Load profile from local storage if exists
  useEffect(() => {
    const saved = localStorage.getItem('labeliq_profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load profile", e);
      }
    }
  }, []);

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('labeliq_profile', JSON.stringify(newProfile));
    setActiveScreen('home');
  };

  const handleCapture = async (imageBuffer: string) => {
    setIsAnalyzing(true);
    setActiveScreen('result');
    try {
      const res = await analyzeIngredients(imageBuffer, profile);
      setLastResult(res);
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please try again with a clearer photo.");
      setActiveScreen('home');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleManualAnalyze = async () => {
    if (!manualText.trim()) return;
    setIsAnalyzing(true);
    setActiveScreen('result');
    try {
      const res = await analyzeText(manualText, profile);
      setLastResult(res);
    } catch (err) {
      console.error(err);
      alert("Manual analysis failed.");
      setActiveScreen('home');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderContent = () => {
    if (activeScreen === 'scan') {
      return (
        <CameraScanner 
          onCapture={handleCapture} 
          onCancel={() => setActiveScreen('home')} 
        />
      );
    }

    if (activeScreen === 'result') {
      if (isAnalyzing) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
            <div className="w-16 h-16 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin mb-6"></div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 italic">DECODING INGREDIENTS</h2>
            <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
              Identifying chemical compounds, identifying allergens, and checking regulatory status...
            </p>
          </div>
        );
      }
      return lastResult ? (
        <AnalysisResultView result={lastResult} onReset={() => setActiveScreen('home')} />
      ) : (
        <div className="p-8 text-center text-slate-400">No result found</div>
      );
    }

    if (activeScreen === 'profile') {
      return (
        <ProfileForm 
          profile={profile} 
          onUpdate={setProfile} 
          onSave={() => saveProfile(profile)} 
        />
      );
    }

    if (activeScreen === 'about') {
      return (
        <div className="p-6 space-y-8 prose prose-slate">
          <div className="space-y-4">
            <h2 className="text-2xl font-black italic tracking-tight uppercase">The Intelligence</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              LabelIQ is built on the principle of <span className="font-bold text-slate-900 italic">Risk-Aware Transparency</span>. 
              Modern food labels are often deliberately opaque, using chemical aliases for additives that impact metabolic health, 
              cognitive performance, and professional regulatory compliance.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Core Principles</h3>
            <ul className="space-y-4 list-none p-0">
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded bg-slate-900 text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold">01</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm m-0">Neutrality First</h4>
                  <p className="text-xs text-slate-500 m-0 leading-relaxed">We interpret data from chemical databases and food science studies without corporate bias or nutritional agendas.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded bg-slate-900 text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold">02</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm m-0">Contextual Safety</h4>
                  <p className="text-xs text-slate-500 m-0 leading-relaxed">Safety is personal. A pilot's requirements differ from an MMA fighter's or an office worker's.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded bg-slate-900 text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold">03</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm m-0">No Fear-mongering</h4>
                  <p className="text-xs text-slate-500 m-0 leading-relaxed">We highlight risks based on confidence levels, not absolutes. Science is a dialogue of evidence.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      );
    }

    // Home Screen
    return (
      <div className="p-6 space-y-8 animate-in fade-in duration-500">
        <section className="space-y-3 pt-4">
          <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">
            Ingredient <br/>Intelligence
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-[280px]">
            Scan any packaged food to decode its hidden components instantly.
          </p>
        </section>

        <section className="relative">
          <button 
            onClick={() => setActiveScreen('scan')}
            className="w-full bg-slate-900 text-white p-6 rounded-[2rem] flex flex-col items-center justify-center gap-4 shadow-xl active:scale-[0.98] transition-all overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <svg className="w-12 h-12 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-lg font-bold tracking-tight">TAP TO SCAN LABEL</span>
          </button>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Manual Entry</h3>
          </div>
          <div className="bg-white border border-slate-100 rounded-[1.5rem] p-4 shadow-sm focus-within:border-slate-300 transition-colors">
            <textarea 
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Paste ingredient text here..."
              className="w-full bg-transparent text-sm text-slate-600 focus:outline-none min-h-[100px] resize-none"
            />
            <div className="flex justify-end mt-2">
              <button 
                onClick={handleManualAnalyze}
                disabled={!manualText.trim()}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold disabled:opacity-30 tracking-tight"
              >
                ANALYZE TEXT
              </button>
            </div>
          </div>
        </section>

        {/* User Context Preview */}
        <section className="bg-slate-50 rounded-[1.5rem] p-5 border border-slate-100/50">
          <div className="flex items-center justify-between mb-3">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Profile</h3>
             <button onClick={() => setActiveScreen('profile')} className="text-[10px] font-bold text-slate-900 uppercase underline underline-offset-4">Edit</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-md">{profile.profession}</span>
            {profile.allergies.map(a => (
              <span key={a} className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-1 rounded-md">{a} Allergy</span>
            ))}
          </div>
        </section>
      </div>
    );
  };

  return (
    <Layout 
      activeScreen={activeScreen} 
      onNavigate={setActiveScreen}
      title={activeScreen === 'home' ? 'LabelIQ' : activeScreen.charAt(0).toUpperCase() + activeScreen.slice(1)}
      hideNav={activeScreen === 'scan'}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
