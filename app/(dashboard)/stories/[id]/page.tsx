import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EpisodeList } from "@/components/episode/EpisodeList";
import Link from "next/link";
import { Plus, Edit, ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import Image from "next/image";

interface StoryDetailPageProps {
  params: Promise<{ id: string }>;
}

const languageLabels: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
};

export default async function StoryDetailPage({ params }: StoryDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: story, error: storyError } = await supabase
    .from("stories")
    .select("*")
    .eq("id", id)
    .single();

  if (storyError || !story) {
    redirect("/dashboard");
  }

  const { data: episodes, error: episodesError } = await supabase
    .from("episodes")
    .select("*")
    .eq("story_id", id)
    .order("episode_number", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto py-8">
      <Link href="/dashboard">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stories
        </Button>
      </Link>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle>{story.title}</CardTitle>
                <Badge variant="outline">
                  {languageLabels[story.language] || story.language}
                </Badge>
                {!story.is_published && (
                  <Badge variant="secondary">Draft</Badge>
                )}
              </div>
              {story.description && (
                <p className="text-muted-foreground">{story.description}</p>
              )}
            </div>
            <Link href={`/stories/${story.id}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Story
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {story.cover_image_url && (
            <div className="relative h-64 w-full rounded-md overflow-hidden mb-4">
              <Image
                src={story.cover_image_url}
                alt={story.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Episodes</h2>
        <Link href={`/stories/${story.id}/new-episode`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Episode
          </Button>
        </Link>
      </div>

      <EpisodeList
        storyId={id}
        initialEpisodes={episodes || []}
      />
    </div>
  );
}
