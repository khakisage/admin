importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Firebase 설정 (실제 값으로 교체 필요)
firebase.initializeApp({
    apiKey: "AIzaSyA1p1nmuaEPlWP-kxPfSwQ30Y8AbWcdSxk",
    authDomain: "hanulae-notifications.firebaseapp.com",
    projectId: "hanulae-notifications",
    storageBucket: "hanulae-notifications.firebasestorage.app",
    messagingSenderId: "546067791518",
    appId: "1:546067791518:web:73b4344bb5e9c1380a058f"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  // console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || '새 알림';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data,
    actions: [
      {
        action: 'open',
        title: '확인'
      },
      {
        action: 'close', 
        title: '닫기'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 처리
self.addEventListener('notificationclick', function(event) {
  // console.log('알림 클릭:', event);
  event.notification.close();

  if (event.action === 'open') {
    // 관리자 페이지로 이동
    event.waitUntil(
      clients.openWindow('/admin')
    );
  }
});