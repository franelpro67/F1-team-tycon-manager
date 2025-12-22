
import React from 'react';
import { TeamState, Driver } from '../types';
import { AVAILABLE_DRIVERS } from '../constants';
import { UserPlus, Trash2 } from 'lucide-react';

interface MarketProps {
  team: TeamState;
  onHireDriver: (driver: Driver) => void;
  onSellDriver: (driverId: string) => void;
}

const Market: React.FC<MarketProps> = ({ team, onHireDriver, onSellDriver }) => {
  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-f1 font-bold text-slate-100">Driver Market</h2>
        <p className="text-slate-400 font-medium">Acquire the fastest drivers on the grid. Maximum 4 drivers per team.</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {AVAILABLE_DRIVERS.map((driver) => {
          const isHired = team.drivers.some(d => d.id === driver.id);
          const canAfford = team.funds >= driver.cost;
          
          return (
            <div key={driver.id} className={`bg-slate-800/50 border-2 rounded-2xl overflow-hidden transition-all flex flex-col ${isHired ? 'border-red-600/50 bg-slate-900/40' : 'border-slate-700 hover:border-slate-500'}`}>
              <div className="relative h-48 bg-slate-900 group">
                <img src={driver.image} alt={driver.name} className="w-full h-full object-contain transition-transform group-hover:scale-110" />
                <div className="absolute top-2 right-2 bg-slate-950/80 px-2 py-1 rounded text-[10px] font-bold text-red-500">
                  {driver.pace} PACE
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <h4 className="font-bold text-sm uppercase tracking-tighter mb-1">{driver.name}</h4>
                <p className="text-[10px] text-slate-500 uppercase font-black mb-4">{driver.nationality}</p>
                
                <div className="mt-auto space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-lg font-f1 font-bold text-green-400">${(driver.cost / 1000000).toFixed(1)}M</p>
                  </div>
                  
                  {isHired ? (
                    <button
                      onClick={() => onSellDriver(driver.id)}
                      className="w-full py-2 bg-red-600/10 text-red-500 border border-red-600/30 rounded-xl font-bold text-xs hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 size={14} /> VENDER (+${(driver.cost * 0.5 / 1000000).toFixed(1)}M)
                    </button>
                  ) : (
                    <button
                      disabled={!canAfford || team.drivers.length >= 4}
                      onClick={() => onHireDriver(driver)}
                      className={`w-full py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                        !canAfford || team.drivers.length >= 4
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-red-600 hover:text-white'
                      }`}
                    >
                      <UserPlus size={14} /> SIGN CONTRACT
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Market;
