import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUpRight, Bot, Loader2, MessageCircle, Search, ShoppingBag, UserRound } from 'lucide-react'
import { ApiError } from '../services/api/client'
import { postAssistantChat, type AssistantChatMessage } from '../services/api/assistantApi'

const prompts = [{ label: 'Find a program', icon: Search }, { label: 'Meet a trainer', icon: UserRound }, { label: 'Explore supplements', icon: ShoppingBag }]

const greeting: AssistantChatMessage = { role: 'assistant', content: 'Hi there. What are we working toward today?' }

export function AssistantPreview() {
  const [messages, setMessages] = useState<AssistantChatMessage[]>([greeting])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const threadRef = useRef<HTMLDivElement>(null)

  useEffect(() => { const thread = threadRef.current; if (thread) thread.scrollTop = thread.scrollHeight }, [messages, sending])

  async function send(text: string) {
    const content = text.trim()
    if (!content || sending) return
    const history = [...messages, { role: 'user' as const, content }]
    setMessages(history)
    setDraft('')
    setError('')
    setSending(true)
    try {
      const response = await postAssistantChat(history)
      setNotice(response.notice ?? '')
      setMessages([...history, { role: 'assistant', content: response.reply }])
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'The assistant is unreachable right now. Please try again in a moment.')
    } finally {
      setSending(false)
    }
  }

  const submit = (event: FormEvent) => { event.preventDefault(); void send(draft) }

  return <div className="assistant-card">
    <div className="assistant-header"><div className="assistant-brand"><span className="assistant-icon"><Bot size={19} /></span><div><strong>Your Fitness Assistant</strong><small>IRON PEAK INTELLIGENCE</small></div></div><span className="online-dot">{sending ? 'Typing' : 'Online'}</span></div>
    <div className="assistant-thread" ref={threadRef} aria-live="polite">
      {messages.map((message, index) => <div className={`assistant-message ${message.role === 'user' ? 'assistant-message-user' : 'assistant-message-bot'}`} key={`${message.role}-${index}`}>{message.content}</div>)}
      {sending && <div className="assistant-message assistant-message-bot assistant-message-pending"><Loader2 size={14} className="assistant-typing" /> Thinking…</div>}
    </div>
    <div className="assistant-prompts">{prompts.map(({ label, icon: Icon }) => <button key={label} type="button" onClick={() => void send(label)} disabled={sending}><Icon size={14} /> {label}</button>)}</div>
    <form className="assistant-input" onSubmit={submit}>
      <input value={draft} onChange={(event) => { setDraft(event.target.value); setError('') }} placeholder="Ask anything about your journey..." aria-label="Message the Iron Peak assistant" disabled={sending} />
      <button type="submit" aria-label="Send message" disabled={sending || !draft.trim()}><ArrowUpRight size={16} /></button>
    </form>
    {error && <p className="assistant-status assistant-status-error" role="alert">{error}</p>}
    {!error && notice && <p className="assistant-status" role="status">{notice}</p>}
    <div className="assistant-footnote"><MessageCircle size={13} /> {notice ? 'Catalog answers while the AI is offline.' : 'Live answers from the Iron Peak assistant.'}</div>
  </div>
}
