import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, RefreshCw, Ticket, AlertTriangle, TrendingUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SUGGESTIONS = [
  { icon: AlertTriangle, text: 'Analyze critical tickets from today', color: 'text-destructive' },
  { icon: TrendingUp, text: 'Summarize team performance this week', color: 'text-success' },
  { icon: Ticket, text: 'Find recurring patterns in open tickets', color: 'text-primary' },
];

const INIT_MESSAGES = [
  { role: 'assistant', content: "Hi! I'm your AI support assistant. I can analyze ticket patterns, suggest resolutions, summarize team performance, and help prioritize your workload.\n\nWhat would you like to explore today?" }
];

export default function AIAssistant() {
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an AI assistant for a technical support ticket system called "AI Ticket System". Answer concisely and helpfully. User asked: ${msg}`,
    });
    setMessages(prev => [...prev, { role: 'assistant', content: result }]);
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 lg:px-8 py-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">AI Assistant</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground">Online · Powered by AI</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setMessages(INIT_MESSAGES)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> New chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-6 space-y-6">
        {messages.length === 1 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Suggested prompts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SUGGESTIONS.map(({ icon: Icon, text, color }, i) => (
                <button
                  key={i}
                  onClick={() => send(text)}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-accent/50 transition-all text-left"
                >
                  <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
                  <span className="text-sm text-muted-foreground">{text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-tr-sm'
                : 'bg-card border border-border text-foreground rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5">
                {[0, 1, 2].map(j => (
                  <span key={j} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${j * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 lg:px-8 py-4 border-t border-border">
        <div className="flex items-end gap-3 bg-card border border-border rounded-xl p-3 focus-within:border-primary/50 transition-colors">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about tickets, patterns, or team performance..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none leading-relaxed max-h-32"
            style={{ minHeight: '24px' }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">AI responses are for guidance only. Always verify critical decisions.</p>
      </div>
    </div>
  );
}