import { RealtimeChannel } from '@supabase/supabase-js'
import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function useCMSContent(page: string) {
  const [content, setContent] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const channelRef = useRef<RealtimeChannel | null>(null)

  const fetchContent = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('cms_content')
        .select('*')
        .eq('page', page);

      if (error) {
        console.error('fetchContent error:', error);
      } else if (data) {
        const structured = {};
        data.forEach(row => {
          if (!structured[row.section]) structured[row.section] = {};
          structured[row.section][row.content_key] = row.content_value;
        });
        setContent(structured);
      }
    } catch (err) {
      console.error('fetchContent caught error:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const updateLocalContent = useCallback((pageName, section, contentKey, value) => {
    setContent(prev => {
      const updated = { ...prev };
      if (!updated[section]) updated[section] = {};
      updated[section][contentKey] = value;
      return updated;
    });
  }, []);

  useEffect(() => { 
    fetchContent();

    const channel = supabase.channel(`public:cms_content:${page}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_content', filter: `page=eq.${page}` }, () => {
        fetchContent();
      })
      .subscribe();
    
    channelRef.current = channel;

    return () => { 
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    }
  }, [fetchContent, page]);

  return { content, loading, refetch: fetchContent, updateLocalContent }
}
