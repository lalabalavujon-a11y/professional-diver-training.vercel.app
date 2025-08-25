import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { tempStorage } from "./temp-storage";
import { emailMarketing } from "./email-marketing";
import { z } from "zod";
import { insertLessonSchema, insertInviteSchema, insertAttemptSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.get("/api/auth/session", async (req, res) => {
    try {
      // This would be handled by Auth.js in a real implementation
      // For now, return mock session or null
      res.json({ user: null });
    } catch (error) {
      res.status(500).json({ error: "Failed to get session" });
    }
  });

  // Tracks routes
  app.get("/api/tracks", async (req, res) => {
    try {
      const tracks = await tempStorage.getAllTracks();
      res.json(tracks);
    } catch (error) {
      console.error('Tracks API error:', error);
      res.status(500).json({ error: "Failed to fetch tracks" });
    }
  });

  app.get("/api/tracks/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const track = await tempStorage.getTrackBySlug(slug);
      if (!track) {
        return res.status(404).json({ error: "Track not found" });
      }
      res.json(track);
    } catch (error) {
      console.error('Track by slug API error:', error);
      res.status(500).json({ error: "Failed to fetch track" });
    }
  });

  // Trial signup endpoint
  app.post('/api/trial-signup', async (req, res) => {
    try {
      const { name, email } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      if (!email.includes('@')) {
        return res.status(400).json({ error: 'Please enter a valid email address' });
      }

      const user = await tempStorage.createTrialUser({ name, email });
      
      // Send welcome email
      await emailMarketing.sendWelcomeTrialEmail({ name, email });
      
      res.json({ 
        success: true, 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          subscriptionType: user.subscription_type,
          trialExpiresAt: user.trial_expires_at
        }
      });
    } catch (error: any) {
      console.error('Trial signup error:', error);
      if (error.message.includes('already exists')) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }
      res.status(500).json({ error: 'Failed to create trial account' });
    }
  });

  // Support ticket endpoints
  app.post('/api/support/ticket', async (req, res) => {
    try {
      const { name, email, subject, message, priority = 'medium' } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const ticket = {
        userId: 'unknown', // Would be from session in real implementation
        email,
        name,
        subject,
        message,
        priority,
        createdAt: new Date()
      };

      const success = await emailMarketing.sendTicketConfirmation(ticket);
      
      if (success) {
        res.json({ 
          success: true, 
          message: 'Support ticket submitted successfully. You will receive a confirmation email shortly.',
          ticketId: `PDT-${Date.now()}`
        });
      } else {
        res.status(500).json({ error: 'Failed to submit support ticket' });
      }
    } catch (error) {
      console.error('Support ticket error:', error);
      res.status(500).json({ error: 'Failed to submit support ticket' });
    }
  });

  // Request Google review endpoint
  app.post('/api/support/request-review', async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      await emailMarketing.checkAndRequestReview(userId);
      
      res.json({ 
        success: true, 
        message: 'Review request processed successfully'
      });
    } catch (error) {
      console.error('Review request error:', error);
      res.status(500).json({ error: 'Failed to process review request' });
    }
  });

  // Get current user (mock endpoint for trial)
  app.get('/api/current-user', async (req, res) => {
    try {
      // For now, return a mock trial user
      const mockTrialUser = {
        id: 'trial-user-1',
        name: 'Trial User',
        email: 'trial@example.com',
        subscriptionType: 'TRIAL',
        trialExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        subscriptionStatus: 'ACTIVE'
      };
      res.json(mockTrialUser);
    } catch (error) {
      console.error('Error fetching current user:', error);
      res.status(500).json({ error: 'Failed to fetch user data' });
    }
  });

  // Lessons routes
  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const lesson = await tempStorage.getLessonById(id);
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      console.error('Lesson API error:', error);
      res.status(500).json({ error: "Failed to fetch lesson" });
    }
  });

  app.patch("/api/lessons/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertLessonSchema.partial().parse(req.body);
      const lesson = await storage.updateLesson(id, updateData);
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update lesson" });
    }
  });

  // Quiz routes
  app.get("/api/quizzes/lesson/:lessonId", async (req, res) => {
    try {
      const { lessonId } = req.params;
      const quiz = await tempStorage.getQuizByLessonId(lessonId);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      console.error('Quiz API error:', error);
      res.status(500).json({ error: "Failed to fetch quiz" });
    }
  });

  app.post("/api/quiz-attempts", async (req, res) => {
    try {
      const attemptData = insertAttemptSchema.parse(req.body);
      const attempt = await storage.createAttempt(attemptData);
      res.status(201).json(attempt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create attempt" });
    }
  });

  // Client Management routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await tempStorage.getAllClients();
      res.json(clients);
    } catch (error) {
      console.error('Get clients API error:', error);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const client = await tempStorage.createClient(req.body);
      res.json(client);
    } catch (error) {
      console.error('Create client API error:', error);
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    try {
      const client = await tempStorage.updateClient(req.params.id, req.body);
      res.json(client);
    } catch (error) {
      console.error('Update client API error:', error);
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const result = await tempStorage.deleteClient(req.params.id);
      res.json(result);
    } catch (error) {
      console.error('Delete client API error:', error);
      res.status(500).json({ error: "Failed to delete client" });
    }
  });

  app.get("/api/clients/stats", async (req, res) => {
    try {
      const stats = await tempStorage.getClientStats();
      res.json(stats);
    } catch (error) {
      console.error('Client stats API error:', error);
      res.status(500).json({ error: "Failed to fetch client stats" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/quiz", async (req, res) => {
    try {
      const analytics = await tempStorage.getQuizAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error('Quiz analytics API error:', error);
      res.status(500).json({ error: "Failed to fetch quiz analytics" });
    }
  });

  // User progress routes
  app.get("/api/users/current/progress", async (req, res) => {
    try {
      // For now, return empty progress since we don't have user auth
      const progress = await tempStorage.getUserProgress("temp-user");
      res.json(progress);
    } catch (error) {
      console.error('User progress API error:', error);
      res.status(500).json({ error: "Failed to fetch user progress" });
    }
  });

  // Admin routes
  app.get("/api/admin/invites", async (req, res) => {
    try {
      const invites = await tempStorage.getAllInvites();
      res.json(invites);
    } catch (error) {
      console.error('Admin invites API error:', error);
      res.status(500).json({ error: "Failed to fetch invites" });
    }
  });

  app.post("/api/admin/invites", async (req, res) => {
    try {
      const inviteData = insertInviteSchema.parse(req.body);
      const invite = await storage.createInvite(inviteData);
      res.status(201).json(invite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create invite" });
    }
  });

  app.delete("/api/admin/invites/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteInvite(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete invite" });
    }
  });

  // User progress routes
  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const { userId } = req.params;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user progress" });
    }
  });

  app.post("/api/users/:userId/progress", async (req, res) => {
    try {
      const { userId } = req.params;
      const { lessonId } = req.body;
      const progress = await storage.markLessonComplete(userId, lessonId);
      res.status(201).json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark lesson complete" });
    }
  });

  // Invite validation route
  app.get("/api/invites/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const invite = await storage.getInviteByToken(token);
      if (!invite || invite.usedAt || new Date() > invite.expiresAt) {
        return res.status(404).json({ error: "Invalid or expired invite" });
      }
      res.json(invite);
    } catch (error) {
      res.status(500).json({ error: "Failed to validate invite" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
