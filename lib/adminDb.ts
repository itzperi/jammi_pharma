import { supabase } from './supabase';

// Generic real-time subscription helper
export const subscribeToCollection = (
    collectionName: string, 
    callback: (data: any[]) => void
) => {
    // Initial fetch
    supabase.from(collectionName).select('*').then(({ data, error }) => {
        if (!error && data) callback(data);
    });

    // Realtime subscription
    const channel = supabase.channel(`public:${collectionName}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: collectionName }, (payload) => {
            // Re-fetch everything on change for simplicity, or we could mutate state
            supabase.from(collectionName).select('*').then(({ data, error }) => {
                if (!error && data) callback(data);
            });
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};

// Generic real-time document subscription helper
export const subscribeToDocument = (
    collectionName: string, 
    id: string,
    callback: (data: any) => void
) => {
    supabase.from(collectionName).select('*').eq('id', id).single().then(({ data, error }) => {
        if (!error && data) callback(data);
        else callback(null);
    });

    const channel = supabase.channel(`public:${collectionName}:${id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: collectionName, filter: `id=eq.${id}` }, (payload) => {
            if (payload.eventType === 'DELETE') {
                 callback(null);
            } else {
                 callback(payload.new);
            }
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};

// Generic CRUD helpers
export const fetchCollection = async (collectionName: string) => {
    const { data, error } = await supabase.from(collectionName).select('*');
    if (error) {
        console.error(`fetchCollection error for ${collectionName}:`, error);
        return [];
    }
    return data || [];
};

export const fetchDocument = async (collectionName: string, id: string) => {
    const { data, error } = await supabase.from(collectionName).select('*').eq('id', id).single();
    if (error) {
        console.error(`fetchDocument error for ${collectionName}/${id}:`, error);
        return null;
    }
    return data;
};

export const createDocument = async (collectionName: string, data: any) => {
    const { data: insertedData, error } = await supabase.from(collectionName).insert([{
        ...data
    }]).select('id').single();
    
    if (error) throw new Error(error.message);
    return insertedData?.id;
};

export const updateDocument = async (collectionName: string, id: string, data: any) => {
    const { error } = await supabase.from(collectionName).update({
        ...data,
        updatedAt: new Date().toISOString()
    }).eq('id', id);
    
    if (error) throw new Error(error.message);
};

export const deleteDocument = async (collectionName: string, id: string) => {
    const { error } = await supabase.from(collectionName).delete().eq('id', id);
    if (error) throw new Error(error.message);
};

// Sequential Order ID Generator - since we use uuids for orders, this logic might need changes
// but we will maintain the API.
export const getNextOrderNumber = async () => {
    // In Supabase, usually you'd use a sequence or RPC for atomic increments.
    // For now, fallback to timestamp for simplicity unless an RPC is created.
    return `Jammi-${Date.now().toString().slice(-6)}`;
};

export const runTransaction = async (updateFunction: (transaction: any) => Promise<any>) => {
    throw new Error("runTransaction is not directly supported in Supabase JS client. Use RPC instead.");
};
