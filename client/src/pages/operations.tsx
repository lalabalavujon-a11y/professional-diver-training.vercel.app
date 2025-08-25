import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Crown, 
  Lock, 
  CheckCircle, 
  AlertTriangle, 
  Wrench, 
  Shield, 
  Search,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  Timer,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import diverWellLogo from "@assets/DIVER_WELL_TRAINING-500x500-rbg-preview_1756088331820.png";
import Navigation from "@/components/navigation";

// Mock operational data - in real app this would come from backend
const operationalData = {
  diveOperations: [
    {
      id: "DO-001",
      title: "Platform Installation - North Sea",
      date: "2025-08-25",
      depth: "45m",
      supervisor: "John Smith",
      divers: 4,
      status: "In Progress",
      type: "Commercial"
    },
    {
      id: "DO-002", 
      title: "Hull Inspection - Port Terminal",
      date: "2025-08-26",
      depth: "12m",
      supervisor: "Sarah Johnson",
      divers: 2,
      status: "Scheduled",
      type: "Inspection"
    }
  ],
  inspectionReports: [
    {
      id: "NDT-001",
      structure: "Pipeline Section A-12",
      inspector: "Mike Wilson",
      date: "2025-08-24",
      findings: "Minor corrosion detected",
      severity: "Low",
      status: "Completed"
    },
    {
      id: "NDT-002",
      structure: "Weld Joint B-08",
      inspector: "Lisa Chen",
      date: "2025-08-25",
      findings: "Crack initiation observed",
      severity: "High",
      status: "Requires Action"
    }
  ],
  lstOperations: [
    {
      id: "LST-001",
      diveId: "DO-001",
      systems: ["Primary Air", "Emergency Gas", "Communications"],
      technician: "Dave Brown",
      status: "Monitoring",
      lastCheck: "2025-08-25 14:30"
    },
    {
      id: "LST-002",
      diveId: "DO-002",
      systems: ["Hot Water", "Umbilical", "Decompression"],
      technician: "Anna Taylor",
      status: "Standby",
      lastCheck: "2025-08-25 12:00"
    }
  ]
};

