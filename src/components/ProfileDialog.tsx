import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { format } from "date-fns";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { userProfile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || "",
    selfIntro: userProfile?.selfIntro || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Input
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <Input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
              <Textarea
                placeholder="Self Introduction"
                value={formData.selfIntro}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    selfIntro: e.target.value,
                  }))
                }
              />
              <Button type="submit">Save Changes</Button>
            </form>
          </TabsContent>

          <TabsContent
            value="applications"
            className="space-y-4 h-72 overflow-auto"
          >
            {userProfile?.applications?.map((app) => {
              // Convert Firestore timestamp to Date object
              const appliedDate =
                app.appliedAt instanceof Date
                  ? app.appliedAt
                  : new Date((app.appliedAt as any)?.seconds * 1000);

              return (
                <div
                  key={app.jobId}
                  className="flex justify-between items-center p-4 border rounded-md"
                >
                  <div>
                    <h3 className="font-medium">{app.jobTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                      Applied on {format(appliedDate, "PPP")}
                    </p>
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
