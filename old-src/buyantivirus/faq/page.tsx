import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaqContent } from "@/components/pages/FaqContent";
import type { Metadata } from 'next';

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="h1 text-center mb-8">Frequently Asked Questions</h1>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="p">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-16 text-center">
            <h2 className="h2 mb-6">Still have questions?</h2>
            <p className="p mb-8">
              Can't find the answer you're looking for? Please chat to our friendly team.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const faqs = [
  {
    question: "What is Key Guardian?",
    answer: "Key Guardian is a digital security platform that helps protect your software licenses, API keys, and other digital assets. We provide advanced encryption and management tools to keep your keys safe and secure."
  },
  {
    question: "How does the encryption work?",
    answer: "We use industry-standard AES-256 encryption to protect your keys. Each key is encrypted individually and stored securely in our cloud infrastructure. The encryption keys are managed using a secure key management system."
  },
  {
    question: "Is my data safe with Key Guardian?",
    answer: "Yes, we take security very seriously. All data is encrypted both in transit and at rest. We use secure cloud infrastructure and follow industry best practices for data protection. Regular security audits and penetration testing ensure our systems remain secure."
  },
  {
    question: "Can I use Key Guardian for my business?",
    answer: "Absolutely! We offer solutions for businesses of all sizes. Our Professional and Enterprise plans include team management, advanced security features, and dedicated support to meet your business needs."
  },
  {
    question: "What happens if I lose access to my account?",
    answer: "We have a secure account recovery process in place. You'll need to verify your identity through multiple factors, and our support team will help you regain access to your account while ensuring security is maintained."
  },
  {
    question: "Do you offer a free trial?",
    answer: "Yes, we offer a 14-day free trial of our Professional plan. This gives you access to all features so you can evaluate if Key Guardian is right for you. No credit card is required to start the trial."
  },
  {
    question: "How do I get started?",
    answer: "Getting started is easy! Simply sign up for an account, choose your plan, and follow our onboarding guide. Our support team is available 24/7 to help you with any questions during the setup process."
  }
]; 