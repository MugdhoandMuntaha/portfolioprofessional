import { useState, useEffect } from "react";
import { fetchContactMessages, deleteContactMessage } from "../../utils/supabaseClient";
import { Trash2, Mail, User, Clock } from "lucide-react";
import Toast from "../../components/ui/Toast";

export default function MessagesViewer() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const loadMessages = async () => {
    try {
      const data = await fetchContactMessages();
      setMessages(data);
    } catch (err) {
      setToast({ message: "Failed to load messages: " + err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteContactMessage(id);
      setToast({ message: "Message deleted successfully", type: "success" });
      loadMessages();
    } catch (err) {
      setToast({ message: "Failed to delete: " + err.message, type: "error" });
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-gray-400 text-sm">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center bg-gray-900 border border-white/5 p-4 rounded-2xl">
        <p className="text-sm text-gray-400">
          Viewing submissions sent via the portfolio contact form.
        </p>
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          Total: {messages.length}
        </span>
      </div>

      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-gray-900 border border-white/5 rounded-2xl p-5 lg:p-6 space-y-4 hover:border-white/10 transition relative group"
          >
            {/* Header info */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-indigo-400" />
                  <span className="font-bold text-white text-base">{msg.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-500" />
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-sm text-gray-400 hover:text-indigo-400 transition"
                  >
                    {msg.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock size={12} />
                  {formatDate(msg.created_at)}
                </div>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition lg:opacity-0 lg:group-hover:opacity-100"
                  aria-label="Delete message"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Message Body */}
            <div className="p-4 rounded-xl bg-white/2 border border-white/5 text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
              {msg.message}
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="bg-gray-900 border border-white/5 rounded-2xl p-12 text-center text-gray-500">
            <Mail size={36} className="mx-auto text-gray-600 mb-3" />
            <p className="font-semibold text-gray-400">No messages yet.</p>
            <p className="text-xs text-gray-600 mt-1">
              Contact submissions will show up here as soon as visitors message you.
            </p>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
