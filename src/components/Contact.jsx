import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Loader2 } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./ui/Icons";
import SectionHeading from "./ui/SectionHeading";
import ScrollReveal from "./ui/ScrollReveal";
import Button from "./ui/Button";
import Toast from "./ui/Toast";
import { submitContactMessage } from "../utils/supabaseClient";
import { usePersonalInfo } from "../hooks/useSupabaseData";
import { SectionSkeleton } from "./ui/LoadingSkeleton";

function validateForm({ name, email, message }) {
  const errors = {};
  if (!name.trim()) errors.name = "Name is required";
  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }
  if (!message.trim()) {
    errors.message = "Message is required";
  } else if (message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }
  return errors;
}

export default function Contact() {
  const { data: personal, loading } = usePersonalInfo();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await submitContactMessage(form);
      setToast({ message: "Message sent successfully! I'll get back to you soon.", type: "success" });
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setToast({ message: `Failed to send message: ${error.message}`, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section
        id="contact"
        className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            title="Get In Touch"
            subtitle="Have a question or want to work together? Drop me a message!"
          />
          <SectionSkeleton type="default" />
        </div>
      </section>
    );
  }

  const email = personal?.email || "";
  const location = personal?.location || "";
  const socialLinks = [
    { icon: GithubIcon, label: "GitHub", url: personal?.social?.github || "#" },
    { icon: LinkedinIcon, label: "LinkedIn", url: personal?.social?.linkedin || "#" },
    { icon: TwitterIcon, label: "Twitter", url: personal?.social?.twitter || "#" },
  ];

  const inputClasses = (fieldName) =>
    `w-full px-4 py-3.5 rounded-xl bg-white dark:bg-white/5 border text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500/20 ${
      errors[fieldName]
        ? "border-red-300 dark:border-red-500/50"
        : "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-500"
    }`;

  return (
    <section
      id="contact"
      className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden"
    >
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-t from-indigo-500/5 to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          title="Get In Touch"
          subtitle="Have a question or want to work together? Drop me a message!"
        />

        <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-2">
            <ScrollReveal direction="left">
              <div className="space-y-8">
                {/* Info cards */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                    <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                        Email
                      </p>
                      <a
                        href={`mailto:${email}`}
                        className="text-sm font-medium text-gray-900 dark:text-white hover:text-indigo-500 transition-colors"
                      >
                        {email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                    <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-500">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                        Location
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social links */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Connect with me
                  </h4>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <motion.a
                          key={social.label}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-indigo-500 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors"
                          aria-label={social.label}
                        >
                          <Icon size={20} />
                        </motion.a>
                      );
                    })}
                  </div>
                </div>

                {/* Google Map Embed */}
                {location && (
                  <div className="w-full h-48 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-md group relative">
                    <iframe
                      title="Google Map location"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        location
                      )}&t=&z=11&ie=UTF8&iwloc=&output=embed`}
                      className="w-full h-full border-0 grayscale dark:invert dark:opacity-80 transition duration-500 group-hover:grayscale-0 dark:group-hover:invert-0 dark:group-hover:opacity-100"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <ScrollReveal direction="right">
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={inputClasses("name")}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={inputClasses("email")}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project or idea..."
                    className={`${inputClasses("message")} resize-none`}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  icon={isSubmitting ? Loader2 : Send}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}
