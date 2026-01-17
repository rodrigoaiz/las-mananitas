import { useState, useEffect } from "react";
import {
  getStatistics,
  type Statistics,
  type VoteVersion,
} from "../lib/supabase";

// Número base para prueba social (se suma a los votos reales)
const BASE_VOTES = 10000;
const BASE_DISTRIBUTION = {
  "hoy-por-ser-tu-cumpleaños": 6200,
  "hoy-por-ser-dia-de-tu-santo": 3100,
  "otras-variaciones": 700,
};

const versionLabels: Record<
  VoteVersion,
  { label: string; emoji: string; color: string }
> = {
  "hoy-por-ser-tu-cumpleaños": {
    label: "Hoy por ser tu cumpleaños",
    emoji: "🎂",
    color: "from-blue-500 to-cyan-500",
  },
  "hoy-por-ser-dia-de-tu-santo": {
    label: "Hoy por ser día de tu santo",
    emoji: "🙏",
    color: "from-purple-500 to-pink-500",
  },
  "otras-variaciones": {
    label: "Otras variaciones",
    emoji: "🤷",
    color: "from-orange-500 to-red-500",
  },
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
      console.error("Error fetching statistics:", err);
      setError("Error al cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    const handleVoteSubmitted = () => {
      setTimeout(fetchStats, 1000);
    };

    window.addEventListener("voteSubmitted", handleVoteSubmitted);

    return () => {
      window.removeEventListener("voteSubmitted", handleVoteSubmitted);
    };
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Skeleton Title */}
          <div className="h-16 w-3/4 max-w-md bg-slate-200 animate-pulse mx-auto rounded-3xl mb-4"></div>
          <div className="h-6 w-1/2 max-w-sm bg-slate-100 animate-pulse mx-auto rounded-full mb-16"></div>

          {/* Skeleton Total Votes */}
          <div className="text-center mb-16">
            <div className="h-6 w-32 bg-slate-100 animate-pulse mx-auto rounded-full mb-4"></div>
            <div className="h-24 w-48 bg-slate-200 animate-pulse mx-auto rounded-[2.5rem]"></div>
          </div>

          {/* Skeleton Bars */}
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-white/60 backdrop-blur-md border-2 border-white/40 rounded-3xl animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !stats) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-3xl p-12 shadow-xl shadow-red-100/30">
            <p className="text-4xl mb-4">⚠️</p>
            <p className="text-red-600 text-xl font-bold">
              {error || "No se pudieron cargar las estadísticas"}
            </p>
            <button
              onClick={fetchStats}
              className="mt-6 text-slate-500 hover:text-slate-900 font-bold underline"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </section>
    );
  }

  const sortedVersions = Object.entries(stats.versionCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([version]) => version as VoteVersion);

  // Aplicar número base a las estadísticas
  const displayTotalVotes = stats.totalVotes + BASE_VOTES;
  const displayVersionCounts = Object.fromEntries(
    Object.entries(stats.versionCounts).map(([version, count]) => [
      version,
      count + (BASE_DISTRIBUTION[version as VoteVersion] || 0),
    ]),
  ) as Record<VoteVersion, number>;

  const getPercentage = (count: number) => {
    if (displayTotalVotes === 0) return 0;
    return Math.round((count / displayTotalVotes) * 100);
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
        <div className="text-center mb-20">
          <p className="text-slate-400 text-lg font-bold uppercase tracking-widest mb-2">
            Total de votos registrados
          </p>
          <p className="text-8xl sm:text-9xl font-black bg-gradient-to-r from-pink-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-500">
            {displayTotalVotes.toLocaleString("es-MX")}
          </p>
        </div>

        {/* Results */}
        <div className="space-y-8">
          {sortedVersions.map((version, index) => {
            const realCount = stats.versionCounts[version];
            const count = displayVersionCounts[version];
            const percentage = getPercentage(count);
            const versionInfo = versionLabels[version];
            const isWinner = index === 0 && displayTotalVotes > 0;

            return (
              <div
                key={version}
                className={`
                  relative bg-white/60 backdrop-blur-md border-2 rounded-3xl p-8 overflow-hidden
                  transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl
                  ${
                    isWinner
                      ? "border-yellow-400 shadow-xl shadow-yellow-100/50 scale-[1.03]"
                      : "border-white/40 shadow-lg shadow-slate-200/20"
                  }
                `}
              >
                {/* Winner Crown - Floating corner */}
                {isWinner && (
                  <div className="absolute top-4 right-4 z-20">
                    <span
                      className="text-4xl animate-bounce-slow block drop-shadow-md"
                      title="Ganadora actual"
                    >
                      👑
                    </span>
                  </div>
                )}

                {/* Background bar */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${versionInfo.color} opacity-10 transition-all duration-1000 ease-out`}
                  style={{ width: `${percentage}%` }}
                />

                {/* Content */}
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-6 flex-1">
                    <span className="text-5xl drop-shadow-sm">
                      {versionInfo.emoji}
                    </span>
                    <div className="flex-1">
                      <h3
                        className={`text-2xl font-black mb-1 ${
                          isWinner ? "text-slate-900" : "text-slate-700"
                        }`}
                      >
                        {versionInfo.label}
                      </h3>
                      <p className="text-lg text-slate-500 font-bold">
                        {count.toLocaleString("es-MX")}{" "}
                        {count === 1 ? "voto" : "votos"}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 sm:border-transparent">
                    <p
                      className={`text-6xl sm:text-6xl font-black tracking-tighter ${
                        isWinner ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {percentage}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Fun Facts (Rescued from TopVersions) */}
        <div className="mt-20 grid sm:grid-cols-2 gap-8">
          <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl p-10 text-center shadow-lg hover:shadow-orange-200/20 transition-all duration-500">
            <p className="text-5xl mb-4">😅</p>
            <p className="text-3xl font-black text-orange-500 mb-2">100%</p>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
              Probabilidad de silenciosos incómodos
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl p-10 text-center shadow-lg hover:shadow-blue-200/20 transition-all duration-500">
            <p className="text-5xl mb-4">🎵</p>
            <p className="text-3xl font-black text-blue-500 mb-2">
              {sortedVersions.length}+
            </p>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
              Variaciones en debate
            </p>
          </div>
        </div>

        {/* Sincronización footer info */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm font-medium inline-flex items-center gap-2 px-6 py-2 bg-slate-50 rounded-full border border-slate-100">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            Actualizado automáticamente al votar
          </p>
        </div>
      </div>
    </section>
  );
}
