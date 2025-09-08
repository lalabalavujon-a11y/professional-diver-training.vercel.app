import { db } from "./db";
import { tracks, lessons, quizzes, questions, invites, clients, users, aiTutors } from "@shared/schema-sqlite";
import { eq, sql } from "drizzle-orm";

// Temporary storage class that works with current database structure
export class TempDatabaseStorage {
  async getAllTracks() {
    try {
      const result = await db.select({
        id: tracks.id,
        title: tracks.title,
        slug: tracks.slug,
        summary: tracks.summary,
        isPublished: tracks.isPublished,
        createdAt: tracks.createdAt,
        aiTutor: {
          id: aiTutors.id,
          name: aiTutors.name,
          specialty: aiTutors.specialty,
          description: aiTutors.description,
        }
      }).from(tracks)
        .leftJoin(aiTutors, eq(tracks.aiTutorId, aiTutors.id))
        .where(eq(tracks.isPublished, true))
        .orderBy(tracks.title);
      return result;
    } catch (error) {
      console.error('Error fetching tracks:', error);
      throw error;
    }
  }

  async getTrackBySlug(slug: string) {
    try {
      const [track] = await db.select({
        id: tracks.id,
        title: tracks.title,
        slug: tracks.slug,
        summary: tracks.summary,
        isPublished: tracks.isPublished,
        createdAt: tracks.createdAt,
        aiTutor: {
          id: aiTutors.id,
          name: aiTutors.name,
          specialty: aiTutors.specialty,
          description: aiTutors.description,
        }
      }).from(tracks)
        .leftJoin(aiTutors, eq(tracks.aiTutorId, aiTutors.id))
        .where(eq(tracks.slug, slug));
      
      if (!track) return undefined;

      const trackLessons = await db.select({
        id: lessons.id,
        trackId: lessons.trackId,
        title: lessons.title,
        order: lessons.order,
        content: lessons.content,
        createdAt: lessons.createdAt,
        updatedAt: lessons.updatedAt,
      }).from(lessons).where(eq(lessons.trackId, track.id)).orderBy(lessons.order);
      
      return {
        ...track,
        lessons: trackLessons
      };
    } catch (error) {
      console.error('Error fetching track by slug:', error);
      throw error;
    }
  }

  async getLessonById(id: string) {
    try {
      const [lesson] = await db.select({
        id: lessons.id,
        trackId: lessons.trackId,
        title: lessons.title,
        order: lessons.order,
        content: lessons.content,
        createdAt: lessons.createdAt,
        updatedAt: lessons.updatedAt,
        trackSlug: tracks.slug,
      }).from(lessons)
      .leftJoin(tracks, eq(lessons.trackId, tracks.id))
      .where(eq(lessons.id, id));
      
      return lesson || undefined;
    } catch (error) {
      console.error('Error fetching lesson:', error);
      throw error;
    }
  }

  async getQuizByLessonId(lessonId: string) {
    try {
      const [quiz] = await db.select({
        id: quizzes.id,
        lessonId: quizzes.lessonId,
        title: quizzes.title,
        timeLimit: quizzes.timeLimit,
      }).from(quizzes).where(eq(quizzes.lessonId, lessonId));
      
      if (!quiz) return undefined;

      const quizQuestions = await db.select({
        id: questions.id,
        quizId: questions.quizId,
        prompt: questions.prompt,
        options: questions.options,
        correctAnswer: questions.correctAnswer,
        order: questions.order,
      }).from(questions).where(eq(questions.quizId, quiz.id)).orderBy(questions.order);
      
      return {
        ...quiz,
        questions: quizQuestions
      };
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  }

  async getAllInvites() {
    try {
      const result = await db.select().from(invites).orderBy(invites.createdAt);
      return result;
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

  // Client Management
  async getAllClients() {
    try {
      const result = await db.execute(`
        SELECT id, name, email, subscription_type, status, subscription_date, monthly_revenue, notes, created_at, updated_at 
        FROM clients 
        ORDER BY created_at DESC
      `);
      return result.rows;
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  }

  async createClient(client: any) {
    try {
      const result = await db.execute(`
        INSERT INTO clients (name, email, subscription_type, status, subscription_date, monthly_revenue, notes) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *
      `, [client.name, client.email, client.subscriptionType, client.status, client.subscriptionDate, client.monthlyRevenue, client.notes]);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  async updateClient(id: string, updates: any) {
    try {
      const result = await db.execute(`
        UPDATE clients 
        SET name = $2, email = $3, subscription_type = $4, status = $5, subscription_date = $6, monthly_revenue = $7, notes = $8, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 
        RETURNING *
      `, [id, updates.name, updates.email, updates.subscriptionType, updates.status, updates.subscriptionDate, updates.monthlyRevenue, updates.notes]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  }

  async deleteClient(id: string) {
    try {
      await db.execute('DELETE FROM clients WHERE id = $1', [id]);
      return { success: true };
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }

  async getClientStats() {
    try {
      const totalResult = await db.execute('SELECT COUNT(*) as total FROM clients');
      const total = parseInt(totalResult.rows[0].total);

      const activeResult = await db.execute("SELECT COUNT(*) as active FROM clients WHERE status = 'ACTIVE'");
      const active = parseInt(activeResult.rows[0].active);

      const revenueResult = await db.execute("SELECT SUM(monthly_revenue) as mrr FROM clients WHERE status = 'ACTIVE'");
      const totalMRR = parseInt(revenueResult.rows[0].mrr || 0);

      return {
        totalClients: total,
        activeClients: active,
        monthlyRecurringRevenue: totalMRR,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching client stats:', error);
      return {
        totalClients: 0,
        activeClients: 0,
        monthlyRecurringRevenue: 0,
        lastUpdated: new Date().toISOString()
      };
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

  // User operations for trial signup
  async createTrialUser(userData: { name: string; email: string }) {
    try {
      // Check if user already exists
      const existingUserResult = await db.execute('SELECT id FROM users WHERE email = $1', [userData.email]);
      if (existingUserResult.rows.length > 0) {
        throw new Error("User already exists with this email");
      }

      // Create 24-hour trial expiration
      const trialExpiration = new Date();
      trialExpiration.setHours(trialExpiration.getHours() + 24);

      const result = await db.execute(`
        INSERT INTO users (email, name, subscription_type, trial_expires_at, subscription_status) 
        VALUES ($1, $2, 'TRIAL', $3, 'ACTIVE') 
        RETURNING *
      `, [userData.email, userData.name, trialExpiration.toISOString()]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating trial user:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    try {
      const result = await db.execute('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  }

  async getUserById(id: string) {
    try {
      const result = await db.execute('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching user by id:', error);
      return null;
    }
  }
}

export const tempStorage = new TempDatabaseStorage();