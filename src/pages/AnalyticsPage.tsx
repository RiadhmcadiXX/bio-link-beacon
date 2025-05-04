
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon } from "lucide-react";

interface Link {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon: string;
  clicks: number;
  created_at: string;
}

// Sample data for charts
const dailyVisitData = [
  { name: "Mon", visits: 4000 },
  { name: "Tue", visits: 3000 },
  { name: "Wed", visits: 2000 },
  { name: "Thu", visits: 2780 },
  { name: "Fri", visits: 1890 },
  { name: "Sat", visits: 2390 },
  { name: "Sun", visits: 3490 }
];

const deviceData = [
  { name: "Desktop", value: 400 },
  { name: "Mobile", value: 300 },
  { name: "Tablet", value: 150 }
];

const referrerData = [
  { name: "Direct", visits: 4000 },
  { name: "Social", visits: 3000 },
  { name: "Search", visits: 2000 },
  { name: "Email", visits: 1000 },
  { name: "Other", visits: 500 }
];

const COLORS = ["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9", "#6E59A5"];

const AnalyticsPage = () => {
  const { user, isLoading } = useAuthContext();

  // Get links data for top performers
  const { 
    data: links, 
    isLoading: isLinksLoading,
    error: linksError
  } = useQuery({
    queryKey: ['links', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('clicks', { ascending: false });
      
      if (error) throw error;
      return data as Link[];
    },
    enabled: !!user,
  });

  if (isLoading || isLinksLoading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <DashboardNav />
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (linksError) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <DashboardNav />
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800">Error Loading Analytics</h2>
              <p className="text-gray-600 mt-2">Please try refreshing the page</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <DashboardNav />
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-gray-500">Monitor your profile and link performance</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
                Live data
              </span>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-500">Total Profile Views</p>
                  <h3 className="text-3xl font-bold mt-2">1,248</h3>
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <span className="inline-block w-0 h-0 border-x-4 border-x-transparent border-b-[6px] mr-1"></span>
                    12% from last week
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-500">Total Link Clicks</p>
                  <h3 className="text-3xl font-bold mt-2">3,842</h3>
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <span className="inline-block w-0 h-0 border-x-4 border-x-transparent border-b-[6px] mr-1"></span>
                    8% from last week
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-500">Avg. Click Rate</p>
                  <h3 className="text-3xl font-bold mt-2">24.3%</h3>
                  <p className="text-sm text-red-600 mt-1 flex items-center">
                    <span className="inline-block w-0 h-0 border-x-4 border-x-transparent border-t-[6px] mr-1"></span>
                    3% from last week
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-500">Active Links</p>
                  <h3 className="text-3xl font-bold mt-2">{links?.length || 0}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Total active links
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="mb-6">
              <TabsTrigger value="overview" className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="traffic" className="flex items-center">
                <PieChartIcon className="h-4 w-4 mr-2" />
                Traffic Sources
              </TabsTrigger>
              <TabsTrigger value="links" className="flex items-center">
                <LineChartIcon className="h-4 w-4 mr-2" />
                Link Performance
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Profile Views</CardTitle>
                  <CardDescription>
                    Number of visits to your profile over the past week
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="h-[300px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dailyVisitData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="visits" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Device Breakdown</CardTitle>
                    <CardDescription>
                      Profile visits by device type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={deviceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {deviceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Links</CardTitle>
                    <CardDescription>
                      Your most clicked links
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {links && links.length > 0 ? (
                        links.slice(0, 5).map((link, index) => (
                          <div key={link.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                                {index + 1}
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium">{link.title}</p>
                                <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                  {link.url}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{link.clicks}</p>
                              <p className="text-xs text-gray-500">clicks</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No links data available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Traffic Tab */}
            <TabsContent value="traffic">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Traffic Sources</CardTitle>
                    <CardDescription>
                      Where your visitors are coming from
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-[300px] mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={referrerData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="visits" fill="#D946EF" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Geographic Distribution</CardTitle>
                    <CardDescription>
                      Top countries by visitor count
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { country: "United States", count: 543, percentage: 42 },
                        { country: "United Kingdom", count: 209, percentage: 16 },
                        { country: "Germany", count: 142, percentage: 11 },
                        { country: "France", count: 98, percentage: 8 },
                        { country: "Japan", count: 76, percentage: 6 }
                      ].map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">{item.country}</span>
                            <span className="text-sm font-medium">{item.count}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-brand-purple h-2 rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Referral Domains</CardTitle>
                    <CardDescription>
                      Websites sending traffic to your profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { domain: "instagram.com", count: 324 },
                        { domain: "twitter.com", count: 210 },
                        { domain: "facebook.com", count: 142 },
                        { domain: "linkedin.com", count: 98 },
                        { domain: "youtube.com", count: 76 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="ml-0">
                              <p className="text-sm font-medium">{item.domain}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{item.count}</p>
                            <p className="text-xs text-gray-500">visitors</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Links Performance Tab */}
            <TabsContent value="links">
              <Card>
                <CardHeader>
                  <CardTitle>Link Click Trend</CardTitle>
                  <CardDescription>
                    Click performance over the past 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="h-[300px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { date: "1 May", clicks: 400 },
                          { date: "5 May", clicks: 300 },
                          { date: "10 May", clicks: 500 },
                          { date: "15 May", clicks: 750 },
                          { date: "20 May", clicks: 600 },
                          { date: "25 May", clicks: 800 },
                          { date: "30 May", clicks: 950 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="clicks" 
                          stroke="#6E59A5" 
                          strokeWidth={2} 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Link Performance Details</CardTitle>
                    <CardDescription>
                      Detailed statistics for each link
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th 
                              scope="col" 
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Link Title
                            </th>
                            <th 
                              scope="col" 
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              URL
                            </th>
                            <th 
                              scope="col" 
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Clicks
                            </th>
                            <th 
                              scope="col" 
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              CTR
                            </th>
                            <th 
                              scope="col" 
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Created
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {links && links.length > 0 ? (
                            links.map((link) => (
                              <tr key={link.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {link.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[200px] truncate">
                                  {link.url}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {link.clicks}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {(Math.random() * 100).toFixed(1)}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(link.created_at).toLocaleDateString()}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                No links data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
