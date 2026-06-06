import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Bot } from "lucide-react";
import {
  usePersonalInfo,
  useSkills,
  useProjects,
  useExperiences,
} from "../hooks/useSupabaseData";

const suggestions = [
  "What are your top technical skills?",
  "Show me your featured projects.",
  "Tell me about your work experience.",
  "How can I get in touch with you?",
];

// Custom Markdown Renderer components for GPT-like response rendering
function InlineFormatter({ text }) {
  if (!text) return null;
  // Match bold text (**bold**), inline code (`code`), and links ([text](url))
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={index}
              className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-rose-500 dark:text-rose-400 font-mono text-[10.5px] border border-gray-300/40 dark:border-white/5 font-semibold"
            >
              {part.slice(1, -1)}
            </code>
          );
        } else if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className="font-bold text-gray-950 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        } else if (part.startsWith("[") && part.includes("](")) {
          const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
          if (match) {
            const linkText = match[1];
            const url = match[2];
            return (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 underline font-medium"
              >
                {linkText}
              </a>
            );
          }
        }
        return part;
      })}
    </>
  );
}

function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <div className="my-2 rounded-lg overflow-hidden border border-gray-200/60 dark:border-white/15 shadow-sm bg-gray-950 text-gray-200 font-mono text-[11px] w-full">
      <div className="flex justify-between items-center px-3 py-1 bg-gray-900 border-b border-white/5 text-[10px] text-gray-400 font-sans select-none">
        <span className="uppercase tracking-wider font-semibold">{language || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition cursor-pointer font-medium"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto leading-relaxed text-left">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function TextBlock({ content }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-1 text-left">
      {lines.map((line, idx) => {
        // Bullet items matching "- " or "* " or numbered list "1. "
        const bulletMatch = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)/);
        if (bulletMatch) {
          const indent = bulletMatch[1].length;
          const bullet = bulletMatch[2];
          const text = bulletMatch[3];
          return (
            <div
              key={idx}
              className="flex items-start gap-1.5 my-0.5"
              style={{ paddingLeft: `${indent * 0.4 + 0.2}rem` }}
            >
              <span className="text-indigo-500 font-bold select-none mt-0.5">
                {bullet.includes(".") ? bullet : "•"}
              </span>
              <span className="flex-1">
                <InlineFormatter text={text} />
              </span>
            </div>
          );
        }

        // Headings: starts with "#"
        const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const text = headingMatch[2];
          const sizeClass =
            level === 1 ? "text-sm font-extrabold mt-3.5 mb-1" :
            level === 2 ? "text-xs font-bold mt-2.5 mb-1" :
            "text-[11px] font-bold mt-2 mb-0.5";
          return (
            <div
              key={idx}
              className={`${sizeClass} text-gray-900 dark:text-white font-heading`}
            >
              <InlineFormatter text={text} />
            </div>
          );
        }

        // Empty line spacing
        if (line.trim() === "") {
          return <div key={idx} className="h-1.5" />;
        }

        return (
          <p key={idx} className="leading-relaxed my-0.5">
            <InlineFormatter text={line} />
          </p>
        );
      })}
    </div>
  );
}

