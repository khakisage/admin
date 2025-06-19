import { Header } from "@/components/common/Header";
import Image from "next/image";

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
          <p className="text-white text-2xl font-medium text-center mt-12 drop-shadow-lg">
            도입문의 <br />
            <span className="font-bold text-center">010-1234-5678</span>
          </p>
        </div>
      </div>
    </>
  );
}
