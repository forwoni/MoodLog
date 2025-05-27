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

### 🚪 로그아웃

* **URL:** `POST /api/auth/logout`
* **인증 필요:** ✅ (Authorization 헤더에 AccessToken 포함)

* **Headers:**
  * `Authorization: Bearer <accessToken>`

* **Response:** `200 OK`

```json
{
  "message": "로그아웃되었습니다."
}
```

---
### 👤 사용자 정보 조회

* **URL:** `GET /api/users/me`
* **인증 필요:** ✅

* **Response:** `200 OK`

```json
{
  "id": 1,
  "username": "woni",
  "email": "woni@example.com"
}
```
---
### 🛠️ 사용자 정보 수정 (닉네임 및 비밀번호 변경)

* **URL:** `PUT /api/users/me`
* **인증 필요:** ✅

* **Request Body:**

```json
{
  "currentPassword": "string",
  "newUsername": "string",
  "newPassword": "string"
}
```

* **Response:** `200 OK`

```json
{
  "id": "1",
  "username": "변경된 닉네임",
  "email": "user@example.com"
}
```

* **예외:**

  * `400`: 현재 비밀번호가 일치하지 않음
  * `401`: 인증 실패(토큰 없음 또는 만료)
  * `422`: 변경할 항목이 없음 (newUsername, newPassword)
---

## 📂 Post

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
    "id": 6,
    "title": "오늘의 기분",
    "content": "조금 우울하지만 괜찮아질 거야",
    "autoSaved": false,
    "authorName": "woni",
    "createdAt": "2025-05-27T15:16:04.8162",
    "updatedAt": "2025-05-27T15:16:04.830484",
    "viewCount": 0,
    "likeCount": 0,
    "comments": [],
    "playlist": {
      "id": 6,
      "name": "오늘의 기분의 플레이리스트",
      "description": "자동 생성된 플레이리스트입니다.",
      "tracks": [
        {
          "trackName": "Sad Songs (with Said The Sky & Annika Wells)",
          "artist": "ILLENIUM",
          "spotifyUrl": "https://open.spotify.com/track/4pioeMejnqa4T3QAEqwVA3"
        },
        {
          "trackName": "old song",
          "artist": "Standing Egg",
          "spotifyUrl": "https://open.spotify.com/track/5IFuZw0mqTVZn1xWzfYqbb"
        },
        {
          "trackName": "Sad Song - Remastered",
          "artist": "Oasis",
          "spotifyUrl": "https://open.spotify.com/track/7aISpvvTIuvm9N5TNDKCeP"
        },
        {
          "trackName": "Sadder Than Yesterday",
          "artist": "Kim Gun Mo",
          "spotifyUrl": "https://open.spotify.com/track/0aE6WVAXv1IjkUaPvkmW4z"
        },
        {
          "trackName": "SAD!",
          "artist": "XXXTENTACION",
          "spotifyUrl": "https://open.spotify.com/track/3ee8Jmje8o58CHK66QrVC2"
        },
        {
          "trackName": "Are you happy?",
          "artist": "shy martin",
          "spotifyUrl": "https://open.spotify.com/track/6s86N7LVaJZuU4alwKp6XO"
        },
        {
          "trackName": "슬픈 초대장",
          "artist": "Han Kyung Il",
          "spotifyUrl": "https://open.spotify.com/track/78kHVc50ML3pR6TNaBVQgP"
        },
        {
          "trackName": "SAD SONG",
          "artist": "CHANMINA",
          "spotifyUrl": "https://open.spotify.com/track/0mlCDt9UWfQNY0pxk5jbJK"
        }
      ]
    }
  }
]
```

---

### 🔍 게시글 상세 조회

* **URL:** `GET /api/posts/{id}`
* **인증 필요:** ✅
* **Response:** `200 OK` (위와 동일 구조이나 리스트 반환이 아님)
```json
  {
  "id": 6,
  "title": "오늘의 기분",
  "content": "조금 우울하지만 괜찮아질 거야",
  "autoSaved": false,
  "authorName": "woni",
  "createdAt": "2025-05-27T15:16:04.8162",
  "updatedAt": "2025-05-27T15:16:04.830484",
  "viewCount": 1,
  "likeCount": 0,
  "comments": [],
  "playlist": {
    "id": 6,
    "name": "오늘의 기분의 플레이리스트",
    "description": "자동 생성된 플레이리스트입니다.",
    "tracks": [
      {
        "trackName": "Sad Songs (with Said The Sky & Annika Wells)",
        "artist": "ILLENIUM",
        "spotifyUrl": "https://open.spotify.com/track/4pioeMejnqa4T3QAEqwVA3"
      },
      {
        "trackName": "old song",
        "artist": "Standing Egg",
        "spotifyUrl": "https://open.spotify.com/track/5IFuZw0mqTVZn1xWzfYqbb"
      },
      {
        "trackName": "Sad Song - Remastered",
        "artist": "Oasis",
        "spotifyUrl": "https://open.spotify.com/track/7aISpvvTIuvm9N5TNDKCeP"
      },
      {
        "trackName": "Sadder Than Yesterday",
        "artist": "Kim Gun Mo",
        "spotifyUrl": "https://open.spotify.com/track/0aE6WVAXv1IjkUaPvkmW4z"
      },
      {
        "trackName": "SAD!",
        "artist": "XXXTENTACION",
        "spotifyUrl": "https://open.spotify.com/track/3ee8Jmje8o58CHK66QrVC2"
      },
      {
        "trackName": "Are you happy?",
        "artist": "shy martin",
        "spotifyUrl": "https://open.spotify.com/track/6s86N7LVaJZuU4alwKp6XO"
      },
      {
        "trackName": "슬픈 초대장",
        "artist": "Han Kyung Il",
        "spotifyUrl": "https://open.spotify.com/track/78kHVc50ML3pR6TNaBVQgP"
      },
      {
        "trackName": "SAD SONG",
        "artist": "CHANMINA",
        "spotifyUrl": "https://open.spotify.com/track/0mlCDt9UWfQNY0pxk5jbJK"
      }
    ]
  }
}
```
* **예외:**

    * `404`: 게시글 없음

---

### ✏️ 게시글 수정

* **URL:** `PUT /api/posts/{id}`
* **인증 필요:** ✅
* **Request Body:**
```json
{
  "title": "string",
  "content": "string",
  "autoSaved": true
}
```
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

## 📂 Comment

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

---
## 📂 Search

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
      "id": 6,
      "title": "오늘의 기분",
      "content": "조금 우울하지만 괜찮아질 거야",
      "autoSaved": false,
      "authorName": "woni",
      "createdAt": "2025-05-27T15:16:04.8162",
      "updatedAt": "2025-05-27T15:16:04.830484",
      "viewCount": 0,
      "likeCount": 0,
      "comments": [],
      "playlist": {
        "id": 6,
        "name": "오늘의 기분의 플레이리스트",
        "description": "자동 생성된 플레이리스트입니다.",
        "tracks": [
          {
            "trackName": "Sad Songs (with Said The Sky & Annika Wells)",
            "artist": "ILLENIUM",
            "spotifyUrl": "https://open.spotify.com/track/4pioeMejnqa4T3QAEqwVA3"
          },
          {
            "trackName": "old song",
            "artist": "Standing Egg",
            "spotifyUrl": "https://open.spotify.com/track/5IFuZw0mqTVZn1xWzfYqbb"
          },
          {
            "trackName": "Sad Song - Remastered",
            "artist": "Oasis",
            "spotifyUrl": "https://open.spotify.com/track/7aISpvvTIuvm9N5TNDKCeP"
          },
          {
            "trackName": "Sadder Than Yesterday",
            "artist": "Kim Gun Mo",
            "spotifyUrl": "https://open.spotify.com/track/0aE6WVAXv1IjkUaPvkmW4z"
          },
          {
            "trackName": "SAD!",
            "artist": "XXXTENTACION",
            "spotifyUrl": "https://open.spotify.com/track/3ee8Jmje8o58CHK66QrVC2"
          },
          {
            "trackName": "Are you happy?",
            "artist": "shy martin",
            "spotifyUrl": "https://open.spotify.com/track/6s86N7LVaJZuU4alwKp6XO"
          },
          {
            "trackName": "슬픈 초대장",
            "artist": "Han Kyung Il",
            "spotifyUrl": "https://open.spotify.com/track/78kHVc50ML3pR6TNaBVQgP"
          },
          {
            "trackName": "SAD SONG",
            "artist": "CHANMINA",
            "spotifyUrl": "https://open.spotify.com/track/0mlCDt9UWfQNY0pxk5jbJK"
          }
        ]
      }
    }
  ],
  "users": []
}
```
유저 네임이 검색 되면?

