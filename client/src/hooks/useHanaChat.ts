import { useState } from "react";
import { trpc } from "@/lib/trpc";

type Message = { role: "user" | "assistant"; content: string };

export function useHanaChat(initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [conversationId, setConversationId] = useState<number | undefined>();
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const mutation = trpc.ai.chat.useMutation();

  const sendMessage = async (text: string) => {
    const value = text.trim();
    if (!value || mutation.isPending) return;
    const history = messages.slice(-10).map(message => ({
      role: message.role === "assistant" ? "model" as const : "user" as const,
      text: message.content,
    }));
    setMessages(previous => [...previous, { role: "user", content: value }]);
    try {
      const response = await mutation.mutateAsync({
        message: value,
        history,
        conversationId,
        memoryEnabled,
      });
      setMessages(previous => [...previous, { role: "assistant", content: response.answer }]);
      if (response.conversationId) setConversationId(response.conversationId);
      return response;
    } catch (error) {
      setMessages(previous => [...previous, { role: "assistant", content: "I couldn't reach my AI service right now. Please try again in a moment." }]);
      throw error;
    }
  };

  return {
    messages,
    sendMessage,
    isLoading: mutation.isPending,
    memoryEnabled,
    setMemoryEnabled,
    conversationId,
  };
}
