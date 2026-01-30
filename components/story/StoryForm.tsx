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
  cover_image_url: z.string().optional(),
  language: z.enum(["en", "hi", "ta"]),
  release_date: z.string().optional().nullable(),
  is_published: z.boolean().default(false),
  rank: z.number().nullable().optional(),
  is_banner: z.boolean().default(false),
  is_new_launch: z.boolean().default(false),
  banner_image_url: z.string().min(1, "Banner image is required"),
  tile_image_url: z.string().min(1, "Tile image is required"),
  homepage_rank: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number({ required_error: "Homepage section rank is required", invalid_type_error: "Homepage section rank must be a number" })
  ),
  new_launch_rank: z.number().nullable().optional(),
});

type StoryFormData = z.infer<typeof storySchema>;

interface StoryFormProps {
  story?: Story;
}

export function StoryForm({ story }: StoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [bannerImageUrl, setBannerImageUrl] = useState(story?.banner_image_url || "");
  const [tileImageUrl, setTileImageUrl] = useState(story?.tile_image_url || "");

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
      is_banner: story?.is_banner || false,
      is_new_launch: story?.is_new_launch || false,
      banner_image_url: story?.banner_image_url || "",
      tile_image_url: story?.tile_image_url || "",
      homepage_rank: story?.homepage_rank ?? 0,
      new_launch_rank: story?.new_launch_rank ?? null,
    },
  });

  const language = watch("language");
  const isPublished = watch("is_published");
  const isBanner = watch("is_banner");
  const isNewLaunch = watch("is_new_launch");

  useEffect(() => {
    setValue("banner_image_url", bannerImageUrl);
  }, [bannerImageUrl, setValue]);

  useEffect(() => {
    setValue("tile_image_url", tileImageUrl);
  }, [tileImageUrl, setValue]);

  const onSubmit = async (data: StoryFormData) => {
    setLoading(true);

    try {
      const supabase = createClient();

      // Convert NaN to null for rank fields (when input is empty)
      const rankValue = data.rank !== undefined && !isNaN(data.rank as number) ? data.rank : null;
      // homepage_rank is required, so it should always be a valid number
      const homepageRankValue = data.homepage_rank !== undefined && !isNaN(data.homepage_rank as number) ? data.homepage_rank : 0;
      const newLaunchRankValue = data.new_launch_rank !== undefined && !isNaN(data.new_launch_rank as number) ? data.new_launch_rank : null;

      if (story) {
        // Update existing story
        const { error } = await supabase
          .from("stories")
          .update({
            title: data.title,
            description: data.description || null,
            cover_image_url: data.cover_image_url || null,
            language: data.language,
            release_date: data.release_date || null,
            is_published: data.is_published,
            rank: rankValue,
            is_banner: data.is_banner,
            is_new_launch: data.is_new_launch,
            banner_image_url: data.banner_image_url,
            tile_image_url: data.tile_image_url,
            homepage_rank: homepageRankValue,
            new_launch_rank: newLaunchRankValue,
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
          cover_image_url: data.cover_image_url || null,
          language: data.language,
          release_date: data.release_date || null,
          is_published: data.is_published,
          rank: rankValue,
          is_banner: data.is_banner,
          is_new_launch: data.is_new_launch,
          banner_image_url: data.banner_image_url,
          tile_image_url: data.tile_image_url,
          homepage_rank: homepageRankValue,
          new_launch_rank: newLaunchRankValue,
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

      <hr className="my-6" />

      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Homepage Content Controls</h3>

        <div className="space-y-6">
          <div className="space-y-4">
            <ImageUpload
              value={bannerImageUrl}
              onChange={setBannerImageUrl}
              folder="banners"
              label="Banner Image (for homepage banner)"
              required
            />
            {errors.banner_image_url && (
              <p className="text-sm text-destructive">{errors.banner_image_url.message}</p>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_banner"
                checked={isBanner}
                onCheckedChange={(checked) => setValue("is_banner", checked === true)}
              />
              <Label htmlFor="is_banner" className="cursor-pointer">
                Add to Banner
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="homepage_rank">
                Homepage Section Rank <span className="text-destructive">*</span>
              </Label>
              <Input
                id="homepage_rank"
                type="number"
                placeholder="Enter rank (lower values appear first)"
                {...register("homepage_rank", { valueAsNumber: true, required: true })}
              />
              <p className="text-sm text-muted-foreground">
                Determines which story section (with episodes) appears first on homepage. Lower rank values appear first.
              </p>
              {errors.homepage_rank && (
                <p className="text-sm text-destructive">{errors.homepage_rank.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <ImageUpload
              value={tileImageUrl}
              onChange={setTileImageUrl}
              folder="tiles"
              label="Tile Image (for explore stories section)"
              required
            />
            {errors.tile_image_url && (
              <p className="text-sm text-destructive">{errors.tile_image_url.message}</p>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_new_launch"
                checked={isNewLaunch}
                onCheckedChange={(checked) => setValue("is_new_launch", checked === true)}
              />
              <Label htmlFor="is_new_launch" className="cursor-pointer">
                Add to New Launches
              </Label>
            </div>

            {isNewLaunch && (
              <div className="space-y-2">
                <Label htmlFor="new_launch_rank">New Launch Rank</Label>
                <Input
                  id="new_launch_rank"
                  type="number"
                  placeholder="Leave empty for no rank"
                  {...register("new_launch_rank", { valueAsNumber: true })}
                />
                <p className="text-sm text-muted-foreground">
                  Lower rank values appear first. Leave empty to exclude from ranking.
                </p>
              </div>
            )}
          </div>
        </div>
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
