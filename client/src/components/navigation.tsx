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
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <DualAIAssistant />
            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}