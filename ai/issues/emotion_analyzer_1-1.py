
import re
from collections import Counter

emotion_keywords = {
    "우울(부정)": ["우울", "지침", "무기력", "외롭", "눈물", "쓸쓸", "힘들", "상처", "속상", "괴롭", "아팠", "울컥"],
    "불안(부정)": ["불안", "걱정", "초조", "두려움", "긴장", "혼란"],
    "행복(긍정)": ["행복", "기쁘", "좋았", "즐거웠", "웃음", "설렘", "두근", "기대", "떨림", "즐겁"],
    "분노(부정)": ["짜증", "화나", "열받", "분노", "억울"],
}

def split_sentences(text: str) -> list:
    return re.split(r'[.!?]\s*', text.strip())

def analyze_emotion(text: str) -> str:
    score = {emotion: 0 for emotion in emotion_keywords}
    for emotion, keywords in emotion_keywords.items():
        for word in keywords:
            if word in text:
                score[emotion] += 1
    top_emotion = max(score.items(), key=lambda x: x[1])
    return top_emotion[0] if top_emotion[1] > 0 else "중립"

def analyze_long_text(text: str) -> str:
    sentences = split_sentences(text)
    emotions = [analyze_emotion(s) for s in sentences if s.strip()]
    count = Counter(emotions)
    return count.most_common(1)[0][0] if count else "중립"
