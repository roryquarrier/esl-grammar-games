import { supabase } from '../lib/supabase';
import type { QuestionAttempt, Progress } from '../lib/database.types';

export async function recordAttempt(
  studentId: string,
  questionId: string,
  gameId?: string,
  chosenIndex?: number,
  isCorrect?: boolean,
  timeSpentMs?: number,
): Promise<QuestionAttempt> {
  let wrongInRow = 0;

  if (isCorrect === false) {
    const { data: lastAttempt } = await supabase
      .from('question_attempts')
      .select('wrong_in_row')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    wrongInRow = Math.min((lastAttempt?.wrong_in_row ?? 0) + 1, 2);
  }

  const { data, error } = await supabase
    .from('question_attempts')
    .insert({
      student_id: studentId,
      question_id: questionId,
      game_id: gameId ?? null,
      chosen_index: chosenIndex ?? null,
      is_correct: isCorrect ?? false,
      wrong_in_row: wrongInRow,
      time_spent_ms: timeSpentMs ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to record attempt: ${error.message}`);
  if (!data) throw new Error('Failed to record attempt');

  await updateProgressStats(studentId);

  return data;
}

export async function getProgress(studentId: string): Promise<Progress> {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('student_id', studentId)
    .single();

  if (error) throw new Error(`Failed to get progress: ${error.message}`);
  if (!data) throw new Error('Progress not found');

  return data;
}

export async function getClassProgress(teacherId: string): Promise<Progress[]> {
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('id')
    .eq('teacher_id', teacherId);

  if (studentsError) throw studentsError;
  if (!students || students.length === 0) return [];

  const studentIds = students.map((s: { id: string }) => s.id);

  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .in('student_id', studentIds);

  if (error) throw error;
  return data ?? [];
}

export async function updateProgressStats(studentId: string): Promise<void> {
  const { data: attempts, error } = await supabase
    .from('question_attempts')
    .select('*, questions(topic)')
    .eq('student_id', studentId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch attempts: ${error.message}`);

  if (!attempts || attempts.length === 0) {
    const { error: upsertError } = await supabase
      .from('progress')
      .upsert({
        student_id: studentId,
        total_attempts: 0,
        total_correct: 0,
        accuracy: 0,
        current_streak: 0,
        best_streak: 0,
        topic_stats: {},
        weak_topics: [],
        strong_topics: [],
      }, { onConflict: 'student_id' });

    if (upsertError) throw new Error(`Failed to update progress: ${upsertError.message}`);
    return;
  }

  type AttemptWithTopic = QuestionAttempt & { questions?: { topic: string } };

  let totalCorrect = 0;
  let currentStreak = 0;
  let bestStreak = 0;
  const topicStats: Record<string, { attempts: number; correct: number; last_seen: string }> = {};

  for (const raw of attempts) {
    const attempt = raw as AttemptWithTopic;

    if (attempt.is_correct) {
      totalCorrect++;
      currentStreak++;
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }

    const topic = attempt.questions?.topic;
    if (topic) {
      if (!topicStats[topic]) {
        topicStats[topic] = { attempts: 0, correct: 0, last_seen: '' };
      }
      topicStats[topic].attempts++;
      if (attempt.is_correct) {
        topicStats[topic].correct++;
      }
      if (attempt.created_at > topicStats[topic].last_seen) {
        topicStats[topic].last_seen = attempt.created_at;
      }
    }
  }

  const totalAttempts = attempts.length;
  const accuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;

  const weakTopics: string[] = [];
  const strongTopics: string[] = [];

  for (const [topic, stats] of Object.entries(topicStats)) {
    const topicAccuracy = stats.attempts > 0 ? stats.correct / stats.attempts : 0;
    if (stats.attempts >= 3 && topicAccuracy < 0.5) {
      weakTopics.push(topic);
    }
    if (stats.attempts >= 5 && topicAccuracy >= 0.8) {
      strongTopics.push(topic);
    }
  }

  const { error: upsertError } = await supabase
    .from('progress')
    .upsert({
      student_id: studentId,
      total_attempts: totalAttempts,
      total_correct: totalCorrect,
      accuracy,
      current_streak: currentStreak,
      best_streak: bestStreak,
      topic_stats: topicStats,
      weak_topics: weakTopics,
      strong_topics: strongTopics,
    }, { onConflict: 'student_id' });

  if (upsertError) throw new Error(`Failed to update progress: ${upsertError.message}`);
}
