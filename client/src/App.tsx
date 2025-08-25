import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AIAssistant from "@/components/ai-assistant";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import TrackDetail from "@/pages/track-detail";
import LessonDetail from "@/pages/lesson-detail";
import Quiz from "@/pages/quiz";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminInvites from "@/pages/admin-invites";
import AdminLessonEditor from "@/pages/admin-lesson-editor";
import Analytics from "@/pages/analytics";
import CRMDashboard from "@/pages/crm-dashboard";
import Landing from "@/pages/landing";
import TrialSignup from "@/pages/trial-signup";
import Invite from "@/pages/invite";
import SignIn from "@/pages/signin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/home" component={Home} />
      <Route path="/trial-signup" component={TrialSignup} />
      <Route path="/login" component={SignIn} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/tracks/:slug" component={TrackDetail} />
      <Route path="/lessons/:id" component={LessonDetail} />
      <Route path="/lessons/:id/quiz" component={Quiz} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/invites" component={AdminInvites} />
      <Route path="/admin/lessons/:id" component={AdminLessonEditor} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/crm" component={CRMDashboard} />
      <Route path="/invite/:token" component={Invite} />
      <Route path="/signin" component={SignIn} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <AIAssistant />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
