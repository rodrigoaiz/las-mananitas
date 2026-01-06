import { useState } from 'react';
import { submitVote, type VoteVersion } from '../lib/supabase';

const versionOptions = [
  {
    id: 'hoy-por-ser-tu-cumpleaños' as VoteVersion,
    label: 'Hoy por ser tu cumpleaños',
    emoji: '🎂',
    description: 'La versión clásica de cumpleaños'
  },
  {
    id: 'hoy-por-ser-dia-de-tu-santo' as VoteVersion,
    label: 'Hoy por ser día de tu santo',
    emoji: '🙏',
    description: 'La versión religiosa tradicional'
  },
  {
    id: 'otras-variaciones' as VoteVersion,
    label: 'Otras variaciones / No sé',
    emoji: '🤷',
    description: 'Cuando inventas sobre la marcha'
  }
];

export default function Survey() {
  const [selectedVersion, setSelectedVersion] = useState<VoteVersion | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVersion) {
      setError('Por favor selecciona una versión');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitVote(selectedVersion);
      setHasVoted(true);
      
      // Trigger a custom event to update statistics
      window.dispatchEvent(new CustomEvent('voteSubmitted'));
    } catch (err) {
      console.error('Error submitting vote:', err);
      setError('Hubo un error al enviar tu voto. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasVoted) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur-md border border-green-200 rounded-3xl p-12 text-center shadow-xl shadow-green-100/50 animate-in fade-in duration-500">
            <div className="text-7xl mb-6 animate-bounce">✨</div>
            <h3 className="text-4xl font-black text-slate-900 mb-4">
              ¡Voto registrado!
            </h3>
            <p className="text-slate-600 text-xl font-medium">
              Gracias por ayudarnos a resolver este misterio nacional.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl sm:text-6xl font-black text-center mb-4 text-slate-900 tracking-tight">
          🗳️ ¿Cuál es tu versión?
        </h2>
        <p className="text-center text-slate-500 mb-16 text-xl font-medium">
          Vota por la versión que TÚ cantas (o intentas cantar)
        </p>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid md:grid-cols-3 gap-6">
            {versionOptions.map((option) => (
              <label
                key={option.id}
                className={`
                  relative flex flex-col items-center text-center bg-white/60 backdrop-blur-md border-2 rounded-[2.5rem] p-10 cursor-pointer
                  transition-all duration-500 hover:scale-105 hover:bg-white/80
                  ${selectedVersion === option.id 
                    ? 'border-pink-500 bg-white/90 shadow-2xl shadow-pink-200/40' 
                    : 'border-white/40 hover:border-pink-200 shadow-lg shadow-slate-200/20'
                  }
                `}
              >
                <div className={`
                  absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                  ${selectedVersion === option.id ? 'border-pink-500 bg-pink-500' : 'border-slate-300'}
                `}>
                  {selectedVersion === option.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                
                <input
                  type="radio"
                  name="version"
                  value={option.id}
                  checked={selectedVersion === option.id}
                  onChange={() => setSelectedVersion(option.id)}
                  className="hidden"
                />
                
                <div className="text-7xl mb-6 group-hover:animate-bounce transition-transform">
                  {option.emoji}
                </div>
                
                <h3 className={`text-2xl font-black mb-4 leading-tight transition-colors duration-300 ${selectedVersion === option.id ? 'text-pink-600' : 'text-slate-900'}`}>
                  {option.label}
                </h3>
                
                <p className="text-slate-500 text-lg font-medium">
                  {option.description}
                </p>
              </label>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 text-center font-bold text-lg">
              {error}
            </div>
          )}

          <div className="pt-8">
            <button
              type="submit"
              disabled={isSubmitting || !selectedVersion}
              className={`
                w-full py-6 px-10 rounded-3xl font-black text-2xl transition-all duration-500 tracking-tight
                ${isSubmitting || !selectedVersion
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 text-white hover:scale-105 shadow-2xl shadow-pink-500/30'
                }
              `}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Enviando voto...
                </span>
              ) : (
                '¡Votar ahora!'
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-slate-400 text-base font-medium mt-10">
          Tu voto es anónimo y ayudará a resolver este debate de una vez por todas
        </p>
      </div>
    </section>
  );
}
