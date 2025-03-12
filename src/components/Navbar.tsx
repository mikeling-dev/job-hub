"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { AuthDialog } from "./AuthDialog";
import { useState } from "react";
import { ProfileDialog } from "./ProfileDialog";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function Navbar() {
  const { user, userProfile } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 w-screen h-16 content-center bg-background border-b z-50 px-8 flex justify-between items-center">
      <Link href={"/"} className="font-bold text-2xl h-fit">
        Job Hub
      </Link>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={user.photoURL || ""} />
              <AvatarFallback>
                {userProfile?.name?.[0] || user.email?.[0]}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => auth.signOut()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={() => setShowAuthDialog(true)}>Login / Sign Up</Button>
      )}

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      <ProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
      />
    </nav>
  );
}
