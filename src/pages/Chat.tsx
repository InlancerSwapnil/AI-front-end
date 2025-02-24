import { MarkdownPreviewer } from "@/components/custom/MarkdownPreviewer";
import { skipToken, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { post } from "@/utils/axiosWrapper";
import { setChatPending } from "@/redux/actions";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

interface Message {
  id: number;
  content?: string;
  user?: number;
  ai_response: string | null;
  type: boolean;
}

interface Response {
  success: number;
  message: string;
  data: {
    messages: Message[];
  };
}

interface ChatState {
  chat: {
    isChated: boolean;
    lastAiChatID: number;
  };
}

const Chat: React.FC = () => {
  const chated = useSelector((state: ChatState) => state.chat.isChated);
  const lastAiChatID = useSelector(
    (state: ChatState) => state.chat.lastAiChatID
  );

  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [content, setContent] = useState<Message[]>([]);

  async function chatHistoryFN() {
    dispatch(setChatPending(true));
    const formData = new FormData();
    formData.append("chat_id", String(params.ID));

    try {
      const response = await post<Response>("m/chat-history", formData);
      if (response.success == 1) {
        setContent(response.data.messages);
        return response.data.messages;
      } else {
        toast.error(response.message);
        navigate("/");
      }
    } catch (e) {
      console.error(e);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      dispatch(setChatPending(false));
    }
  }

  const { isPending, isError, error } = useQuery({
    queryKey: ["chatHistory", params.ID],
    queryFn: !chated ? chatHistoryFN : skipToken,
  });

  useEffect(() => {
    if (chated && lastAiChatID) {
      dispatch(setChatPending(true));

      const eventSource = new EventSource(
        `http://192.168.0.42:8040/d/response-stream?chat_id=${String(
          params.ID
        )}&last_message=${lastAiChatID}`
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (event.type === "start") {
          console.log("Streaming started...");
        } else if (event.type === "message") {
          setContent((prevState) => {
            const lastMessage = prevState[prevState.length - 1];

            if (data.type === "ai") {
              if (
                lastMessage &&
                lastMessage.id === data.id &&
                lastMessage.type === false
              ) {
                return prevState.map((msg) =>
                  msg.id === data.id
                    ? {
                        ...msg,
                        ai_response: msg.ai_response + " " + data.content,
                      }
                    : msg
                );
              } else {
                return [
                  ...prevState,
                  {
                    id: data.id,
                    content: "",
                    ai_response: data.content,
                    type: false,
                  },
                ];
              }
            } else {
              return [...prevState, { ...data }];
            }
          });
        } else if (event.type === "stop") {
          console.log("Streaming complete.");
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource.close();
        dispatch(setChatPending(false));
      };

      return () => {
        eventSource.close();
        dispatch(setChatPending(false));
      };
    }
  }, [params, dispatch, chated, lastAiChatID]);

  if (isPending && !chated) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div className="flex-1">
      <MarkdownPreviewer content={content} />
    </div>
  );
};

export default Chat;
