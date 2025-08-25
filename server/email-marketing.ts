// Email marketing utilities for Professional Diver - Diver Well Training
// This module handles support tickets, Google review requests, and user communications

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface SupportTicket {
  userId: string;
  email: string;
  name: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
}

interface ReviewRequest {
  userId: string;
  email: string;
  name: string;
  completedCourses: number;
  avgScore: number;
}

export class EmailMarketing {
  private fromEmail = "noreply@diverwell.app";
  private supportEmail = "support@diverwell.app";

  // Support ticket templates
  private getTicketConfirmationTemplate(ticket: SupportTicket): EmailTemplate {
    return {
      subject: `Support Ticket Confirmation - ${ticket.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Support Ticket Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1e40af;">Professional Diver</h1>
              <p style="color: #64748b;">Diver Well Training</p>
            </div>
            
            <h2 style="color: #1e40af;">Support Ticket Received</h2>
            
            <p>Hello ${ticket.name},</p>
            
            <p>We've received your support request and will respond within 24 hours. Here are the details:</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Subject:</strong> ${ticket.subject}</p>
              <p><strong>Priority:</strong> ${ticket.priority.toUpperCase()}</p>
              <p><strong>Submitted:</strong> ${ticket.createdAt.toLocaleDateString()}</p>
              <p><strong>Message:</strong></p>
              <p style="background: white; padding: 15px; border-radius: 4px;">${ticket.message}</p>
            </div>
            
            <p>Our diving education specialists are reviewing your request. For urgent matters, please contact us directly at ${this.supportEmail}.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 14px;">
              <p>Professional Diver - Diver Well Training</p>
              <p>Brand-neutral commercial diving education</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Professional Diver - Diver Well Training
        Support Ticket Confirmation
        
        Hello ${ticket.name},
        
        We've received your support request and will respond within 24 hours.
        
        Subject: ${ticket.subject}
        Priority: ${ticket.priority.toUpperCase()}
        Submitted: ${ticket.createdAt.toLocaleDateString()}
        
        Message:
        ${ticket.message}
        
        Our diving education specialists are reviewing your request.
        For urgent matters, contact: ${this.supportEmail}
        
        Best regards,
        Professional Diver - Diver Well Training Team
      `
    };
  }

  // Google review request template
  private getReviewRequestTemplate(request: ReviewRequest): EmailTemplate {
    return {
      subject: "Share Your Professional Diver Experience 🌟",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Review Request</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1e40af;">Professional Diver</h1>
              <p style="color: #64748b;">Diver Well Training</p>
            </div>
            
            <h2 style="color: #1e40af;">How's Your Learning Experience?</h2>
            
            <p>Hello ${request.name},</p>
            
            <p>Congratulations on completing ${request.completedCourses} courses with an average score of ${request.avgScore}%! 🎉</p>
            
            <p>We'd love to hear about your experience with our brand-neutral commercial diving education platform. Your feedback helps other diving professionals discover quality training resources.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://g.page/r/professional-diver-reviews" 
                 style="display: inline-block; background: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Leave a Google Review
              </a>
            </div>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0369a1; margin-top: 0;">Your Progress:</h3>
              <ul style="margin: 0;">
                <li>Courses Completed: ${request.completedCourses}</li>
                <li>Average Score: ${request.avgScore}%</li>
                <li>Professional diving knowledge gained through brand-neutral content</li>
              </ul>
            </div>
            
            <p>Thank you for choosing Professional Diver for your commercial diving education. Your success in the industry is our priority!</p>
            
            <p style="font-size: 14px; color: #64748b;">
              If you have any concerns or suggestions, please reply to this email or contact our support team at ${this.supportEmail}.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 14px;">
              <p>Professional Diver - Diver Well Training</p>
              <p>Brand-neutral commercial diving education</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Professional Diver - Diver Well Training
        
        Hello ${request.name},
        
        Congratulations on completing ${request.completedCourses} courses with an average score of ${request.avgScore}%!
        
        We'd love to hear about your experience with our brand-neutral commercial diving education platform.
        
        Please consider leaving a Google review: https://g.page/r/professional-diver-reviews
        
        Your Progress:
        - Courses Completed: ${request.completedCourses}
        - Average Score: ${request.avgScore}%
        - Professional diving knowledge gained through brand-neutral content
        
        Thank you for choosing Professional Diver for your commercial diving education.
        
        Best regards,
        Professional Diver - Diver Well Training Team
      `
    };
  }

  // Welcome email for new trial users
  private getWelcomeTrialTemplate(user: { name: string; email: string }): EmailTemplate {
    return {
      subject: "Welcome to Professional Diver - Your 24-Hour Trial Starts Now! 🤿",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Professional Diver</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1e40af;">Professional Diver</h1>
              <p style="color: #64748b;">Diver Well Training</p>
            </div>
            
            <h2 style="color: #1e40af;">Welcome to Professional Diving Education!</h2>
            
            <p>Hello ${user.name},</p>
            
            <p>Welcome to Professional Diver - Diver Well Training! Your 24-hour free trial has begun, giving you full access to our brand-neutral commercial diving education platform.</p>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0369a1; margin-top: 0;">What You Can Access:</h3>
              <ul style="margin: 0;">
                <li>📚 Comprehensive learning tracks</li>
                <li>🧠 AI-powered diving consultant</li>
                <li>📝 Timed mock examinations</li>
                <li>📊 Progress tracking and analytics</li>
                <li>🎯 Spaced repetition learning system</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://professional-diver.diverwell.app/dashboard" 
                 style="display: inline-block; background: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Start Learning Now
              </a>
            </div>
            
            <p>Need help getting started? Contact our support team at ${this.supportEmail} or use the AI Consultant built into the platform.</p>
            
            <div style="background: #fefce8; padding: 15px; border-radius: 8px; border-left: 4px solid #fbbf24;">
              <p style="margin: 0; font-weight: bold; color: #92400e;">
                🔒 Brand-Neutral Content: All our materials are original, reworded content that maintains educational quality while remaining independent of any certification bodies.
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 14px;">
              <p>Professional Diver - Diver Well Training</p>
              <p>Commercial diving education that's compliant and congruent</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Professional Diver - Diver Well Training
        
        Hello ${user.name},
        
        Welcome to Professional Diver! Your 24-hour free trial has begun.
        
        What You Can Access:
        - Comprehensive learning tracks
        - AI-powered diving consultant  
        - Timed mock examinations
        - Progress tracking and analytics
        - Spaced repetition learning system
        
        Start learning: https://professional-diver.diverwell.app/dashboard
        
        Need help? Contact: ${this.supportEmail}
        
        All our content is brand-neutral, original, and educationally focused.
        
        Best regards,
        Professional Diver - Diver Well Training Team
      `
    };
  }

