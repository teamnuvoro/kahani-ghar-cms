"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { AudioUpload } from "@/components/upload/AudioUpload";
import { SlideEditor } from "@/components/slide/SlideEditor";
import { Episode, EpisodeInsert, Slide } from "@/lib/types/database";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";

const episodeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  audio_url: z.string().min(1, "Audio file is required"),
  episode_number: z.number().nullable().optional(),
  is_published: z.boolean().default(false),
  slides: z.array(
    z.object({
      image_url: z.string(),
      start_time: z.number(),
    })
  ).optional(),
});

type EpisodeFormData = z.infer<typeof episodeSchema>;

interface EpisodeFormProps {
  storyId: string;
  episode?: Episode;
}

export function EpisodeForm({ storyId, episode }: EpisodeFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(episode?.audio_url || "");
  const [slides, setSlides] = useState<Slide[]>(
    episode?.slides || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EpisodeFormData>({
    resolver: zodResolver(episodeSchema),
    defaultValues: {
      title: episode?.title || "",
      description: episode?.description || "",
      audio_url: episode?.audio_url || "",
      episode_number: episode?.episode_number || null,
      is_published: episode?.is_published || false,
      slides: episode?.slides || [],
    },
  });

  const isPublished = watch("is_published");

  useEffect(() => {
    setValue("audio_url", audioUrl);
  }, [audioUrl, setValue]);

  useEffect(() => {
    setValue("slides", slides);
  }, [slides, setValue]);

  const onSubmit = async (data: EpisodeFormData) => {
    setLoading(true);

    try {
      const supabase = createClient();

      const episodeData = {
        story_id: storyId,
        title: data.title,
        description: data.description || null,
        audio_url: data.audio_url,
        episode_number: data.episode_number,
        is_published: data.is_published,
        slides: data.slides && data.slides.length > 0 ? data.slides : null,
      };

      if (episode) {
        // Update existing episode
        const { error } = await supabase
          .from("episodes")
          .update(episodeData)
          .eq("id", episode.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Episode updated successfully",
        });
      } else {
        // Create new episode
        const { error } = await supabase.from("episodes").insert(episodeData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Episode created successfully",
        });
      }

      router.push(`/stories/${storyId}`);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save episode",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Episode title"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Episode description"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="episode_number">Episode Number</Label>
        <Input
          id="episode_number"
          type="number"
          {...register("episode_number", { valueAsNumber: true })}
          placeholder="1"
        />
      </div>

      <AudioUpload
        value={audioUrl}
        onChange={setAudioUrl}
        label="Audio File"
        required
      />
      {errors.audio_url && (
        <p className="text-sm text-destructive">{errors.audio_url.message}</p>
      )}

      <SlideEditor slides={slides} onChange={setSlides} />

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_published"
          checked={isPublished}
          onCheckedChange={(checked) => setValue("is_published", checked === true)}
        />
        <Label htmlFor="is_published" className="cursor-pointer">
          Publish this episode
        </Label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : episode ? "Update Episode" : "Create Episode"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
