
import React, { useState, useEffect } from 'react';
import { TeamState, Driver, TeamResult } from '../types';
import { TrendingUp, DollarSign, Award, Settings, Edit2, Check, X, UserCheck, UserPlus, RotateCcw, Crown, Trophy, BarChart3, Star, Target, ArrowRight } from 'lucide-react';
import { getEngineerAdvice } from '../services/geminiService';
import { AVAILABLE_DRIVERS, RIVAL_TEAMS } from '../constants';

interface DashboardProps {
  team: TeamState;
  onRaceStart: () => void;
  onRenameTeam: (newName: string) => void;
  onToggleActive: (driverId: string) => void;
  onResetSeason: () => void;
  isVersus?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ team, onRaceStart, onRenameTeam, onToggleActive, onResetSeason, isVersus }) => {
  const [advice, setAdvice] = useState<string>("Analyzing team data...");
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(team.name);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoadingAdvice(true);
      const msg = await getEngineerAdvice(team);
      setAdvice(msg);
      setLoadingAdvice(false);
    };
    fetchAdvice();
  }, [team.car, team.engineers.length]);

  const handleSaveName = () => {
    if (tempName.trim()) {
      onRenameTeam(tempName.trim());
      setIsEditingName(false);
    }
  };

  const accentColor = team.color === 'cyan' ? 'text-cyan-400' : 'text-red-500';
  const accentBg = team.color === 'cyan' ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-red-600 hover:bg-red-700';

  const canAdvance = team.activeDriverIds.length === 2 && team.engineers.length > 0;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div className="max-w-md w-full">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} autoFocus className="bg-slate-800 border-2 border-red-500 text-3xl font-f1 font-bold text-slate-100 px-4 py-2 rounded-lg w-full outline-none" />
              <button onClick={handleSaveName} className="p-3 bg-green-600 rounded-lg"><Check /></button>
            </div>
          ) : (
            <div className="flex items-center gap-3 group">
              <h2 className={`text-4xl font-f1 font-bold italic uppercase transition-colors duration-500 ${accentColor}`}>{team.name}</h2>
              <button onClick={() => setIsEditingName(true)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-500"><Edit2 size={20} /></button>
            </div>
          )}
        </div>
        <button 
          onClick={onRaceStart} 
          disabled={!canAdvance}
          className={`px-8 py-4 rounded-full font-bold transition-all uppercase tracking-tighter flex items-center gap-2 text-white transform hover:-translate-y-1 active:translate-y-0 ${canAdvance ? accentBg : 'bg-slate-800 opacity-50 cursor-not-allowed'}`}
        >
          {isVersus ? 'END TURN' : 'GO TO RACE'} <ArrowRight size={20} />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<DollarSign className="text-green-500" />} label="Funds" value={`$${(team.funds / 1000000).toFixed(1)}M`} />
        <StatCard icon={<Award className="text-yellow-500" />} label="Rep" value={`${team.reputation}%`} />
        <StatCard icon={<BarChart3 className={accentColor} />} label="Car Tech" value={`${team.car.aerodynamics + team.car.powerUnit + team.car.chassis}`} />
        <StatCard icon={<Settings className="text-slate-500" />} label="Staff" value={`${team.engineers.length}/3`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">Drivers ({team.drivers.length}/4)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {team.drivers.length === 0 ? (
                <div className="col-span-2 p-8 border-2 border-dashed border-slate-700 rounded-xl text-center">
                  <p className="text-slate-500 italic">No signed drivers. Visit the market.</p>
                </div>
              ) : (
                team.drivers.map(d => {
                  const isActive = team.activeDriverIds.includes(d.id);
                  return (
                    <div key={d.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${isActive ? (team.color === 'cyan' ? 'bg-cyan-600/10 border-cyan-600' : 'bg-red-600/10 border-red-600') : 'bg-slate-900/50 border-slate-700'}`}>
                      <img src={d.image} alt="" className="w-12 h-12 rounded-full object-cover" />
                      <div className="flex-1">
                        <p className="font-bold text-sm truncate">{d.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase">{isActive ? 'Primary' : 'Reserve'}</p>
                      </div>
                      <button onClick={() => onToggleActive(d.id)} className={`p-2 rounded-lg ${isActive ? accentBg : 'bg-slate-700 hover:text-white'}`}>
                        {isActive ? <UserCheck size={18} /> : <UserPlus size={18} />}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Development Levels</h3>
            <div className="grid grid-cols-3 gap-6">
              <LevelStat label="Aero" value={team.car.aerodynamics} color="bg-blue-500" />
              <LevelStat label="Engine" value={team.car.powerUnit} color="bg-red-500" />
              <LevelStat label="Chassis" value={team.car.chassis} color="bg-green-500" />
            </div>
          </section>
        </div>

        <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className={`text-lg font-bold mb-4 italic uppercase ${accentColor}`}>Technical Debrief</h3>
          <div className="text-sm text-slate-300 italic min-h-[120px] bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            {loadingAdvice ? "Consulting with lead engineers..." : `"${advice}"`}
          </div>
          <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-800">
            <h4 className="text-[10px] text-slate-500 font-bold uppercase mb-2">Technical Staff</h4>
            <div className="space-y-2">
              {team.engineers.map(e => (
                <div key={e.id} className="flex justify-between text-xs">
                  <span className="text-slate-300">{e.name}</span>
                  <span className={accentColor}>RTG {e.rating}</span>
                </div>
              ))}
              {team.engineers.length === 0 && <p className="text-xs text-slate-600 italic">No engineers hired.</p>}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: any) => (
  <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
    <div className="p-3 bg-slate-900 rounded-lg">{icon}</div>
    <div><p className="text-[10px] text-slate-400 uppercase font-bold">{label}</p><p className="text-xl font-f1 font-bold text-white">{value}</p></div>
  </div>
);

const LevelStat = ({ label, value, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] uppercase font-black text-slate-400"><span>{label}</span><span className="text-red-500">LVL {value}</span></div>
    <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
      <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${Math.min(100, (value / 15) * 100)}%` }}></div>
    </div>
  </div>
);

export default Dashboard;
