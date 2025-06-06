import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, FileText, BarChart3, Settings } from "lucide-react";
import { db } from "@/lib/db";
import { forms } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Check if user has any forms
  const userFormsCount = await db
    .select({ count: count() })
    .from(forms)
    .where(eq(forms.userId, user.id));

  const formsCount = userFormsCount[0]?.count || 0;

  // If user has no forms, redirect to form creation
  if (formsCount === 0) {
    redirect("/forms/new");
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Create and manage your conversational forms
          </p>
        </div>
        <Button asChild>
          <Link href="/forms/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Form
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total Forms</h3>
          </div>
          <p className="text-2xl font-bold">{formsCount}</p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total Responses</h3>
          </div>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Completion Rate</h3>
          </div>
          <p className="text-2xl font-bold">0%</p>
        </div>
      </div>

      {/* Empty State */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col items-center justify-center py-16">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No forms yet</h3>
          <p className="text-muted-foreground text-center max-w-sm mb-6">
            Get started by creating your first conversational form. It only takes a few seconds with AI.
          </p>
          <Button asChild>
            <Link href="/forms/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Form
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}