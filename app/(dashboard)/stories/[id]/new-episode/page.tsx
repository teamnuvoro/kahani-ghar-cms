import { createClient } from "@/lib/supabase/server";
import { EpisodeForm } from "@/components/episode/EpisodeForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

interface NewEpisodePageProps {
  params: Promise<{ id: string }>;
}

export default async function NewEpisodePage({ params }: NewEpisodePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Verify story exists
  const { data: story, error } = await supabase
    .from("stories")
    .select("id")
    .eq("id", id)
    .single();

  if (error || !story) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Episode</CardTitle>
        </CardHeader>
        <CardContent>
          <EpisodeForm storyId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
