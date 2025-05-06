
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
  linkType?: string;
  clicks: number;
  position: number;
}

interface AnalyticsProps {
  links: Link[] | undefined;
  onNavigateToLinks: () => void;
}

export const Analytics = ({ links, onNavigateToLinks }: AnalyticsProps) => {
  return (
    <Card className="p-6">
      <p className="text-center mb-4">View insights about your bio link performance</p>
      {links && links.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Link Performance</h2>
          <div className="space-y-2">
            {links.map(link => (
              <div key={link.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div className="font-medium">{link.title}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{link.clicks || 0} clicks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p>No link data available yet.</p>
          <Button
            onClick={onNavigateToLinks}
            className="mt-2 bg-brand-purple hover:bg-brand-purple/90"
          >
            Create Your First Link
          </Button>
        </div>
      )}
    </Card>
  );
};
