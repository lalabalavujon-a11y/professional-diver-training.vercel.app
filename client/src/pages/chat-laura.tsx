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
      text: "Hi! I'm Laura, your Professional Diver platform assistant. I'm here to help with account management, technical support, billing questions, and any platform guidance you need. How can I assist you today?",
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
    
    if (input.includes('password') || input.includes('login')) {
      return "I can help you with password and login issues! For password resets, you can use the 'Forgot Password' link on the sign-in page. If you're having trouble accessing your account, please let me know your email address and I'll guide you through the process.";
    }
    
    if (input.includes('billing') || input.includes('payment') || input.includes('subscription')) {
      return "For billing and subscription questions, I can help explain your current plan, upgrade options, and payment methods. Your lifetime membership includes full access to all training tracks, AI features, and operational tools. What specific billing question do you have?";
    }
    
    if (input.includes('profile') || input.includes('picture') || input.includes('upload')) {
      return "For profile issues, you can update your information in the Profile Settings page. If your profile picture isn't uploading, make sure the file is under 5MB and in JPG, PNG, or GIF format. Would you like me to walk you through the profile update process?";
    }
    
    if (input.includes('track') || input.includes('lesson') || input.includes('course')) {
      return "I can help with accessing tracks and lessons! Your lifetime membership gives you access to all professional diving training tracks. If you're having trouble starting a lesson or accessing content, please let me know which specific track you're trying to access.";
    }
    
    if (input.includes('ai') || input.includes('learning path')) {
      return "The AI Learning Path feature analyzes your progress and creates personalized recommendations! You can access it from your dashboard or the navigation menu. It provides career guidance, learning style analysis, and customized track suggestions based on your goals.";
    }
    
    if (input.includes('technical') || input.includes('error') || input.includes('bug')) {
      return "I'm here to help with technical issues! Please describe the specific problem you're experiencing - what page were you on, what action were you trying to take, and what error message (if any) did you see? This will help me provide the best solution.";
    }
    
    return "Thank you for reaching out! I'm here to help with any questions about your Professional Diver account, platform features, technical support, or billing. Could you please provide more details about what you need assistance with?";
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
                <div className="text-xs text-slate-500">Chat with Laura</div>
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
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Admin & Support Assistant
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900 mb-2">I can help with:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <User className="w-3 h-3" />
                        <span>Account Management</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Settings className="w-3 h-3" />
                        <span>Technical Support</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <HelpCircle className="w-3 h-3" />
                        <span>Platform Guidance</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-purple-800">
                      💡 <strong>Quick tip:</strong> Ask me about password resets, billing questions, profile updates, or any technical issues you're experiencing!
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