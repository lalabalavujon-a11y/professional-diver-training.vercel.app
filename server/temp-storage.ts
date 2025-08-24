import { db } from "./db";

// Temporary storage class that works with current database structure
export class TempDatabaseStorage {
  async getAllTracks() {
    try {
      const result = await db.execute('SELECT id, title, slug, summary, is_published, created_at FROM tracks WHERE is_published = true ORDER BY title');
      return result.rows;
    } catch (error) {
      console.error('Error fetching tracks:', error);
      throw error;
    }
  }

  async getTrackBySlug(slug: string) {
    try {
      const trackResult = await db.execute(`SELECT id, title, slug, summary, is_published, created_at FROM tracks WHERE slug = $1`, [slug]);
      const track = trackResult.rows[0];
      if (!track) return undefined;

      const lessonsResult = await db.execute(`SELECT id, track_id, title, "order", content, created_at, updated_at FROM lessons WHERE track_id = $1 ORDER BY "order"`, [track.id]);
      
      return {
        ...track,
        lessons: lessonsResult.rows
      };
    } catch (error) {
      console.error('Error fetching track by slug:', error);
      throw error;
    }
  }

  async getLessonById(id: string) {
    try {
      const result = await db.execute(`SELECT id, track_id, title, "order", content, created_at, updated_at FROM lessons WHERE id = $1`, [id]);
      return result.rows[0] || undefined;
    } catch (error) {
      console.error('Error fetching lesson:', error);
      throw error;
    }
  }

  async getQuizByLessonId(lessonId: string) {
    try {
      const quizResult = await db.execute(`SELECT id, lesson_id, title, time_limit FROM quizzes WHERE lesson_id = $1`, [lessonId]);
      const quiz = quizResult.rows[0];
      if (!quiz) return undefined;

      const questionsResult = await db.execute(`SELECT id, quiz_id, prompt, a, b, c, d, answer, "order" FROM questions WHERE quiz_id = $1 ORDER BY "order"`, [quiz.id]);
      
      return {
        ...quiz,
        questions: questionsResult.rows
      };
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  }

  async getAllInvites() {
    try {
      const result = await db.execute('SELECT id, email, token, created_at, expires_at, used_at, created_by_user_id FROM invites ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      console.error('Error fetching invites:', error);
      throw error;
    }
  }

  async getUserProgress(userId: string) {
    try {
      // Since user_progress table may not exist, return empty array for now
      return [];
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
  }

  async getQuizAnalytics() {
    try {
      // Get quiz completion statistics
      const quizStats = await db.execute(`
        SELECT 
          q.id,
          q.title,
          l.title as lesson_title,
          t.title as track_title,
          COUNT(CASE WHEN qa.id IS NOT NULL THEN 1 END) as total_attempts,
          AVG(CASE WHEN qa.score IS NOT NULL THEN qa.score::float END) as avg_score,
          MAX(CASE WHEN qa.score IS NOT NULL THEN qa.score END) as max_score,
          MIN(CASE WHEN qa.score IS NOT NULL THEN qa.score END) as min_score
        FROM quizzes q
        LEFT JOIN lessons l ON q.lesson_id = l.id
        LEFT JOIN tracks t ON l.track_id = t.id
        LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
        GROUP BY q.id, q.title, l.title, t.title
        ORDER BY total_attempts DESC
      `);

      // Get track-level analytics
      const trackStats = await db.execute(`
        SELECT 
          t.id,
          t.title,
          COUNT(DISTINCT l.id) as total_lessons,
          COUNT(DISTINCT q.id) as total_quizzes,
          COUNT(qa.id) as total_attempts,
          AVG(CASE WHEN qa.score IS NOT NULL THEN qa.score::float END) as avg_score
        FROM tracks t
        LEFT JOIN lessons l ON t.id = l.track_id
        LEFT JOIN quizzes q ON l.id = q.lesson_id
        LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
        WHERE t.is_published = true
        GROUP BY t.id, t.title
        ORDER BY total_attempts DESC
      `);

      // Get recent quiz attempts for activity feed
      const recentAttempts = await db.execute(`
        SELECT 
          qa.id,
          qa.score,
          qa.total_questions,
          qa.created_at,
          q.title as quiz_title,
          l.title as lesson_title,
          t.title as track_title
        FROM quiz_attempts qa
        LEFT JOIN quizzes q ON qa.quiz_id = q.id
        LEFT JOIN lessons l ON q.lesson_id = l.id
        LEFT JOIN tracks t ON l.track_id = t.id
        ORDER BY qa.created_at DESC
        LIMIT 20
      `);

      return {
        quizStats: quizStats.rows,
        trackStats: trackStats.rows,
        recentAttempts: recentAttempts.rows
      };
    } catch (error) {
      console.error('Error fetching quiz analytics:', error);
      // Return empty data structure
      return {
        quizStats: [],
        trackStats: [],
        recentAttempts: []
      };
    }
  }
}

export const tempStorage = new TempDatabaseStorage();