import ChatMessages from "@/templates/chat";

export default function Home() {
  return (
    <main className="flex h-screen w-full max-w-3xl flex-col items-center mx-auto">
      <ChatMessages />
    </main>
  );
}
