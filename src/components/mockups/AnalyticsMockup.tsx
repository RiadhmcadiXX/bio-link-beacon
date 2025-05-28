
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

const AnalyticsMockup = () => {
  const [chartData, setChartData] = useState<number[]>([20, 40, 30, 70, 50, 60, 80]);
  
  // Animate the chart data
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev];
        // Shift array and add new random value
        newData.shift();
        newData.push(Math.floor(Math.random() * 70) + 20);
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative w-full max-w-[220px] mx-auto">
      <div className="rounded-[2rem] bg-gray-900 p-1.5 shadow-xl">
        <div className="rounded-[1.8rem] overflow-hidden aspect-[9/19] relative">
          <div className="absolute inset-0 bg-white text-gray-800 flex flex-col pt-4 px-3">
            <h3 className="text-sm font-bold text-center mb-3">Analytics Dashboard</h3>
            
            {/* Stats overview */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-gray-100 rounded-md p-2 text-center">
                <div className="text-sm font-bold text-primary">124</div>
                <div className="text-xs text-gray-600">Clicks</div>
              </div>
              <div className="bg-gray-100 rounded-md p-2 text-center">
                <div className="text-sm font-bold text-green-500">+18%</div>
                <div className="text-xs text-gray-600">Growth</div>
              </div>
            </div>
            
            {/* Chart */}
            <div className="bg-gray-100 rounded-md p-2 h-24 mt-1 relative">
              <div className="absolute bottom-2 left-2 right-2 h-16 flex items-end justify-between">
                {chartData.map((value, index) => (
                  <div 
                    key={index}
                    className={`w-2 bg-primary rounded-t-sm transition-all duration-500 ease-in-out`}
                    style={{ height: `${value}%` }}
                  ></div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300"></div>
              <div className="absolute text-[8px] text-gray-400 top-1 left-2">Views over time</div>
            </div>
            
            {/* Most clicked link */}
            <div className="mt-3">
              <div className="text-xs text-gray-600 mb-1">Top performing link:</div>
              <div className="bg-primary/10 rounded-md p-1.5 text-xs flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-1.5"></span>
                <span className="text-primary">Instagram Profile</span>
                <span className="ml-auto text-[10px]">68%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
        <Activity className="h-4 w-4 text-primary" />
      </div>
    </div>
  );
};

export default AnalyticsMockup;