function MarkdownRenderer({ text }) {
  if (!text) return null;
  // Split text by code blocks
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-1 text-left w-full">
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : "";
          const code = match ? match[2] : part.slice(3, -3);
          return <CodeBlock key={index} language={lang} code={code.trim()} />;
        } else {
          return <TextBlock key={index} content={part} />;
        }
      })}
    </div>
  );
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hi there! I am Junaid's AI portfolio assistant. Ask me anything about his projects, skills, education, or work experiences!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const chatEndRef = useRef(null);

  // Fetch portfolio data to feed to the AI context
  const { data: personal } = usePersonalInfo();
  const { categories: skills } = useSkills();
  const { projects } = useProjects();
  const { data: experiences } = useExperiences();

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

  useEffect(() => {
    if (!apiKey) {
      setApiKeyMissing(true);
    } else {
      setApiKeyMissing(false);
    }
  }, [apiKey]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const compileSystemPrompt = () => {
    return `You are Junaid's Personal AI Assistant. Your role is to represent Junaid and answer questions about his technical skills, education, projects, experience, location, and career goals based on the provided portfolio data.

Developer Junaid's Profile:
- Full Name: ${personal?.name || "Shah Md Al Junaid"}
- First Name: ${personal?.firstName || "Junaid"}
- Current Role: ${personal?.role || "Full Stack Developer"}
- Location: ${personal?.location || "Rangpur, Bangladesh"}
- Email: ${personal?.email || ""}
- Bio: ${personal?.bio || ""}
- Career Goals: ${personal?.careerGoals || ""}
- Education: ${personal?.education?.degree || ""} from ${personal?.education?.university || ""} (${personal?.education?.year || ""}) with GPA ${personal?.education?.gpa || ""}
- Interests: ${(personal?.interests || []).join(", ")}
- Social Links: GitHub (${personal?.social?.github || ""}), LinkedIn (${personal?.social?.linkedin || ""}), Twitter (${personal?.social?.twitter || ""})

Junaid's Skills & Categories:
${(skills || []).map(cat => `- ${cat.title}: ${cat.skills.map(s => `${s.name} (${s.level}%)`).join(", ")}`).join("\n")}

Junaid's Projects Showcase:
${(projects || []).map(p => `- ${p.title} (${p.category}): ${p.shortDescription}. Key Tech Stack: ${p.techStack.join(", ")}. GitHub Link: ${p.githubUrl || "None"}. Live Link: ${p.liveUrl || "None"}`).join("\n")}

Junaid's Work Experience History:
${(experiences || []).map(exp => `- ${exp.title} at ${exp.company} (${exp.period}): ${exp.description}`).join("\n")}

Instructions for Conversation:
1. Act as Junaid's intelligent representative. Speak politely and professionally.
2. Keep answers concise, direct, and structured. Use bullet points for list queries.
3. You are also a fully capable AI assistant (similar to ChatGPT or GPT models). If the user asks general questions, requests programming/coding assistance, needs code debugging, wants formulas, recipes, or translations, you MUST answer them fully and directly rather than refusing. Maintain your polite persona as Junaid's assistant, and when natural/relevant, relate the topic back to Junaid's skills (e.g. mentioning Junaid has experience in that technology).
4. If the user asks about contact details, provide the email address and suggest filling out the Contact form at the bottom of the page.
5. Format your answers clearly using Markdown syntax (headings, bold text, bullet points, and code blocks using triple backticks with language specifier) so it renders correctly for the user.
6. Support Banglish (Bengali language written using the English/Latin alphabet, e.g., "Kemon achen?", "apnar projects dekhaw", "ami website banate chai"). You MUST fully understand and interpret these questions and respond back in either clear standard Bengali, natural Banglish, or English, ensuring the conversation flows smoothly and remains professional.`;
  };

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (apiKeyMissing) {
      setIsLoading(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: "⚠️ Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file in the project root to activate this AI Chatbot live!",
          },
        ]);
        setIsLoading(false);
      }, 800);
      return;
    }

    setIsLoading(true);

    try {
      const systemInstruction = compileSystemPrompt();
      
      // Serialize conversational history into Gemini's payload format
      // Prepend system prompt inside the context of the prompt flow
      const apiMessages = [
        {
          role: "user",
          parts: [
            {
              text: `${systemInstruction}\n\nUser Initializer: Hello! I want to ask questions.`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Hello! I am Junaid's portfolio assistant. I am ready to answer any questions about Junaid's profile, skills, projects, and work history, or any general topics you'd like to chat about!",
            },
          ],
        },
        ...messages.slice(1).map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.text }],
        })),
        {
          role: "user",
          parts: [{ text: textToSend }],
        },
      ];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: apiMessages,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API Error details:", errorText);
        throw new Error(`Google API error: Status ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const botText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I could not process that request. Could you rephrase your question?";

      setMessages((prev) => [...prev, { role: "model", text: botText }]);
    } catch (err) {
      console.error("Gemini AI API Call failed:", err);
      const isApiKeyError =
        err.message?.includes("Status 404") ||
        err.message?.includes("Status 401") ||
        err.message?.includes("Status 403") ||
        err.message?.includes("API key not found") ||
        err.message?.includes("API key") ||
        err.message?.includes("authentication") ||
        err.message?.includes("credentials");
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: isApiKeyError
            ? "⚠️ It looks like the Gemini API key (`VITE_GEMINI_API_KEY`) in your `.env` file is invalid or inactive. Please generate a valid free key from [Google AI Studio](https://aistudio.google.com/) and update your `.env` file, then restart the dev server."
            : "Sorry, I ran into an error communicating with my neural model. Please check your internet connection or try again in a few moments.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          width: isOpen ? 56 : (isHovered ? 160 : 56),
          borderRadius: 28
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="fixed bottom-6 right-6 z-40 h-14 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-2xl border border-white/20 cursor-pointer overflow-hidden group shadow-indigo-500/20"
        aria-label="Toggle AI Assistant"
      >
        {/* Glow Ring Effect */}
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping" />
        
        {/* Conic Spinner border (underneath button) */}
        {!isOpen && (
          <div className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-indigo-400 via-pink-500 to-violet-400 opacity-75 group-hover:opacity-100 blur-[1px] animate-spin -z-10 [animation-duration:3s]" />
        )}

        <div className="flex items-center justify-center gap-2.5 px-4 whitespace-nowrap">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <X size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center relative"
              >
                {/* Glowing Sparkle Bot SVG Icon */}
                <svg className="w-5 h-5 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.187-.813L9 9l.813 5.187L15 15l-5.187.813zM18 10.5l-.563 3.563L14 14.5l3.437.438L18 18.5l.563-3.563L22 14.5l-3.438-.437L18 10.5z" />
                </svg>
                {/* Ping notification */}
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanding text on hover */}
          {!isOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                width: isHovered ? "auto" : 0,
              }}
              transition={{ duration: 0.2 }}
              className="text-xs font-bold tracking-wide uppercase select-none font-heading"
            >
              Ask my AI
            </motion.span>
          )}
        </div>
      </motion.button>

      {/* Chat Window Box Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-24 right-6 z-40 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[70vh] flex flex-col bg-white/90 dark:bg-gray-950/85 border border-gray-200/70 dark:border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(99,102,241,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden glass backdrop-blur-2xl"
          >
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 opacity-30 dark:opacity-20">
              <div className="absolute top-12 left-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-16 right-16 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-500/10 via-violet-500/5 to-transparent border-b border-gray-200/40 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                  <Bot size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white font-heading">
                    Junaid's AI Assistant
                  </h3>
                  <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online • Gemini 2.5
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-650 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm transition-all duration-200 ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-tr-none shadow-indigo-500/10"
                        : "bg-gray-100/90 dark:bg-white/5 text-gray-800 dark:text-gray-200 rounded-tl-none border-l-2 border-l-indigo-500 border border-gray-200/40 dark:border-white/5"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <span className="whitespace-pre-line text-left block">{msg.text}</span>
                    ) : (
                      <MarkdownRenderer text={msg.text} />
                    )}
                  </div>
                </div>
              ))}

              {/* Bot thinking loader */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100/90 dark:bg-white/5 border border-gray-200/40 dark:border-white/5 text-gray-400 rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center gap-1.5 shadow-sm">
                    <Loader2 size={12} className="animate-spin text-indigo-500" />
                    <span className="text-[10px] font-medium">Assistant thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestion Chips */}
            {messages.length === 1 && (
              <div className="px-4 py-3 bg-gray-50/40 dark:bg-gray-950/20 border-t border-gray-200/30 dark:border-white/5">
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                  Suggestions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSendMessage(s)}
                      className="px-3 py-1.5 text-[10px] rounded-full bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-indigo-500 dark:hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105 transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 border-t border-gray-200/50 dark:border-white/5 bg-gray-50/70 dark:bg-gray-950/40 backdrop-blur-md">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(input);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me something..."
                  className="flex-1 px-4 py-2.5 text-xs rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-white/5 dark:disabled:to-white/5 text-white disabled:text-gray-400 transition-all duration-200 cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 shadow-md shadow-indigo-500/10"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
