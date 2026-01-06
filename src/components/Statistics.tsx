import { useState, useEffect } from 'react';
import { getStatistics, type Statistics, type VoteVersion } from '../lib/firebase';

const versionLabels: Record<VoteVersion, { label: string; emoji: string; color: string }> = {
  'hoy-por-ser-tu-cumpleaños': { 
    label: 'Hoy por ser tu cumpleaños', 
    emoji: '🎂',
    color: 'from-blue-500 to-cyan-500'
  },
  'hoy-por-ser-dia-de-tu-santo': { 
    label: 'Hoy por ser día de tu santo', 
    emoji: '🙏',
    color: 'from-purple-500 to-pink-500'
  },
  'otras-variaciones': { 
    label: 'Otras variaciones', 
    emoji: '🤷',
    color: 'from-orange-500 to-red-500'
  }
};

export default function Statistics() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getStatistics();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Listen for vote submissions to refresh stats
    const handleVoteSubmitted = () => {
      setTimeout(fetchStats, 1000); // Small delay to ensure Firebase has updated
    };

    window.addEventListener('voteSubmitted', handleVoteSubmitted);

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => {
      window.removeEventListener('voteSubmitted', handleVoteSubmitted);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-white/10 rounded-lg w-64 mx-auto mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-white/5 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !stats) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-red-400">{error || 'No se pudieron cargar las estadísticas'}</p>
        </div>
      </section>
    );
  }

  const sortedVersions = Object.entries(stats.versionCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([version]) => version as VoteVersion);

  const getPercentage = (count: number) => {
    if (stats.totalVotes === 0) return 0;
    return Math.round((count / stats.totalVotes) * 100);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-5xl sm:text-6xl font-black text-center mb-4 text-slate-900 tracking-tight">
          📊 Estadísticas en Vivo
        </h2>
        <p className="text-center text-slate-500 mb-16 text-xl font-medium">
          Así va el debate nacional hasta ahora...
        </p>

        {/* Total votes */}
        <div className="text-center mb-16">
          <p className="text-slate-400 text-lg font-bold uppercase tracking-widest mb-2">Total de votos</p>
          <p className="text-8xl font-black bg-gradient-to-r from-pink-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            {stats.totalVotes.toLocaleString()}
          </p>
        </div>

        {/* Results */}
        <div className="space-y-8">
          {sortedVersions.map((version, index) => {
            const count = stats.versionCounts[version];
            const percentage = getPercentage(count);
            const versionInfo = versionLabels[version];
            const isWinner = index === 0 && stats.totalVotes > 0;

            return (
              <div
                key={version}
                className={`
                  relative bg-white/60 backdrop-blur-md border-2 rounded-3xl p-8 overflow-hidden
                  transition-all duration-500 hover:scale-102
                  ${isWinner ? 'border-yellow-400 shadow-xl shadow-yellow-100/50' : 'border-white/40 shadow-lg shadow-slate-200/20'}
                `}
              >
                {/* Background bar */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${versionInfo.color} opacity-10 transition-all duration-1000`}
                  style={{ width: `${percentage}%` }}
                />

                {/* Content */}
                <div className="relative flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6 flex-1">
                    {isWinner && (
                      <span className="text-4xl animate-bounce">👑</span>
                    )}
                    <span className="text-5xl">{versionInfo.emoji}</span>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-slate-900 mb-1">
                        {versionInfo.label}
                      </h3>
                      <p className="text-lg text-slate-500 font-medium">
                        {count.toLocaleString()} {count === 1 ? 'voto' : 'votos'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-black text-slate-900 tracking-tighter">
                      {percentage}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Last updated */}
        {stats.totalVotes > 0 && (
          <p className="text-center text-slate-400 text-base font-medium mt-12">
            Actualizado automáticamente cada 30 segundos
          </p>
        )}

        {/* No votes yet */}
        {stats.totalVotes === 0 && (
          <div className="text-center mt-16 bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl p-12 shadow-xl shadow-slate-200/20">
            <p className="text-4xl mb-4">🤔</p>
            <p className="text-slate-600 text-xl font-medium">
              ¡Sé el primero en votar y empezar el debate!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
