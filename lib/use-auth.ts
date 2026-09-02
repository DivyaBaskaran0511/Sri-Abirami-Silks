'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [session, setSession] = useState<{ user: { id: string; email: string } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession({
          user: {
            id: data.session.user.id,
            email: data.session.user.email ?? '',
          },
        });
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (sess) {
        setSession({ user: { id: sess.user.id, email: sess.user.email ?? '' } });
      } else {
        setSession(null);
      }
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { session, loading };
}