```json
{
    "posts": [],
    "users": [
        {
            "id": 1,
            "username": "woni",
            "email": "ktion@naver.com"
        },
        {
            "id": 2,
            "username": "woni1",
            "email": "ktion1@naver.com"
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
    "keyword": "오늘1",
    "searchedAt": "2025-05-27T15:48:16.275228"
  },
  {
    "keyword": "오늘",
    "searchedAt": "2025-05-27T15:47:14.787072"
  }
]
```

* **기능:** 현재 로그인된 사용자의 최근 검색 기록과 해당 결과를 반환 

---

## 📂 Notification

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

---
## 📂 Spotify

### 🎧 토큰 발급 (Client Credentials)

* **URL:** `GET /api/spotify/token`
* **인증 필요:** ❌
* **Response:** `200 OK`

```json
{
  "access_token": "BQD7…your_token_here…xY"
}
```

* **예외:**
  * `500`: Spotify 인증 실패(토큰 발급 실패 시)

## 📂 Emotion

### 🎭감정 분석 및 음악 추천

* **URL:** `POST /api/emotion/recommend`
* **인증 필요:**  ✅ (JWT 토큰 필요, Authorization: Bearer <accessToken>)
* **Request Body:**

```json
{
  "text": "오늘 기분이 우울하고 외로워"
}
```

* **Response:** `200 OK`

```json
{
  "emotion": "우울(부정)",
  "tracks": [
    {
      "track_name": "Sad Songs (with Said The Sky & Annika Wells)",
      "artist": "ILLENIUM",
      "preview_url": null,
      "spotify_url": "https://open.spotify.com/track/4pioeMeJngq8T3QAEqwVA3"
    },
    {
      "track_name": "Endless",
      "artist": "곽진언",
      "preview_url": null,
      "spotify_url": "https://open.spotify.com/track/29IGd0qsLN56BEaUzh7YOS"
    }
  ]
}

```
* **예외:**
  * `400`: text 필드 누락 또는 비어있음
  * `401`: 인증실패(토큰 없음 또는 만료)
  * `422`: 요청 형식 오류 (Spring 유효성 검사 실패 등)
  * `500`: AI 서버 또는 Spotify API 호출 실패

