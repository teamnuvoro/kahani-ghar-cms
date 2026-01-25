"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Story } from "@/lib/types/database";
import { Eye, Edit, Archive, ArchiveRestore } from "lucide-react";
import Image from "next/image";

interface StoryCardProps {
  story: Story;
  onToggleArchive: (id: string, isPublished: boolean) => void;
}

const languageLabels: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
};

export function StoryCard({ story, onToggleArchive }: StoryCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        {story.cover_image_url ? (
          <Image
            src={story.cover_image_url}
            alt={story.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        {!story.is_published && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary">Draft</Badge>
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-2">{story.title}</h3>
            <Badge variant="outline" className="mt-2">
              {languageLabels[story.language] || story.language}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {story.description || "No description"}
        </p>
        <div className="flex items-center gap-2">
          <Link href={`/stories/${story.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </Link>
          <Link href={`/stories/${story.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleArchive(story.id, !story.is_published)}
          >
            {story.is_published ? (
              <>
                <Archive className="h-4 w-4 mr-2" />
                Unpublish
              </>
            ) : (
              <>
                <ArchiveRestore className="h-4 w-4 mr-2" />
                Publish
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
