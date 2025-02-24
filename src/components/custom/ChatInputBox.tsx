import { Button } from "@/components/ui/button";
import {
  Mic,
  Send,
  Paperclip,
  CircleStop,
  FileArchive,
  Image,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { post } from "@/utils/axiosWrapper";
import { useMutation } from "@tanstack/react-query";
import {
  setChatPending,
  setNewChat,
  setIsChated,
  setLastAiChatID,
  setLastUserChatID,
} from "@/redux/actions";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const formSchema = z.object({
  message: z.string().nonempty({ message: "Message is required." }),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface DataObject {
  chat_id: number;
  chat_title: string;
  created_at: number;
  user_msg_id: number;
  ai_res_id: number;
}

interface Response {
  success: number;
  message: string;
  data: DataObject;
}

interface ChatState {
  chat: {
    chatPending: boolean;
  };
}

export const ChatInputBox = () => {
  const chatPending = useSelector((state: ChatState) => state.chat.chatPending);
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const chatSendFn = async (data: FormSchemaType): Promise<void> => {
    dispatch(setChatPending(true));
    dispatch(setIsChated(true));
    const formData = new FormData();
    formData.append("message", data.message);
    formData.append("message_type", "text");
    formData.append("chat_id", String(params && params.ID ? params.ID : ""));

    try {
      const response = await post<Response>("m/chat-message", formData);
      if (response.success == 1) {
        dispatch(setLastAiChatID(response.data.ai_res_id));
        dispatch(setLastUserChatID(response.data.user_msg_id));
        if (Number(params.ID) == response.data.chat_id) {
          dispatch(setNewChat(false));
        } else {
          navigate(`/chat/${response.data.chat_id}`);
          dispatch(setNewChat(true));
        }
        form.reset({
          message: "",
        });
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.error(e);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      dispatch(setChatPending(false));
    }
  };

  const mutation = useMutation({
    mutationFn: (formData: FormSchemaType) => chatSendFn(formData),
  });

  function onSubmit(values: FormSchemaType) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`bg-background border rounded-lg shadow-xl overflow-hidden divide-y
         ${
           form.formState.errors.message
             ? "border-destructive divide-destructive"
             : "border-border divide-border"
         } `}
      >
        <div className="w-full">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={chatPending}
                    placeholder="Type message.."
                    className="border-0 shadow-none resize-none focus-visible:ring-0"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="w-full flex items-center justify-between p-1.5">
          <div className="flex gap-0.5 items-stretch">
            <Button
              variant="ghost"
              type="button"
              className="max-w-8 max-h-8"
              size="icon"
              disabled={chatPending}
            >
              <Mic className="size-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="max-w-8 max-h-8"
                  size="icon"
                  disabled={chatPending}
                >
                  <Paperclip className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuItem>
                  <FileArchive className="w-4 h-4" />
                  Files
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Image className="w-4 h-4" />
                  Images
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            className="max-w-8 max-h-8"
            size="icon"
            type="submit"
            disabled={chatPending}
          >
            {chatPending ? (
              <CircleStop className="size-4" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
