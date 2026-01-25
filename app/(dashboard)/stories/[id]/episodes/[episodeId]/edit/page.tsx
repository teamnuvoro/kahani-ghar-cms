import { createClient } from "@/lib/supabase/server";
import { EpisodeForm } from "@/components/episode/EpisodeForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { Episode } from "@/lib/types/database";

interface EditEpisodePageProps {
  params: Promise<{ id: string; episodeId: string }>;
}

export default async function EditEpisodePage({ params }: EditEpisodePageProps) {
  const { id, episodeId } = await params;
  const supabase = await createClient();

  const { data: episode, error } = await supabase
    .from("episodes")
    .select("*")
    .eq("id", episodeId)
    .eq("story_id", id)
    .single();

  if (error || !episode) {
    redirect(`/stories/${id}`);
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Episode</CardTitle>
        </CardHeader>
        <CardContent>
          <EpisodeForm storyId={id} episode={episode as Episode} />
        </CardContent>
      </Card>
    </div>
  );
}
