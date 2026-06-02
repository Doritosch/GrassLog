@AGENTS.md

# GrassLog — 프로젝트 컨텍스트

GitHub 잔디 스타일 라이프 로그 앱. Next.js 16 App Router + Supabase + Vercel.

## 핵심 아키텍처

### 데이터 흐름
- `app/(main)/layout.js` — 서버에서 **한 번만** Supabase 데이터 fetch (activities 최근 200개, categories 전체)
- `MainProvider` — fetch한 데이터를 Context로 공유 (`activities`, `categories`, `selectedDate`, `email`)
- 각 page.js는 서버 fetch 없음 — Context에서만 읽음
- DB 뮤테이션은 `app/(main)/dashboard/actions.js` Server Actions → `revalidatePath('/dashboard')`

### 라우팅
```
/                → middleware가 로그인 여부에 따라 /dashboard 또는 /login으로 redirect
/login           → Google OAuth
/dashboard       → 활동 기록 메인
/grass           → 잔디 히트맵
/auth/callback   → Supabase OAuth 콜백
```

### 레이아웃 구조
- 데스크탑: `SidebarWrapper` (날짜 목록, 카테고리 관리) + 메인 콘텐츠
- 모바일: `MobileTabBar` (하단 탭) + `MobileDateChips` (수평 날짜 필터)
- `md:` breakpoint 기준으로 분기

## 주요 파일

| 파일 | 역할 |
|------|------|
| `middleware.js` | Auth guard + `/` redirect. 반드시 `middleware.js`여야 함 (`proxy.js` 등 다른 이름은 무시됨) |
| `app/(main)/layout.js` | 공유 레이아웃, 데이터 fetch 담당 |
| `app/(main)/dashboard/actions.js` | Server Actions: createActivity, deleteActivity, createCategory, deleteCategory |
| `components/providers/MainProvider.js` | 전역 Context |
| `components/activity/ActivitySidebar.js` | 데스크탑 사이드바 (날짜 목록, 카테고리) |
| `components/activity/ActivityForm.js` | 활동 입력창 (이미지 업로드, 드래그 앤 드롭 포함) |
| `components/activity/RecentActivityList.js` | 날짜별 활동 목록 |
| `components/heatmap/HeatmapInteractive.js` | 잔디 히트맵 (클릭/툴팁) |
| `lib/date/heatmap-grid.js` | 1월 1일~12월 31일 그리드 생성. `toLocalDateStr()` 사용 (UTC 버그 방지) |
| `lib/category-colors.js` | 카테고리 이름 해시 → 일관된 색상 반환 |
| `lib/supabase/server.js` | 서버 컴포넌트용 Supabase 클라이언트 |
| `lib/supabase/client.js` | 클라이언트 컴포넌트용 Supabase 클라이언트 |

## DB 스키마

```sql
activity_log (
  id            uuid PRIMARY KEY,
  user_id       uuid REFERENCES auth.users ON DELETE CASCADE,
  title         text CHECK (title IS NULL OR char_length(title) BETWEEN 1 AND 2000),
  category_name text,   -- 쉼표 구분 다중 카테고리 (예: "운동, 독서")
  activity_date date,
  image_url     text,   -- Supabase Storage 공개 URL
  created_at    timestamptz
)

category (
  id      uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  name    text UNIQUE
)
```

## Supabase Storage

- 버킷명: `activity-images` (Public)
- 경로: `{user_id}/{timestamp}.{ext}`
- RLS: INSERT/DELETE는 본인 폴더만, SELECT는 전체 공개
- 이미지 제한: 5MB 이하, jpeg/png/gif/webp만 허용

## 주의사항

- **날짜 계산**: `new Date().toISOString()`은 UTC 기준 — 한국(UTC+9)에서 날짜가 어긋남. 항상 `toLocalDateStr()` 또는 `getFullYear()/getMonth()/getDate()` 사용
- **Server Action 경로**: `app/(main)/dashboard/actions.js` — 괄호 포함 경로라 git add 시 따옴표 필요: `git add "app/(main)/dashboard/actions.js"`
- **reactStrictMode: false** — `next.config.mjs`에서 비활성화 (이중 실행 방지)
- **Vercel 리전**: `vercel.json`에 `icn1` (서울) 설정 — 변경 시 지연시간 증가

## 환경변수

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