  // Send support ticket confirmation
  async sendTicketConfirmation(ticket: SupportTicket): Promise<boolean> {
    try {
      const template = this.getTicketConfirmationTemplate(ticket);
      
      // In a real implementation, this would integrate with SendGrid or similar service
      console.log('Sending support ticket confirmation email:', {
        to: ticket.email,
        subject: template.subject,
        priority: ticket.priority
      });
      
      // Would also create internal ticket in support system
      await this.createInternalTicket(ticket);
      
      return true;
    } catch (error) {
      console.error('Error sending support ticket confirmation:', error);
      return false;
    }
  }

  // Send review request
  async sendReviewRequest(request: ReviewRequest): Promise<boolean> {
    try {
      const template = this.getReviewRequestTemplate(request);
      
      console.log('Sending review request email:', {
        to: request.email,
        subject: template.subject,
        courses: request.completedCourses
      });
      
      return true;
    } catch (error) {
      console.error('Error sending review request:', error);
      return false;
    }
  }

  // Send welcome trial email
  async sendWelcomeTrialEmail(user: { name: string; email: string }): Promise<boolean> {
    try {
      const template = this.getWelcomeTrialTemplate(user);
      
      console.log('Sending welcome trial email:', {
        to: user.email,
        subject: template.subject
      });
      
      return true;
    } catch (error) {
      console.error('Error sending welcome trial email:', error);
      return false;
    }
  }

  // Create internal support ticket
  private async createInternalTicket(ticket: SupportTicket): Promise<void> {
    // This would integrate with a ticketing system like Zendesk, Freshdesk, etc.
    console.log('Creating internal support ticket:', {
      id: `PDT-${Date.now()}`,
      user: ticket.email,
      subject: ticket.subject,
      priority: ticket.priority,
      message: ticket.message
    });
  }

  // Trigger review request based on user progress
  async checkAndRequestReview(userId: string): Promise<void> {
    try {
      // This would check user progress and send review request if criteria met
      // Example criteria: completed 3+ courses, average score 80%+, no recent review request
      
      const mockUser = {
        userId,
        email: 'user@example.com',
        name: 'Professional Diver',
        completedCourses: 5,
        avgScore: 87
      };

      if (mockUser.completedCourses >= 3 && mockUser.avgScore >= 80) {
        await this.sendReviewRequest(mockUser);
      }
    } catch (error) {
      console.error('Error checking review request criteria:', error);
    }
  }
}

export const emailMarketing = new EmailMarketing();