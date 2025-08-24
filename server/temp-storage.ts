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
      const result = await db.execute('SELECT * FROM user_progress WHERE user_id = $1', [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
  }
}

export const tempStorage = new TempDatabaseStorage();