// Static mock of /en/ai-tutor. The real app talks to a live model over a
// websocket; this slice ships a scripted stand-in so the screen can be used
// without a backend. The wording follows the tone of the real Renald replies.

export type ChatMessage = {
  id: number
  from: 'me' | 'renald'
  text: string
  /** the thread shows a "Today" divider before the first message of today */
  today?: boolean
}

export const renald = {
  name: 'Renald',
  status: 'Online',
  avatar: '/assets/tutor/avatar.png',
}

export const greeting = `Hello! 👋 It's wonderful to meet you. I'm **Renald**, your friendly language learning assistant.

Are you ready to start a new adventure, or practice a language you already know? Here are a few we can explore together:

- English
- Japan (Japanese)
- South Korea (Korean)
- France (French)
- Spanish

Which one would you like to dive into today? Just let me know, and I'll share speaking tips, writing tricks and cultural insights to help you along the way! 🌍✨`

/** first match wins; everything else falls back to the generic reply */
export const replies: { match: RegExp; text: string }[] = [
  {
    match: /\b(hi|hello|hey|hai|halo)\b/i,
    text: `Hi there! 😊 Lovely to hear from you.

Tell me what you would like to work on today — a language, a topic like **greetings** or **travel phrases**, or even a sentence you want me to check.`,
  },
  {
    match: /\benglish\b/i,
    text: `Great choice! English is spoken all over the world, so it opens a lot of doors.

### 🗣️ Speaking tips
- **Stress matters**: say *PHO-to-graph* but *pho-TO-gra-pher*
- Link your words: "an apple" sounds like *a-napple*
- Record yourself and listen back — it is the fastest fix for pronunciation

### ✍️ A quick exercise
Finish this sentence out loud:
**"Last weekend I ______ ."**

Send me your answer and I will check it for you! 😊`,
  },
  {
    match: /\b(japan|japanese|nihongo)\b/i,
    text: `Japanese is a wonderful choice! 🇯🇵

Let's start with an introduction you can use right away:

> **"Hajimemashite. Watashi wa ___ desu. Yoroshiku onegaishimasu."**
> *Nice to meet you. I am ___. Please treat me well.*

### 🎤 Pronunciation tips
- **Hajimemashite** → "Ha-ji-me-mash-te" (the last *i* is almost silent)
- **Watashi wa** → "Wa-ta-shi wa"
- **Yoroshiku** → "Yo-ro-shi-ku"

Try saying it with your own name and send it to me — I'll tell you how you did! ✨`,
  },
  {
    match: /\b(korea|korean|hangul)\b/i,
    text: `Korean is a great language to start with — the alphabet, **한글 (Hangul)**, is famously logical and you can learn to read it in a weekend.

### Start here
- **안녕하세요 (annyeonghaseyo)** – Hello
- **감사합니다 (gamsahamnida)** – Thank you
- **제 이름은 ___ 입니다 (je ireumeun ___ imnida)** – My name is ___

Want to try writing your name in Hangul? Send it over and I'll check it. 😊`,
  },
  {
    match: /\b(france|french|francais|français)\b/i,
    text: `French it is! 🇫🇷 A few words to carry you through a first conversation:

- **Bonjour** – Hello (before the evening)
- **Je m'appelle ___** – My name is ___
- **Comment allez-vous ?** – How are you? (polite)
- **Ça va ?** – How are you? (casual)

### 💡 Small tip
The final consonant is usually silent: *Paris* sounds like "Pa-ree", *comment* like "ko-mon".

Try introducing yourself and I'll give you feedback! 😊`,
  },
  {
    match: /\b(spanish|espanol|español|spain)\b/i,
    text: `¡Buena elección! Spanish is spoken by over 480 million people.

- **Hola** – Hello
- **Me llamo ___** – My name is ___
- **¿Cómo estás?** – How are you?
- **Mucho gusto** – Nice to meet you

### 🎤 Pronunciation
- **ll** → "y" as in *yes* (so *llamo* is "ya-mo")
- **ñ** → "ny" as in *canyon*

Say the full introduction out loud, then send it to me so I can check it. ✨`,
  },
  {
    match: /\b(grammar|tense|past|present)\b/i,
    text: `Happy to help with grammar! 📘

Send me the sentence you are unsure about and I will:
- tell you whether it is correct,
- explain **why** in plain words,
- and give you a more natural alternative if there is one.

For example, try: *"I have been to Paris last year."* — there is one small mistake hiding in it. Can you spot it?`,
  },
  {
    match: /\b(pronounce|pronunciation|accent|speak)\b/i,
    text: `### 🎤 Pronunciation practice

Here is the routine I recommend:
1. Listen to a short line — no more than one sentence.
2. Say it out loud at half speed.
3. Record yourself and compare.
4. Repeat it three times at normal speed.

Send me a word or a phrase you find difficult and I'll break it into syllables for you. 😊`,
  },
  {
    match: /\b(thank|thanks|terima kasih|makasih)\b/i,
    text: `You're very welcome! 😊 Keep going — a few minutes every day beats a long session once a week.

Whenever you are ready, send me another sentence to check.`,
  },
]

export const fallbackReply = `Thanks for sharing that! 😊

I can help you with any of these:
- **Check a sentence** you have written
- **Explain a grammar point** in plain words
- **Practise pronunciation** syllable by syllable
- **Learn phrases** for travel, work or everyday chat

Which one would you like to try?`
