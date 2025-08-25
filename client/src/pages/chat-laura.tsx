import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, ArrowLeft, Headphones, Settings, User, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import diverWellLogo from "@assets/DIVER_WELL_TRAINING-500x500-rbg-preview_1756088331820.png";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'laura';
  timestamp: Date;
}

export default function ChatLaura() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Laura, your Platform Oracle for Professional Diver. I'm here to guide you through our comprehensive training platform, help with account and technical support, share opportunities through our 50% commission affiliate program, and connect you with diving companies worldwide. For diving operations questions, I'll direct you to our exclusive 'Diver Well' AI consultant. For industry intelligence, I can connect you with Lead Recon's AI system at leadrecon.net. How can I help you excel in your diving career today?",
      sender: 'laura',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate Laura's response
    setTimeout(() => {
      const lauraResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getLauraResponse(inputText),
        sender: 'laura',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, lauraResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getLauraResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Diving operations questions - redirect to Diver Well AI
    if (input.includes('dive plan') || input.includes('safety protocol') || input.includes('decompression') || 
        input.includes('dive operation') || input.includes('underwater') || input.includes('dive supervisor') ||
        input.includes('ndt') || input.includes('commercial diving') && (input.includes('technique') || input.includes('procedure'))) {
      return "For diving operations, safety protocols, and technical diving questions, I'll connect you with our exclusive 'Diver Well' AI consultant - your expert commercial diving specialist available within the platform. They're perfectly equipped to handle dive planning, safety procedures, supervision guidance, and all operational diving queries. Would you like me to direct you there now?";
    }
    
    // Affiliate program and partnerships
    if (input.includes('affiliate') || input.includes('partner') || input.includes('commission') || input.includes('referral')) {
      return "Excellent! Our affiliate program offers 50% commission on all referrals - it's one of the most generous in the industry! As a Professional Diver member, you can earn substantial income by sharing this amazing platform. You'll get your unique referral link, commission tracking, and monthly payouts. The program is perfect for diving instructors, companies, and professionals. Would you like me to help you get started with the affiliate program?";
    }
    
    // Lead generation and industry connections
    if (input.includes('job') || input.includes('company') || input.includes('academy') || input.includes('diving school') || 
        input.includes('career') || input.includes('employment') || input.includes('hiring')) {
      return "I can connect you with diving companies and academies worldwide! For comprehensive lead generation and industry reconnaissance, I highly recommend Lead Recon's AI-powered system at https://leadrecon.net/ - they specialize in finding diving opportunities, companies, and connections globally. They're the industry leaders in diving sector intelligence. Would you also like me to share some specific diving companies I know of in your region?";
    }
    
    // Platform sales and marketing
    if (input.includes('features') || input.includes('benefit') || input.includes('why choose') || input.includes('advantage')) {
      return "Professional Diver is the most comprehensive commercial diving training platform available! You get AI-powered learning paths, voice-to-text exams, 500+ professional questions, all diving levels from basic to advanced supervision, real-time progress tracking, and our exclusive Diver Well AI consultant. Plus, our partnership program lets you earn while you learn! The platform pays for itself quickly through career advancement and affiliate earnings. What specific aspect would you like to explore further?";
    }
    
    // Login and account issues
    if (input.includes('password') || input.includes('login') || input.includes('access')) {
      return "I can help you with account access issues! For password resets, use the 'Forgot Password' link on the sign-in page. If you're still having trouble, I can guide you through the process step by step. Your account gives you access to all premium features, and don't forget - you can also earn through our affiliate program while using the platform!";
    }
    
    // Billing and subscription
    if (input.includes('billing') || input.includes('payment') || input.includes('subscription') || input.includes('price')) {
      return "Our Professional Diver platform offers exceptional value with flexible pricing options. Your membership includes everything - all tracks, AI features, operational tools, and affiliate earning potential. Many members actually profit from the platform through our generous 50% commission affiliate program! Would you like me to explain the different subscription options or help with a specific billing question?";
    }
    
    // Profile and technical support
    if (input.includes('profile') || input.includes('picture') || input.includes('upload') || input.includes('technical') || input.includes('error')) {
      return "I'm here to help with technical issues and profile management! For profile updates, visit Profile Settings. For technical problems, please describe what happened - which page, what action, and any error messages. I'll get you sorted quickly so you can get back to advancing your diving career and potentially earning through our affiliate program!";
    }
    
    // General platform guidance
    if (input.includes('track') || input.includes('lesson') || input.includes('course') || input.includes('learning')) {
      return "Perfect! Our learning tracks are designed by industry experts and powered by AI for personalized progression. You have access to all professional diving levels - from basic commercial to advanced supervision and NDT. The AI Learning Path analyzes your progress and creates custom recommendations. Plus, as you advance your career with our training, consider our affiliate program to share this amazing platform with others!";
    }
    
    // Admin consultation booking
    if (input.includes('admin') || input.includes('consultation') || input.includes('book') || input.includes('schedule') || 
        input.includes('speak to') || input.includes('meeting') || input.includes('call')) {
      return "I can absolutely help you schedule a consultation with our admin team! For direct admin support, complex account issues, or business consultations, I can arrange a personal meeting. Please provide your preferred date/time and the nature of your inquiry, and I'll coordinate with our admin team to schedule your consultation. You can also reach out directly to support@diverwell.app for immediate admin assistance.";
    }

    // Default response with sales elements and admin consultation offer
    return "Hello! I'm Laura, your Platform Oracle for Professional Diver. I'm here to guide you through every aspect of our comprehensive training platform, help with any technical or account issues, and share opportunities like our lucrative 50% commission affiliate program. For diving operations questions, I'll connect you with our exclusive Diver Well AI consultant. For industry connections worldwide, I can direct you to Lead Recon's AI system at leadrecon.net. If you need to speak with an admin directly, I can also schedule consultations! What can I help you achieve today?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-slate-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src={diverWellLogo} 
                alt="Professional Diver - Diver Well Training" 
                className="w-10 h-10 rounded-lg"
              />
              <div>
                <div className="text-lg font-bold text-slate-900">Professional Diver</div>
                <div className="text-xs text-slate-500">Laura - Platform Oracle</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Laura Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-purple-200 bg-gradient-to-b from-purple-50 to-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Headphones className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Laura</CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Platform Oracle
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900 mb-2">Your Platform Oracle for:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <User className="w-3 h-3" />
                        <span>Platform Guidance & Support</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                        </svg>
                        <span>50% Commission Affiliate Program</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                        </svg>
                        <span>Industry Connections Worldwide</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-800">
                      🚀 <strong>Oracle Tip:</strong> Ask me about our 50% affiliate program, platform optimization, industry connections, or technical support. For diving operations, I'll connect you with Diver Well AI!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Headphones className="w-4 h-4 text-purple-600" />
                  </div>
                  <span>Chat with Laura</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={message.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}>
                            {message.sender === 'user' ? 'U' : 'L'}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`rounded-lg p-3 ${
                          message.sender === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 text-slate-900'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex space-x-2 max-w-[80%]">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-purple-100 text-purple-600">L</AvatarFallback>
                        </Avatar>
                        <div className="bg-slate-100 rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1"
                      data-testid="input-chat-message"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputText.trim()}
                      className="bg-purple-600 hover:bg-purple-700"
                      data-testid="button-send-message"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}