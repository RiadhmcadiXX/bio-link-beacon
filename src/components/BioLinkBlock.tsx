
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export const BioLinkBlock = () => {
  const { user } = useAuthContext();
  
  // Extract username from user metadata or use email as fallback
  const username = user?.user_metadata?.username || 
                   (user?.email ? user.email.split('@')[0] : 'my-profile');
  
  const profileUrl = `/${username}`;
  
  return (
    <div className="w-full bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 p-3 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <span className="font-medium mr-1">Your profile:</span>
          <Link to={profileUrl} className="text-brand-purple hover:underline truncate max-w-[200px] sm:max-w-xs">
            {window.location.origin}/{username}
          </Link>
        </div>
        <a 
          href={`${window.location.origin}/${username}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-sm bg-brand-purple text-white px-3 py-1 rounded-md hover:bg-brand-purple/90 transition-colors"
        >
          <span className="mr-1 hidden sm:inline">Visit</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};
