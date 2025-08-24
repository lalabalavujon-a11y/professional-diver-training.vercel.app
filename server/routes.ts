import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { tempStorage } from "./temp-storage";
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
