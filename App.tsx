
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AGENCIES } from './constants';
import { IntelligenceSource, CrimeReport } from './types';
import { fetchIntelligenceData } from './services/geminiService';
import AuthGateway from './components/AuthGateway';
import { 
  Eye, 
  Search, 
  Terminal, 
  AlertTriangle, 
  Globe, 
  Lock, 
  Activity,
  ChevronRight,
  ExternalLink,
  Loader2,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Cpu,
  Bug,
  User
} from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<{name: string, email: string} | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<IntelligenceSource>(AGENCIES[0]);
  const [query, setQuery] = useState('');
  const [report, setReport] = useState<CrimeReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Security States
  const [integrityScore, setIntegrityScore] = useState(100);
  const [securityStatus, setSecurityStatus] = useState<'stable' | 'scanning' | 'neutralizing' | 'fixed'>('stable');
  const [threatCount, setThreatCount] = useState(0);
  const securityIntervalRef = useRef<number | null>(null);

  const addLog = (msg: string, type: 'info' | 'warn' | 'success' | 'danger' = 'info') => {
    const prefix = type === 'warn' ? '⚠️ ' : type === 'success' ? '✅ ' : type === 'danger' ? '🔥 ' : '» ';
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${prefix}${msg}`, ...prev].slice(0, 15));
  };

  // Malware Auto-Fix Simulation Logic
  const triggerAutoFix = useCallback(() => {
    setSecurityStatus('neutralizing');
    addLog('MALWARE DETECTED: Corrupted data packets in intelligence stream.', 'danger');
    addLog('INITIATING BOGI AUTO-FIX PROTOCOL...', 'warn');
    
    let fixProgress = 0;
    const interval = window.setInterval(() => {
      fixProgress += 10;
      if (fixProgress >= 100) {
        clearInterval(interval);
        setSecurityStatus('fixed');
        setIntegrityScore(100);
        setThreatCount(0);
        addLog('AUTO-FIX COMPLETE: System integrity restored to 100%.', 'success');
        addLog('MALWARE REMOVED: 0 threats remaining.', 'success');
        setTimeout(() => setSecurityStatus('stable'), 3000);
      }
    }, 300);
  }, []);

  // Background "High Protection" Scanner
  useEffect(() => {
    if (isAuthenticated) {
      securityIntervalRef.current = window.setInterval(() => {
        // Randomly simulate a threat every 45-60 seconds
        if (Math.random() > 0.85 && securityStatus === 'stable') {
          setIntegrityScore(prev => Math.max(prev - Math.floor(Math.random() * 15 + 5), 70));
          setThreatCount(prev => prev + 1);
          triggerAutoFix();
        }
      }, 15000);
    }
    return () => {
      if (securityIntervalRef.current) clearInterval(securityIntervalRef.current);
    };
  }, [isAuthenticated, securityStatus, triggerAutoFix]);

  const handleSearch = useCallback(async (searchQuery?: string) => {
    const finalQuery = searchQuery || query || `Current Most Wanted List for ${selectedAgency.name}`;
    setLoading(true);
    setError(null);
    addLog(`BOGI eye scanning: ${finalQuery}`);
    
    // Simulate pre-search security sweep
    addLog('Pre-search malware scan active...', 'info');
    
    try {
      const data = await fetchIntelligenceData(finalQuery);
      setReport(data);
      addLog(`Intel gathered. Validated ${data.sources.length} sources.`, 'success');
    } catch (err) {
      setError("Search blocked. Data encrypted or server unreachable.");
      addLog(`ACCESS DENIED: Surveillance node timeout.`, 'danger');
    } finally {
      setLoading(false);
    }
  }, [query, selectedAgency]);

  useEffect(() => {
    if (isAuthenticated) {
      handleSearch(`High profile fugitives and public criminal list for ${selectedAgency.name}`);
      addLog(`AUTHENTICATED SESSION: ${userProfile?.email}`, 'info');
      addLog('BOGI HIGH PROTECTION: ENABLED', 'success');
    }
  }, [selectedAgency, isAuthenticated, handleSearch, userProfile]);

  const handleLogin = (user: {name: string, email: string}) => {
    setUserProfile(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setReport(null);
    setUserProfile(null);
  };

  if (!isAuthenticated) {
    return <AuthGateway onVerified={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
      {/* Sidebar - Agency Navigator */}
      <aside className="w-80 flex flex-col border-r border-slate-800 bg-slate-900/50">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Eye className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-widest text-white italic">BOGI</h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2 italic">Intelligence Nodes</div>
          {AGENCIES.map((agency) => (
            <button
              key={agency.id}
              onClick={() => setSelectedAgency(agency)}
              className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 group ${
                selectedAgency.id === agency.id 
                ? 'bg-blue-600/20 border border-blue-500/50 text-blue-100 shadow-inner' 
                : 'hover:bg-slate-800 border border-transparent text-slate-400'
              }`}
            >
              <span className="text-2xl">{agency.logo}</span>
              <div className="flex-1">
                <div className="font-bold text-sm uppercase tracking-tight">{agency.name}</div>
                <div className="text-[10px] opacity-60 truncate font-medium">{agency.region}</div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${selectedAgency.id === agency.id ? 'translate-x-1' : 'opacity-0'}`} />
            </button>
          ))}
        </nav>

        {/* Security Terminal Section */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className={`w-3 h-3 ${securityStatus === 'stable' ? 'text-green-500' : 'text-yellow-500'}`} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BOGI Defense</span>
            </div>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
              securityStatus === 'neutralizing' ? 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse' : 'bg-green-500/10 border-green-500/30 text-green-500'
            }`}>
              {securityStatus.toUpperCase()}
            </span>
          </div>
          <div className="space-y-3">
             <div className="bg-black/40 p-2.5 rounded-lg border border-slate-800/50">
                <div className="flex justify-between text-[9px] text-slate-500 font-bold mb-1.5">
                  <span>INTEGRITY</span>
                  <span className={integrityScore < 90 ? 'text-red-400' : 'text-blue-400'}>{integrityScore}%</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${integrityScore < 90 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-blue-500'}`} 
                    style={{ width: `${integrityScore}%` }}
                  />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/40 p-2 rounded-lg border border-slate-800/50 text-center">
                  <div className="text-[8px] text-slate-500 font-bold uppercase mb-0.5">Threats</div>
                  <div className={`text-xs font-black ${threatCount > 0 ? 'text-red-500' : 'text-slate-300'}`}>{threatCount}</div>
                </div>
                <div className="bg-black/40 p-2 rounded-lg border border-slate-800/50 text-center">
                  <div className="text-[8px] text-slate-500 font-bold uppercase mb-0.5">Fixed</div>
                  <div className="text-xs font-black text-green-500">Auto</div>
                </div>
             </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="p-4 bg-black/40 border-t border-slate-800 h-40 overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Watcher Stream</span>
          </div>
          <div className="mono text-[9px] space-y-1 opacity-70 custom-scrollbar overflow-y-auto max-h-32">
            {logs.map((log, i) => (
              <div key={i} className="break-words border-b border-white/5 pb-1">
                {log}
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-800">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-lg text-xs font-black tracking-widest uppercase transition-all"
           >
             <LogOut className="w-3 h-3" /> Terminate Session
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Global Security Overlay for Neutralizing */}
        {securityStatus === 'neutralizing' && (
          <div className="absolute inset-0 z-50 bg-red-950/20 backdrop-blur-[2px] pointer-events-none border-4 border-red-500/30 animate-pulse" />
        )}

        {/* Header / Search Bar */}
        <header className="h-20 border-b border-slate-800 flex items-center px-8 gap-6 bg-slate-900/40 backdrop-blur-xl z-20">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder={`BOGI is watching ${selectedAgency.name}...`}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2.5 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600 text-sm font-medium"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end mr-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Operator</span>
              <div className="flex items-center gap-1.5">
                <User className="w-2.5 h-2.5 text-blue-400" />
                <span className="text-[10px] font-bold text-blue-400 truncate max-w-[120px]">{userProfile?.name}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-md group relative cursor-help">
              <ShieldCheck className="w-3 h-3 text-green-500" />
              <span className="text-[10px] font-black text-green-400 tracking-widest uppercase">High Protection</span>
              <div className="absolute top-full right-0 mt-2 p-2 bg-slate-900 border border-slate-800 rounded shadow-xl hidden group-hover:block w-48 text-[9px] text-slate-400 z-50">
                <div className="font-black text-blue-400 mb-1">SENTINEL SHIELD v4.0</div>
                • Auto-Fix Malware Active<br/>
                • Real-time Virus Neutralization<br/>
                • Encrypted Intel Tunnels
              </div>
            </div>

            <div className="h-8 w-[1px] bg-slate-800" />
            <div className="flex gap-2">
               <button 
                onClick={() => {
                  addLog('MANUAL SECURITY AUDIT INITIATED', 'warn');
                  setSecurityStatus('scanning');
                  setTimeout(() => setSecurityStatus('stable'), 2000);
                }}
                className="p-2 hover:bg-slate-800 rounded-lg text-blue-400 transition-colors tooltip"
                title="Security Audit"
               >
                 <Zap className={`w-5 h-5 ${securityStatus === 'scanning' ? 'animate-spin' : ''}`} />
               </button>
               <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><Globe className="w-5 h-5" /></button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(30,41,59,0.2),transparent)]">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* System Status Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Cpu className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Process Node</div>
                  <div className="text-sm font-black text-white italic">SENTINEL-X</div>
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Antivirus</div>
                  <div className="text-sm font-black text-green-400 italic">AUTO-FIX ON</div>
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                <div className="bg-red-500/10 p-2 rounded-lg">
                  <Bug className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Threat Level</div>
                  <div className="text-sm font-black text-slate-300 italic">LOW (SECURED)</div>
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                <div className="bg-yellow-500/10 p-2 rounded-lg">
                  <Activity className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sync Health</div>
                  <div className="text-sm font-black text-slate-300 italic">99.9% LIVE</div>
                </div>
              </div>
            </div>

            {/* Agency Banner */}
            <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-10 group transition-all hover:border-blue-500/30">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] -z-10 group-hover:bg-blue-600/10 transition-all duration-500" />
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="w-36 h-36 flex items-center justify-center bg-slate-950 border border-slate-800 rounded-[2.5rem] text-7xl shadow-2xl group-hover:scale-105 transition-transform">
                  {selectedAgency.logo}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-4xl font-black text-white tracking-tight">{selectedAgency.fullName}</h2>
                  <p className="text-slate-400 mt-3 leading-relaxed max-w-2xl font-medium">{selectedAgency.description}</p>
                  <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                    <span className="px-4 py-1.5 bg-slate-950 border border-slate-800 rounded-full text-[10px] font-black tracking-widest text-slate-300 flex items-center gap-2 uppercase">
                      <Globe className="w-3 h-3 text-blue-500" /> {selectedAgency.region}
                    </span>
                    <span className="px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-full text-[10px] font-black tracking-widest text-blue-400 flex items-center gap-2 uppercase">
                      <Activity className="w-3 h-3 animate-pulse" /> Live Tracking
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
              {/* Main Intelligence Report */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden min-h-[550px] shadow-xl backdrop-blur-sm relative">
                  {/* Local Scanning Effect */}
                  {securityStatus === 'scanning' && (
                    <div className="absolute inset-0 bg-blue-500/5 z-10 flex items-center justify-center backdrop-blur-[1px]">
                       <div className="text-center">
                         <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-2" />
                         <span className="text-xs font-black text-blue-400 uppercase tracking-widest">SCANNING DATA NODE...</span>
                       </div>
                    </div>
                  )}

                  <div className="px-8 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                    <div className="flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase">
                      <Eye className="w-4 h-4 text-blue-500" />
                      Intel Feed
                    </div>
                    {report && <span className="text-[10px] text-slate-500 mono font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800">{report.timestamp}</span>}
                  </div>

                  <div className="p-8">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-28 text-slate-500">
                        <div className="relative mb-6">
                           <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
                           <Eye className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400" />
                        </div>
                        <p className="mono animate-pulse text-sm font-bold tracking-widest">INTERROGATING DATABASE NODES...</p>
                      </div>
                    ) : error ? (
                      <div className="flex flex-col items-center justify-center py-24 text-red-500 border border-red-500/20 bg-red-500/5 rounded-2xl">
                        <AlertTriangle className="w-16 h-16 mb-6 animate-bounce" />
                        <p className="text-xl font-black tracking-tighter uppercase">Connection Terminated</p>
                        <p className="text-xs mt-2 opacity-70 mono">{error}</p>
                      </div>
                    ) : report ? (
                      <div className="prose prose-invert prose-blue max-w-none">
                        <div className="bg-blue-500/5 p-6 rounded-2xl border border-blue-500/10 mb-8 shadow-inner relative group">
                           <div className="absolute top-2 right-2 flex gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                              <ShieldCheck className="w-3 h-3 text-green-500" />
                              <span className="text-[8px] font-black text-green-500">SECURE FEED</span>
                           </div>
                           <p className="text-sm md:text-base leading-relaxed whitespace-pre-line text-slate-300 font-medium">
                             {report.summary}
                           </p>
                        </div>
                        
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <ExternalLink className="w-3 h-3 text-blue-500" /> Source Validation Matrix
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {report.sources.map((src, i) => (
                              <a 
                                key={i} 
                                href={src.web?.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-4 bg-slate-950 border border-slate-800 hover:border-blue-500/50 rounded-xl flex items-center justify-between group transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.1)]"
                              >
                                <div className="flex flex-col overflow-hidden">
                                  <span className="text-[9px] text-blue-500 font-black tracking-tighter mb-1 uppercase">Node {i + 1}</span>
                                  <span className="text-xs text-slate-200 font-bold truncate group-hover:text-blue-400 transition-colors">{src.web?.title || 'Classified Intelligence Source'}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-500" />
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-28 text-slate-600">
                        <Eye className="w-20 h-20 mb-6 opacity-10 animate-pulse" />
                        <p className="text-center text-sm font-bold tracking-widest uppercase opacity-40">BOGI waiting for target selection...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Widgets */}
              <div className="space-y-8">
                {/* Watcher Status */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
                   <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] tracking-widest uppercase mb-6">
                     <Activity className="w-4 h-4 text-blue-500" />
                     Watcher Status
                   </div>
                   <div className="space-y-6">
                     <div className="space-y-2">
                       <div className="flex justify-between text-[10px] text-slate-500 font-black tracking-tighter">
                         <span>CPU LOAD</span>
                         <span className="text-blue-400">42.8%</span>
                       </div>
                       <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                         <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: '42%' }}></div>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <div className="flex justify-between text-[10px] text-slate-500 font-black tracking-tighter">
                         <span>NODE SYNC</span>
                         <span className="text-green-400">99.2%</span>
                       </div>
                       <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                         <div className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" style={{ width: '99%' }}></div>
                       </div>
                     </div>
                   </div>
                </div>

                {/* Priority Alerts */}
                <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-[40px] -z-10" />
                   <div className="flex items-center gap-2 text-red-400 font-black text-[10px] tracking-widest uppercase mb-6">
                     <AlertTriangle className="w-4 h-4" />
                     Priority Alerts
                   </div>
                   <div className="space-y-4">
                     {[
                       { title: "Protocol Breach", agency: "EUROPOL", time: "2h" },
                       { title: "Target Disappeared", agency: "INTERPOL", time: "5h" },
                       { title: "Asset Alert", agency: "CIA", time: "8h" }
                     ].map((alert, idx) => (
                       <div key={idx} className="border-l-2 border-red-500 pl-4 py-2 bg-red-500/5 rounded-r-lg group hover:bg-red-500/10 transition-colors cursor-default">
                         <div className="text-xs font-black text-red-200 tracking-tight group-hover:text-white transition-colors uppercase">{alert.title}</div>
                         <div className="flex justify-between text-[9px] text-red-500/60 font-black uppercase mt-1">
                           <span>{alert.agency}</span>
                           <span>{alert.time} ago</span>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>

                {/* Protection Status Widget */}
                <div className="p-6 bg-blue-950/30 border border-blue-500/20 rounded-2xl text-center shadow-lg group hover:border-blue-500/40 transition-all relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] ${securityStatus === 'stable' ? 'opacity-100' : 'opacity-20'}`} />
                  <div className="relative inline-block mb-4">
                    <ShieldAlert className={`w-10 h-10 ${securityStatus === 'neutralizing' ? 'text-red-500 animate-bounce' : 'text-blue-500'} mx-auto`} />
                    <Eye className="w-4 h-4 text-blue-400 absolute bottom-0 right-0 bg-slate-950 rounded-full p-0.5" />
                  </div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">High Protection Active</p>
                  <p className="text-[9px] text-slate-500 mt-2 uppercase font-bold italic opacity-60">Malware & Virus Auto-Fix is engaged. System scanning every 15s. All threats will be neutralized automatically.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
