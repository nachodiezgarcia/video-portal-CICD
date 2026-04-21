import { createFileRoute } from "@tanstack/react-router";
import { ChatComponent } from "../pods/chat/chat.component";

export const Route = createFileRoute("/chat")({
  component: function ChatPage() {
    return <ChatComponent />;
  },
});
