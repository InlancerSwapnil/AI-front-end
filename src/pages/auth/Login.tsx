import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { setJwtToken, setJwtExpired, setUserID } from "@/redux/actions";
import { useDispatch } from "react-redux";
import { post } from "@/utils/axiosWrapper";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .nonempty({ message: "Email is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface DataObject {
  session_token: string;
  user_id: number;
  expire_time: number;
}

interface Response {
  success: number;
  message: string;
  data: DataObject;
}

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const signInFn = async (data: FormSchemaType): Promise<void> => {
    const formData = new FormData();
    formData.append("user_email", data.email);
    formData.append("user_password", data.password);

    try {
      const response = await post<Response>("sign-in", formData);
      if (response.success == 1) {
        dispatch(setJwtToken(response.data.session_token));
        dispatch(setJwtExpired(response.data.expire_time));
        dispatch(setUserID(response.data.user_id));
        toast.success(response.message);
        navigate("/");
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.error(e);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const mutation = useMutation({
    mutationFn: (formData: FormSchemaType) => signInFn(formData),
  });

  function onSubmit(values: FormSchemaType) {
    mutation.mutate(values);
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome</CardTitle>
        <CardDescription>
          Login with your Email and Password account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid gap-8">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl className="mt-1">
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl className="mt-1">
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
