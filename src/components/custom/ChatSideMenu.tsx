import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  SquarePen,
  Loader,
  Ellipsis,
  Trash2,
  SquareArrowOutUpRight,
} from "lucide-react";
import { post } from "@/utils/axiosWrapper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect } from "react";

interface Response {
  success: number;
  message: string;
  data: {
    chat_list: { chat_id: number; chat_title: string; created_at: number }[];
  };
}

interface DeleteResponse {
  success: number;
  message: string;
}

interface ChatState {
  chat: {
    isNewChat: boolean;
  };
}

export const ChatSideMenu: React.FC = () => {
  const newChat = useSelector((state: ChatState) => state.chat.isNewChat);
  const params = useParams();
  const navigate = useNavigate();

  async function chatListFn() {
    const formData = new FormData();
    formData.append("search", "");

    try {
      const response = await post<Response>("c/chat-list", formData);
      if (response.success == 1) {
        return response.data;
      } else {
        toast.error(response.message);
        return null;
      }
    } catch (e) {
      console.error(e);
      toast.error("An unexpected error occurred. Please try again.");
      throw e;
    }
  }

  async function chatDelete(id: number) {
    const formData = new FormData();
    formData.append("chat_id", id.toString());

    try {
      const response = await post<DeleteResponse>("c/chat-delete", formData);
      if (response.success != 1) {
        toast.error(response.message);
      } else {
        refetch();
        if (Number(params.ID) == id) {
          navigate("/");
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("An unexpected error occurred. Please try again.");
      throw e;
    }
  }

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["chatlist"],
    queryFn: chatListFn,
  });

  useEffect(() => {
    if (newChat) {
      refetch();
    }
  }, [newChat, refetch]);

  return (
    <aside className="w-full max-w-60 h-full flex flex-col justify-between divide-y border-r border-input divide-border">
      <div className="flex items-center justify-between pr-2">
        <Button variant="ghost" asChild>
          <Link to="/" className="h-11 !px-2 py-1.5 rounded-none justify-start">
            <img
              alt="inlancer logo"
              width={120}
              className="dark:hidden block"
              src="https://imageproxy.inlancer.in/pr:sharp/f:webp/rs:fit:206:0/g:sm/plain/https://inlancer.in/assets/upload/images/original/63380d4d8dcc1-633572ab8819c-logo.svg"
            />
            <img
              alt="inlancer logo"
              width={120}
              className="hidden dark:block"
              src="https://imageproxy.inlancer.in/pr:sharp/f:webp/rs:fit:283:0/g:sm/plain/https://inlancer.in/assets/upload/images/original/63380d4d8d804-633572d7b246b-footer-logo.svg"
            />
          </Link>
        </Button>
        <Button size="icon" variant="ghost" asChild>
          <Link to="/">
            <SquarePen />
          </Link>
        </Button>
      </div>
      <ScrollArea className="flex-1 w-full">
        <div className="py-1 w-full">
          {isError && (
            <p className="text-red-500">
              Error:{" "}
              {error instanceof Error ? error.message : "Something went wrong!"}
            </p>
          )}
          {isLoading ? (
            <ChatSkeleton />
          ) : (
            <ul className="grid gap-1 pr-2.5 pl-1">
              {data?.chat_list && data?.chat_list.length > 0 ? (
                data?.chat_list.map((chat) => (
                  <li key={chat.chat_id}>
                    <Button
                      variant={
                        Number(params.ID) == chat.chat_id
                          ? "secondary"
                          : "ghost"
                      }
                      className="w-full p-0 shadow-none justify-between"
                      asChild
                    >
                      <div className="w-full flex items-center pr-1 justify-between">
                        <Link
                          className="block w-full py-1.5 pl-2.5 text-wrap"
                          to={`/chat/${chat.chat_id}`}
                        >
                          <span className="line-clamp-1">
                            {" "}
                            {chat.chat_title}{" "}
                          </span>
                        </Link>
                        <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                className="!max-w-7 text-muted-foreground !max-h-7"
                                size="icon"
                                variant="ghost"
                              >
                                <Ellipsis />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              className="min-w-44"
                              side="bottom"
                              align="start"
                            >
                              <DropdownMenuItem>
                                <SquareArrowOutUpRight />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialogTrigger className="w-full">
                                <DropdownMenuItem className="text-destructive w-full">
                                  <Trash2 />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete chat?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will delete{" "}
                                <b className="text-foreground underline">
                                  {chat.chat_title}
                                </b>{" "}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => chatDelete(Number(chat.chat_id))}
                              >
                                Yes, Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </Button>
                  </li>
                ))
              ) : (
                <li className="py-12">
                  <p className="text-sm text-center">No chats available</p>
                </li>
              )}
            </ul>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

function ChatSkeleton() {
  return (
    <div className="flex items-center justify-center w-full py-12">
      <Loader className="animate-spin size-8 text-muted-foreground" />
    </div>
  );
}
