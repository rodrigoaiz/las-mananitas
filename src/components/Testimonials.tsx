import { useState, useEffect } from 'react';
import { getSignatures, type SignatureData } from '../lib/firebase';

interface TestimonialsProps {
  initialLimit?: number;
}

export default function Testimonials({ initialLimit = 6 }: TestimonialsProps) {
  const [signatures, setSignatures] = useState<SignatureData[]>([]);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchSignatures = async (currentLimit: number) => {
    const data = await getSignatures(currentLimit + 1);
    if (data.length <= currentLimit) {
      setHasMore(false);
      setSignatures(data);
    } else {
      setHasMore(true);
      setSignatures(data.slice(0, currentLimit));
    }
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchSignatures(limit);

    const handleSignatureSubmitted = () => {
      setTimeout(() => fetchSignatures(limit), 1000);
    };

    window.addEventListener('signatureSubmitted', handleSignatureSubmitted);
    return () => window.removeEventListener('signatureSubmitted', handleSignatureSubmitted);
  }, [limit]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setLimit(prev => prev + 6);
  };

  if (loading && signatures.length === 0) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-20">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/40 h-48 rounded-3xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (signatures.length === 0) return null;

  return (
    <div className="mt-32">
      <h2 className="text-4xl font-black text-center text-slate-900 mb-12 tracking-tight">
        Voces de la <span className="text-pink-600">Resistencia</span>
      </h2>
      
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {signatures.map((sig) => (
          <div 
            key={sig.id}
            className="bg-white/60 backdrop-blur-md border border-white/40 rounded-[2rem] p-8 shadow-xl shadow-pink-200/5 flex flex-col hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">👤</span>
              <div>
                <p className="font-black text-slate-900 leading-tight">{sig.name}</p>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{sig.country}</p>
              </div>
            </div>
            
            <p className="text-slate-600 font-medium italic flex-1">
              "{sig.reason}"
            </p>
            
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">
                Firmado hace poco
              </p>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-16 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className={`
              px-10 py-4 rounded-2xl font-black text-lg transition-all duration-300 border-2
              ${loadingMore 
                ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-white border-pink-100 text-pink-600 hover:border-pink-500 hover:shadow-xl hover:shadow-pink-100'
              }
            `}
          >
            {loadingMore ? 'Cargando...' : 'Cargar más testimonios'}
          </button>
        </div>
      )}
    </div>
  );
}
