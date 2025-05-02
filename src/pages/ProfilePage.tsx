
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";
import { ProfileLink } from "@/components/ProfileLink";

// Mock data - in real app would come from Supabase
const MOCK_PROFILE = {
  username: "johndoe",
  displayName: "John Doe",
  bio: "Digital creator & web developer",
  profileImage: "https://i.pravatar.cc/300",
  theme: "purple",
  links: [
    { id: "1", title: "My Portfolio", url: "https://portfolio.example.com", icon: "link", clicks: 42 },
    { id: "2", title: "Follow me on Twitter", url: "https://twitter.com/example", icon: "twitter", clicks: 25 },
    { id: "3", title: "My YouTube Channel", url: "https://youtube.com/c/example", icon: "youtube", clicks: 17 },
  ]
};

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real app, fetch profile data from Supabase based on the username
  useEffect(() => {
    // For now, use mock data
    setTimeout(() => {
      if (MOCK_PROFILE.username === username) {
        setProfile(MOCK_PROFILE);
        setLoading(false);
      } else {
        setError("Profile not found");
        setLoading(false);
      }
    }, 500);
  }, [username]);

  // Function to handle link clicks
  const handleLinkClick = (linkId: string) => {
    // In a real app, this would record the click in the database
    console.log(`Link clicked: ${linkId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
          <div className="h-6 bg-gray-200 rounded w-40"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
          <div className="space-y-3 w-full max-w-md">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-2">Profile Not Found</h1>
        <p className="text-gray-600 mb-6">The profile you're looking for doesn't seem to exist.</p>
        <Button asChild className="bg-brand-purple hover:bg-brand-purple/90">
          <a href="/">Back to Home</a>
        </Button>
      </div>
    );
  }

  // Theme styles based on user's preference
  const getThemeStyles = () => {
    switch (profile.theme) {
      case 'blue':
        return { background: 'bg-gradient-to-br from-blue-50 to-blue-100', button: 'bg-brand-blue hover:bg-brand-blue/90' };
      case 'pink':
        return { background: 'bg-gradient-to-br from-pink-50 to-pink-100', button: 'bg-brand-pink hover:bg-brand-pink/90' };
      case 'orange':
        return { background: 'bg-gradient-to-br from-orange-50 to-orange-100', button: 'bg-brand-orange hover:bg-brand-orange/90' };
      default: // purple
        return { background: 'bg-gradient-to-br from-purple-50 to-purple-100', button: 'bg-brand-purple hover:bg-brand-purple/90' };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div className={`min-h-screen ${themeStyles.background} py-12 px-4`}>
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={profile.profileImage} alt={profile.displayName} />
            <AvatarFallback>{profile.displayName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">{profile.displayName}</h1>
          {profile.bio && <p className="text-gray-600 text-center mt-2">{profile.bio}</p>}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {profile.links.map((link: any) => (
            <ProfileLink 
              key={link.id} 
              link={link} 
              themeColor={profile.theme} 
              onClick={() => handleLinkClick(link.id)} 
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Powered by <a href="/" className="font-medium hover:underline">LinkBeacon</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
