import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";

const faqs = [
  {
    question: "Are your antivirus license keys genuine?",
    answer: "Yes, all our license keys are 100% genuine and purchased directly from authorized vendors. We guarantee the authenticity of every key we sell."
  },
  {
    question: "How quickly will I receive my license key?",
    answer: "We provide instant delivery of license keys. As soon as your payment is confirmed, you'll receive your key via email and can access it in your account dashboard."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and various other secure payment methods. All transactions are encrypted and secure."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with your purchase. Please contact our support team for assistance."
  },
  {
    question: "Can I use the license key on multiple devices?",
    answer: "The number of devices depends on the specific antivirus product and license type you purchase. This information is clearly stated in the product description."
  },
  {
    question: "What if I need help with activation?",
    answer: "Our support team is available 24/7 to assist you with any activation issues. You can contact us through live chat, email, or phone."
  }
];

export default function FaqSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Find answers to common questions about our products and services.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
} 