import { useState } from 'react';
import { submitSignature } from '../lib/supabase';

export default function PetitionForm() {
  const [formData, setFormData] = useState({
    name: '',
    reason: '',
    country: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.reason || !formData.country) {
      setError('Por favor completa todos los campos');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitSignature(formData);
      setIsSuccess(true);
      // Trigger event to refresh testimonials
      window.dispatchEvent(new CustomEvent('signatureSubmitted'));
    } catch (err) {
      console.error('Error submitting signature:', err);
      setError('Hubo un error al firmar. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white/80 backdrop-blur-md border border-green-200 rounded-[3rem] p-12 text-center shadow-xl shadow-green-100/50 animate-in fade-in duration-500">
        <div className="text-7xl mb-6 animate-bounce">✍️✨</div>
        <h3 className="text-4xl font-black text-slate-900 mb-4">
          ¡Petición Firmada!
        </h3>
        <p className="text-slate-600 text-xl font-medium">
          Tu firma ha sido registrada. Gracias por unirte a esta causa nacional.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="mt-8 text-pink-600 font-bold hover:underline"
        >
          Firmar otra vez (si tienes otro trauma)
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-md border-2 border-white/40 rounded-[3rem] p-10 sm:p-16 shadow-2xl shadow-pink-200/10">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-slate-900 font-black text-xl mb-4">Nombre Completo</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Tu nombre aquí..."
            className="w-full bg-white/80 border-2 border-slate-100 rounded-2xl px-6 py-4 text-lg font-medium focus:border-pink-500 focus:outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-slate-900 font-black text-xl mb-4">País</label>
          <input 
            type="text" 
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            placeholder="¿Desde dónde nos escribes? (ej. México, España...)"
            className="w-full bg-white/80 border-2 border-slate-100 rounded-2xl px-6 py-4 text-lg font-medium focus:border-pink-500 focus:outline-none transition-colors"
            required
          />
        </div>
        
        <div>
          <label className="block text-slate-900 font-black text-xl mb-4">¿Por qué quieres estandarizarla?</label>
          <textarea 
            rows={4}
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Cuéntanos tu trauma en los cumpleaños..."
            className="w-full bg-white/80 border-2 border-slate-100 rounded-2xl px-6 py-4 text-lg font-medium focus:border-pink-500 focus:outline-none transition-colors"
            required
          ></textarea>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 text-center font-bold">
            {error}
          </div>
        )}

        <button 
          type="submit"
          disabled={isSubmitting}
          className={`
            w-full py-6 rounded-2xl font-black text-2xl transition-all duration-300 shadow-xl
            ${isSubmitting 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 text-white hover:scale-105 shadow-pink-500/20'
            }
          `}
        >
          {isSubmitting ? 'Firmando...' : 'Firmar Petición'}
        </button>
      </form>
    </div>
  );
}
