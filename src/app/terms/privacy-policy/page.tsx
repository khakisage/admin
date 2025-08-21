import { Header } from "@/components/common/Header";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              하늘애 개인정보 처리방침
            </h1>
            
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-blue-800">
                  "(주)제이에스브라더스의 서비스 하늘애 "(이하 "회사")는 이용자의 개인정보를 보호하며, 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법 등에 관련 법령을 준수하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보처리방침을 수립합니다.
                </p>
              </div>

              <p className="mb-6">
                회사는 이용자가 언제나 쉽게 열람할 수 있도록 서비스 초기화면을 통해 개인정보처리방침을 공개하고 있으며, 개인정보 관련 법령, 지침, 고시 또는 하늘애 서비스(이하 "서비스"라 함) 정책의 변경에 따라 달라질 수 있습니다.
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                  1. 개인정보의 수집 ∙ 이용
                </h2>
                <p className="mb-4">
                  회사는 다음과 같이 이용자의 개인정보를 수집합니다. 처리하고 있는 개인정보는 다음의 수집∙이용 목적이외의 용도로는 활용되지 않습니다.
                </p>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    (1) 회원 정보의 수집 ∙ 이용 목적, 수집항목, 보유 ∙ 이용기간은 아래와 같습니다
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-3 text-left">수집방법</th>
                          <th className="border border-gray-300 p-3 text-left">수집 및 이용목적</th>
                          <th className="border border-gray-300 p-3 text-left">수집항목</th>
                          <th className="border border-gray-300 p-3 text-left">보유 및 이용기간</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-3 font-medium" rowSpan={3}>입력정보<br/>(필수)</td>
                          <td className="border border-gray-300 p-3">회원가입,<br/>카카오 서비스를 이용한 회원가입,<br/>네이버 서비스를 이용한 회원가입</td>
                          <td className="border border-gray-300 p-3">이름, 아이디(전자우편주소),<br/>비밀번호, 휴대전화번호,<br/>수취인의 배송지 주소(선택)</td>
                          <td className="border border-gray-300 p-3">목적달성(회원탈퇴 등) 후 지체 없이 파기<br/>(단, 관련법령 및 회사정책에 따라 별도 보관되는 정보는 예외)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3">만 14세 미만의 이용자 연령확인</td>
                          <td className="border border-gray-300 p-3">생년월일</td>
                          <td className="border border-gray-300 p-3">-</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3">요금제 가입 시 또는 수거신청 시</td>
                          <td className="border border-gray-300 p-3">배송 서비스 이용</td>
                          <td className="border border-gray-300 p-3">수취인의 배송지 정보(수취인명, 휴대전화번호, 수취인주소), 공동현관번호 (선택)</td>
                          <td className="border border-gray-300 p-3">전자상거래등에서의 소비자보호에 관한 법률에 따라 5년간 보관</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3">결제 서비스 이용</td>
                          <td className="border border-gray-300 p-3">결제 서비스 이용 (서비스 구매 및 환불, 취소 포함)</td>
                          <td className="border border-gray-300 p-3">결제 대행사가 수집하는 정보: 카드번호, 유효기간, 생년월일</td>
                          <td className="border border-gray-300 p-3">-</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 font-medium" rowSpan={2}>생성정보<br/>(필수)</td>
                          <td className="border border-gray-300 p-3">회원가입 및 서비스 이용</td>
                          <td className="border border-gray-300 p-3">서비스 이용 및 부정거래 기록 확인</td>
                          <td className="border border-gray-300 p-3">접속지 정보, 로그기록 등<br/>통신비밀보호법에 따라 3개월간 보관</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3">서비스 이용을 위한 이용자 식별, 이용자 맞춤형 서비스 제공</td>
                          <td className="border border-gray-300 p-3">모바일 기기정보 (모델명, 이동통신사 정보, OS정보, 언어 및 국가정보, 기기 고유 식별번호, 광고 ID 등)</td>
                          <td className="border border-gray-300 p-3">목적달성(회원탈퇴 등) 후 지체 없이 파기</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 font-medium" rowSpan={3}>입력정보<br/>(선택)</td>
                          <td className="border border-gray-300 p-3">회원가입</td>
                          <td className="border border-gray-300 p-3">마케팅 CRM 활용</td>
                          <td className="border border-gray-300 p-3">전자우편주소, 휴대전화번호 및 문자메시지, 앱알림, 배송지 정보<br/>목적달성(회원탈퇴 등) 후 지체 없이 파기</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3">카카오 서비스를 이용한 회원가입</td>
                          <td className="border border-gray-300 p-3">마케팅 CRM 활용</td>
                          <td className="border border-gray-300 p-3">전자우편주소, 휴대전화번호 및 문자메시지, 앱알림, 배송지 정보, 성별, 출생연도, 생일<br/>목적달성(회원탈퇴 등) 후 지체 없이 파기</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3">네이버 서비스를 이용한 회원가입</td>
                          <td className="border border-gray-300 p-3">마케팅 CRM 활용</td>
                          <td className="border border-gray-300 p-3">전자우편주소, 휴대전화번호 및 문자메시지, 앱알림, 배송지 정보, 성별, 출생연도, 생일<br/>목적달성(회원탈퇴 등) 후 지체 없이 파기</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3">제휴 및 단체 구매 문의</td>
                          <td className="border border-gray-300 p-3">제휴 및 단체 구매 문의</td>
                          <td className="border border-gray-300 p-3">업체명, 업체주소, 담당자명, 담당자 연락처, 담당자 전자우편주소</td>
                          <td className="border border-gray-300 p-3">해당 문의 상담종료 후 5일 이내 파기</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <p className="text-yellow-800 text-sm">
                    ※ 결제수단 등록 단계에서 이용자가 직접 입력하는 정보는 회사가 직접 저장하지 않고, 신용카드 결제 대행사에 전달 후 회신받은 암호화된 카드식별정보(Key)로 결제수단을 관리합니다.<br/>
                    ※ 회사는 결제 알림메일 발송을 위해 회원가입 수집항목 중 일부 정보(이름, 이메일 주소, 휴대폰 번호)를 결제 대행사에 전달합니다.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    (2) 법령에 의하여 수집 ∙ 이용되는 이용자의 정보는 아래와 같은 수집 ∙ 이용목적으로 보관합니다.
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-3 text-left">법령</th>
                          <th className="border border-gray-300 p-3 text-left">수집 및 이용 목적</th>
                          <th className="border border-gray-300 p-3 text-left">수집항목</th>
                          <th className="border border-gray-300 p-3 text-left">보유 및 이용기간</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-3">통신비밀보호법</td>
                          <td className="border border-gray-300 p-3">통신사실확인자료 제공</td>
                          <td className="border border-gray-300 p-3">로그기록, 접속지 정보 등</td>
                          <td className="border border-gray-300 p-3">3개월</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3" rowSpan={3}>전자상거래 등에서의 소비자보호에 관한 법률</td>
                          <td className="border border-gray-300 p-3">표시 ∙ 광고에 관한 기록</td>
                          <td className="border border-gray-300 p-3">표시 ∙ 광고 기록</td>
                          <td className="border border-gray-300 p-3">6개월</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3">대금결제 및 재화 등에 공급에 관한 기록</td>
                          <td className="border border-gray-300 p-3">대금결제/재화 등의 공급 기록</td>
                          <td className="border border-gray-300 p-3">5년</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3">계약 또는 청약철회 등에 관한 기록</td>
                          <td className="border border-gray-300 p-3">소비자 식별정보 계약/청약철회 기록</td>
                          <td className="border border-gray-300 p-3">5년</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3">-</td>
                          <td className="border border-gray-300 p-3">소비자 불만 또는 분쟁처리에 관한 기록</td>
                          <td className="border border-gray-300 p-3">소비자 식별정보 분쟁처리 기록</td>
                          <td className="border border-gray-300 p-3">3년</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                  2. 개인정보의 제3자 제공
                </h2>
                <p className="mb-4">
                  회사는 개인정보의 수집 및 이용목적에서 고지한 범위에서 사용하며, 이용자의 사전 동의 없이 개인정보 수집이용 목적범위를 초과하여 이용하거나 제3자에게 제공하지 않습니다.
                </p>
                <p>
                  단, 수사 목적에 따라 통신비밀보호법 등 관련 법령에서 규정한 절차와 방법에 따라 수사기관의 개인정보 제공 요청이 있는 경우에는 예외로 합니다.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                  3. 개인정보의 처리 ∙ 위탁
                </h2>
                <div className="space-y-4">
                  <p>
                    (1) 회사는 원활하고 향상된 서비스 이용 및 제공을 위해서 타인에게 개인정보 처리업무를 위탁할 수 있습니다.
                  </p>
                  <p>
                    (2) 회사는 수탁자에 대하여 개인정보의 처리 업무를 위탁하는 경우 위탁업무 수행 목적 외 개인정보의 처리 금지에 관한 사항, 개인정보의 기술적 관리적 보호조치에 관한 사항, 개인정보의 안전한 관리 등 관련 규정을 준수하도록 관리하고 있습니다.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                  4. 개인정보의 파기절차 및 방법
                </h2>
                <div className="space-y-4">
                  <p>
                    (1) 회사는 이용자의 개인정보를 원칙적으로 처리목적이 달성, 보유 ∙ 이용기간의 경과 등 개인정보가 필요하지 않을 경우에는 해당 정보를 지체 없이 파기합니다.
                  </p>
                  <div>
                    <p className="mb-3">(2) 개인정보의 파기절차 및 방법은 다음과 같습니다.</p>
                    <div className="ml-4 space-y-3">
                      <div>
                        <p className="font-semibold">⓵ 파기절차</p>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                          <li>회원님이 회원가입 등을 위해 입력하신 정보는 목적이 달성된 후 별도의 DB로 옮겨져 (종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호사유에 따라 (보유 및 이용기간 참조)일정 기간 저장된 후 파기 되어집니다.</li>
                          <li>회사는 파기 사유가 발생한 개인정보를 개인정보관리책임자의 승인절차를 거쳐 파기 합니다.</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold">⓶ 파기방법</p>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                          <li>회사는 잔저작 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하며, 종이로 출력된 개인정보는 분쇄기로 분쇄하거나 소각 등을 통하여 파기합니다.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                  5. 이용자 및 법정대리인의 권리와 그 행사 방법
                </h2>
                <div className="space-y-4">
                  <p>
                    (1) 이용자 및 법정 대리인은 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 가입 해지 (회원탈퇴)를 요청할 수 있습니다.
                  </p>
                  <p>
                    (2) 이용자 및 법정 대리인의 가입정보를 해지(동의철회)하기 위해서는 "회원탈퇴"를 클릭하여 본인 확인 절차를 거치신 후 직접 열람, 정정 또는 탈퇴가 가능하며, 개인정보 관리책임자 또는 담당자에게 서면, 전화 또는 전자우편주소로 연락하시면 지체 없이 조치하겠습니다.
                  </p>
                  <p>
                    (3) 귀하가 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지 개인정보를 이용 또는 제공하지 않겠습니다. 또한 잘못된 개인정보를 제3자에게 이미 제공한 경우에는 정정처리결과를 제3자에게 지체없이 통지하여 정정이 이루어지도록 하겠습니다.
                  </p>
                  <p>
                    (4) 회사는 이용자 혹은 법정 대리인의 요청에 의해 해지 또는 삭제된 개인정보는 회사가 수집하는 "개인정보의 보유 및 이용기간"에 명시된 바에 따라 처리하고 그 외의 용도로 열람 또는 이용할 수 없도록 처리하고 있습니다.
                  </p>
                  <p>
                    (5) 이용자는 자신의 개인정보를 최신의 상태로 유지해야 하며, 이용자의 부정확한 정보 입력으로 발생하는 문제의 책임은 이용자 자신에게 있습니다.
                  </p>
                  <p>
                    (6) 타인의 개인정보를 도용한 회원가입의 경우 이용자 자격을 상실하거나 관련 개인정보보호 법령에 의해 처벌 받을 수 있습니다.
                  </p>
                  <p>
                    (7) 이용자는 전자우편주소, 비밀번호 등에 대한 보안을 유지할 책임이 있으며 제3자에게 이를 양도하거나 대여 할 수 없습니다.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                  6. 아동의 개인정보보호
                </h2>
                <p>
                  회사는 만 14세미만 아동의 개인정보 보호를 위하여 만 14세 이상의 이용자에 한하여 회원가입을 허용합니다.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                  7. 개인정보의 기술적 ∙ 관리적 보호대책
                </h2>
                <p className="mb-4">
                  회사는 이용자의 개인정보를 처리함에 있어 개인정보가 분실, 도난, 유출, 변조, 훼손 등이 되지 아니하도록 안정성을 확보하기 위해 다음과 같이 기술적 ∙ 관리적 보호대책을 강구하고 있습니다.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">(1) 비밀번호의 암호화</h3>
                    <p>
                      이용자의 비밀번호는 일방향 암호화하여 저장 및 관리되고 있으며, 개인정보의 확인, 변경은 비밀번호를 알고 있는 본인에 의해서만 가능합니다.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">(2) 해킹 등에 대비한 대책</h3>
                    <div className="ml-4 space-y-2">
                      <p>⓵ 회사는 해킹, 컴퓨터 바이러스 등 정보통신망 침입에 의해 이용자의 개인정보가 유출되거나 훼손되는 것을 막기 위해 최선을 다하고 있습니다.</p>
                      <p>⓶ 최신 백신프로그램을 이용하여 이용자들의 개인정보나 자료가 누출되거나 손상되지 않도록 방지하고 있습니다.</p>
                      <p>⓷ 만일의 사태에 대비하여 침입차단 시스템을 이용하여 보안에 최선을 다하고 있습니다.</p>
                      <p>⓸ 민감한 개인정보는 암호화 통신 등을 통하여 네트워크상에서 개인정보를 안전하고 전송할 수 있도록 하고 있습니다.</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">(3) 개인정보 처리 최소화 및 교육</h3>
                    <p>
                      회사는 개인정보 관련 처리 담당자를 최소한으로 제한하며, 개인정보 처리자에 대한 교육 등 관리적 조치를 통해 법령 및 내부방침 등의 준수를 강조하고 있습니다.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">(4) 개인정보보호 전담당당부서 운영</h3>
                    <p>
                      회사는 개인정보의 보호를 위해 개인정보보호 전담부서를 운영하고 있으며, 개인정보처리방침의 이행사항 및 담당자의 준수여부를 확인하여 문제가 발견될 경우 즉시 해결하고 바로 잡을 수 있도록 최선을 다하고 있습니다.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                  8. 개인정보 자동수집장치의 설치 / 운영 및 거부에 관한 사항
                </h2>
                <p>
                  회사는 이용자의 쿠키를 수집하지 않습니다.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                  9. 개인정보보호책임자 및 개인정보침해에 대한 민원 서비스
                </h2>
                <div className="space-y-4">
                  <p>
                    (1) 회사는 이용자의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 관련 부서 및 개인정보보호책임자를 지정하고 있습니다.
                  </p>
                  <p>
                    (2) 귀하께서는 회사의 서비스를 이용하시며 발생하는 모든 개인정보보호 관련 민원을 개인정보보호책임자로 신고하실 수 있습니다. 회사는 이용자들의 신고사항에 대해 신속하게 충분한 답변을 드릴 것 입니다.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">개인정보 보호책임자</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>성명:</strong>도병학</p>
                        <p><strong>연락처:</strong>010-4544-7740</p>
                        <p><strong>전자우편:</strong>ddd831025@hanmail.net</p>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">개인정보 전담담당부서</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>담당자:</strong>도병학</p>
                        <p><strong>연락처:</strong>010-4544-7740</p>
                        <p><strong>전자우편:</strong>ddd831025@hanmail.net</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="mb-3">(3) 이용자는 기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">개인정보침해 신고센터</h4>
                        <p className="text-sm"><strong>홈페이지:</strong> -</p>
                        <p className="text-sm"><strong>전화번호:</strong> -</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">개인정보 분쟁조정위원회</h4>
                        <p className="text-sm"><strong>홈페이지:</strong> -</p>
                        <p className="text-sm"><strong>전화번호:</strong> -</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">대검찰청 사이버수사과</h4>
                        <p className="text-sm"><strong>홈페이지:</strong> -</p>
                        <p className="text-sm"><strong>전화번호:</strong> -</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">경찰청 사이버안전국</h4>
                        <p className="text-sm"><strong>홈페이지:</strong> -</p>
                        <p className="text-sm"><strong>전화번호:</strong> -</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                  10. 고지의 의무
                </h2>
                <div className="space-y-4">
                  <p>
                    (1) 현 개인정보처리방침은 법령, 정부의 정책 또는 회사 내부정책 등 필요에 의하여 변경될 수 있으며, 내용 추가, 삭제 및 수정이 있을 시에는 개정 최소 7일전부터 홈페이지의 '공지사항'을 통해 고지할 것입니다. 다만, 이용자 권리의 중요한 변경이 있을 경우에는 최소 30일 전에 고지합니다.
                  </p>
                  <p>
                    (2) 현 개인정보처리방침은 2024년 10월 7일부터 적용되며, 변경 전의 개인정보처리방침은 공지사항을 통해서 확인하실 수 있습니다.
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