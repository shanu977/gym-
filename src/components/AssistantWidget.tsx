import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowUp, Bot, Clock3, Loader2, RotateCcw, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { ApiError } from '../services/api/client'
import { postAssistantChat, type AssistantChatMessage } from '../services/api/assistantApi'

const WELCOME: AssistantChatMessage = {
  role: 'assistant',
  content: "Hi! I'm your Iron Peak fitness assistant. Ask me about memberships, programs, trainers, gym timings or supplements — I'm here to help.",
}

const MAX_MESSAGE_LENGTH = 2000

const prompts = [
  { label: 'Find a program', icon: Search },
  { label: 'Meet a trainer', icon: UserRound },
  { label: 'Explore supplements', icon: ShoppingBag },
  { label: 'Gym timings', icon: Clock3 },
]

export function AssistantWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<AssistantChatMessage[]>([WELCOME])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const threadRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const pinnedRef = useRef(true)

  const hasSentMessage = messages.length > 1

  useEffect(() => {
    const thread = threadRef.current
    if (thread && pinnedRef.current) thread.scrollTop = thread.scrollHeight
  }, [messages, sending])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    inputRef.current?.focus()
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  async function send(text: string) {
    const content = text.trim().slice(0, MAX_MESSAGE_LENGTH)
    if (!content || sending) return
    const history = [...messages, { role: 'user' as const, content }]
    setMessages(history)
    setDraft('')
    setError('')
    setSending(true)
    pinnedRef.current = true
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

  async function retry() {
    if (sending) return
    const last = messages[messages.length - 1]
    if (!last || last.role !== 'user') return
    setError('')
    setSending(true)
    pinnedRef.current = true
    try {
      const response = await postAssistantChat(messages)
      setNotice(response.notice ?? '')
      setMessages([...messages, { role: 'assistant', content: response.reply }])
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'The assistant is unreachable right now. Please try again in a moment.')
    } finally {
      setSending(false)
    }
  }

  function resetThread() {
    if (sending) return
    setMessages([WELCOME])
    setDraft('')
    setError('')
    setNotice('')
    inputRef.current?.focus()
  }

  const submit = (event: FormEvent) => { event.preventDefault(); void send(draft) }

  const onInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      void send(draft)
    }
  }

  return (
    <div className="assistant-fab-wrap">
      {open && (
        <div className="assistant-panel" role="dialog" aria-label="Iron Peak fitness assistant">
          <div className="assistant-header assistant-panel-header">
            <div className="assistant-brand">
              <span className="assistant-icon"><Bot size={19} /></span>
              <div><strong>Your Fitness Assistant</strong><small>IRON PEAK INTELLIGENCE</small></div>
            </div>
            <div className="assistant-panel-tools">
              <span className="online-dot">{sending ? 'Typing' : 'Online'}</span>
              <button className="assistant-icon-button" type="button" onClick={resetThread} disabled={sending || !hasSentMessage} aria-label="Start a new conversation" title="New conversation"><RotateCcw size={14} /></button>
              <button className="assistant-icon-button" type="button" onClick={() => setOpen(false)} aria-label="Close assistant"><X size={15} /></button>
            </div>
          </div>
          <div
            className="assistant-thread assistant-panel-thread"
            ref={threadRef}
            aria-live="polite"
            onScroll={(event) => {
              const thread = event.currentTarget
              pinnedRef.current = thread.scrollHeight - thread.scrollTop - thread.clientHeight < 80
            }}
          >
            {messages.map((message, index) => (
              <div className={`assistant-message ${message.role === 'user' ? 'assistant-message-user' : 'assistant-message-bot'}`} key={`${message.role}-${index}`}>{message.content}</div>
            ))}
            {sending && <div className="assistant-message assistant-message-bot assistant-message-pending"><Loader2 size={14} className="assistant-typing" /> Thinking…</div>}
          </div>
          {error && (
            <div className="assistant-panel-error" role="alert">
              <span>{error}</span>
              <button className="assistant-retry" type="button" onClick={() => void retry()} disabled={sending}><RotateCcw size={12} /> Retry</button>
            </div>
          )}
          <div className="assistant-prompts assistant-panel-prompts">
            {prompts.map(({ label, icon: Icon }) => (
              <button key={label} type="button" onClick={() => void send(label)} disabled={sending}><Icon size={14} /> {label}</button>
            ))}
          </div>
          <form className="assistant-input assistant-panel-input" onSubmit={submit}>
            <textarea
              ref={inputRef}
              value={draft}
              rows={1}
              maxLength={MAX_MESSAGE_LENGTH}
              onChange={(event) => { setDraft(event.target.value); setError('') }}
              onKeyDown={onInputKeyDown}
              placeholder="Ask anything about your fitness journey..."
              aria-label="Message the Iron Peak assistant"
              disabled={sending}
            />
            <button type="submit" aria-label="Send message" disabled={sending || !draft.trim()}><ArrowUp size={16} /></button>
          </form>
          {!error && notice && <p className="assistant-status" role="status">{notice}</p>}
        </div>
      )}
      <button
        className="assistant-fab"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? 'Close AI assistant' : 'Ask AI Assistant'}
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <Bot size={22} />}
        {!open && !hasSentMessage && <span className="assistant-fab-badge" aria-hidden="true" />}
        <span className="assistant-fab-tooltip" aria-hidden="true">{open ? 'Close assistant' : 'Ask AI Assistant'}</span>
      </button>
    </div>
  )
}
