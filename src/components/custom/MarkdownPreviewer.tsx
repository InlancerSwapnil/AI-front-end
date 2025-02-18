import Markdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";

interface Message {
  id: number;
  content: string;
  user: number;
  ai_response: string | null;
  type: boolean;
}

export const MarkdownPreviewer: React.FC<{ content: Message[] }> = ({
  content,
}) => {
  return (
    <div className="space-y-1">
      {content.map((msg, index) =>
        !msg.type ? (
          <Card className="shadow" key={index}>
            <CardContent className="p-2.5 text-xs space-y-4">
              <Markdown>{msg.ai_response}</Markdown>
            </CardContent>
          </Card>
        ) : (
          <Markdown key={index}>{msg.content}</Markdown>
        )
      )}
    </div>
  );
};
