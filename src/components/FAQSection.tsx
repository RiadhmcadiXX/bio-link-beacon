
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is OneLink?",
    answer: "OneLink is a powerful platform that allows you to create a personalized page with all your important links in one place. It's perfect for creators, businesses, and professionals who want to share multiple links with their audience."
  },
  {
    question: "How much does OneLink cost?",
    answer: "OneLink offers multiple pricing tiers to fit your needs. We offer a free plan with basic features, as well as premium plans starting at $9.99/month. Check our pricing page for more details."
  },
  {
    question: "Can I customize my OneLink page?",
    answer: "Absolutely! OneLink offers extensive customization options including custom backgrounds, fonts, colors, and the ability to add your own branding elements. Premium plans include even more customization features."
  },
];

const FAQSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-600 text-center mb-10">Everything you need to know about OneLink</p>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-5 py-4 hover:bg-gray-50">{faq.question}</AccordionTrigger>
                <AccordionContent className="px-5 pb-4 pt-1 text-gray-700">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-10 text-center">
            <a href="/faq" className="text-primary font-medium hover:underline">View all FAQs</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
