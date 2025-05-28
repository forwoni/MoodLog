# 🎧 MoodLog AI 감정 분석 및 음악 추천 API 명세서

버전: v1
작성자: 이신비 (AI 파트)
인증: ❌ 현재는 인증 없이 사용 가능

---

## 📂 Emotion API

---

### 1. 🎭 감정 분석 API

* **URL**: `POST /analyze`
* **Method**: `POST`
* **인증 필요**: ❌
* **설명**: 사용자가 입력한 텍스트를 기반으로 감정을 분석하여 반환합니다.

#### 📤 Request Body

```json
{
  "text": "기분이 너무 울적하고 외로워."
}
```

#### 📥 Response: `200 OK`

```json
{
  "emotion": "우울(부정)"
}
```

#### ⚠️ 예외 응답

| 상태 코드                      | 설명                             |
| -------------------------- | ------------------------------ |
| `400 Bad Request`          | `text` 필드 누락 또는 비어 있는 경우       |
| `422 Unprocessable Entity` | 요청 형식 오류 (FastAPI 유효성 검사 실패 등) |

---

### 2. 🎵 감정 분석 + 음악 추천 API

* **URL**: `POST /recommend`
* **Method**: `POST`
* **인증 필요**: ❌
* **설명**: 입력 텍스트의 감정을 분석하고, 해당 감정에 맞는 Spotify 음악(플레이리스트)을 추천합니다.

#### 📤 Request Body

```json
{
  "text": "기분이 너무 울적하고 외로워."
}
```

#### 📥 Response: `200 OK`

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
    },
    {
      "track_name": "SAD SONG",
      "artist": "CHANMINA",
      "preview_url": null,
      "spotify_url": "https://open.spotify.com/track/mCldD94U9fNQWpdxp5kJbK"
    },
    {
      "track_name": "old song",
      "artist": "Standing Egg",
      "preview_url": null,
      "spotify_url": "https://open.spotify.com/track/SlFuzbMmqTVZInlxkfYQbb"
    }
  ]
}
```

#### ⚠️ 예외 응답

| 상태 코드                      | 설명                             |
| -------------------------- | ------------------------------ |
| `400 Bad Request`          | `text` 필드 누락 또는 비어 있는 경우       |
| `422 Unprocessable Entity` | 요청 형식 오류 (FastAPI 유효성 검사 실패 등) |

---

### ✅ 감정 분류 기준

* 감정은 다음과 같은 키워드로 분류됩니다:

  * `우울(부정)`
  * `불안(부정)`
  * `분노(부정)`
  * `행복(긍정)`
  * (예외처리-중립)

---

### ✅ 추천 시스템 설명

* 감정 → 내부 매핑된 Spotify 검색 키워드로 변환
* Spotify API를 통해 해당 키워드로 곡 검색
* 검색된 곡 리스트는 트랙명, 아티스트, Spotify URL, 프리뷰 URL 등을 포함

---

> 이 명세서는 MoodLog 프로젝트의 AI API 사용을 위한 공식 문서입니다.
> 프론트엔드 및 백엔드 연동 시 반드시 이 명세를 참고해주세요.
