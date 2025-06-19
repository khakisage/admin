import { Header } from "@/components/common/Header";

export default function Home() {
  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-blue">
        <h1 className="text-white text-9xl font-kimm font-bold">하늘애</h1>
        <p className="text-white text-4xl font-gmarket font-medium mt-12">
          하늘애는 검증된 장례 서비스를 연결하고, <br />
          신뢰할 수 있는 장례준비를 함께합니다.
        </p>
        <p className="text-white text-2xl font-medium text-center mt-12">
          도입문의 <br />
          <span className="font-bold text-center">010-1234-5678</span>
        </p>
      </div>
    </>
  );
}
