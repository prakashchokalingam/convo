"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Plus, 
  Calendar,
  BarChart3,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface Form {
  id: string;
  name: string;
  description: string | null;
  isPublished: boolean;
  isConversational: boolean;
  createdAt: string;
  updatedAt: string;
  responseCount: number;
}

interface FormsResponse {
  forms: Form[];
  pagination: {
    page: number;
    limit: number;
    totalForms: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function FormsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [forms, setForms] = useState<Form[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    totalForms: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
      return;
    }

    if (isLoaded && user) {
      fetchForms();
    }
  }, [isLoaded, user, router]);

  const fetchForms = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/forms?page=${page}&limit=100`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch forms");
      }

      const data: FormsResponse = await response.json();
      setForms(data.forms);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching forms:", error);
      toast({
        title: "Error",
        description: "Failed to load forms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePublish = async (formId: string, currentStatus: boolean) => {
    try {
      setActionLoading(formId);
      const response = await fetch(`/api/forms/${formId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublished: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update form status");
      }

      // Update local state
      setForms(prev => prev.map(form => 
        form.id === formId 
          ? { ...form, isPublished: !currentStatus }
          : form
      ));

      toast({
        title: "Form updated",
        description: `Form ${!currentStatus ? 'published' : 'unpublished'} successfully.`,
      });
    } catch (error) {
      console.error("Error updating form:", error);
      toast({
        title: "Error",
        description: "Failed to update form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteForm = async (formId: string) => {
    if (!confirm("Are you sure you want to delete this form? This action cannot be undone.")) {
      return;
    }

    try {
      setActionLoading(formId);
      const response = await fetch(`/api/forms/${formId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete form");
      }

      // Remove from local state
      setForms(prev => prev.filter(form => form.id !== formId));
      
      toast({
        title: "Form deleted",
        description: "Form has been permanently deleted.",
      });
    } catch (error) {
      console.error("Error deleting form:", error);
      toast({
        title: "Error",
        description: "Failed to delete form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forms</h1>
          <p className="text-gray-600 mt-1">
            Manage your forms and track responses
          </p>
        </div>
        <Button asChild>
          <Link href="/forms/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Form
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.totalForms}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Live Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {forms.filter(f => f.isPublished).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {forms.reduce((sum, form) => sum + form.responseCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forms List */}
      {forms.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
                <p className="text-gray-500 mb-4">Create your first form to get started</p>
                <Button asChild>
                  <Link href="/forms/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Form
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {forms.map((form) => (
            <Card key={form.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {form.name}
                      </h3>
                      <Badge 
                        variant={form.isPublished ? "default" : "secondary"}
                        className={form.isPublished ? "bg-green-100 text-green-800" : ""}
                      >
                        {form.isPublished ? "Live" : "Draft"}
                      </Badge>
                      {form.isConversational && (
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          Conversational
                        </Badge>
                      )}
                    </div>
                    
                    {form.description && (
                      <p className="text-gray-600 mb-3">{form.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="h-4 w-4" />
                        <span>{form.responseCount} responses</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Updated {formatDate(form.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Edit Button - disabled for published forms */}
                    <Button
                      variant="outline"
                      size="sm"
                      asChild={!form.isPublished}
                      disabled={form.isPublished}
                      className={form.isPublished ? "cursor-not-allowed opacity-50" : ""}
                    >
                      {form.isPublished ? (
                        <span>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </span>
                      ) : (
                        <Link href={`/forms/${form.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      )}
                    </Button>
                    
                    {/* Publish/Unpublish Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(form.id, form.isPublished)}
                      disabled={actionLoading === form.id}
                    >
                      {actionLoading === form.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : form.isPublished ? (
                        <EyeOff className="h-4 w-4 mr-2" />
                      ) : (
                        <Eye className="h-4 w-4 mr-2" />
                      )}
                      {form.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    
                    {/* Delete Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteForm(form.id)}
                      disabled={actionLoading === form.id}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      {actionLoading === form.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-600">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.totalForms)} of{' '}
            {pagination.totalForms} forms
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchForms(pagination.page - 1)}
              disabled={!pagination.hasPrev}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchForms(pagination.page + 1)}
              disabled={!pagination.hasNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
