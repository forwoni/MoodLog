# 📘 MoodLog API 명세서

> 버전: v1
> 인증: JWT 기반 (헤더에 `Authorization: Bearer <access_token>` 포함 필요)

---

## 📂 Auth

### 🔐 회원가입

* **URL:** `POST /api/auth/signup`
* **인증 필요:** ❌
* **Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

* **Response:** `201 Created`

```json
{
  "id": 1,
  "username": "string",
  "email": "string"
}
```

* **예외:**

    * `400`: 유효성 검사 실패 (중복된 이메일/username, 형식 오류 등)

---

### 🔑 로그인

* **URL:** `POST /api/auth/login`
* **인증 필요:** ❌
* **Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

* **Response:** `200 OK`

```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

* **예외:**

    * `401`: 로그인 실패 (비밀번호 불일치, 사용자 없음)

---

### 🔁 토큰 재발급

* **URL:** `POST /api/auth/refresh`
* **인증 필요:** ❌
* **Request Body:**

```json
{
  "refreshToken": "string"
}
```

* **Response:** `200 OK`

```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

---

## 📝 Post

### 📌 게시글 작성

* **URL:** `POST /api/posts`
* **인증 필요:** ✅
* **Request Body:**

```json
{
  "title": "string",
  "content": "string",
  "autoSaved": true
}
```

* **Response:** `201 Created`
* **예외:**

    * `400`: 필드 누락 또는 비정상 요청
    * `401`: 인증 실패

---

### 📄 전체 게시글 조회

* **URL:** `GET /api/posts`
* **인증 필요:** ✅
* **Response:** `200 OK`

```json
[
  {
    "id": 1,
    "title": "string",
    "content": "string",
    "autoSaved": false,
    "authorUsername": "string",
    "createdAt": "yyyy-MM-ddTHH:mm:ss",
    "updatedAt": "yyyy-MM-ddTHH:mm:ss",
    "viewCount": 0,
    "likeCount": 0,
    "comments": []
  }
]
```

---

### 🔍 게시글 상세 조회

* **URL:** `GET /api/posts/{id}`
* **인증 필요:** ✅
* **Response:** `200 OK` (위와 동일 구조)
* **예외:**

    * `404`: 게시글 없음

---

### ✏️ 게시글 수정

* **URL:** `PUT /api/posts/{id}`
* **인증 필요:** ✅
* **Request Body:** PostRequestDto
* **Response:** `200 OK`
* **예외:**

    * `403`: 작성자가 아님
    * `404`: 게시글 없음

---

### ❌ 게시글 삭제

* **URL:** `DELETE /api/posts/{id}`
* **인증 필요:** ✅
* **Response:** `204 No Content`

---

### ❤️ 게시글 좋아요 토글

* **URL:** `POST /api/posts/{postId}/like`
* **인증 필요:** ✅
* **Response:** `200 OK`
* **기능:** 좋아요 추가/취소 토글

---

## 👤 유저 게시글 조회

### 🗂️ 특정 유저 게시글 목록 (정렬/페이징)

* **URL:** `GET /api/users/{username}/posts`
* **인증 필요:** ❌ (공개)
* **Query Parameters:**

    * `sort`: `recent | likes | comments` (default: recent)
    * `page`: 페이지 번호
    * `size`: 페이지당 항목 수
* **Response:** `200 OK` (Page<PostResponseDto>)

---

## 💬 댓글

### 💬 댓글 작성

* **URL:** `POST /api/posts/{postId}/comments`
* **인증 필요:** ✅
* **Request Body:**

```json
{
  "content": "string"
}
```

* **Response:** `201 Created`

---

### 📑 댓글 목록 조회

* **URL:** `GET /api/posts/{postId}/comments`
* **인증 필요:** ✅
* **Response:** `200 OK`

```json
[
  {
    "id": 1,
    "content": "string",
    "authorUsername": "string",
    "createdAt": "yyyy-MM-ddTHH:mm:ss"
  }
]
```

