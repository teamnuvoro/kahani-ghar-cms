import { createClient } from "@/lib/supabase/server";
import { StoryForm } from "@/components/story/StoryForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { Story } from "@/lib/types/database";

interface EditStoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStoryPage({ params }: EditStoryPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: story, error } = await supabase
    .from("stories")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !story) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Story</CardTitle>
        </CardHeader>
        <CardContent>
          <StoryForm story={story as Story} />
        </CardContent>
      </Card>
    </div>
  );
}
