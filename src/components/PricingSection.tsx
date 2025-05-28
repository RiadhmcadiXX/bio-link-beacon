import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "0",
    description: "For personal use",
    features: [
      "1 Bio Page",
      "5 Custom Links",
      "Basic Analytics",
      "Standard Templates"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
  },
  {
    name: "Pro",
    price: "9",
    description: "For creators",
    features: [
      "5 Bio Pages",
      "Unlimited Links",
      "Advanced Analytics",
      "All Templates",
      "Custom Colors",
      "No OneLink Branding"
    ],
    popular: true,
    buttonText: "Start Pro",
    buttonVariant: "default" as const,
  },
  {
    name: "Business",
    price: "29",
    description: "For teams",
    features: [
      "20 Bio Pages",
      "Unlimited Links",
      "Advanced Analytics",
      "All Templates",
      "Custom Colors",
      "No OneLink Branding",
      "Priority Support"
    ],
    buttonText: "Start Business",
    buttonVariant: "outline" as const,
  }
];

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section id="pricing" className="py-16 md:py-24 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ease-in-out 
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that's right for you.
          </p>

          {/* Toggle buttons */}
          <div className="mt-8 inline-flex items-center bg-gray-100 p-1 rounded-full">
            <button 
              className={`px-5 py-2 rounded-full transition-all ${!isAnnual ? 'bg-white shadow-md' : 'text-gray-600'}`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>
            <button 
              className={`px-5 py-2 rounded-full transition-all ${isAnnual ? 'bg-white shadow-md' : 'text-gray-600'}`}
              onClick={() => setIsAnnual(true)}
            >
              Annual <span className="text-green-500 font-medium">-20%</span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 transition-all duration-700 ease-in-out 
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white p-6 rounded-xl shadow-md relative flex flex-col border transition-all duration-500
                ${plan.popular ? 'border-primary shadow-lg' : 'border-gray-100'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-bold">
                    ${isAnnual ? (parseInt(plan.price) * 0.8 * 12).toFixed(0) : plan.price}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {isAnnual ? "/year" : "/month"}
                  </span>
                </div>
              </div>

              <div className="flex-grow">
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant={plan.buttonVariant}
                className="w-full"
                onClick={() => navigate('/pricing')}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center mt-12 transition-all duration-700 ease-in-out 
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-gray-600">Need a custom plan for your enterprise?</p>
          <Button variant="link" onClick={() => navigate('/contact')}>
            Contact our sales team
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
