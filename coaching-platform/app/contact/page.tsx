import ContactForm from "@/components/contact/contact-form";

export const metadata = {
  title: "Contact Us | Being Consultant",
  description: "Get in touch with our team for any questions or inquiries.",
};

export default function ContactPage() {
  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Have questions or need assistance? Fill out the form below and our team
          will get back to you as soon as possible.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="bg-card p-6 rounded-lg shadow-md">
          <ContactForm />
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Our Office</h2>
            <p>123 Consulting Street</p>
            <p>New Delhi, India 110001</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
            <p>Email: info@beingconsultant.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Business Hours</h2>
            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday: 10:00 AM - 2:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
