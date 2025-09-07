import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Brain, Lightbulb, HelpCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// AI Tutor data for each track
const AI_TUTORS = {
  "ndt-inspection": {
    name: "Sarah",
    specialty: "NDT - a highly trained AI expert in the field of Non-Destructive Testing ready for real time Tutoring",
    avatar: "👩‍🔬",
    background: "20+ years in underwater inspection, PhD in Materials Engineering",
    traits: ["Detail-oriented", "Technical expert", "Patient teacher"],
    responses: {
      greeting: "Hello! I'm Sarah, your AI tutor for underwater inspection and NDT. I've spent over 20 years perfecting underwater inspection techniques. What would you like to explore today?",
      concepts: [
        "Let's discuss cathodic protection systems and how they prevent corrosion in underwater structures.",
        "I'll explain the physics behind ultrasonic thickness gauging - it's fascinating how sound waves help us see inside materials!",
        "Would you like me to walk you through the magnetic particle inspection process step by step?"
      ],
      tips: [
        "💡 Always calibrate your thickness gauge in the same medium you'll be testing - water affects ultrasonic readings.",
        "⚠️ Remember: Visual inspection comes first, NDT methods confirm what we suspect.",
        "🔍 Document everything! Your inspection report could save lives and prevent millions in damage."
      ]
    }
  },
  "diver-medic": {
    name: "Mike",
    specialty: "DMT - a highly trained AI expert in the field of Dive Medicine ready for real time Tutoring",
    avatar: "👨‍⚕️",
    background: "Emergency medicine physician, hyperbaric specialist",
    traits: ["Emergency-focused", "Clear communicator", "Life-saving expertise"],
    responses: {
      greeting: "I'm Mike, your medical AI tutor. As an emergency physician specializing in diving medicine, I'm here to help you master life-saving techniques. Ready to learn?",
      concepts: [
        "Let's review the ABCDE assessment protocol - it's your foundation for any diving emergency.",
        "I want to show you how to recognize and treat decompression sickness quickly and effectively.",
        "Understanding nitrogen narcosis symptoms could save a diver's life - let me explain the signs."
      ],
      tips: [
        "🚨 In diving emergencies, time is brain tissue - act fast but think faster.",
        "💨 High-flow oxygen is your best friend in almost every diving accident.",
        "📞 Always have emergency contact numbers memorized - seconds count in real emergencies."
      ]
    }
  },
  "commercial-supervisor": {
    name: "David",
    specialty: "Commercial Dive Supervisor Training - a highly trained AI expert in the field of Commercial Diving Operations ready for real time Tutoring",
    avatar: "👨‍✈️",
    background: "30 years commercial diving, former Navy dive supervisor",
    traits: ["Leadership-focused", "Safety-first", "Decision maker"],
    responses: {
      greeting: "David here! I've supervised thousands of commercial dives. Leadership underwater requires split-second decisions and absolute safety focus. Let's build your command skills.",
      concepts: [
        "Risk assessment isn't just a checklist - it's a mindset that saves lives. Let me show you my approach.",
        "Communication protocols can make or break a dive operation. I'll teach you the standards that matter.",
        "Emergency response planning: Hope for the best, prepare for the worst. Here's how we do it."
      ],
      tips: [
        "🎯 A good supervisor is always thinking three steps ahead of the current operation.",
        "📋 Your pre-dive briefing sets the tone for safety - make every word count.",
        "⚡ When things go wrong, stay calm, communicate clearly, execute the plan."
      ]
    }
  },
  "air-diving-life-support-technician": {
    name: "Jennifer",
    specialty: "ALST - a highly trained AI expert in the field of Air Diving Life Support ready for real time Tutoring",
    avatar: "👩‍⚕️",
    background: "Life support systems specialist, 15+ years commercial diving",
    traits: ["Systems-focused", "Safety expert", "Technical precision"],
    responses: {
      greeting: "I'm Jennifer, your life support AI tutor. I specialize in keeping divers alive through proper air systems management. Ready to master life support systems?",
      concepts: [
        "Let's explore how breathing gas mixtures affect diver performance and safety underwater.",
        "I'll show you how to calculate surface air consumption rates and plan gas supplies accordingly.",
        "Understanding compressor maintenance is critical - contaminated air kills divers."
      ],
      tips: [
        "🔧 Regular compressor maintenance isn't optional - it's life insurance for your divers.",
        "📊 Always monitor gas consumption rates - they tell you everything about diver stress and efficiency.",
        "⚠️ Never compromise on air quality testing - your reputation and lives depend on it."
      ]
    }
  },
  "limited-surface-supplied-tender": {
    name: "Robert", 
    specialty: "LST - a highly trained AI expert in the field of Limited Surface Supply ready for real time Tutoring",
    avatar: "👨‍🔧",
    background: "Surface supply specialist, tender operations expert",
    traits: ["Detail-oriented", "Communication expert", "Reliability-focused"],
    responses: {
      greeting: "Robert here! I'm your surface supply AI tutor. The lifeline between topside and underwater operations starts with me. Let's ensure perfect communication and supply.",
      concepts: [
        "Proper tender procedures can save a diver's life - let me show you the critical steps.",
        "Communication protocols between tender and diver must be flawless - here's how we achieve that.",
        "Understanding umbilical management prevents entanglement and ensures continuous life support."
      ],
      tips: [
        "🎧 Clear communication saves lives - always confirm your messages are understood.",
        "🔄 Keep your umbilical organized - a tangled line can become a death trap.",
        "👁️ Watch your diver's bubbles - they tell you everything about their condition below."
      ]
    }
  },
  "saturation-diving": {
    name: "Robert",
    specialty: "Saturation Diving Systems - a highly trained AI expert in the field of Saturation Diving Operations ready for real time Tutoring",
    avatar: "👨‍🔬",
    background: "Saturation diving specialist, life support systems expert",
    traits: ["Systems-focused", "Technical precision", "Safety expert"],
    responses: {
      greeting: "I'm Robert, your saturation diving AI tutor. Saturation operations require absolute precision and deep understanding of life support systems. Let's master these critical skills together!",
      concepts: [
        "Life support systems in saturation diving are your lifeline - understanding every component is essential.",
        "Decompression management in saturation diving follows precise protocols that must be followed exactly.",
        "Human factors in confined environments require special psychological and physical preparation."
      ],
      tips: [
        "🔧 Regular system checks prevent catastrophic failures in saturation environments.",
        "⏰ Time management in saturation diving is critical - every minute counts.",
        "🧠 Mental preparation is as important as physical training for saturation operations."
      ]
    }
  },
  "underwater-welding": {
    name: "Carlos",
    specialty: "Underwater Welding - a highly trained AI expert in the field of Underwater Welding Operations ready for real time Tutoring",
    avatar: "👨‍🔧",
    background: "Underwater welding specialist, marine construction expert",
    traits: ["Precision-focused", "Quality expert", "Safety advocate"],
    responses: {
      greeting: "I'm Carlos, your underwater welding AI tutor. Underwater welding demands perfect technique and unwavering attention to safety. Let's build your expertise in this challenging field!",
      concepts: [
        "Electrode selection underwater depends on water depth, current conditions, and material type.",
        "Quality control in underwater welding requires multiple inspection techniques and strict protocols.",
        "Safety protocols in underwater welding protect both the welder and the integrity of the work."
      ],
      tips: [
        "⚡ Electrical safety underwater is paramount - never compromise on safety procedures.",
        "🔍 Visual inspection of welds underwater requires specialized techniques and equipment.",
        "📋 Documentation of welding parameters ensures quality and traceability."
      ]
    }
  },
  "hyperbaric-operations": {
    name: "Emma",
    specialty: "Hyperbaric Operations - a highly trained AI expert in the field of Hyperbaric Chamber Operations ready for real time Tutoring",
    avatar: "👩‍⚕️",
    background: "Hyperbaric medicine specialist, chamber operations expert",
    traits: ["Medical precision", "Patient safety", "Technical expertise"],
    responses: {
      greeting: "I'm Emma, your hyperbaric operations AI tutor. Hyperbaric medicine combines advanced medical knowledge with complex technical systems. Let's ensure you're ready for any situation!",
      concepts: [
        "Hyperbaric treatment protocols must be followed precisely for patient safety and treatment effectiveness.",
        "Chamber operations require understanding of both medical and engineering principles.",
        "Emergency procedures in hyperbaric chambers must be second nature for all operators."
      ],
      tips: [
        "🏥 Patient monitoring in hyperbaric chambers requires constant vigilance and quick response.",
        "🔧 Regular maintenance of hyperbaric equipment prevents dangerous malfunctions.",
        "📊 Accurate record-keeping in hyperbaric operations ensures patient safety and regulatory compliance."
      ]
    }
  },
  "alst": {
    name: "Alex",
    specialty: "Advanced Life Support Technician - a highly trained AI expert in the field of Advanced Life Support Operations ready for real time Tutoring",
    avatar: "👨‍⚕️",
    background: "Advanced life support specialist, saturation diving medical expert",
    traits: ["Advanced medical", "System expert", "Emergency response"],
    responses: {
      greeting: "I'm Alex, your Advanced Life Support Technician AI tutor. ALST operations require the highest level of medical and technical expertise. Let's prepare you for the most challenging scenarios!",
      concepts: [
        "Advanced life support systems in saturation diving require expert knowledge of both medical and engineering principles.",
        "Emergency decompression protocols must be executed with precision and speed.",
        "Saturation diving medical procedures combine hyperbaric medicine with advanced life support techniques."
      ],
      tips: [
        "🚨 Emergency response in saturation environments requires split-second decision making.",
        "🔬 Advanced monitoring systems provide critical data for life support operations.",
        "👥 Team coordination in life support operations is essential for success."
      ]
    }
  },
  "lst": {
    name: "Maria",
    specialty: "Life Support Technician - a highly trained AI expert in the field of Life Support System Operations ready for real time Tutoring",
    avatar: "👩‍🔧",
    background: "Life support systems specialist, gas management expert",
    traits: ["System expert", "Gas management", "Safety focused"],
    responses: {
      greeting: "I'm Maria, your Life Support Technician AI tutor. LST operations are the foundation of safe diving operations. Let's master the systems that keep divers alive!",
      concepts: [
        "Life support system operations require deep understanding of gas physics and system engineering.",
        "Gas management in diving operations is critical for diver safety and operational efficiency.",
        "Emergency response procedures for life support systems must be practiced until they're automatic."
      ],
      tips: [
        "💨 Gas analysis and monitoring are your primary responsibilities as an LST.",
        "🔧 Preventive maintenance of life support equipment prevents dangerous failures.",
        "📋 Detailed logging of system parameters ensures operational safety and regulatory compliance."
      ]
    }
  }
};

