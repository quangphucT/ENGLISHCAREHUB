# Firebase Setup Guide

## 🔥 Thiết lập Firebase cho dự án

### 1. Tạo Firebase Project

1. Đi tới [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** hoặc **"Add project"**
3. Đặt tên project (ví dụ: `ai-english-practice`)
4. Disable Google Analytics (không bắt buộc)
5. Click **"Create project"**

### 2. Thiết lập Authentication

1. Trong Firebase console, chọn **"Authentication"** từ sidebar
2. Click tab **"Sign-in method"**
3. Enable **"Google"** provider:
   - Click vào Google
   - Toggle "Enable"
   - Thêm email hỗ trợ
   - Click "Save"

### 3. Lấy Firebase Configuration

1. Click vào icon **"Web"** (</>) trong Project Overview
2. Đặt app nickname (ví dụ: `ai-english-web`)
3. Không check "Firebase Hosting"
4. Click **"Register app"**
5. Copy các giá trị configuration

### 4. Cấu hình Environment Variables

1. Tạo file `.env.local` trong thư mục root
2. Copy nội dung từ `.env.example`
3. Điền các giá trị từ Firebase config:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Backend API URL
BE_API_URL=http://localhost:3001/api
```

### 5. Thiết lập Domain cho Google Auth

1. Trong Firebase Authentication settings
2. Đi tới **"Authorized domains"**
3. Thêm domains:
   - `localhost` (cho development)
   - Domain production của bạn

### 6. Test Authentication

1. Restart Next.js development server: `npm run dev`
2. Thử login với Google
3. Kiểm tra Firebase console > Authentication > Users để xem user đã được tạo

## 🚨 Lưu ý bảo mật

- **KHÔNG** commit file `.env.local` lên Git
- File `.env.local` đã được thêm vào `.gitignore`
- Chỉ share Firebase config qua kênh riêng tư

## 🔧 Troubleshooting

### Lỗi "configuration-not-found"

- Kiểm tra file `.env.local` có tồn tại
- Đảm bảo tất cả biến môi trường được điền đầy đủ
- Restart dev server sau khi thay đổi `.env.local`

### Lỗi "auth/unauthorized-domain"

- Thêm domain vào "Authorized domains" trong Firebase console
- Đảm bảo `localhost` được thêm cho development