export default function Operations() {
  const { toast } = useToast();
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);

  // Get current user to check subscription status
  const { data: currentUser } = useQuery({
    queryKey: ["/api/users/current"],
    queryFn: async () => {
      const email = localStorage.getItem('userEmail') || 'lalabalavu.jon@gmail.com';
      const response = await fetch(`/api/users/current?email=${email}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    }
  });

  const hasOperationsAccess = currentUser?.subscriptionType === 'LIFETIME' || currentUser?.role === 'ADMIN';

  const operationalApps = [
    {
      id: "dive-supervisor",
      title: "Dive Supervisor Operations",
      description: "Comprehensive dive operation management, crew coordination, and safety oversight tools",
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      color: "blue",
      features: [
        "Real-time dive monitoring",
        "Crew assignment & scheduling", 
        "Safety protocol management",
        "Emergency response coordination",
        "Dive log management",
        "Equipment status tracking"
      ],
      userRole: "Dive Supervisor"
    },
    {
      id: "lst-manager",
      title: "Life Support Technician (LST)",
      description: "Life support systems monitoring, maintenance scheduling, and critical equipment management",
      icon: <Wrench className="w-8 h-8 text-green-600" />,
      color: "green", 
      features: [
        "Life support system monitoring",
        "Equipment maintenance tracking",
        "Gas supply management",
        "Emergency backup systems",
        "Pressure & flow monitoring",
        "System diagnostics & alerts"
      ],
      userRole: "Life Support Technician"
    },
    {
      id: "ndt-inspector",
      title: "NDT Underwater Inspection Controller",
      description: "Non-destructive testing inspection management, reporting, and quality assurance tools",
      icon: <Search className="w-8 h-8 text-purple-600" />,
      color: "purple",
      features: [
        "Inspection planning & scheduling",
        "NDT method selection & protocols",
        "Real-time inspection data capture",
        "Defect analysis & reporting",
        "Quality assurance workflows",
        "Certification compliance tracking"
      ],
      userRole: "NDT Inspector"
    }
  ];

  const handleAppAccess = (appId: string) => {
    if (!hasOperationsAccess) {
      setSubscriptionModalOpen(true);
      return;
    }
    setSelectedApp(appId);
  };

  const renderAppContent = (appId: string) => {
    switch (appId) {
      case "dive-supervisor":
        return <DiveSupervisorApp />;
      case "lst-manager":
        return <LSTManagerApp />;
      case "ndt-inspector":
        return <NDTInspectorApp />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Operations Center</h1>
              <p className="text-lg text-slate-600">
                Professional operational management applications for diving professionals
              </p>
            </div>
            {hasOperationsAccess && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" />
                Operations Access Enabled
              </Badge>
            )}
          </div>
        </div>

        {selectedApp ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setSelectedApp(null)}
                className="flex items-center space-x-2"
              >
                ← Back to Operations
              </Button>
              <h2 className="text-xl font-semibold text-slate-900">
                {operationalApps.find(app => app.id === selectedApp)?.title}
              </h2>
            </div>
            {renderAppContent(selectedApp)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {operationalApps.map((app) => (
              <Card 
                key={app.id} 
                className={`relative cursor-pointer transition-all hover:shadow-lg ${
                  hasOperationsAccess 
                    ? `border-${app.color}-200 hover:border-${app.color}-300` 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleAppAccess(app.id)}
              >
                {!hasOperationsAccess && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="text-center">
                      <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600">Subscription Required</p>
                    </div>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {app.icon}
                        <Badge variant="outline" className="text-xs">
                          {app.userRole}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{app.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {app.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">Key Features:</h4>
                      <ul className="text-xs text-slate-600 space-y-1">
                        {app.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                        {app.features.length > 4 && (
                          <li className="text-xs text-slate-400">
                            +{app.features.length - 4} more features
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Subscription Modal */}
        <Dialog open={subscriptionModalOpen} onOpenChange={setSubscriptionModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Crown className="w-6 h-6 text-yellow-600" />
                <span>Operations Access Required</span>
              </DialogTitle>
              <DialogDescription>
                Access to operational management applications requires an active subscription or lifetime membership.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Professional Operations Suite</h4>
                    <p className="text-sm text-yellow-800 mt-1">
                      These specialized operational management tools are designed for professional diving operations 
                      and require subscription access to ensure quality, support, and regular updates.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Included in Operations Access:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Complete operational management suite</li>
                  <li>• Real-time monitoring & reporting</li>
                  <li>• Compliance & safety tracking</li>
                  <li>• Advanced analytics & insights</li>
                  <li>• 24/7 technical support</li>
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                onClick={() => setSubscriptionModalOpen(false)}
                variant="outline" 
                className="flex-1"
              >
                Maybe Later
              </Button>
              <Button 
                onClick={() => {
                  setSubscriptionModalOpen(false);
                  toast({
                    title: "Contact Sales",
                    description: "Please contact our sales team for subscription options.",
                  });
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Upgrade Subscription
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

// Individual operational app components
function DiveSupervisorApp() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>Active Dive Operations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {operationalData.diveOperations.map((operation) => (
                <div key={operation.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{operation.title}</h4>
                    <Badge variant={operation.status === 'In Progress' ? 'default' : 'secondary'}>
                      {operation.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                    <div>Date: {operation.date}</div>
                    <div>Depth: {operation.depth}</div>
                    <div>Supervisor: {operation.supervisor}</div>
                    <div>Divers: {operation.divers}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Safety Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Incident-Free Days</span>
                <span className="font-semibold text-green-600">127</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Active Operations</span>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Crew Availability</span>
                <span className="font-semibold text-blue-600">95%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LSTManagerApp() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wrench className="w-5 h-5 text-green-600" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {operationalData.lstOperations.map((operation) => (
                <div key={operation.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Dive {operation.diveId}</h4>
                    <Badge variant={operation.status === 'Monitoring' ? 'default' : 'secondary'}>
                      {operation.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-600">
                    <div>Technician: {operation.technician}</div>
                    <div>Last Check: {operation.lastCheck}</div>
                    <div className="mt-2">
                      <span className="font-medium">Systems: </span>
                      {operation.systems.join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Timer className="w-5 h-5 text-orange-600" />
              <span>Maintenance Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-l-4 border-orange-500 pl-3">
                <div className="font-medium">Primary Air System</div>
                <div className="text-sm text-slate-600">Due: Today</div>
              </div>
              <div className="border-l-4 border-blue-500 pl-3">
                <div className="font-medium">Emergency Gas Supply</div>
                <div className="text-sm text-slate-600">Due: Tomorrow</div>
              </div>
              <div className="border-l-4 border-green-500 pl-3">
                <div className="font-medium">Communication System</div>
                <div className="text-sm text-slate-600">Due: Next Week</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NDTInspectorApp() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-purple-600" />
              <span>Inspection Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {operationalData.inspectionReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{report.structure}</h4>
                    <Badge variant={report.severity === 'High' ? 'destructive' : 'secondary'}>
                      {report.severity} Risk
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                    <div>Inspector: {report.inspector}</div>
                    <div>Date: {report.date}</div>
                    <div className="col-span-2">Findings: {report.findings}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Compliance Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Inspections Complete</span>
                <span className="font-semibold text-green-600">24/25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Critical Findings</span>
                <span className="font-semibold text-red-600">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Compliance Rate</span>
                <span className="font-semibold text-blue-600">96%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}