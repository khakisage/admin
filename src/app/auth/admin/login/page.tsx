"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const formSchema = z.object({
    email: z
      .string()
      .email({ message: "이메일 형식이 올바르지 않습니다" })
      .refine((email) => email.endsWith("@hanulae.com"), {
        message: "이메일 형식이 올바르지 않습니다",
      }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다" })
      .max(20, { message: "비밀번호는 최대 20자까지 가능합니다" })
      .regex(/[A-Z]/, { message: "대문자를 포함해야 합니다" })
      .regex(/[a-z]/, { message: "소문자를 포함해야 합니다" })
      .regex(/[0-9]/, { message: "숫자를 포함해야 합니다" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // TODO: 로그인 로직 구현
    // - API 호출
    // - 토큰 저장
    // - 인증 상태 관리

    // 임시로 /admin으로 이동
    router.push("/admin/approval/manager");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>관리자 로그인</CardTitle>
          <CardDescription>
            하늘애 관리자 계정으로 로그인해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@hanulae.com" {...field} />
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
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
