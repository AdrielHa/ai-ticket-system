import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Bot, Sparkles, Clock, User, Tag, AlertTriangle, CheckCircle2,
  MessageSquare, Paperclip, History, Link2, ChevronDown, Send, Loader2
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from './Badge';
import { base44 } from '@/api/base44Client';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'ai', label: 'AI Analysis' },
  { id: 'activity', label: 'Activity' },
  { id: 'comments', label: 'Comments' },
];

const panelCardStyle = {
  background: 'hsl(222,44%,13%)',
  border: '1px solid hsl(217,32%,20%)',
  borderRadius: 10,
};

function AIAnalysisTab({ ticket }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const runAnalysis = async () => {
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an enterprise AI support analyst. Analyze this support ticket and respond in JSON format.
Ticket ID: ${ticket.id}
Title: ${ticket.title}
Description: ${ticket.description}
Category: ${ticket.category}
Priority: ${ticket.priority}
Status: ${ticket.status}

Provide:
1. summary: A 2-sentence executive summary
2. severity_analysis: Assess the business impact (2-3 sentences)
3. suggested_solutions: Array of 3 actionable solution steps (each as a string)
4. urgency_score: Number 1-10
5. urgency_reason: One sentence explaining the urgency score
6. related_categories: Array of 2-3 related issue categories`,
      response_json_schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          severity_analysis: { type: 'string' },
          suggested_solutions: { type: 'array', items: { type: 'string' } },
          urgency_score: { type: 'number' },
          urgency_reason: { type: 'string' },
          related_categories: { type: 'array', items: { type: 'string' } },
        },
      },
    });
    setAnalysis(result);
    setLoading(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'hsl(217,91%,60%/0.1)', border: '1px solid hsl(217,91%,60%/0.2)' }}>
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
      </div>
      <p className="text-[13px] text-muted-foreground">Analyzing ticket with AI...</p>
    </div>
  );

  if (!analysis) return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'hsl(217,91%,60%/0.1)', border: '1px solid hsl(217,91%,60%/0.15)' }}>
        <Bot className="w-6 h-6 text-primary" />
      </div>
      <div className="text-center">
        <p className="text-[13px] font-semibold text-foreground mb-1">AI Analysis Ready</p>
        <p className="text-[12px] text-muted-foreground">Run a full AI analysis on this ticket to get smart insights, urgency scoring, and solution suggestions.</p>
      </div>
      <button
        onClick={runAnalysis}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all active:scale-95"
        style={{ background: 'linear-gradient(135deg, hsl(217,91%,62%), hsl(217,91%,52%))', boxShadow: '0 1px 3px hsl(0,0%,0%/0.3), inset 0 1px 0 hsl(0,0%,100%/0.1)' }}
      >
        <Sparkles className="w-4 h-4" /> Run AI Analysis
      </button>
    </div>
  );

  const scoreColor = analysis.urgency_score >= 8 ? 'hsl(0,84%,72%)' : analysis.urgency_score >= 5 ? 'hsl(38,92%,65%)' : 'hsl(160,84%,55%)';
  const scoreBg = analysis.urgency_score >= 8 ? 'hsl(0,84%,60%/0.1)' : analysis.urgency_score >= 5 ? 'hsl(38,92%,50%/0.1)' : 'hsl(160,84%,39%/0.1)';
  const scoreBorder = analysis.urgency_score >= 8 ? 'hsl(0,84%,60%/0.2)' : analysis.urgency_score >= 5 ? 'hsl(38,92%,50%/0.2)' : 'hsl(160,84%,39%/0.2)';

  return (
    <div className="space-y-4">
      {/* Urgency Score */}
      <div className="p-4 rounded-xl flex items-center gap-4" style={{ background: scoreBg, border: `1px solid ${scoreBorder}` }}>
        <div className="flex-shrink-0 text-center">
          <div className="text-3xl font-black" style={{ color: scoreColor }}>{analysis.urgency_score}</div>
          <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: scoreColor }}>/ 10</div>
        </div>
        <div>
          <p className="text-[12px] font-semibold mb-0.5" style={{ color: scoreColor }}>AI Urgency Score</p>
          <p className="text-[12px] text-muted-foreground leading-relaxed">{analysis.urgency_reason}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-xl space-y-2" style={panelCardStyle}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">AI Summary</span>
        </div>
        <p className="text-[13px] text-foreground leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Severity */}
      <div className="p-4 rounded-xl" style={panelCardStyle}>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-3.5 h-3.5 text-warning" />
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Severity Analysis</span>
        </div>
        <p className="text-[13px] text-foreground leading-relaxed">{analysis.severity_analysis}</p>
      </div>

      {/* Solutions */}
      <div className="p-4 rounded-xl" style={panelCardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Suggested Solutions</span>
        </div>
        <ol className="space-y-2.5">
          {analysis.suggested_solutions?.map((sol, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0 mt-0.5" style={{ background: 'hsl(217,91%,60%/0.15)', border: '1px solid hsl(217,91%,60%/0.2)' }}>{i + 1}</span>
              <span className="text-[13px] text-foreground leading-relaxed">{sol}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Related categories */}
      {analysis.related_categories?.length > 0 && (
        <div className="p-4 rounded-xl" style={panelCardStyle}>
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Related Categories</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.related_categories.map(cat => (
              <span key={cat} className="text-[11px] px-2.5 py-1 rounded-lg font-medium text-muted-foreground" style={{ background: 'hsl(217,32%,20%)', border: '1px solid hsl(217,32%,25%)' }}>{cat}</span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={runAnalysis}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        style={{ border: '1px solid hsl(217,32%,20%)' }}
      >
        <Sparkles className="w-3.5 h-3.5" /> Re-run Analysis
      </button>
    </div>
  );
}

function ActivityTab({ ticket }) {
  return (
    <div className="space-y-1">
      {ticket.activity?.map((item, i) => (
        <div key={i} className="flex gap-3 py-3 relative">
          {i < ticket.activity.length - 1 && <div className="absolute left-[15px] top-8 bottom-0 w-px" style={{ background: 'hsl(217,32%,20%)' }} />}
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 z-10" style={{ background: 'hsl(217,91%,60%/0.12)', border: '1px solid hsl(217,91%,60%/0.2)', color: 'hsl(217,91%,72%)' }}>
            {item.user[0]}
          </div>
          <div className="flex-1 pt-0.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[12px] text-foreground"><span className="font-semibold">{item.user}</span> {item.action}</p>
              <span className="text-[11px] text-muted-foreground/60 flex-shrink-0">{item.time}</span>
            </div>
            {item.detail && <p className="text-[12px] text-muted-foreground mt-0.5">{item.detail}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentsTab({ ticket }) {
  const [comment, setComment] = useState('');
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-3">
        {ticket.comments?.map((c, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: 'hsl(217,91%,60%/0.12)', border: '1px solid hsl(217,91%,60%/0.2)', color: 'hsl(217,91%,72%)' }}>{c.user[0]}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[12px] font-semibold text-foreground">{c.user}</span>
                <span className="text-[11px] text-muted-foreground/60">{c.time}</span>
              </div>
              <div className="text-[13px] text-foreground/90 leading-relaxed p-3 rounded-lg" style={{ background: 'hsl(222,44%,13%)', border: '1px solid hsl(217,32%,20%)' }}>{c.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-auto">
        <input
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Add an internal comment..."
          className="flex-1 px-3 py-2.5 rounded-lg text-[13px] text-foreground placeholder:text-muted-foreground outline-none transition-colors"
          style={{ background: 'hsl(222,44%,13%)', border: '1px solid hsl(217,32%,20%)' }}
          onFocus={e => e.target.style.border = '1px solid hsl(217,91%,60%/0.4)'}
          onBlur={e => e.target.style.border = '1px solid hsl(217,32%,20%)'}
        />
        <button className="px-3 py-2.5 rounded-lg text-white transition-all" style={{ background: 'hsl(217,91%,60%)', boxShadow: '0 1px 4px hsl(0,0%,0%/0.3)' }}>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function TicketDetailPanel({ ticket, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <AnimatePresence>
      {ticket && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 40 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-xl z-50 flex flex-col overflow-hidden"
            style={{ background: 'hsl(220,47%,8%)', borderLeft: '1px solid hsl(217,32%,18%)' }}
          >
            {/* Panel Header */}
            <div className="flex-shrink-0 px-6 py-4" style={{ borderBottom: '1px solid hsl(217,32%,18%)' }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-mono text-muted-foreground/70">{ticket.id}</span>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="text-[11px] text-muted-foreground">{ticket.category}</span>
                  </div>
                  <h2 className="text-[15px] font-semibold text-foreground leading-snug">{ticket.title}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
                <span className="text-[11px] text-muted-foreground ml-auto">{ticket.updated}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex-shrink-0 flex px-6 gap-1 pt-3 pb-0" style={{ borderBottom: '1px solid hsl(217,32%,18%)' }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="px-3 py-2 text-[12px] font-medium transition-colors relative"
                  style={{ color: activeTab === tab.id ? 'hsl(217,91%,72%)' : 'hsl(215,20%,50%)' }}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'hsl(217,91%,60%)' }} transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  {/* Description */}
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2">Description</p>
                    <p className="text-[13px] text-foreground/90 leading-relaxed">{ticket.description}</p>
                  </div>

                  {/* Meta grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Assigned To', value: ticket.assignee, icon: User },
                      { label: 'Category', value: ticket.category, icon: Tag },
                      { label: 'Created', value: ticket.created, icon: Clock },
                      { label: 'AI Risk Score', value: `${ticket.riskScore}/10`, icon: Bot },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="p-3 rounded-xl" style={panelCardStyle}>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Icon className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider">{label}</span>
                        </div>
                        <p className="text-[13px] font-medium text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Status history */}
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-3">Status History</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {ticket.statusHistory?.map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <StatusBadge status={s.status} />
                          <span className="text-[11px] text-muted-foreground/60">{s.date}</span>
                          {i < ticket.statusHistory.length - 1 && <span className="text-muted-foreground/30">→</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Attachments */}
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-3">Attachments</p>
                    {ticket.attachments?.length > 0 ? (
                      <div className="space-y-2">
                        {ticket.attachments.map((file, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent" style={{ border: '1px solid hsl(217,32%,20%)' }}>
                            <Paperclip className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-[13px] text-foreground flex-1">{file.name}</span>
                            <span className="text-[11px] text-muted-foreground">{file.size}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[13px] text-muted-foreground">No attachments</p>
                    )}
                  </div>

                  {/* Related tickets */}
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-3">Related Tickets</p>
                    <div className="space-y-2">
                      {ticket.relatedTickets?.map(rt => (
                        <div key={rt.id} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent" style={{ border: '1px solid hsl(217,32%,20%)' }}>
                          <Link2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-[11px] font-mono text-muted-foreground/70 flex-shrink-0">{rt.id}</span>
                          <span className="text-[13px] text-foreground flex-1 truncate">{rt.title}</span>
                          <StatusBadge status={rt.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'ai' && <AIAnalysisTab ticket={ticket} />}
              {activeTab === 'activity' && <ActivityTab ticket={ticket} />}
              {activeTab === 'comments' && <CommentsTab ticket={ticket} />}
            </div>

            {/* Footer actions */}
            <div className="flex-shrink-0 px-6 py-4 flex items-center gap-2" style={{ borderTop: '1px solid hsl(217,32%,18%)' }}>
              <button className="flex-1 py-2 rounded-lg text-[13px] font-semibold text-white transition-all" style={{ background: 'linear-gradient(135deg, hsl(217,91%,62%), hsl(217,91%,52%))', boxShadow: '0 1px 3px hsl(0,0%,0%/0.3)' }}>
                Assign to Me
              </button>
              <button className="px-4 py-2 rounded-lg text-[13px] font-semibold text-success transition-colors hover:bg-success/10" style={{ border: '1px solid hsl(160,84%,39%/0.3)' }}>
                Resolve
              </button>
              <button className="px-4 py-2 rounded-lg text-[13px] font-semibold text-muted-foreground transition-colors hover:bg-accent" style={{ border: '1px solid hsl(217,32%,20%)' }}>
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}