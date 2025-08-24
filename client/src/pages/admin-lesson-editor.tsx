import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Save, Eye, Hash, Link, Bold, Italic } from "lucide-react";
import { Link as RouterLink } from "wouter";

export default function AdminLessonEditor() {
  const [, params] = useRoute("/admin/lessons/:id");
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);
  const [content, setContent] = useState("");
  const [trackId, setTrackId] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["/api/lessons", params?.id],
    enabled: !!params?.id,
  });

  const { data: tracks } = useQuery({
    queryKey: ["/api/tracks"],
  });

  // Initialize form when lesson data loads
  useState(() => {
    if (lesson) {
      setTitle(lesson.title || "");
      setOrder(lesson.order || 1);
      setContent(lesson.content || "");
      setTrackId(lesson.trackId || "");
    }
  }, [lesson]);

  const updateLessonMutation = useMutation({
    mutationFn: async (lessonData: any) => {
      return apiRequest("PATCH", `/api/lessons/${params?.id}`, lessonData);
    },
    onSuccess: () => {
      toast({
        title: "Lesson Updated!",
        description: "The lesson has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/lessons", params?.id] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update lesson. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateLessonMutation.mutate({
      title,
      order,
      content,
      trackId,
    });
  };

  const insertMarkdown = (type: string) => {
    const textarea = document.getElementById("content-editor") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let replacement = "";
    switch (type) {
      case "bold":
        replacement = `**${selectedText || "bold text"}**`;
        break;
      case "italic":
        replacement = `*${selectedText || "italic text"}*`;
        break;
      case "header":
        replacement = `## ${selectedText || "Header"}`;
        break;
      case "link":
        replacement = `[${selectedText || "link text"}](https://example.com)`;
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + replacement.length - (selectedText ? 0 : replacement.length - start),
        start + replacement.length - (selectedText ? 0 : replacement.length - start)
      );
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="p-6 space-y-6">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-slate-500" data-testid="text-lesson-not-found">
              Lesson not found
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <RouterLink href="/admin">
                  <button className="text-slate-500 hover:text-slate-700" data-testid="button-back">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </RouterLink>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900" data-testid="text-editor-title">
                    Edit Lesson: {title || lesson.title}
                  </h2>
                  <p className="text-sm text-slate-500">
                    Lesson {order}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  data-testid="button-preview"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showPreview ? "Edit" : "Preview"}
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={updateLessonMutation.isPending}
                  className="bg-primary-500 hover:bg-primary-600 text-white"
                  data-testid="button-save"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateLessonMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              {/* Title Field */}
              <div>
                <Label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                  Lesson Title
                </Label>
                <Input 
                  id="title"
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                  placeholder="Enter lesson title"
                  data-testid="input-title"
                />
              </div>

              {/* Order and Track Fields */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="order" className="block text-sm font-medium text-slate-700 mb-2">
                    Lesson Order
                  </Label>
                  <Input 
                    id="order"
                    type="number" 
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                    className="w-full"
                    min="1"
                    data-testid="input-order"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-slate-700 mb-2">
                    Track
                  </Label>
                  <Select value={trackId} onValueChange={setTrackId}>
                    <SelectTrigger data-testid="select-track">
                      <SelectValue placeholder="Select a track" />
                    </SelectTrigger>
                    <SelectContent>
                      {tracks?.map((track: any) => (
                        <SelectItem key={track.id} value={track.id}>
                          {track.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <Label className="block text-sm font-medium text-slate-700 mb-2">
                  Lesson Content {showPreview ? "(Preview)" : "(Markdown)"}
                </Label>
                {showPreview ? (
                  <div className="border border-gray-300 rounded-lg p-4 min-h-[500px] bg-white">
                    <article 
                      className="prose prose-slate max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/## (.*?)(<br>|$)/g, '<h2>$1</h2>$2')
                      }}
                      data-testid="content-preview"
                    />
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
                      <div className="flex space-x-2">
                        <button 
                          type="button" 
                          onClick={() => insertMarkdown("header")}
                          className="p-1 text-slate-600 hover:text-slate-900 hover:bg-gray-200 rounded"
                          title="Header"
                          data-testid="button-header"
                        >
                          <Hash className="w-4 h-4" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => insertMarkdown("bold")}
                          className="p-1 text-slate-600 hover:text-slate-900 hover:bg-gray-200 rounded"
                          title="Bold"
                          data-testid="button-bold"
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => insertMarkdown("italic")}
                          className="p-1 text-slate-600 hover:text-slate-900 hover:bg-gray-200 rounded"
                          title="Italic"
                          data-testid="button-italic"
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => insertMarkdown("link")}
                          className="p-1 text-slate-600 hover:text-slate-900 hover:bg-gray-200 rounded"
                          title="Link"
                          data-testid="button-link"
                        >
                          <Link className="w-4 h-4" />
                        </button>
                        <div className="w-px bg-gray-300 mx-2"></div>
                        <button 
                          type="button" 
                          onClick={() => setShowPreview(true)}
                          className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1 hover:bg-gray-200 rounded"
                          data-testid="button-toolbar-preview"
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                    <Textarea 
                      id="content-editor"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={20}
                      className="border-0 focus:ring-0 font-mono text-sm resize-none rounded-none"
                      placeholder="Enter lesson content in Markdown format..."
                      data-testid="textarea-content"
                    />
                  </div>
                )}
                <p className="mt-2 text-sm text-slate-500">
                  Supports Markdown formatting including headers (##), bold (**text**), italic (*text*), and links ([text](url)).
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <RouterLink href="/admin">
                  <Button 
                    type="button" 
                    variant="ghost"
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                </RouterLink>
                <div className="space-x-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    data-testid="button-save-draft"
                  >
                    Save as Draft
                  </Button>
                  <Button 
                    type="submit"
                    disabled={updateLessonMutation.isPending}
                    className="bg-primary-500 hover:bg-primary-600 text-white"
                    data-testid="button-publish"
                  >
                    {updateLessonMutation.isPending ? "Publishing..." : "Publish Changes"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
