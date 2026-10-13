import { apiRequest } from './client'

export type AssistantChatMessage = { role: 'user' | 'assistant'; content: string }

export type AssistantChatResponse = {
  mode: 'live' | 'demo'
  reply: string
  notice?: string
  model?: string
}

export function postAssistantChat(messages: AssistantChatMessage[]) {
  return apiRequest<AssistantChatResponse>('/assistant/chat', {
    method: 'POST',
    body: JSON.stringify({ messages: messages.slice(-20) }),
  })
}
