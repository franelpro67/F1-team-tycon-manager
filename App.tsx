
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Market from './components/Market';
import Factory from './components/Factory';
import Engineering from './components/Engineering';
import Sponsors from './components/Sponsors';
import RaceSimulation from './components/RaceSimulation';
import { GameState, TeamState, RaceResult } from './types';
import { INITIAL_FUNDS, AVAILABLE_SPONSORS } from './constants';
import { Users, User, Globe, Copy, Check, Loader2, ArrowLeft } from 'lucide-react';
import * as OnlineService from './services/onlineService';

const createInitialTeam = (id: number, name: string, color: string): TeamState => ({
  id,
  name,
  funds: INITIAL_FUNDS,
  reputation: 10,
  drivers: [],
  activeDriverIds: [],
  activeSponsorIds: [],
  sponsorOffers: [],
  engineers: [],
  car: { aerodynamics: 1, powerUnit: 1, chassis: 1, reliability: 1 },
  color
});

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRacing, setIsRacing] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(() => !localStorage.getItem('f1_tycoon_game_v4'));
  const [onlineMenu, setOnlineMenu] = useState<'none' | 'host' | 'join'>('none');
  const [roomInput, setRoomInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('f1_tycoon_game_v4');
    if (saved) return JSON.parse(saved);
    return {
      mode: 'single',
      teams: [createInitialTeam(0, "Player 1 Team", "red")],
      currentPlayerIndex: 0,
      currentRaceIndex: 0,
      seasonHistory: []
    };
  });

  // Efecto de Sincronización Online
  useEffect(() => {
    if (gameState.mode !== 'online' || !gameState.roomCode) return;

    const interval = setInterval(async () => {
      const remoteState = await OnlineService.fetchGameState(gameState.roomCode!);
      if (remoteState && remoteState.lastUpdateBy !== (gameState.isHost ? 'host' : 'guest')) {
        // Solo actualizamos si el cambio viene del otro jugador
        setGameState(prev => ({
          ...prev,
          teams: remoteState.teams,
          currentRaceIndex: remoteState.currentRaceIndex,
          seasonHistory: remoteState.seasonHistory,
          currentPlayerIndex: remoteState.currentPlayerIndex,
          // Si estamos esperando carrera y el host la inició
          ...(remoteState.status === 'racing' && !isRacing ? { status: 'racing' } : {})
        }));

        if (remoteState.status === 'racing' && !isRacing) {
          setIsRacing(true);
        }
      }
    }, 3000); // Polling cada 3s

    return () => clearInterval(interval);
  }, [gameState.mode, gameState.roomCode, gameState.isHost, isRacing]);

  const syncToCloud = useCallback(async (newState: GameState, extra = {}) => {
    if (newState.mode === 'online' && newState.roomCode) {
      await OnlineService.syncGameState(newState.roomCode, {
        teams: newState.teams,
        currentRaceIndex: newState.currentRaceIndex,
        seasonHistory: newState.seasonHistory,
        currentPlayerIndex: newState.currentPlayerIndex,
        lastUpdateBy: newState.isHost ? 'host' : 'guest',
        ...extra
      });
    }
  }, []);

  const handleStartGame = (mode: 'single' | 'versus' | 'online') => {
    if (mode === 'online') {
      setOnlineMenu('host');
    } else {
      const teams = mode === 'single' 
        ? [createInitialTeam(0, "My Team", "red")]
        : [createInitialTeam(0, "Player 1", "red"), createInitialTeam(1, "Player 2", "cyan")];
      
      const newState: GameState = {
        mode,
        teams,
        currentPlayerIndex: 0,
        currentRaceIndex: 0,
        seasonHistory: []
      };
      setGameState(newState);
      setShowModeSelector(false);
    }
  };

  const handleCreateRoom = async () => {
    setIsSyncing(true);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newState: GameState = {
      mode: 'online',
      roomCode: code,
      isHost: true,
      teams: [createInitialTeam(0, "Host Team", "red"), createInitialTeam(1, "Waiting...", "cyan")],
      currentPlayerIndex: 0,
      currentRaceIndex: 0,
      seasonHistory: []
    };
    await OnlineService.syncGameState(code, { ...newState, lastUpdateBy: 'host', status: 'lobby' });
    setGameState(newState);
    setOnlineMenu('none');
    setShowModeSelector(false);
    setIsSyncing(false);
  };

  const handleJoinRoom = async () => {
    if (!roomInput) return;
    setIsSyncing(true);
    const remote = await OnlineService.fetchGameState(roomInput.toUpperCase());
    if (remote) {
      const newState: GameState = {
        mode: 'online',
        roomCode: roomInput.toUpperCase(),
        isHost: false,
        teams: remote.teams,
        currentPlayerIndex: remote.currentPlayerIndex,
        currentRaceIndex: remote.currentRaceIndex,
        seasonHistory: remote.seasonHistory
      };
      // Al unirse, el jugador 2 actualiza su nombre de equipo
      newState.teams[1].name = "Guest Team";
      await OnlineService.syncGameState(roomInput.toUpperCase(), { ...newState, lastUpdateBy: 'guest', status: 'ready' });
      setGameState(newState);
      setOnlineMenu('none');
      setShowModeSelector(false);
    } else {
      alert("Sala no encontrada");
    }
    setIsSyncing(false);
  };

  const handleEndTurn = async () => {
    const isMyTurn = (gameState.mode !== 'online') || 
                   (gameState.isHost && gameState.currentPlayerIndex === 0) || 
                   (!gameState.isHost && gameState.currentPlayerIndex === 1);

    if (!isMyTurn) return;

    if (gameState.mode === 'online') {
      const nextIndex = (gameState.currentPlayerIndex + 1) % 2;
      const newState = { ...gameState, currentPlayerIndex: nextIndex };
      setGameState(newState);
      
      if (nextIndex === 0) {
        // Si vuelve al host, es hora de correr
        await syncToCloud(newState, { status: 'racing' });
        setIsRacing(true);
      } else {
        await syncToCloud(newState, { status: 'waiting_guest' });
        setActiveTab('dashboard');
      }
    } else if (gameState.mode === 'versus') {
      const nextIndex = (gameState.currentPlayerIndex + 1) % gameState.teams.length;
      if (nextIndex === 0) setIsRacing(true);
      else {
        setGameState(prev => ({ ...prev, currentPlayerIndex: nextIndex }));
        setActiveTab('dashboard');
      }
    } else {
      setIsRacing(true);
    }
  };

  const handleFinishRace = async (result: RaceResult) => {
    setIsRacing(false);
    const updatedState = { ...gameState };
    
    // Repartir fondos
    updatedState.teams = updatedState.teams.map(team => {
      const teamRes = result.teamResults.find(r => r.teamId === team.id);
      const bestPos = teamRes ? Math.min(teamRes.driver1Position, teamRes.driver2Position) : 20;
      const activeSponsors = AVAILABLE_SPONSORS.filter(s => team.activeSponsorIds.includes(s.id));
      const sponsorPayout = activeSponsors.reduce((sum, s) => bestPos <= s.targetPosition ? sum + s.payoutPerRace : sum, 0);
      return {
        ...team,
        funds: team.funds + (21 - bestPos) * 300000 + sponsorPayout + 2000000,
        reputation: Math.min(100, team.reputation + Math.max(0, 10 - bestPos))
      };
    });

    updatedState.seasonHistory = [...updatedState.seasonHistory, result];
    updatedState.currentRaceIndex += 1;
    updatedState.currentPlayerIndex = 0;

    setGameState(updatedState);
    if (gameState.mode === 'online') {
      await syncToCloud(updatedState, { status: 'lobby' });
    }
    setActiveTab('season');
  };

  const currentTeam = gameState.teams[gameState.currentPlayerIndex];
  const isMyTurn = gameState.mode !== 'online' || 
                 (gameState.isHost && gameState.currentPlayerIndex === 0) || 
                 (!gameState.isHost && gameState.currentPlayerIndex === 1);

  if (showModeSelector) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-7xl font-f1 font-bold text-red-600 italic tracking-tighter">F1 TYCOON</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Select Your Management Style</p>
        </div>

        {onlineMenu === 'none' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
            <ModeCard onClick={() => handleStartGame('single')} icon={<User size={40} />} title="SOLO CAREER" desc="Classic experience against the AI." />
            <ModeCard onClick={() => handleStartGame('versus')} icon={<Users size={40} />} title="LOCAL DUEL" desc="Two players on the same device." />
            <ModeCard onClick={() => setOnlineMenu('host')} icon={<Globe size={40} />} title="ONLINE VERSUS" desc="Race against a friend via room code." accent="border-blue-500 hover:border-blue-400" />
          </div>
        ) : (
          <div className="bg-slate-900 p-10 rounded-3xl border-2 border-slate-800 w-full max-w-md space-y-8 animate-in zoom-in">
             <button onClick={() => setOnlineMenu('none')} className="text-slate-500 flex items-center gap-2 hover:text-white transition-colors"><ArrowLeft size={16} /> Volver</button>
             <div className="space-y-4">
                <h2 className="text-2xl font-f1 font-bold">Online Lobby</h2>
                <p className="text-slate-400 text-sm">Create a room or enter your friend's code.</p>
             </div>
             <div className="space-y-4">
                <button onClick={handleCreateRoom} disabled={isSyncing} className="w-full py-4 bg-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-all">
                  {isSyncing ? <Loader2 className="animate-spin" /> : <Globe size={20} />} CREATE NEW ROOM
                </button>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">#</div>
                  <input type="text" value={roomInput} onChange={e => setRoomInput(e.target.value.toUpperCase())} maxLength={6} placeholder="ENTER CODE" className="w-full bg-slate-950 border border-slate-700 py-4 pl-8 rounded-xl font-f1 text-center outline-none focus:border-blue-500 transition-all uppercase" />
                </div>
                <button onClick={handleJoinRoom} disabled={isSyncing || !roomInput} className="w-full py-4 bg-slate-800 rounded-xl font-bold border border-slate-700 hover:bg-slate-700 transition-all disabled:opacity-50">
                  JOIN ROOM
                </button>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex transition-colors duration-500 ${currentTeam.color === 'cyan' ? 'selection:bg-cyan-500' : 'selection:bg-red-500'}`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} teamColor={currentTeam.color} onReset={() => setShowModeSelector(true)} />
      
      <main className="ml-64 flex-1 p-8 overflow-y-auto">
        {gameState.mode === 'online' && (
          <div className="mb-6 flex justify-between items-center bg-blue-900/20 border border-blue-500/30 p-4 rounded-2xl">
            <div className="flex items-center gap-4">
               <div className="p-2 bg-blue-500 rounded-lg text-white font-f1 text-xs">ROOM: {gameState.roomCode}</div>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                 {isMyTurn ? <span className="text-green-400">YOUR TURN</span> : <span className="text-yellow-500">WAITING FOR RIVAL...</span>}
               </p>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-bold text-slate-500 uppercase">Synced</span>
            </div>
          </div>
        )}

        {!isMyTurn && gameState.mode === 'online' && (
          <div className="fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-[2px] cursor-not-allowed flex items-center justify-center">
             <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl flex items-center gap-4">
                <Loader2 className="animate-spin text-blue-500" />
                <p className="font-f1 text-sm uppercase">Opponent is making moves...</p>
             </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto pb-20">
          {activeTab === 'dashboard' && (
            <Dashboard 
              team={currentTeam} 
              onRaceStart={handleEndTurn} 
              onRenameTeam={(n) => setGameState(prev => ({...prev, teams: prev.teams.map((t, i) => i === prev.currentPlayerIndex ? {...t, name: n} : t)}))}
              onToggleActive={(id) => setGameState(prev => ({...prev, teams: prev.teams.map((t, i) => i === prev.currentPlayerIndex ? {...t, activeDriverIds: t.activeDriverIds.includes(id) ? t.activeDriverIds.filter(x => x !== id) : (t.activeDriverIds.length < 2 ? [...t.activeDriverIds, id] : t.activeDriverIds)} : t)}))}
              onResetSeason={() => {}}
              isVersus={gameState.mode !== 'single'}
            />
          )}
          {/* Otros componentes: Market, Factory, etc. Se mantienen con la lógica de turno actual */}
          {activeTab === 'market' && <Market team={currentTeam} onHireDriver={d => setGameState(prev => ({...prev, teams: prev.teams.map((t, i) => i === prev.currentPlayerIndex ? {...t, funds: t.funds - d.cost, drivers: [...t.drivers, d], activeDriverIds: t.activeDriverIds.length < 2 ? [...t.activeDriverIds, d.id] : t.activeDriverIds} : t)}))} onSellDriver={id => setGameState(prev => ({...prev, teams: prev.teams.map((t, i) => i === prev.currentPlayerIndex ? {...t, funds: t.funds + (t.drivers.find(x => x.id === id)?.cost || 0)*0.5, drivers: t.drivers.filter(x => x.id !== id), activeDriverIds: t.activeDriverIds.filter(x => x !== id)} : t)}))} />}
          {activeTab === 'engineering' && <Engineering team={currentTeam} onHireEngineer={e => setGameState(prev => ({...prev, teams: prev.teams.map((t, i) => i === prev.currentPlayerIndex ? {...t, funds: t.funds - e.cost, engineers: [...t.engineers, e]} : t)}))} onFireEngineer={id => setGameState(prev => ({...prev, teams: prev.teams.map((t, i) => i === prev.currentPlayerIndex ? {...t, engineers: t.engineers.filter(x => x.id !== id)} : t)}))} />}
          {activeTab === 'factory' && <Factory team={currentTeam} onUpgrade={(p, c) => setGameState(prev => ({...prev, teams: prev.teams.map((t, i) => i === prev.currentPlayerIndex ? {...t, funds: t.funds - c, car: {...t.car, [p]: t.car[p] + 1}} : t)}))} />}
          {activeTab === 'season' && (
             <div className="space-y-6">
               <h2 className="text-3xl font-f1 font-bold">Season Progress</h2>
               <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                 <table className="w-full text-left">
                   <thead className="bg-slate-900/80">
                     <tr className="text-slate-400 text-xs font-bold uppercase">
                       <th className="px-6 py-4">Race</th>
                       {gameState.teams.map(t => (
                         <th key={t.id} className={`px-6 py-4 ${t.color === 'cyan' ? 'text-cyan-400' : 'text-red-500'}`}>{t.name}</th>
                       ))}
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-700">
                     {gameState.seasonHistory.map((race, i) => (
                       <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                         <td className="px-6 py-4 font-bold">{race.raceName}</td>
                         {gameState.teams.map(t => {
                           const res = race.teamResults.find(r => r.teamId === t.id);
                           return <td key={t.id} className="px-6 py-4 font-f1 text-sm">P{res?.driver1Position} / P{res?.driver2Position} <span className="text-green-500 ml-2">+{res?.points}</span></td>;
                         })}
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
          )}
        </div>
      </main>

      {isRacing && (
        <RaceSimulation 
          teams={gameState.teams} 
          currentRaceIndex={gameState.currentRaceIndex}
          onFinish={handleFinishRace}
          isHost={gameState.isHost || gameState.mode !== 'online'}
          roomCode={gameState.roomCode}
        />
      )}
    </div>
  );
};

const ModeCard = ({ onClick, icon, title, desc, accent = "border-slate-800 hover:border-red-500" }: any) => (
  <button onClick={onClick} className={`group bg-slate-900 border-2 ${accent} p-10 rounded-3xl transition-all hover:-translate-y-2 flex flex-col items-center text-center space-y-6 shadow-2xl`}>
    <div className="p-6 bg-slate-800 rounded-2xl group-hover:bg-opacity-50 transition-colors">{icon}</div>
    <div>
      <h2 className="text-2xl font-f1 font-bold mb-2">{title}</h2>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  </button>
);

export default App;
