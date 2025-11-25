import { useState } from 'react'
import { Card, Button, Radio, Typography, Progress, Space, Divider } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, ArrowRightOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number // index of correct answer (0-based)
  explanation?: string
}

interface QuizProps {
  questions: QuizQuestion[]
  onComplete?: (score: number, total: number) => void
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentIndex] = answerIndex
    setSelectedAnswers(newAnswers)
    setAnsweredQuestions(new Set([...answeredQuestions, currentIndex]))
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSubmit = () => {
    let score = 0
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        score++
      }
    })
    setShowResults(true)
    if (onComplete) {
      onComplete(score, questions.length)
    }
  }

  const calculateScore = () => {
    let score = 0
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        score++
      }
    })
    return score
  }

  if (showResults) {
    const score = calculateScore()
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <Card className="rounded-2xl" bodyStyle={{ padding: 32 }}>
        <div className="text-center mb-8">
          <div className="mb-4">
            {percentage >= 80 ? (
              <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a' }} />
            ) : percentage >= 50 ? (
              <Text style={{ fontSize: 64 }}>😊</Text>
            ) : (
              <CloseCircleOutlined style={{ fontSize: 64, color: '#ff4d4f' }} />
            )}
          </div>
          <Title level={2} className="!mb-2">
            Kết quả bài thi
          </Title>
          <Text className="text-lg text-gray-600">
            Bạn đã trả lời đúng <strong>{score}</strong> / <strong>{questions.length}</strong> câu hỏi
          </Text>
          <div className="mt-4">
            <Progress
              type="circle"
              percent={percentage}
              strokeColor={percentage >= 80 ? '#52c41a' : percentage >= 50 ? '#faad14' : '#ff4d4f'}
              format={(percent) => `${percent}%`}
              style={{ fontSize: 24 }}
            />
          </div>
        </div>

        <Divider />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {questions.map((q, index) => {
            const userAnswer = selectedAnswers[index]
            const isCorrect = userAnswer === q.correctAnswer

            return (
              <Card
                key={index}
                className={`rounded-lg ${
                  isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}
                bodyStyle={{ padding: 20 }}
              >
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircleOutlined style={{ fontSize: 20, color: '#52c41a', marginTop: 2 }} />
                  ) : (
                    <CloseCircleOutlined style={{ fontSize: 20, color: '#ff4d4f', marginTop: 2 }} />
                  )}
                  <div className="flex-1">
                    <Text strong className="text-base">
                      Câu {index + 1}: {q.question}
                    </Text>
                  </div>
                </div>

                <div style={{ marginLeft: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {q.options.map((option, optIndex) => {
                    const isSelected = userAnswer === optIndex
                    const isCorrectOption = optIndex === q.correctAnswer

                    return (
                      <div
                        key={optIndex}
                        className={`p-3 rounded-lg ${
                          isCorrectOption
                            ? 'bg-green-100 border-2 border-green-500'
                            : isSelected && !isCorrect
                            ? 'bg-red-100 border-2 border-red-500'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <Space>
                          {isCorrectOption && (
                            <CheckCircleOutlined style={{ color: '#52c41a' }} />
                          )}
                          {isSelected && !isCorrect && (
                            <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                          )}
                          <Text
                            className={
                              isCorrectOption
                                ? 'text-green-700 font-semibold'
                                : isSelected && !isCorrect
                                ? 'text-red-700'
                                : ''
                            }
                          >
                            {String.fromCharCode(65 + optIndex)}. {option}
                          </Text>
                          {isCorrectOption && (
                            <Text className="text-green-600 text-xs ml-2">(Đáp án đúng)</Text>
                          )}
                        </Space>
                      </div>
                    )
                  })}
                </div>

                {q.explanation && (
                  <div className="mt-3 ml-8 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Text className="text-blue-700">
                      <strong>Giải thích:</strong> {q.explanation}
                    </Text>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Button
            type="primary"
            size="large"
            onClick={() => {
              setShowResults(false)
              setCurrentIndex(0)
              setSelectedAnswers([])
              setAnsweredQuestions(new Set())
            }}
            className="!bg-orange-500 !border-orange-500"
          >
            Làm lại bài thi
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl" bodyStyle={{ padding: 32 }}>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <Text className="text-sm text-gray-600">
            Câu {currentIndex + 1} / {questions.length}
          </Text>
          <Text className="text-sm text-gray-600">{Math.round(progress)}%</Text>
        </div>
        <Progress percent={progress} showInfo={false} strokeColor="#ff8c00" />
      </div>

      {/* Question */}
      <div className="mb-6">
        <Title level={3} className="!mb-4">
          {currentQuestion.question}
        </Title>

        <Radio.Group
          value={selectedAnswers[currentIndex]}
          onChange={(e) => handleAnswerSelect(e.target.value)}
          className="w-full"
        >
          <Space direction="vertical" size="middle" className="w-full">
            {currentQuestion.options.map((option, index) => (
              <Radio
                key={index}
                value={index}
                className="w-full p-3 rounded-lg border border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all"
              >
                <Text className="text-base">
                  {String.fromCharCode(65 + index)}. {option}
                </Text>
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          size="large"
        >
          Câu trước
        </Button>

        <Text className="text-gray-500">
          {answeredQuestions.size} / {questions.length} câu đã trả lời
        </Text>

        <Button
          type="primary"
          onClick={handleNext}
          disabled={selectedAnswers[currentIndex] === undefined}
          size="large"
          className="!bg-orange-500 !border-orange-500"
          icon={currentIndex === questions.length - 1 ? null : <ArrowRightOutlined />}
        >
          {currentIndex === questions.length - 1 ? 'Nộp bài' : 'Câu tiếp'}
        </Button>
      </div>
    </Card>
  )
}

export default Quiz

