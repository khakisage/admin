'use client';

import { useEffect, useRef } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';
import { requestNotificationPermission } from '@/lib/requestPermission';
import { toast } from 'sonner';
import { api, userAPI } from '@/lib/api';

console.log('🔴 FCMProvider 파일 로드됨 - 최상위 로그');

export function FCMProvider({ children }: { children: React.ReactNode }) {
  console.log('🟢 FCMProvider 컴포넌트 렌더링됨');
  
  // 토큰 저장 상태를 추적하는 ref
  const tokenSavedRef = useRef(false);
  
  useEffect(() => {
    console.log('🟢 FCMProvider useEffect 실행됨');
    
    // 서비스 워커 등록
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then(() => console.log('✅ Service Worker 등록 완료'))
        .catch((err) => console.error('❌ SW 등록 실패:', err));
    }

    // FCM 설정 함수
    const setupFCM = async () => {
      try {
        // 이미 토큰이 저장되었다면 중복 실행 방지
        if (tokenSavedRef.current) {
          console.log('🔄 토큰이 이미 저장되어 있음 - 중복 실행 방지');
          return;
        }
        
        // 권한 요청 및 토큰 발급
        const token = await requestNotificationPermission();
        if (token) {
          // 로컬스토리지에서 이전 토큰 확인
          const savedToken = localStorage.getItem('fcmToken');
          
          // 토큰이 변경되었거나 처음 저장하는 경우에만 API 호출
          if (savedToken !== token) {
            try {
              await api.post('/common/notification/fcm/token', {
                fcmToken: token,
                deviceId: navigator.userAgent || 'unknown',
                deviceType: 'web',
              });
              
              // 토큰 저장 성공 시 로컬스토리지에 저장
              localStorage.setItem('fcmToken', token);
              tokenSavedRef.current = true;
              console.log('🔑 FCM 토큰 저장 성공');
            } catch (error) {
              console.error('❌ FCM 토큰 저장 실패:', error);
            }
          } else {
            console.log('🔄 동일한 토큰이 이미 저장되어 있음');
            tokenSavedRef.current = true;
          }
        } else {
          console.warn('⚠️ FCM 토큰 발급 실패 - 알림을 받을 수 없습니다');
        }

        // messaging이 Promise이므로 await하여 실제 인스턴스 가져오기
        const messagingInstance = await messaging;
        
        if (messagingInstance) {
          // 포그라운드 메시지 수신 처리
          onMessage(messagingInstance, (payload: any) => {
            // toast로 알림 표시 (alert 대신 더 나은 UX)
            if (payload.notification) {
              toast.info(payload.notification.title || '알림', {
                description: payload.notification.body,
                duration: 5000,
              });
            }
          });
        }
      } catch (error) {
        console.error('❌ FCM 설정 실패:', error);
      }
    };

    setupFCM();
  }, []);

  return <>{children}</>;
} 