interface AITutorProps {
  trackSlug: string;
  lessonTitle?: string;
}

export default function AITutor({ trackSlug, lessonTitle }: AITutorProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "concepts" | "tips">("chat");
  const [messages, setMessages] = useState<Array<{ type: "tutor" | "user"; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState("");

  const tutor = AI_TUTORS[trackSlug as keyof typeof AI_TUTORS];

  if (!tutor) {
    return null;
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessages = [
      ...messages,
      { type: "user" as const, content: inputMessage },
      { 
        type: "tutor" as const, 
        content: generateTutorResponse(inputMessage, tutor, lessonTitle) 
      }
    ];
    
    setMessages(newMessages);
    setInputMessage("");
  };

  const startConversation = () => {
    if (messages.length === 0) {
      setMessages([{ type: "tutor", content: tutor.responses.greeting }]);
      setActiveTab("chat");
    }
  };

  return (
    <Card className="mt-8 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{tutor.avatar}</div>
          <div>
            <CardTitle className="text-xl text-blue-900" data-testid="text-tutor-name">
              {tutor.name}
            </CardTitle>
            <p className="text-blue-700 font-medium">{tutor.specialty}</p>
            <p className="text-sm text-blue-600">{tutor.background}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          {tutor.traits.map((trait, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
              {trait}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeTab === "chat" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("chat")}
            className="flex items-center gap-2"
            data-testid="button-chat-tab"
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </Button>
          <Button
            variant={activeTab === "concepts" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("concepts")}
            className="flex items-center gap-2"
            data-testid="button-concepts-tab"
          >
            <Brain className="w-4 h-4" />
            Key Concepts
          </Button>
          <Button
            variant={activeTab === "tips" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("tips")}
            className="flex items-center gap-2"
            data-testid="button-tips-tab"
          >
            <Lightbulb className="w-4 h-4" />
            Pro Tips
          </Button>
        </div>

        {activeTab === "chat" && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto text-blue-400 mb-4" />
                <p className="text-blue-700 mb-4">Start a conversation with your AI tutor!</p>
                <Button onClick={startConversation} data-testid="button-start-chat">
                  Begin Learning Session
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      message.type === "tutor"
                        ? "bg-blue-100 text-blue-900"
                        : "bg-white text-slate-900 ml-8"
                    }`}
                    data-testid={`message-${message.type}`}
                  >
                    <strong>{message.type === "tutor" ? tutor.name : "You"}:</strong> {message.content}
                  </div>
                ))}
              </div>
            )}
            
            {messages.length > 0 && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask your tutor a question..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-testid="input-chat-message"
                />
                <Button onClick={handleSendMessage} data-testid="button-send-message">
                  Send
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "concepts" && (
          <div className="space-y-3">
            {tutor.responses.concepts.map((concept, index) => (
              <Alert key={index} className="border-blue-200 bg-blue-50">
                <Brain className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  {concept}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {activeTab === "tips" && (
          <div className="space-y-3">
            {tutor.responses.tips.map((tip, index) => (
              <Alert key={index} className="border-amber-200 bg-amber-50">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  {tip}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Generate contextual responses based on user input and lesson content
function generateTutorResponse(userInput: string, tutor: any, lessonTitle?: string): string {
  const input = userInput.toLowerCase();
  
  // Context-aware responses based on lesson title and user input
  if (input.includes("help") || input.includes("explain")) {
    return `I'd be happy to help! Based on what we're covering${lessonTitle ? ` in "${lessonTitle}"` : ""}, here's my explanation: ${tutor.responses.concepts[0]}`;
  }
  
  if (input.includes("emergency") || input.includes("danger")) {
    return "Emergency situations require immediate, methodical response. Remember your training: assess the situation, ensure safety, then act decisively. What specific emergency scenario would you like to discuss?";
  }
  
  if (input.includes("equipment") || input.includes("tool")) {
    return "Equipment knowledge is crucial for safety and efficiency. Each tool has its specific purpose and limitations. What equipment would you like to learn more about?";
  }
  
  if (input.includes("safety") || input.includes("risk")) {
    return "Safety is paramount in our field. Every procedure, every decision, every action should be evaluated through the lens of risk management. What safety concern can I help address?";
  }
  
  // Default encouraging response
  const encouragingResponses = [
    "That's a great question! Let me share my experience with that topic.",
    "I appreciate your curiosity. In my years of experience, I've found that...",
    "Excellent thinking! This is exactly the kind of question that shows you're developing professional judgment.",
    "Your question demonstrates good awareness. Here's what I've learned over the years..."
  ];
  
  return encouragingResponses[Math.floor(Math.random() * encouragingResponses.length)] + " Feel free to ask me more specific questions about the techniques and procedures we're covering.";
}