import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { StoriesList } from "@/components/story/StoriesList";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: stories, error } = await supabase
    .from("stories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching stories:", error);
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Stories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your story content
          </p>
        </div>
        <Link href="/stories/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Story
          </Button>
        </Link>
      </div>

      <StoriesList initialStories={stories || []} />
    </div>
  );
}
