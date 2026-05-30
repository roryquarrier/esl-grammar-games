import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { supabase } from '../../lib/supabase'

export function TeacherSync() {
  const { user } = useUser()

  useEffect(() => {
    if (!user) return

    const upsertTeacher = async () => {
      const { error } = await supabase.from('teachers').upsert(
        {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? '',
          display_name:
            user.fullName ?? user.primaryEmailAddress?.emailAddress ?? 'Teacher',
        },
        { onConflict: 'id' },
      )

      if (error) {
        console.error('TeacherSync: failed to upsert teacher', error)
      }
    }

    upsertTeacher()
  }, [user])

  return null
}
