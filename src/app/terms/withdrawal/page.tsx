import { Header } from "@/components/common/Header";
import Link from "next/link";

export default function WithdrawalPage() {
  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              회원탈퇴 안내
            </h1>
            
            <div className="prose max-w-none">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-yellow-800">
                  회원탈퇴 시 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                </p>
              </div>
              
              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  회원탈퇴 시 처리사항
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>계정 정보 및 개인정보 즉시 삭제</li>
                  <li>서비스 이용 기록 삭제</li>
                  <li>포인트 및 캐시 잔액 소멸</li>
                  <li>예약 내역 및 이용 기록 삭제</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  탈퇴 절차
                </h2>
                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                  <li>로그인 후 프로필 페이지의 앱 설정 메뉴 접근</li>
                  <li>회원탈퇴 동의 체크 활성화</li>
                  <li>탈퇴 버튼 클릭</li>
                  <li>최종 탈퇴 처리</li>
                </ol>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  주의사항
                </h2>
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <p className="text-red-800">
                    탈퇴 후에는 동일한 정보로 재가입이 제한될 수 있습니다.
                  </p>
                </div>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t">
              <Link 
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                메인으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 