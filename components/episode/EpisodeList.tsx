"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Episode } from "@/lib/types/database";
import { EpisodeCard } from "@/components/episode/EpisodeCard";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EpisodeListProps {
  storyId: string;
  initialEpisodes: Episode[];
}

export function EpisodeList({ storyId, initialEpisodes }: EpisodeListProps) {
  const [episodes, setEpisodes] = useState<Episode[]>(initialEpisodes);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [episodeToDelete, setEpisodeToDelete] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    setEpisodeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!episodeToDelete) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("episodes")
        .delete()
        .eq("id", episodeToDelete);

      if (error) throw error;

      setEpisodes(episodes.filter((ep) => ep.id !== episodeToDelete));
      setDeleteDialogOpen(false);
      setEpisodeToDelete(null);

      toast({
        title: "Success",
        description: "Episode deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete episode",
        variant: "destructive",
      });
    }
  };

  if (episodes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No episodes yet. Create your first episode!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {episodes.map((episode) => (
          <EpisodeCard
            key={episode.id}
            episode={episode}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Episode</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this episode? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setEpisodeToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
