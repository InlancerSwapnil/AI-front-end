import { Button } from "@/components/ui/button";
import { PanelRightOpen } from "lucide-react";

export const ChatHeader = () => {
  return (
    <header className="absolute top-0 inset-x-0 flex items-center justify-between">
      <div className="p-1">
        <Button variant="ghost" size="icon">
          <PanelRightOpen />
        </Button>
      </div>
    </header>
  );
};
