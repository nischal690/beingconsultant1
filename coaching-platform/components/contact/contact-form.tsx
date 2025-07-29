"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendEmail } from "@/lib/firebase/email";
import { toast } from "sonner";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send email to admin
      await sendEmail({
        to: "admin@beingconsultant.com", // Replace with your admin email
        template: {
          name: "contact_form",
          data: {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          },
        },
      });

      // Send confirmation email to user
      await sendEmail({
        to: formData.email,
        message: {
          subject: "We've received your message",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Thank You for Contacting Us</h1>
              <p>Hello ${formData.name},</p>
              <p>We've received your message and will get back to you as soon as possible.</p>
              <p>For your reference, here's a copy of your message:</p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Subject:</strong> ${formData.subject}</p>
                <p><strong>Message:</strong></p>
                <div style="background-color: #fff; padding: 10px; border-radius: 3px;">
                  <p>${formData.message}</p>
                </div>
              </div>
              <p>Best regards,<br>The Being Consultant Team</p>
            </div>
          `,
        },
      });

      toast.success("Message sent successfully!");
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1">
            Subject
          </label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Message subject"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Your message"
            rows={5}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
