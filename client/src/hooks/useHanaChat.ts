import { useRef, useState } from "react";
import { trpc } from "@/lib/trpc";

type Message = { role: "user" | "assistant"; content: string };

type ChatResponse = {
  answer: string;
  conversationId?: number | null;
  provider?: string;
  sources?: { title: string; url: string }[];
};

export function useHanaChat(initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [conversationId, setConversationId] = useState<number | undefined>();
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const mutation = trpc.ai.chat.useMutation();
  const fallbackBusy = useRef(false);

  const sendMessage = async (text: string): Promise<ChatResponse | undefined> => {
    const value = text.trim();
    if (!value || mutation.isPending || fallbackBusy.current) return;

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
    } catch (trpcError) {
      // The main tRPC path can fail on deployments where the server runtime/API
      // route is misconfigured. The app already exposes a resilient chat endpoint
      // with OpenAI -> Gemini -> local fallback, so use it before showing an error.
      fallbackBusy.current = true;
      try {
        const response = await fetch("/api/free-chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            message: value,
            history,
            memory: memoryEnabled ? messages.slice(-6).map(message => `${message.role}: ${message.content}`).join("\n") : "",
          }),
        });

        if (!response.ok) {
          const detail = await response.text().catch(() => "");
          throw new Error(`Fallback chat failed (${response.status})${detail ? `: ${detail.slice(0, 240)}` : ""}`);
        }

        const fallback = (await response.json()) as ChatResponse;
        if (!fallback.answer?.trim()) throw new Error("Fallback chat returned no answer");
        setMessages(previous => [...previous, { role: "assistant", content: fallback.answer }]);
        return fallback;
      } catch (fallbackError) {
        console.error("[Hana chat] tRPC and fallback chat both failed", { trpcError, fallbackError });
        setMessages(previous => [...previous, {
          role: "assistant",
          content: "I’m having trouble reaching Hana’s AI service right now. Please try again in a moment.",
        }]);
        throw fallbackError;
      } finally {
        fallbackBusy.current = false;
      }
    }
  };

  return {
    messages,
    sendMessage,
    isLoading: mutation.isPending || fallbackBusy.current,
    memoryEnabled,
    setMemoryEnabled,
    conversationId,
  };
}
