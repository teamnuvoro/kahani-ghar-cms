"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/upload/ImageUpload";
import { Slide } from "@/lib/types/database";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SlideEditorProps {
  slides: Slide[];
  onChange: (slides: Slide[]) => void;
}

export function SlideEditor({ slides, onChange }: SlideEditorProps) {
  const addSlide = () => {
    onChange([
      ...slides,
      {
        image_url: "",
        start_time: 0,
      },
    ]);
  };

  const removeSlide = (index: number) => {
    onChange(slides.filter((_, i) => i !== index));
  };

  const updateSlide = (index: number, updates: Partial<Slide>) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Slides</Label>
        <Button type="button" variant="outline" size="sm" onClick={addSlide}>
          <Plus className="h-4 w-4 mr-2" />
          Add Slide
        </Button>
      </div>

      {slides.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No slides yet. Click "Add Slide" to get started.
        </p>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Slide {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSlide(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <ImageUpload
                    value={slide.image_url}
                    onChange={(url) => updateSlide(index, { image_url: url })}
                    folder="slides"
                    label="Slide Image"
                  />

                  <div className="space-y-2">
                    <Label htmlFor={`start_time_${index}`}>
                      Start Time (seconds)
                    </Label>
                    <Input
                      id={`start_time_${index}`}
                      type="number"
                      min="0"
                      step="0.1"
                      value={slide.start_time}
                      onChange={(e) =>
                        updateSlide(index, {
                          start_time: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
