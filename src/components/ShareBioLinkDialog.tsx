
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Facebook, Mail, Twitter, Copy, X } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ShareBioLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShareBioLinkDialog: React.FC<ShareBioLinkDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { user } = useAuthContext();
  
  const username = user?.user_metadata?.username || 
                  (user?.email ? user.email.split('@')[0] : 'my-profile');
  
  const profileUrl = `${window.location.origin}/${username}`;
  const avatarUrl = user?.user_metadata?.avatar_url || null;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };
  
  const handleShareTwitter = () => {
    const tweetText = encodeURIComponent(`Check out my bio link page: ${profileUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  };
  
  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`, '_blank');
  };
  
  const handleShareEmail = () => {
    const subject = encodeURIComponent('Check out my bio link page');
    const body = encodeURIComponent(`Hey,\n\nI wanted to share my bio link page with you: ${profileUrl}\n\nCheck it out!`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0">
        <div className="p-4 border-b flex justify-between items-center">
          <DialogTitle className="text-xl font-bold">Share this Bio Link</DialogTitle>
          <DialogClose className="h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        
        <div className="p-6 flex flex-col items-center">
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6 relative">
            <QRCodeSVG 
              value={profileUrl}
              size={220}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
              includeMargin={false}
              imageSettings={{
                src: avatarUrl || "public/lovable-uploads/e241b281-73d0-4e79-87a9-580be9c33304.png",
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
              }}
              className="bg-gradient-to-br from-red-300 to-purple-400"
            />
          </div>
          
          <div className="w-full space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-between text-black" 
              onClick={handleShareTwitter}
            >
              <div className="flex items-center">
                <Twitter className="h-5 w-5 text-blue-400 mr-2" />
                <span>Share on Twitter</span>
              </div>
              <span className="text-gray-400">›</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-between text-black" 
              onClick={handleShareFacebook}
            >
              <div className="flex items-center">
                <Facebook className="h-5 w-5 text-blue-600 mr-2" />
                <span>Share on Facebook</span>
              </div>
              <span className="text-gray-400">›</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-between text-black" 
              onClick={handleShareEmail}
            >
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-500 mr-2" />
                <span>Share via Email</span>
              </div>
              <span className="text-gray-400">›</span>
            </Button>
            
            <div className="flex mt-4 border rounded-md overflow-hidden">
              <div className="bg-white p-4 flex-1 border-r truncate text-sm flex items-center">
                <span className="truncate">{profileUrl}</span>
              </div>
              <Button 
                onClick={handleCopyLink} 
                className="rounded-none px-8"
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