---

### ❌ 댓글 삭제

* **URL:** `DELETE /api/posts/{postId}/comments/{commentId}`
* **인증 필요:** ✅
* **Response:** `204 No Content`

---

## 👥 Social (팔로우)

### ➕ 이웃 추가 (팔로우)

* **URL:** `POST /api/social/follow`
* **인증 필요:** ✅
* **Request Body:**

```json
{
  "followingUsername": "string"
}
```

* **Response:** `200 OK`

---

### ➖ 이웃 제거 (언팔로우)

* **URL:** `DELETE /api/social/unfollow`
* **인증 필요:** ✅
* **Request Body:** 위와 동일
* **Response:** `200 OK`

---

### ❓ 팔로우 여부 확인

* **URL:** `GET /api/social/is-following?target={username}`
* **인증 필요:** ✅
* **Response:** `200 OK`

```json
true // 또는 false
```

* **예외:**

    * `400`: target 파라미터 누락

---

### 📋 이웃 목록 조회

* **URL:** `GET /api/social/followings`
* **인증 필요:** ✅
* **Response:** `200 OK`

```json
[
  {
    "id": 1,
    "followerUsername": "me",
    "followingUsername": "target",
    "createdAt": "yyyy-MM-ddTHH:mm:ss"
  }
]
```
## 🔍 검색

### 🔎 키워드 검색

* **URL:** `GET /api/search`
* **인증 필요:** ❌
* **Query Parameters:**
  * `query` : 검색 키워드

* **Response:** `200 OK`

```json
{
  "posts": [
    {
      "id": 1,
      "title": "string",
      "content": "string",
      "autoSaved": false,
      "authorUsername": "string",
      "createdAt": "yyyy-MM-ddTHH:mm:ss",
      "updatedAt": "yyyy-MM-ddTHH:mm:ss",
      "viewCount": 0,
      "likeCount": 0,
      "comments": []
    }
  ],
  "users": [
    {
      "id": 1,
      "username": "string",
      "email": "string"
    }
  ]
}
```

* **기능:** 게시글 제목과 사용자 이름 기준 검색. 로그인하지 않아도 사용 가능. 로그인한 경우만 검색 기록 저장됨.

* **예외:**
  * `400`: query 파라미터 누락

---

### 🕓 검색 히스토리 조회

* **URL:** `GET /api/search/histories`
* **인증 필요:** ✅

* **Response:** `200 OK`

```json
[
  {
    "keyword": "won",
    "posts": [...],
    "users": [...]
  }
]
```

* **기능:** 현재 로그인된 사용자의 최근 검색 기록과 해당 결과를 반환

---

## 🔔 알림

### 📬 알림 목록 조회

* **URL:** `GET /api/notifications`
* **인증 필요:** ✅
* **Response:** `200 OK`

```json
[
  {
    "id": 1,
    "message": "woni님이 회원님의 게시글에 댓글을 남겼습니다.",
    "type": "COMMENT",
    "isRead": false,
    "createdAt": "2025-05-23T10:00:00"
  },
  {
    "id": 2,
    "message": "woni님이 회원님을 팔로우했습니다.",
    "type": "FOLLOW",
    "isRead": false,
    "createdAt": "2025-05-23T10:01:00"
  }
  {
    "id": 3,
    "message": "woni님이 회원님을 팔로우했습니다.",
    "type": "LIKE",
    "isRead": false,
    "createdAt": "2025-05-23T10:01:00"
  }
  
]
```
---

### ✅ 알림 읽음 처리

* **URL:** `PUT /api/notifications/{id}/read`
* **인증 필요:** ✅
* **Path Variable:**
  * `id` : 알림 ID
* **Response:** `200 OK`

* **예외:**
  * `404`: 알림 ID가 존재하지 않음
  * `403`: 자신의 알림이 아님
