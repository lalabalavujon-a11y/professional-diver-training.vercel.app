import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { Document } from '@langchain/core/documents';
import LangChainConfig from './langchain-config';
import ProfessionalDivingVectorStore from './vector-store';

// Brand-neutral AI tutor interface
export interface DivingTutor {
  id: string;
  name: string;
  discipline: string;
  specialty: string;
  avatar: string;
  background: string;
  traits: string[];
  systemPrompt: string;
}

// Brand-neutral tutor configurations
export const DIVING_TUTORS: Record<string, DivingTutor> = {
  'ndt': {
    id: 'ndt-tutor',
    name: 'Dr. Sarah Chen',
    discipline: 'NDT',
    specialty: 'Non-Destructive Testing and Underwater Inspection',
    avatar: '👩‍🔬',
    background: '20+ years in underwater inspection, PhD in Materials Engineering, IMCA certified',
    traits: ['Detail-oriented', 'Technical expert', 'Patient teacher'],
    systemPrompt: 'You are Dr. Sarah Chen, a highly experienced NDT specialist with expertise in underwater inspection techniques, corrosion assessment, and professional documentation standards.'
  },
  'lst': {
    id: 'lst-tutor',
    name: 'Mike Rodriguez',
    discipline: 'LST',
    specialty: 'Life Support Systems and Safety Operations',
    avatar: '👨‍🔧',
    background: '15+ years in life support operations, certified LST, hyperbaric specialist',
    traits: ['Safety-focused', 'Technical expert', 'Clear communicator'],
    systemPrompt: 'You are Mike Rodriguez, a seasoned Life Support Technician with extensive experience in life support systems, gas mixing, and safety protocols.'
  },
  'alst': {
    id: 'alst-tutor',
    name: 'Captain Elena Vasquez',
    discipline: 'ALST',
    specialty: 'Advanced Life Support and Saturation Diving',
    avatar: '👩‍✈️',
    background: '18+ years in advanced life support, saturation diving specialist, IMCA certified',
    traits: ['Advanced technical expertise', 'Leadership focused', 'Safety advocate'],
    systemPrompt: 'You are Captain Elena Vasquez, an expert in advanced life support systems, saturation diving operations, and complex underwater life support protocols.'
  },
  'dmt': {
    id: 'dmt-tutor',
    name: 'Dr. James Mitchell',
    discipline: 'DMT',
    specialty: 'Diving Medicine and Emergency Response',
    avatar: '👨‍⚕️',
    background: 'Emergency medicine physician, hyperbaric specialist, diving medicine expert',
    traits: ['Emergency-focused', 'Medical expert', 'Life-saving expertise'],
    systemPrompt: 'You are Dr. James Mitchell, an emergency medicine physician specializing in diving medicine, hyperbaric treatment, and diving emergency response.'
  },
  'commercial-supervisor': {
    id: 'supervisor-tutor',
    name: 'Commander David Thompson',
    discipline: 'Commercial Dive Supervisor',
    specialty: 'Dive Supervision and Operations Management',
    avatar: '👨‍💼',
    background: '25+ years in commercial diving supervision, IMCA certified supervisor, operations management expert',
    traits: ['Leadership expert', 'Operations focused', 'Safety leader'],
    systemPrompt: 'You are Commander David Thompson, a highly experienced Commercial Dive Supervisor with expertise in operations management, safety oversight, and team leadership.'
  }
};

export class DivingTutorManager {
  private static instance: DivingTutorManager;
  private config: LangChainConfig;
  private vectorStore: ProfessionalDivingVectorStore;
  private chatModel: ChatOpenAI;

  private constructor() {
    this.config = LangChainConfig.getInstance();
    this.vectorStore = ProfessionalDivingVectorStore.getInstance();
    this.chatModel = this.config.getChatModel();
  }

  public static getInstance(): DivingTutorManager {
    if (!DivingTutorManager.instance) {
      DivingTutorManager.instance = new DivingTutorManager();
    }
    return DivingTutorManager.instance;
  }

  // Get available tutors
  public getAvailableTutors(): DivingTutor[] {
    return Object.values(DIVING_TUTORS);
  }

  // Get tutor by discipline
  public getTutorByDiscipline(discipline: string): DivingTutor | null {
    return DIVING_TUTORS[discipline] || null;
  }

