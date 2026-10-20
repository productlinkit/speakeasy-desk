import { useState } from 'react'
import { QuizRunner, type QuizResult } from '../components/QuizRunner'
import { ResultScreen } from '../components/ResultScreen'
import { lesson, questions } from '../data/quiz'
import './Quiz.css'

export function Quiz({ onExit }: { onExit: () => void }) {
  const [result, setResult] = useState<QuizResult | null>(null)

  if (result) {
    return (
      <ResultScreen
        title="Good work,"
        subtitle="Keep practicing!"
        correct={result.correct}
        total={result.total}
        seconds={result.seconds}
        xp={lesson.xp}
        onContinue={onExit}
      />
    )
  }

  return (
    <QuizRunner
      title={lesson.title}
      questions={questions}
      fallbackImage={lesson.image}
      checkLabel="Check Answers"
      onExit={onExit}
      onFinish={setResult}
    />
  )
}
