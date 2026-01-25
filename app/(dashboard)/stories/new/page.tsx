import { StoryForm } from "@/components/story/StoryForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewStoryPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Story</CardTitle>
        </CardHeader>
        <CardContent>
          <StoryForm />
        </CardContent>
      </Card>
    </div>
  );
}
