import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/layout/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth removed - will add later
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {children}
    </div>
  );
}
