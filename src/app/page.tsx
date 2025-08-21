import { Header } from "@/components/common/Header";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center relative overflow-hidden bg-blue">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <Image
            src="/mainImage.png"
            alt="하늘애 메인 이미지"
            width={800}
            height={600}
            className="object-contain opacity-10"
            priority
          />
        </div>

        {/* 텍스트 콘텐츠 */}
        <div className="relative z-10 text-center">
          <h1 className="text-white text-9xl font-kimm font-bold drop-shadow-lg">
            하늘애
          </h1>
          <p className="text-white text-4xl font-gmarket font-medium mt-12 drop-shadow-lg">
            마음을 담아, <br />
            마지막 길을 함께합니다.
          </p>
          {/* <p className="text-white text-2xl font-medium text-center mt-12 drop-shadow-lg">
            도입문의 <br />
            <span className="font-bold text-center">010-1234-5678</span>
          </p> */}
        </div>

        {/* 하단 링크 버튼들 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/terms/privacy-policy"
              className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-md hover:bg-white/30 transition-all duration-200 text-sm border border-white/30"
            >
              개인정보처리방침
            </Link>
            <Link
              href="/terms/withdrawal"
              className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-md hover:bg-white/30 transition-all duration-200 text-sm border border-white/30"
            >
              회원탈퇴
            </Link>
            <Link
              href="/terms/data-deletion"
              className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-md hover:bg-white/30 transition-all duration-200 text-sm border border-white/30"
            >
              데이터 삭제 방법
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
