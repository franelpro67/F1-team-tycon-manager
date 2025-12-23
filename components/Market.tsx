
import React, { useState, useMemo } from 'react';
import { TeamState, Driver } from '../types';
import { AVAILABLE_DRIVERS } from '../constants';
import { UserPlus, Trash2, Search, Filter, ArrowUpDown, Star, Trophy, Zap } from 'lucide-react';

interface MarketProps {
  team: TeamState;
  onHireDriver: (driver: Driver) => void;
  onSellDriver: (driverId: string) => void;
}

type SortOption = 'price-asc' | 'price-desc' | 'pace-desc';
type CategoryFilter = 'all' | 'legends' | 'pros' | 'prospects';

const Market: React.FC<MarketProps> = ({ team, onHireDriver, onSellDriver }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [sort, setSort] = useState<SortOption>('pace-desc');

  const filteredDrivers = useMemo(() => {
    let result = AVAILABLE_DRIVERS.filter(d => 
      d.name.toLowerCase().includes(search.toLowerCase()) || 
      d.nationality.toLowerCase().includes(search.toLowerCase())
    );

    if (category !== 'all') {
      result = result.filter(d => {
        const isLegend = d.id.startsWith('d-');
        if (category === 'legends') return isLegend;
        if (category === 'pros') return !isLegend && d.pace >= 88;
        if (category === 'prospects') return !isLegend && d.pace < 88;
        return true;
      });
    }

    result.sort((a, b) => {
      if (sort === 'price-asc') return a.cost - b.cost;
      if (sort === 'price-desc') return b.cost - a.cost;
      if (sort === 'pace-desc') return b.pace - a.pace;
      return 0;
    });

    return result;
  }, [search, category, sort]);

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-4xl font-f1 font-bold text-slate-100 italic tracking-tighter">DRIVER MARKET</h2>
          <p className="text-slate-400 font-medium">Build your dream lineup. Legend or Future Star?</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search driver..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-950 border border-slate-700 pl-10 pr-4 py-2 rounded-xl text-sm outline-none focus:border-red-500 transition-all w-48"
            />
          </div>
          
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value as CategoryFilter)}
            className="bg-slate-950 border border-slate-700 px-4 py-2 rounded-xl text-sm outline-none focus:border-red-500 transition-all"
          >
            <option value="all">All Categories</option>
            <option value="legends">Legends</option>
            <option value="pros">Elite Pros</option>
            <option value="prospects">Young Talents</option>
          </select>

          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-slate-950 border border-slate-700 px-4 py-2 rounded-xl text-sm outline-none focus:border-red-500 transition-all"
          >
            <option value="pace-desc">Top Pace First</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="price-asc">Price: Low to High</option>
          </select>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDrivers.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
             <p className="text-slate-500 font-f1 text-lg">NO DRIVERS FOUND IN THIS CATEGORY</p>
          </div>
        ) : (
          filteredDrivers.map((driver) => {
            const isHired = team.drivers.some(d => d.id === driver.id);
            const canAfford = team.funds >= driver.cost;
            const isLegend = driver.id.startsWith('d-');
            
            return (
              <div key={driver.id} className={`group bg-slate-900/60 border-2 rounded-3xl overflow-hidden transition-all flex flex-col hover:scale-[1.02] active:scale-95 ${isHired ? 'border-red-600/50 bg-red-600/5' : 'border-slate-800 hover:border-slate-500 shadow-2xl'}`}>
                <div className="relative h-56 bg-gradient-to-b from-slate-950 to-slate-900 flex items-end justify-center overflow-hidden">
                  <img 
                    src={driver.image} 
                    alt={driver.name} 
                    className="h-[90%] object-contain transform group-hover:scale-110 transition-transform duration-500 filter drop-shadow-2xl" 
                  />
                  
                  {/* Badge de Categoría */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {isLegend && (
                      <div className="bg-yellow-500/90 text-slate-950 p-1.5 rounded-lg shadow-lg">
                        <Trophy size={14} />
                      </div>
                    )}
                    {driver.pace >= 95 && (
                      <div className="bg-red-600 text-white p-1.5 rounded-lg shadow-lg">
                        <Zap size={14} />
                      </div>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 font-black uppercase mb-1">{driver.nationality}</span>
                    <div className="bg-slate-950/90 backdrop-blur-md border border-slate-700 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-slate-400">PACE</span>
                      <span className={`text-sm font-f1 font-bold ${driver.pace >= 90 ? 'text-red-500' : 'text-white'}`}>{driver.pace}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h4 className="font-f1 font-bold text-lg leading-tight truncate text-white uppercase italic">{driver.name}</h4>
                    <div className="flex gap-4 mt-2">
                       <div className="flex flex-col">
                          <span className="text-[8px] text-slate-500 font-bold uppercase">Experience</span>
                          <span className="text-xs font-bold">{driver.experience}</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[8px] text-slate-500 font-bold uppercase">Marketability</span>
                          <span className="text-xs font-bold">{driver.marketability}%</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[8px] text-slate-500 font-bold uppercase">Age</span>
                          <span className="text-xs font-bold">{driver.age}</span>
                       </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto space-y-4">
                    <div className="flex justify-between items-end border-t border-slate-800 pt-4">
                      <div>
                        <p className="text-[9px] text-slate-500 uppercase font-black">Contract Fee</p>
                        <p className="text-2xl font-f1 font-bold text-green-400">${(driver.cost / 1000000).toFixed(1)}M</p>
                      </div>
                    </div>
                    
                    {isHired ? (
                      <button
                        onClick={() => onSellDriver(driver.id)}
                        className="w-full py-3 bg-red-600/10 text-red-500 border border-red-600/30 rounded-2xl font-bold text-xs hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        <Trash2 size={16} className="group-hover/btn:rotate-12 transition-transform" /> TERMINATE (+${(driver.cost * 0.5 / 1000000).toFixed(1)}M)
                      </button>
                    ) : (
                      <button
                        disabled={!canAfford || team.drivers.length >= 4}
                        onClick={() => onHireDriver(driver)}
                        className={`w-full py-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xl ${
                          !canAfford || team.drivers.length >= 4
                          ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                          : 'bg-white text-slate-950 hover:bg-red-600 hover:text-white transform hover:-translate-y-1 active:translate-y-0'
                        }`}
                      >
                        <UserPlus size={16} /> SIGN DRIVER
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};

export default Market;
