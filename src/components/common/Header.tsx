import Link from "next/link";
import { Button } from "../ui/button";

export const Header = () => {
  return (
    <header className="w-full h-16 flex justify-end items-center px-2 bg-blue">
      <Button variant="outline" className="">
        <Link href={"/auth/admin/login"}>관리자 로그인</Link>
      </Button>
    </header>
  );
};
