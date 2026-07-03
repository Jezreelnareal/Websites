import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { ContactPanel } from "@/components/contact-panel";

export const metadata: Metadata = {
  title: "Let's Talk"
};

export default function LetsTalkPage() {
  return (
    <div className="pt-32">
      <ContactPanel title="Let's Talk About Your Future Project" action="form">
        <p>
          Ready to bring your ideas to life? I would love to hear from you.
          Fill out the form below, and let us discuss how we can work together
          on your next big project.
        </p>
        <div>
          <h2 className="font-serif text-xl font-light text-[#dac5a7]">
            Project Details
          </h2>
          <p className="mt-3">
            Send a short message with your project details and the best way to
            reach you. I am excited to explore how my skills and experience can
            contribute to your success.
          </p>
        </div>
        <ContactForm />
      </ContactPanel>
    </div>
  );
}
