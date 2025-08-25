import { Link, useLocation } from "wouter";
import { LayoutDashboard, BookOpen, BarChart3, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import diverWellLogo from "@assets/DIVER_WELL_TRAINING-500x500-rbg-preview_1756088331820.png";
import UserProfileDropdown from "@/components/user-profile-dropdown";
import DualAIAssistant from "@/components/dual-ai-assistant";

export default function Navigation() {
  const [location] = useLocation();

  const isMoreMenuActive = ["/admin", "/markdown-editor", "/learning-path", "/operations", "/crm", "/analytics"].some(path => 
    location === path || location.startsWith(path)
  );

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" data-testid="link-home">
              <a className="flex items-center space-x-3">
                <img 
                  src={diverWellLogo} 
                  alt="Professional Diver - Diver Well Training" 
                  className="w-10 h-10 rounded-lg"
                />
                <div>
                  <h1 className="text-lg font-bold text-slate-900">Professional Diver</h1>
                  <p className="text-xs text-slate-500">Diver Well Training</p>
                </div>
              </a>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/" data-testid="link-tracks">
                <a className={`font-medium transition-colors ${
                  location === "/" 
                    ? "text-slate-900" 
                    : "text-slate-600 hover:text-slate-900"
                }`}>
                  Tracks
                </a>
              </Link>
              <Link href="/dashboard" data-testid="link-dashboard">
                <a className={`font-medium transition-colors ${
                  location === "/dashboard" 
                    ? "text-slate-900" 
                    : "text-slate-600 hover:text-slate-900"
                }`}>
                  Dashboard
                </a>
              </Link>
              
              {/* More Menu Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`font-medium transition-colors px-0 h-auto ${
                      isMoreMenuActive 
                        ? "text-slate-900" 
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    data-testid="button-more-menu"
                  >
                    More <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/crm" data-testid="link-crm">
                      <a className="w-full flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4" />
                        <span>CRM</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/analytics" data-testid="link-analytics">
                      <a className="w-full flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4" />
                        <span>Analytics</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin" data-testid="link-admin">
                      <a className="w-full flex items-center space-x-2">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Admin</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/markdown-editor" data-testid="link-markdown-editor">
                      <a className="w-full flex items-center space-x-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Content Editor</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/learning-path" data-testid="link-learning-path">
                      <a className="w-full flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                        </svg>
                        <span>AI Learning Path</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/operations" data-testid="link-operations">
                      <a className="w-full flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                        </svg>
                        <span>Operations</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  
                  <div className="border-t my-2"></div>
                  
                  {/* Platform Links */}
                  <DropdownMenuItem asChild>
                    <Link href="/tracks" data-testid="link-tracks-menu">
                      <a className="w-full flex items-center space-x-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Learning Tracks</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/trial-signup" data-testid="link-trial-signup">
                      <a className="w-full flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span>Free Trial</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/login" data-testid="link-login-menu">
                      <a className="w-full flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                        </svg>
                        <span>Login</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  
                  <div className="border-t my-2"></div>
                  
                  {/* Legal Links */}
                  <DropdownMenuItem asChild>
                    <Link href="/privacy" data-testid="link-privacy">
                      <a className="w-full flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                        </svg>
                        <span>Privacy Policy</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/terms" data-testid="link-terms">
                      <a className="w-full flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <span>Terms of Service</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="mailto:privacy@diverwell.app" className="w-full flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <span>Data Requests</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="mailto:support@diverwell.app" className="w-full flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span>Support</span>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/affiliate" data-testid="link-partners">
              <a className="text-slate-600 hover:text-slate-900 font-medium">
                Partners
              </a>
            </Link>
            <button 
              onClick={() => window.open('https://chatgpt.com/g/g-6897d42d3ba48191b48883a4839c09bf-diver-well-commercial-diver-ai-consultant', '_blank')}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              data-testid="button-ai-consultant-header"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              AI Consultant
            </button>
            <DualAIAssistant />
            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}