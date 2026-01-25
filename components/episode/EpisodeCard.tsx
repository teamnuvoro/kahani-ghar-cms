"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Episode } from "@/lib/types/database";
import { Edit, Trash2 } from "lucide-react";

interface EpisodeCardProps {
  episode: Episode;
  onDelete: (id: string) => void;
}

export function EpisodeCard({ episode, onDelete }: EpisodeCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{episode.title}</h3>
              {episode.episode_number !== null && (
                <Badge variant="outline">Episode {episode.episode_number}</Badge>
              )}
              {episode.is_published ? (
                <Badge>Published</Badge>
              ) : (
                <Badge variant="secondary">Draft</Badge>
              )}
            </div>
            {episode.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {episode.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Link href={`/stories/${episode.story_id}/episodes/${episode.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(episode.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
