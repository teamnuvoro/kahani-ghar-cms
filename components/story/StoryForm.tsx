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
import { ImageUpload } from "@/components/upload/ImageUpload";
import { LanguageSelect } from "@/components/story/LanguageSelect";
import { Story, StoryInsert, Language } from "@/lib/types/database";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";

const storySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  cover_image_url: z.string().min(1, "Cover image is required"),
  language: z.enum(["en", "hi", "ta"]),
  release_date: z.string().optional().nullable(),
  is_published: z.boolean().default(false),
  rank: z.number().nullable().optional(),
});

type StoryFormData = z.infer<typeof storySchema>;

interface StoryFormProps {
  story?: Story;
}

export function StoryForm({ story }: StoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(story?.cover_image_url || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      title: story?.title || "",
      description: story?.description || "",
      cover_image_url: story?.cover_image_url || "",
      language: (story?.language as Language) || "en",
      release_date: story?.release_date || null,
      is_published: story?.is_published || false,
      rank: story?.rank ?? null,
    },
  });

  const language = watch("language");
  const isPublished = watch("is_published");

  useEffect(() => {
    setValue("cover_image_url", coverImageUrl);
  }, [coverImageUrl, setValue]);

  const onSubmit = async (data: StoryFormData) => {
    setLoading(true);

    try {
      const supabase = createClient();

      // Convert NaN to null for rank (when input is empty)
      const rankValue = data.rank !== undefined && !isNaN(data.rank as number) ? data.rank : null;

      if (story) {
        // Update existing story
        const { error } = await supabase
          .from("stories")
          .update({
            title: data.title,
            description: data.description || null,
            cover_image_url: data.cover_image_url,
            language: data.language,
            release_date: data.release_date || null,
            is_published: data.is_published,
            rank: rankValue,
          })
          .eq("id", story.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Story updated successfully",
        });
      } else {
        // Create new story
        const { error } = await supabase.from("stories").insert({
          title: data.title,
          description: data.description || null,
          cover_image_url: data.cover_image_url,
          language: data.language,
          release_date: data.release_date || null,
          is_published: data.is_published,
          rank: rankValue,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Story created successfully",
        });
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Story save error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save story";
      toast({
        title: "Error",
        description: errorMessage,
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
          placeholder="Story title"
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
          placeholder="Story description"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Language <span className="text-destructive">*</span></Label>
        <LanguageSelect
          value={language}
          onValueChange={(value) => setValue("language", value)}
        />
        {errors.language && (
          <p className="text-sm text-destructive">{errors.language.message}</p>
        )}
      </div>

      <ImageUpload
        value={coverImageUrl}
        onChange={setCoverImageUrl}
        folder="covers"
        label="Cover Image"
        required
      />
      {errors.cover_image_url && (
        <p className="text-sm text-destructive">{errors.cover_image_url.message}</p>
      )}

      <div className="space-y-2">
        <Label htmlFor="release_date">Release Date</Label>
        <Input
          id="release_date"
          type="date"
          {...register("release_date")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rank">Rank (for homepage ordering)</Label>
        <Input
          id="rank"
          type="number"
          placeholder="Leave empty for no rank"
          {...register("rank", { valueAsNumber: true })}
        />
        <p className="text-sm text-muted-foreground">
          Lower rank values appear first. Leave empty to exclude from ranking.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_published"
          checked={isPublished}
          onCheckedChange={(checked) => setValue("is_published", checked === true)}
        />
        <Label htmlFor="is_published" className="cursor-pointer">
          Publish this story
        </Label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : story ? "Update Story" : "Create Story"}
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