  // Chat with a specific tutor
  public async chatWithTutor(
    discipline: string,
    message: string,
    sessionId?: string
  ): Promise<{
    response: string;
    relevantContent?: Document[];
    tutor: DivingTutor;
  }> {
    try {
      const tutor = this.getTutorByDiscipline(discipline);
      if (!tutor) {
        throw new Error(`Tutor not found for discipline: ${discipline}`);
      }

      // Get relevant content from vector store
      const relevantContent = await this.vectorStore.searchContent(
        message,
        discipline,
        3
      );

      // Build context from relevant content
      const context = relevantContent
        .map(doc => doc.pageContent)
        .join('\n\n');

      // Create system prompt with brand neutrality
      const systemPrompt = `${this.config.getBrandNeutralSystemPrompt(discipline)}

${tutor.systemPrompt}

${this.config.getContentGuidelines()}

Relevant professional content:
${context}

Remember: Maintain complete brand neutrality. Focus on industry standards, safety protocols, and professional development. Do not mention any specific companies or brands.`;

      // Generate response
      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(message)
      ];

      const response = await this.chatModel.invoke(messages);

      return {
        response: response.content as string,
        relevantContent,
        tutor
      };

    } catch (error) {
      console.error('❌ Error in chatWithTutor:', error);
      throw error;
    }
  }

  // Generate learning path recommendations
  public async generateLearningPath(
    discipline: string,
    userLevel: 'beginner' | 'intermediate' | 'advanced',
    goals: string[]
  ): Promise<{
    recommendations: string[];
    nextSteps: string[];
    resources: string[];
  }> {
    try {
      const tutor = this.getTutorByDiscipline(discipline);
      if (!tutor) {
        throw new Error(`Tutor not found for discipline: ${discipline}`);
      }

      // Get relevant content for the discipline
      const relevantContent = await this.vectorStore.getContentByDiscipline(discipline);

      const context = relevantContent
        .map(doc => doc.pageContent)
        .join('\n\n');

      const systemPrompt = `${this.config.getBrandNeutralSystemPrompt(discipline)}

${tutor.systemPrompt}

${this.config.getContentGuidelines()}

Relevant professional content:
${context}

Create a personalized learning path for a ${userLevel} level professional in ${discipline}.
User goals: ${goals.join(', ')}

Provide:
1. Specific learning recommendations
2. Next steps for skill development
3. Relevant industry resources and certifications

Focus on industry standards, safety protocols, and professional development opportunities.`;

      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(`Create a learning path for ${userLevel} level ${discipline} professional with goals: ${goals.join(', ')}`)
      ];

      const response = await this.chatModel.invoke(messages);
      const responseText = response.content as string;

      // Parse response into structured format
      const recommendations = this.parseLearningPathResponse(responseText);

      return recommendations;

    } catch (error) {
      console.error('❌ Error generating learning path:', error);
      throw error;
    }
  }

  // Parse learning path response
  private parseLearningPathResponse(responseText: string): {
    recommendations: string[];
    nextSteps: string[];
    resources: string[];
  } {
    // Simple parsing - in a real implementation, you might use more sophisticated parsing
    const lines = responseText.split('\n').filter(line => line.trim());
    
    const recommendations: string[] = [];
    const nextSteps: string[] = [];
    const resources: string[] = [];

    let currentSection = 'recommendations';
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('recommendation') || lowerLine.includes('learning')) {
        currentSection = 'recommendations';
      } else if (lowerLine.includes('next step') || lowerLine.includes('development')) {
        currentSection = 'nextSteps';
      } else if (lowerLine.includes('resource') || lowerLine.includes('certification')) {
        currentSection = 'resources';
      } else if (line.trim() && !line.startsWith('#')) {
        switch (currentSection) {
          case 'recommendations':
            recommendations.push(line.trim());
            break;
          case 'nextSteps':
            nextSteps.push(line.trim());
            break;
          case 'resources':
            resources.push(line.trim());
            break;
        }
      }
    }

    return { recommendations, nextSteps, resources };
  }

  // Generate assessment questions
  public async generateAssessmentQuestions(
    discipline: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    topic: string,
    count: number = 5
  ): Promise<{
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
      difficulty: string;
    }>;
  }> {
    try {
      const tutor = this.getTutorByDiscipline(discipline);
      if (!tutor) {
        throw new Error(`Tutor not found for discipline: ${discipline}`);
      }

      // Get relevant content for the topic
      const relevantContent = await this.vectorStore.searchContent(
        `${topic} ${discipline}`,
        discipline,
        5
      );

      const context = relevantContent
        .map(doc => doc.pageContent)
        .join('\n\n');

      const systemPrompt = `${this.config.getBrandNeutralSystemPrompt(discipline)}

${tutor.systemPrompt}

${this.config.getContentGuidelines()}

Relevant professional content:
${context}

Generate ${count} ${difficulty} level assessment questions about ${topic} in ${discipline}.

Each question should include:
- A clear, professional question
- 4 multiple choice options
- The correct answer
- A detailed explanation
- Appropriate difficulty level

Focus on industry standards, safety protocols, and practical knowledge.`;

      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(`Generate ${count} ${difficulty} level questions about ${topic} in ${discipline}`)
      ];

      const response = await this.chatModel.invoke(messages);
      const responseText = response.content as string;

      // Parse questions from response
      const questions = this.parseAssessmentQuestions(responseText);

      return { questions };

    } catch (error) {
      console.error('❌ Error generating assessment questions:', error);
      throw error;
    }
  }

  // Parse assessment questions from response
  private parseAssessmentQuestions(responseText: string): Array<{
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: string;
  }> {
    // Simple parsing - in a real implementation, you might use more sophisticated parsing
    const questions: Array<{
      question: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
      difficulty: string;
    }> = [];

    // This is a simplified parser - in production, you'd want more robust parsing
    const sections = responseText.split(/\d+\./).filter(section => section.trim());
    
    for (const section of sections) {
      const lines = section.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        const question = lines[0].trim();
        const options = lines.slice(1, 5).filter(line => line.trim());
        const correctAnswer = options[0] || 'A';
        const explanation = lines.slice(5).join(' ').trim() || 'Professional explanation based on industry standards.';
        
        questions.push({
          question,
          options,
          correctAnswer,
          explanation,
          difficulty: 'intermediate'
        });
      }
    }

    return questions;
  }
}

export default DivingTutorManager;
