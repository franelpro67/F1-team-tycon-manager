
import React from 'react';
import { TeamState, Sponsor } from '../types';
import { Coins, Check, X, TrendingUp, Target, Award, Mail, PhoneIncoming, AlertCircle, PhoneMissed } from 'lucide-react';
// Import AVAILABLE_SPONSORS directly
import { AVAILABLE_SPONSORS } from '../constants';

interface SponsorsProps {
  team: TeamState;
  onAcceptSponsor: (sponsor: Sponsor) => void;
  onRejectSponsor: (sponsorId: string) => void;
  onCancelActive: (sponsorId: string) => void;
}

const Sponsors: React.FC<SponsorsProps> = ({ team, onAcceptSponsor, onRejectSponsor, onCancelActive }) => {
  const activeSponsors = team.activeSponsorIds.map(id => {
      // Use imported AVAILABLE_SPONSORS instead of require to avoid Node.js type errors in browser environment
      return AVAILABLE_SPONSORS.find(s => s.id === id);
  }).filter(Boolean) as Sponsor[];

  const offers = team.sponsorOffers;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-f1 font-bold text-slate-100 flex items-center gap-3 italic tracking-tighter">
            <Coins className="text-red-500" /> BUSINESS HUB
          </h2>
          <p className="text-slate-400 font-medium italic">Your team's success attract investors. Manage your incoming business inquiries.</p>
        </div>
      </header>

      {/* Active Contracts */}
      <section>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <Award size={16} className="text-yellow-500" /> Active Partnerships ({activeSponsors.length}/3)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map(index => {
            const sponsor = activeSponsors[index];
            return (
              <div key={index} className={`min-h-[200px] rounded-3xl border-2 p-8 flex flex-col justify-between transition-all ${
                sponsor ? 'bg-slate-900 border-green-500/30 shadow-xl' : 'bg-slate-950 border-dashed border-slate-800 opacity-40'
              }`}>
                {sponsor ? (
                  <>
                    <div className="flex justify-between items-start">
                      <div className={`w-14 h-14 rounded-2xl ${sponsor.logoColor} flex items-center justify-center text-white font-black text-2xl shadow-lg`}>
                        {sponsor.name.charAt(0)}
                      </div>
                      <button onClick={() => onCancelActive(sponsor.id)} className="p-2 text-slate-600 hover:text-red-500 transition-colors">
                        <X size={18} />
                      </button>
                    </div>
                    <div>
                      <h4 className="font-f1 text-white uppercase italic truncate text-lg">{sponsor.name}</h4>
                      <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest mt-1">Contract Active</p>
                    </div>
                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-800">
                       <span className="text-[10px] text-slate-500 font-bold uppercase">KPI Target</span>
                       <span className="font-f1 text-white text-sm">Top {sponsor.targetPosition}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 space-y-3">
                    <Target size={32} className="text-slate-800" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Empty Slot</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Incoming Proposals - THE "CALLS" */}
      <section className="pt-8">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <PhoneIncoming size={16} className="text-red-500 animate-pulse" /> Business Inquiries ({offers.length})
            </h3>
            {offers.length > 0 && <span className="bg-red-600 text-white text-[10px] px-3 py-1 rounded-full font-black animate-bounce">NEW CALLS</span>}
        </div>
        
        {offers.length === 0 ? (
          <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-3xl p-16 text-center flex flex-col items-center">
            <PhoneMissed size={60} className="text-slate-800 mb-6" />
            <p className="text-slate-500 font-medium italic max-w-sm">The phone is quiet. Brands are waiting for better results or higher reputation to invest in your team.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-slate-900 border-2 border-slate-800 p-8 rounded-3xl flex flex-col hover:border-red-500/50 transition-all shadow-2xl group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <PhoneIncoming size={120} />
                </div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className={`w-20 h-20 rounded-2xl ${offer.logoColor} flex items-center justify-center text-white font-black text-4xl shadow-2xl transform group-hover:scale-110 transition-all`}>
                    {offer.name.charAt(0)}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-1 tracking-widest">{offer.category}</p>
                    <h4 className="text-2xl font-f1 font-bold text-white uppercase italic leading-none">{offer.name}</h4>
                  </div>
                </div>

                <div className="bg-slate-950/80 backdrop-blur-sm rounded-2xl p-6 mb-8 space-y-4 border border-slate-800 relative z-10">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 uppercase font-bold tracking-widest">Initial Investment</span>
                    <span className="font-f1 text-white text-lg">${(offer.signingBonus / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 uppercase font-bold tracking-widest">Per Race Payout</span>
                    <span className="font-f1 text-green-400 text-lg">${(offer.payoutPerRace / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="h-px bg-slate-800" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 uppercase font-bold tracking-widest">Minimum Result</span>
                    <span className="font-f1 text-red-500 text-lg">Top {offer.targetPosition}</span>
                  </div>
                </div>

                <div className="flex gap-4 relative z-10 mt-auto">
                  <button
                    onClick={() => onAcceptSponsor(offer)}
                    className="flex-1 bg-white text-slate-950 py-5 rounded-2xl font-black text-xs hover:bg-red-600 hover:text-white transition-all shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    <Check size={18} /> SIGN CONTRACT
                  </button>
                  <button
                    onClick={() => onRejectSponsor(offer.id)}
                    className="px-8 border-2 border-slate-800 text-slate-500 py-5 rounded-2xl font-black text-xs hover:bg-slate-800 hover:text-white transition-all uppercase tracking-widest"
                  >
                    DECLINE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Sponsors;
