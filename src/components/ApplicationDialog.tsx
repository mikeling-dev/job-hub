import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { FirebaseError } from "firebase/app";

interface ApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
}

export function ApplicationDialog({
  open,
  onOpenChange,
  jobId,
  jobTitle,
}: ApplicationDialogProps) {
  const { user, userProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    email: userProfile?.email || "",
    selfIntro: userProfile?.selfIntro || "",
  });
  const [resume, setResume] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Upload resume if provided
      let resumeUrl = "";
      if (resume) {
        const storageRef = ref(storage, `resumes/${user.uid}/${jobId}`);
        await uploadBytes(storageRef, resume);
        resumeUrl = storageRef.fullPath;
      }

      // Update user's applications in Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        applications: arrayUnion({
          jobId,
          jobTitle,
          appliedAt: new Date(),
          resumeUrl,
          ...formData,
        }),
      });

      onOpenChange(false);
    } catch (err: unknown) {
      const error = err as FirebaseError;
      setError(error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
          <Input
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
          <Textarea
            placeholder="Self Introduction"
            value={formData.selfIntro}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, selfIntro: e.target.value }))
            }
            required
          />
          <Input
            type="file"
            accept=".pdf"
            onChange={(e) => setResume(e.target.files?.[0] || null)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit">Submit Application</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
