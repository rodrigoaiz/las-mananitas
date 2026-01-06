import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Only initialize if we have a valid URL
export const supabase = (supabaseUrl && supabaseUrl.startsWith('http')) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  console.warn('Supabase is not configured. Using placeholder mode.');
}

// Types
export type VoteVersion =
  | "hoy-por-ser-tu-cumpleaños"
  | "hoy-por-ser-dia-de-tu-santo"
  | "otras-variaciones";

export interface SignatureData {
  id?: string;
  name: string;
  reason: string;
  country: string;
  created_at?: string;
}

export interface Statistics {
  totalVotes: number;
  versionCounts: Record<VoteVersion, number>;
  lastUpdated: string | null;
}

// Submit a vote
export async function submitVote(version: VoteVersion): Promise<void> {
  if (!supabase) {
    console.warn('Cannot submit vote: Supabase is not configured.');
    return;
  }

  const { error } = await supabase
    .from('votes')
    .insert([{ version, user_agent: navigator.userAgent }]);

  if (error) {
    console.error('Error submitting vote:', error);
    throw error;
  }
}

// Get current statistics
export async function getStatistics(): Promise<Statistics | null> {
  if (!supabase) return {
    totalVotes: 0,
    versionCounts: {
      "hoy-por-ser-tu-cumpleaños": 0,
      "hoy-por-ser-dia-de-tu-santo": 0,
      "otras-variaciones": 0,
    },
    lastUpdated: null,
  };

  try {
    const { data, error } = await supabase
      .from('statistics')
      .select('*')
      .eq('id', 'global')
      .single();

    if (error) throw error;

    return {
      totalVotes: data.total_votes,
      versionCounts: data.version_counts,
      lastUpdated: data.updated_at,
    };
  } catch (error) {
    console.error('Error getting statistics:', error);
    return {
      totalVotes: 0,
      versionCounts: {
        "hoy-por-ser-tu-cumpleaños": 0,
        "hoy-por-ser-dia-de-tu-santo": 0,
        "otras-variaciones": 0,
      },
      lastUpdated: null,
    };
  }
}

// Submit a petition signature
export async function submitSignature(data: Omit<SignatureData, 'id' | 'created_at'>): Promise<void> {
  if (!supabase) {
    console.warn('Cannot submit signature: Supabase is not configured.');
    return;
  }

  const { error } = await supabase
    .from('signatures')
    .insert([data]);

  if (error) {
    console.error('Error submitting signature:', error);
    throw error;
  }
}

// Get recent signatures
export async function getSignatures(limitCount: number = 10): Promise<SignatureData[]> {
  const placeholders: SignatureData[] = [
    {
      id: 'placeholder-1',
      name: 'Juan Pérez',
      country: 'MÉXICO',
      reason: 'Porque mi tía siempre empieza con "el día de tu santo" y yo con "tu cumpleaños". ¡Es un caos!',
      created_at: new Date().toISOString()
    },
    {
      id: 'placeholder-2',
      name: 'María García',
      country: 'ESPAÑA',
      reason: 'En España ni sabemos qué es el santo en la canción, ¡ayuda! Queremos una versión universal.',
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'placeholder-3',
      name: 'Carlos Ruiz',
      country: 'MÉXICO',
      reason: 'El tercer verso es un campo de batalla. Necesitamos paz y una sola letra.',
      created_at: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'placeholder-4',
      name: 'Elena Torres',
      country: 'COLOMBIA',
      reason: 'En Colombia también la cantamos y siempre hay alguien que se adelanta al "despierta". ¡Justicia!',
      created_at: new Date(Date.now() - 14400000).toISOString()
    },
    {
      id: 'placeholder-5',
      name: 'Roberto Gómez',
      country: 'MÉXICO',
      reason: 'Mi abuelo la canta en una versión que nadie más conoce. ¡Es hora de estandarizar!',
      created_at: new Date(Date.now() - 28800000).toISOString()
    },
    {
      id: 'placeholder-6',
      name: 'Sofía Martínez',
      country: 'ARGENTINA',
      reason: '¡Queremos una versión estándar para las fiestas internacionales! Saludos desde el sur.',
      created_at: new Date(Date.now() - 43200000).toISOString()
    },
    {
      id: 'placeholder-7',
      name: 'Diego López',
      country: 'MÉXICO',
      reason: 'Ya basta de la confusión entre el Rey David y el cumpleañero. ¡Firmado!',
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  try {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase
      .from('signatures')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limitCount);

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return placeholders.slice(0, limitCount);
    }

    return data.map(sig => ({
      id: sig.id,
      name: sig.name,
      reason: sig.reason,
      country: sig.country,
      created_at: sig.created_at
    }));
  } catch (error) {
    console.error("Error getting signatures, returning placeholders:", error);
    return placeholders.slice(0, limitCount);
  }
}
