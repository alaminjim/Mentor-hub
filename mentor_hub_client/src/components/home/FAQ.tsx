"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "how do i find the right mentor for my needs?",
    answer: "you can browse mentors by subject, expertise level, and student ratings. each mentor profile includes their background, teaching style, and availability."
  },
  {
    question: "is there a free trial session available?",
    answer: "yes! many of our mentors offer a first-time trial session for free. look for the 'trial pass' badge on their profiles."
  },
  {
    question: "how does the payment system work?",
    answer: "mentorhub uses a secure escrow-based payment system. your payment is held securely and only released to the mentor after the session is successfully completed."
  },
  {
    question: "what if i'm not satisfied with my mentor?",
    answer: "we offer a 100% satisfaction guarantee. if your first session doesn't meet your expectations, we'll help you find a new mentor."
  },
  {
    question: "can i become a mentor on mentorhub?",
    answer: "absolutely! if you're an expert in your field and passionate about teaching, you can apply. visit our 'become a tutor' page to start."
  }
];

export default function FAQ() {
  return (
    <section className="py-12 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
           <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 lowercase leading-none">
             frequently asked <br /> <span className="text-gradient">questions.</span>
           </h2>
           <p className="text-muted-foreground text-xl font-medium lowercase">
             have questions? we've got answers. if you can't find what you're looking for, feel free to contact our support team.
           </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, i) => (
             <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 rounded-[2rem] px-8 glass overflow-hidden border-none group">
                <AccordionTrigger className="text-2xl font-black tracking-tighter hover:no-underline py-8 text-left group-hover:text-primary transition-colors lowercase">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-lg pb-8 leading-relaxed font-medium lowercase">
                  {faq.answer}
                </AccordionContent>
             </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
