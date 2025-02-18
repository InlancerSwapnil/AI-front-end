import { Outlet } from "react-router";
import { ChatSideMenu } from "@/components/custom/ChatSideMenu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInputBox } from "@/components/custom/ChatInputBox";

export default function ChatLayout() {
  return (
    <main className="w-full flex items-stretch h-dvh">
      <ChatSideMenu />
      <ScrollArea className="bg-muted w-full h-auto">
        <div className="w-full flex flex-col relative min-h-dvh justify-between pb-24 max-w-[680px]  mx-auto">
          <div className="py-1">
            <Outlet />
          </div>
          <div className="py-1 absolute bottom-0 inset-x-0">
            <ChatInputBox />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
}
