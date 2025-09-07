import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Video, 
  Image, 
  Download, 
  Play, 
  BookOpen, 
  File,
  Presentation,
  Calculator,
  MapPin,
  Clock,
  Users,
  Award
} from "lucide-react";

interface EnhancedLessonContentProps {
  content: string;
  trackSlug: string;
  lessonTitle: string;
}

// Rich media content for each track
const RICH_MEDIA_CONTENT = {
  "ndt-inspection": {
    videos: [
      {
        id: "visual-inspection-demo",
        title: "Visual Inspection Techniques",
        duration: "12:45",
        description: "Step-by-step demonstration of underwater visual inspection procedures",
        thumbnail: "/api/placeholder/320/180"
      },
      {
        id: "ultrasonic-testing",
        title: "Ultrasonic Thickness Gauging",
        duration: "8:30",
        description: "How to use ultrasonic equipment for accurate thickness measurements",
        thumbnail: "/api/placeholder/320/180"
      }
    ],
    documents: [
      {
        id: "inspection-checklist",
        title: "Underwater Inspection Checklist",
        type: "PDF",
        size: "2.3 MB",
        description: "Comprehensive checklist for underwater inspection operations"
      },
      {
        id: "ndt-standards",
        title: "NDT Standards & Procedures",
        type: "PDF", 
        size: "5.1 MB",
        description: "Industry standards for non-destructive testing"
      }
    ],
    interactive: [
      {
        id: "corrosion-calculator",
        title: "Corrosion Rate Calculator",
        type: "Tool",
        description: "Calculate corrosion rates and predict material degradation"
      },
      {
        id: "inspection-simulator",
        title: "Virtual Inspection Simulator",
        type: "Simulation",
        description: "Practice inspection techniques in a virtual environment"
      }
    ]
  },
  "diver-medic": {
    videos: [
      {
        id: "abcde-assessment",
        title: "ABCDE Emergency Assessment",
        duration: "15:20",
        description: "Complete guide to emergency patient assessment underwater",
        thumbnail: "/api/placeholder/320/180"
      },
      {
        id: "decompression-sickness",
        title: "Decompression Sickness Treatment",
        duration: "10:15",
        description: "Recognizing and treating DCS in diving emergencies",
        thumbnail: "/api/placeholder/320/180"
      }
    ],
    documents: [
      {
        id: "medical-protocols",
        title: "Diving Medical Protocols",
        type: "PDF",
        size: "3.8 MB",
        description: "Comprehensive medical procedures for diving emergencies"
      },
      {
        id: "emergency-drugs",
        title: "Emergency Drug Reference",
        type: "PDF",
        size: "1.2 MB",
        description: "Quick reference for emergency medications"
      }
    ],
    interactive: [
      {
        id: "medical-calculator",
        title: "Medical Calculations Tool",
        type: "Tool",
        description: "Calculate drug dosages and medical parameters"
      },
      {
        id: "emergency-scenarios",
        title: "Emergency Scenario Trainer",
        type: "Simulation",
        description: "Practice emergency response procedures"
      }
    ]
  }
  // Add more tracks as needed
};

export default function EnhancedLessonContent({ content, trackSlug, lessonTitle }: EnhancedLessonContentProps) {
  const [activeTab, setActiveTab] = useState("content");
  const richMedia = RICH_MEDIA_CONTENT[trackSlug as keyof typeof RICH_MEDIA_CONTENT] || RICH_MEDIA_CONTENT["ndt-inspection"];

  return (
    <div className="space-y-6">
      {/* Enhanced Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <File className="w-4 h-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="interactive" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Tools
          </TabsTrigger>
        </TabsList>

        {/* Main Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {lessonTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate max-w-none">
                <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {richMedia.videos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                      <Play className="w-5 h-5 mr-2" />
                      Play Video
                    </Button>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-black bg-opacity-70">
                    {video.duration}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button size="sm">
                      <Play className="w-4 h-4 mr-1" />
                      Watch Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <div className="grid gap-4">
            {richMedia.documents.map((doc) => (
              <Card key={doc.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <File className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{doc.title}</h3>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <Badge variant="outline">{doc.type}</Badge>
                        <span className="text-xs text-gray-500">{doc.size}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Interactive Tools Tab */}
        <TabsContent value="interactive" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {richMedia.interactive.map((tool) => (
              <Card key={tool.id} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calculator className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{tool.title}</h3>
                    <Badge variant="outline">{tool.type}</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                <Button className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Launch Tool
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Learning Progress Indicators */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Learning Progress</h3>
                <p className="text-sm text-blue-700">Track your advancement through professional diving skills</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">85%</div>
              <div className="text-sm text-blue-700">Complete</div>
            </div>
          </div>
          <div className="mt-3 bg-blue-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
