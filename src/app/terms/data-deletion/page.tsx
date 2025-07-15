import { Header } from "@/components/common/Header";
import Link from "next/link";

export default function DataDeletionPage() {
  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              데이터 삭제 방법 안내
            </h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                하늘애 서비스에서 개인 데이터를 삭제하는 방법을 안내드립니다.
              </p>
              
              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  자동 삭제되는 데이터
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>회원탈퇴 시 모든 개인정보 즉시 삭제</li>
                  <li>로그 데이터는 3개월 후 자동 삭제</li>
                  <li>임시 데이터는 24시간 후 자동 삭제</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  수동 삭제 방법
                </h2>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">1. 개별 데이터 삭제</h3>
                    <p className="text-gray-600">
                      프로필 페이지의 개인정보 수정에서 개인 정보를 선택적으로 삭제할 수 있습니다.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">2. 전체 데이터 삭제</h3>
                    <p className="text-gray-600">
                      회원탈퇴를 통해 모든 개인 데이터를 일괄 삭제할 수 있습니다.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">3. 고객센터 요청</h3>
                    <p className="text-gray-600">
                      고객센터를 통해 데이터 삭제를 요청할 수 있습니다.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  삭제 처리 기간
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                  <p className="text-blue-800">
                    데이터 삭제 요청 후 즉시 처리되며, 백업 데이터는 최대 30일 내에 완전 삭제됩니다.
                  </p>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  문의처
                </h2>
                <div className="bg-gray-50 rounded p-4">
                  <p className="text-gray-700">
                    <strong>고객센터:</strong>02)1661-1897<br />
                    <strong>이메일:</strong>ddd831025@hanmail.net<br />
                    <strong>운영시간:</strong> 평일 09:00 - 18:00
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