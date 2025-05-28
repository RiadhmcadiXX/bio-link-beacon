
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpModal = ({ isOpen, onClose }: SignUpModalProps) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !username) {
      toast.error("Please fill out all fields");
      return;
    }
    
    // In a real app, this would send data to a backend
    toast.success("Account created! Check your email for verification.");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-lime/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-blue/20 rounded-full blur-3xl" />
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl font-bold">Join OneLink</DialogTitle>
          <DialogDescription>
            Create your account to get started with your own link-in-bio page.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="yourname"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="focus:ring-2 focus:ring-brand-blue"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus:ring-2 focus:ring-brand-blue"
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              className="w-full btn-primary rounded-full py-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
            >
              Create My Profile
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpModal;
