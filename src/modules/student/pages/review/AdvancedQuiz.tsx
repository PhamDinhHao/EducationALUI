import { useState, useEffect, useRef } from 'react'
import { Card, Button, Radio, Input, Typography, Progress, Space, Divider, Modal, message } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export interface Part1Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface Part2Question {
  question: string
  statements: Array<{ text: string; correct: boolean }>
  explanation: string
}

export interface Part3Question {
  question: string
  correctAnswer: string
  explanation: string
}

export interface QuizData {
  part1: Part1Question[]
  part2: Part2Question[]
  part3: Part3Question[]
}

export interface QuizResult {
  score: number
  total: number
  studentName: string
  studentClass: string
  answers: {
    part1: number[]
    part2: boolean[][]
    part3: string[]
  }
}

interface AdvancedQuizProps {
  quizData: QuizData
  onComplete?: (result: QuizResult) => void
  onRetry?: () => void
}

const AdvancedQuiz: React.FC<AdvancedQuizProps> = ({ quizData, onComplete, onRetry }) => {
  const [studentName, setStudentName] = useState('')
  const [studentClass, setStudentClass] = useState('')
  const [timeLeft, setTimeLeft] = useState(20 * 60) // 20 phút = 1200 giây
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  
  // Answers state
  const [part1Answers, setPart1Answers] = useState<number[]>(new Array(12).fill(-1))
  const [part2Answers, setPart2Answers] = useState<boolean[][]>(
    new Array(4).fill(null).map(() => new Array(4).fill(null))
  )
  const [part3Answers, setPart3Answers] = useState<string[]>(new Array(4).fill(''))
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAutoSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [timeLeft, isSubmitted])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handlePart1Answer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...part1Answers]
    newAnswers[questionIndex] = answerIndex
    setPart1Answers(newAnswers)
  }

  const handlePart2Answer = (questionIndex: number, statementIndex: number, value: boolean) => {
    const newAnswers = part2Answers.map((q, qIdx) => {
      if (qIdx === questionIndex) {
        const newStatements = [...q]
        newStatements[statementIndex] = value
        return newStatements
      }
      return q
    })
    setPart2Answers(newAnswers)
  }

  const handlePart3Answer = (questionIndex: number, value: string) => {
    const newAnswers = [...part3Answers]
    newAnswers[questionIndex] = value.slice(0, 4) // Giới hạn 4 ký tự
    setPart3Answers(newAnswers)
  }

  const checkUnansweredQuestions = (): number[] => {
    const unanswered: number[] = []
    
    // Check Part 1
    part1Answers.forEach((answer, index) => {
      if (answer === -1) unanswered.push(index + 1)
    })
    
    // Check Part 2
    part2Answers.forEach((answers, qIndex) => {
      const hasUnanswered = answers.some(a => a === null)
      if (hasUnanswered) unanswered.push(21 + qIndex)
    })
    
    // Check Part 3
    part3Answers.forEach((answer, index) => {
      if (!answer.trim()) unanswered.push(25 + index)
    })
    
    return unanswered
  }

  const handleSubmit = () => {
    if (!studentName.trim() || !studentClass.trim()) {
      message.warning('Vui lòng nhập đầy đủ Họ tên và Lớp!')
      return
    }

    const unanswered = checkUnansweredQuestions()
    if (unanswered.length > 0) {
      setShowSubmitConfirm(true)
      return
    }
    
    submitQuiz()
  }

  const submitQuiz = () => {
    setShowSubmitConfirm(false)
    setIsSubmitted(true)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Calculate score
    let score = 0
    const total = 20

    // Part 1: 12 questions
    quizData.part1.forEach((q, index) => {
      if (part1Answers[index] === q.correctAnswer) {
        score += 0.5 // Mỗi câu 0.5 điểm
      }
    })

    // Part 2: 4 questions, mỗi câu có 4 nhận định
    quizData.part2.forEach((q, qIndex) => {
      q.statements.forEach((stmt, sIndex) => {
        if (part2Answers[qIndex][sIndex] === stmt.correct) {
          score += 0.125 // Mỗi nhận định đúng = 0.125 điểm (4 nhận định = 0.5 điểm/câu)
        }
      })
    })

    // Part 3: 4 questions
    quizData.part3.forEach((q, index) => {
      const userAnswer = part3Answers[index].trim().toLowerCase()
      const correctAnswer = q.correctAnswer.trim().toLowerCase()
      if (userAnswer === correctAnswer) {
        score += 0.5 // Mỗi câu 0.5 điểm
      }
    })

    const result: QuizResult = {
      score: Math.round(score * 10) / 10, // Làm tròn 1 chữ số thập phân
      total,
      studentName,
      studentClass,
      answers: {
        part1: part1Answers,
        part2: part2Answers,
        part3: part3Answers
      }
    }

    setQuizResult(result)

    if (onComplete) {
      onComplete(result)
    }
  }

  const handleAutoSubmit = () => {
    if (!studentName.trim() || !studentClass.trim()) {
      message.warning('Hết thời gian! Vui lòng nhập thông tin và nộp bài.')
      return
    }
    submitQuiz()
    message.info('Hết thời gian! Bài làm đã được nộp tự động.')
  }

  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)

  if (isSubmitted && quizResult) {
    return <QuizResults 
      quizData={quizData} 
      result={quizResult}
      onRetry={onRetry}
    />
  }

  return (
    <>
      <Card className="rounded-2xl" bodyStyle={{ padding: 32 }}>
        {/* Header */}
        <div className="text-center mb-6">
          <Title level={2} className="!mb-2">Bài tập về nhà</Title>
          <Text className="text-gray-600">Thời gian làm bài: 20 phút</Text>
        </div>

        {/* Timer */}
        <div className="flex justify-center mb-6">
          <div className="bg-orange-50 border-2 border-orange-400 rounded-lg px-6 py-3">
            <Space>
              <ClockCircleOutlined style={{ fontSize: 24, color: '#ff8c00' }} />
              <Text strong style={{ fontSize: 24, color: timeLeft < 300 ? '#ff4d4f' : '#ff8c00' }}>
                {formatTime(timeLeft)}
              </Text>
            </Space>
          </div>
        </div>

        {/* Student Info Form */}
        <Card className="mb-6" bodyStyle={{ padding: 20 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Text strong>Họ và tên học sinh: *</Text>
              <Input
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Nhập họ và tên"
                className="mt-2"
                disabled={isSubmitted}
              />
            </div>
            <div>
              <Text strong>Lớp: *</Text>
              <Input
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="Nhập lớp"
                className="mt-2"
                disabled={isSubmitted}
              />
            </div>
          </div>
        </Card>

        <Divider />

        {/* Part 1: Multiple Choice */}
        <div className="mb-8">
          <Title level={3} className="!mb-4">I. Trắc nghiệm khách quan nhiều lựa chọn</Title>
          {quizData.part1.map((q, index) => (
            <Card key={index} className="mb-4" bodyStyle={{ padding: 20 }}>
              <Text strong className="text-base">
                Câu {index + 1}. {q.question}
              </Text>
              <Radio.Group
                value={part1Answers[index] === -1 ? undefined : part1Answers[index]}
                onChange={(e) => handlePart1Answer(index, e.target.value)}
                className="mt-3 w-full"
              >
                <Space direction="vertical" size="middle" className="w-full">
                  {q.options.map((option, optIndex) => (
                    <Radio key={optIndex} value={optIndex} className="w-full">
                      <Text>{String.fromCharCode(65 + optIndex)}. {option}</Text>
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Card>
          ))}
        </div>

        <Divider />

        {/* Part 2: True/False */}
        <div className="mb-8">
          <Title level={3} className="!mb-4">II. Trắc nghiệm đúng sai</Title>
          {quizData.part2.map((q, qIndex) => (
            <Card key={qIndex} className="mb-4" bodyStyle={{ padding: 20 }}>
              <Text strong className="text-base">
                Câu {21 + qIndex}. {q.question}
              </Text>
              <div className="mt-4 space-y-3">
                {q.statements.map((stmt, sIndex) => (
                  <div key={sIndex} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                    <Text className="font-semibold min-w-[20px]">
                      {String.fromCharCode(97 + sIndex)}.
                    </Text>
                    <Text className="flex-1">{stmt.text}</Text>
                    <Space>
                      <Radio.Group
                        value={part2Answers[qIndex][sIndex]}
                        onChange={(e) => handlePart2Answer(qIndex, sIndex, e.target.value)}
                        size="small"
                      >
                        <Radio value={true}>Đúng</Radio>
                        <Radio value={false}>Sai</Radio>
                      </Radio.Group>
                    </Space>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Divider />

        {/* Part 3: Short Answer */}
        <div className="mb-8">
          <Title level={3} className="!mb-4">III. Trả lời ngắn</Title>
          {quizData.part3.map((q, index) => (
            <Card key={index} className="mb-4" bodyStyle={{ padding: 20 }}>
              <Text strong className="text-base">
                Câu {25 + index}. {q.question}
              </Text>
              <Input
                value={part3Answers[index]}
                onChange={(e) => handlePart3Answer(index, e.target.value)}
                placeholder="Nhập đáp án (tối đa 4 ký tự)"
                maxLength={4}
                className="mt-3"
                style={{ maxWidth: 200 }}
              />
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <div className="text-center mt-8">
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            className="!bg-orange-500 !border-orange-500"
            style={{ minWidth: 200 }}
          >
            Nộp bài
          </Button>
        </div>
      </Card>

      {/* Submit Confirmation Modal */}
      <Modal
        title="Xác nhận nộp bài"
        open={showSubmitConfirm}
        onOk={submitQuiz}
        onCancel={() => setShowSubmitConfirm(false)}
        okText="Vẫn nộp bài"
        cancelText="Quay lại làm tiếp"
      >
        <Text>
          Bạn còn câu hỏi{' '}
          <Text strong>{checkUnansweredQuestions().join(', ')}</Text> chưa hoàn thành.
          Bạn có chắc chắn muốn nộp bài không?
        </Text>
      </Modal>
    </>
  )
}

// Results Component
interface QuizResultsProps {
  quizData: QuizData
  result: QuizResult
  onRetry?: () => void
}

const QuizResults: React.FC<QuizResultsProps> = ({ quizData, result, onRetry }) => {
  const [feedback, setFeedback] = useState<any>(null)
  const [loadingFeedback, setLoadingFeedback] = useState(false)

  useEffect(() => {
    generateFeedback()
  }, [])

  const generateFeedback = async () => {
    setLoadingFeedback(true)
    try {
      // Calculate detailed results
      const correctPart1 = quizData.part1.filter((q, i) => result.answers.part1[i] === q.correctAnswer).length
      const correctPart2 = quizData.part2.reduce((acc, q, qIdx) => {
        return acc + q.statements.filter((stmt, sIdx) => 
          result.answers.part2[qIdx][sIdx] === stmt.correct
        ).length
      }, 0)
      const correctPart3 = quizData.part3.filter((q, i) => 
        result.answers.part3[i].trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
      ).length

      // Generate feedback using AI (simplified version - you can enhance this)
      const strengths: string[] = []
      const weaknesses: string[] = []

      if (correctPart1 >= 10) strengths.push('Nắm vững kiến thức cơ bản')
      else if (correctPart1 < 6) weaknesses.push('Cần củng cố kiến thức cơ bản')

      if (correctPart2 >= 12) strengths.push('Hiểu sâu các khái niệm')
      else if (correctPart2 < 8) weaknesses.push('Cần rèn luyện khả năng phân tích')

      if (correctPart3 >= 3) strengths.push('Kỹ năng tính toán tốt')
      else if (correctPart3 < 2) weaknesses.push('Cần luyện tập thêm bài tập tính toán')

      setFeedback({
        strengths: strengths.length > 0 ? strengths : ['Cần cố gắng thêm'],
        weaknesses: weaknesses.length > 0 ? weaknesses : ['Cần ôn tập toàn diện'],
        studyPlan: [
          '1. Đọc lại các phần kiến thức đã sai trong sách giáo khoa (1-2 ngày)',
          '2. Xem lại video bài giảng và làm lại các bài tập tương tự (2-3 ngày)',
          '3. Thực hành lại bài kiểm tra này vào cuối tuần'
        ]
      })
    } catch (error) {
      console.error('Error generating feedback:', error)
    } finally {
      setLoadingFeedback(false)
    }
  }

  return (
    <Card className="rounded-2xl" bodyStyle={{ padding: 32 }}>
      {/* Score Display */}
      <div className="text-center mb-8">
        <Title level={2} className="!mb-4">Kết quả bài thi</Title>
        <div className="mb-4">
          <Progress
            type="circle"
            percent={Math.round((result.score / 10) * 100)}
            strokeColor={result.score >= 8 ? '#52c41a' : result.score >= 5 ? '#faad14' : '#ff4d4f'}
            format={() => `${result.score.toFixed(1)}/10`}
            style={{ fontSize: 24 }}
          />
        </div>
        <Text className="text-lg">
          Điểm số: <Text strong>{result.score.toFixed(1)}/10</Text> ({Math.round(result.score * 2)}/20 câu)
        </Text>
      </div>

      <Divider />

      {/* Detailed Results */}
      <div className="mb-8">
        <Title level={3} className="!mb-4">Chi tiết bài làm</Title>

        {/* Part 1 Results */}
        <div className="mb-6">
          <Title level={4}>I. Trắc nghiệm khách quan nhiều lựa chọn</Title>
          {quizData.part1.map((q, index) => {
            const isCorrect = result.answers.part1[index] === q.correctAnswer
            return (
              <Card
                key={index}
                className={`mb-3 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}
                bodyStyle={{ padding: 16 }}
              >
                <div className="flex items-start gap-2 mb-2">
                  {isCorrect ? (
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20, marginTop: 2 }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 20, marginTop: 2 }} />
                  )}
                  <Text strong>Câu {index + 1}. {q.question}</Text>
                </div>
                <div className="ml-8 space-y-1">
                  {q.options.map((option, optIndex) => {
                    const isSelected = result.answers.part1[index] === optIndex
                    const isCorrectOption = optIndex === q.correctAnswer
                    return (
                      <div
                        key={optIndex}
                        className={`p-2 rounded ${
                          isCorrectOption
                            ? 'bg-green-100 border border-green-500'
                            : isSelected && !isCorrect
                            ? 'bg-red-100 border border-red-500'
                            : 'bg-gray-50'
                        }`}
                      >
                        <Text className={isCorrectOption ? 'text-green-700 font-semibold' : ''}>
                          {String.fromCharCode(65 + optIndex)}. {option}
                          {isCorrectOption && ' (Đáp án đúng)'}
                          {isSelected && !isCorrect && ' (Bạn đã chọn)'}
                        </Text>
                      </div>
                    )
                  })}
                </div>
                {!isCorrect && (
                  <div className="ml-8 mt-2 p-2 bg-blue-50 rounded">
                    <Text className="text-blue-700 text-sm">
                      <strong>Giải thích:</strong> {q.explanation}
                    </Text>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* Part 2 Results */}
        <div className="mb-6">
          <Title level={4}>II. Trắc nghiệm đúng sai</Title>
          {quizData.part2.map((q, qIndex) => (
            <Card key={qIndex} className="mb-3" bodyStyle={{ padding: 16 }}>
              <Text strong className="text-base">
                Câu {21 + qIndex}. {q.question}
              </Text>
              <div className="mt-3 space-y-2">
                {q.statements.map((stmt, sIndex) => {
                  const userAnswer = result.answers.part2[qIndex][sIndex]
                  const isCorrect = userAnswer === stmt.correct
                  const isAnswered = userAnswer !== null
                  return (
                    <div
                      key={sIndex}
                      className={`p-3 rounded ${
                        isCorrect ? 'bg-green-50 border border-green-500' : isAnswered ? 'bg-red-50 border border-red-500' : 'bg-gray-50 border border-gray-300'
                      }`}
                    >
                      <Space>
                        {isCorrect ? (
                          <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        ) : isAnswered ? (
                          <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                        ) : null}
                        <Text>
                          {String.fromCharCode(97 + sIndex)}. {stmt.text}
                        </Text>
                        {isAnswered && (
                          <Text className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                            ({stmt.correct ? 'Đúng' : 'Sai'} - Bạn chọn: {userAnswer ? 'Đúng' : 'Sai'})
                          </Text>
                        )}
                        {!isAnswered && (
                          <Text className="text-gray-500">(Chưa trả lời - Đáp án đúng: {stmt.correct ? 'Đúng' : 'Sai'})</Text>
                        )}
                      </Space>
                    </div>
                  )
                })}
              </div>
              <div className="mt-2 p-2 bg-blue-50 rounded">
                <Text className="text-blue-700 text-sm">
                  <strong>Giải thích:</strong> {q.explanation}
                </Text>
              </div>
            </Card>
          ))}
        </div>

        {/* Part 3 Results */}
        <div className="mb-6">
          <Title level={4}>III. Trả lời ngắn</Title>
          {quizData.part3.map((q, index) => {
            const userAnswer = result.answers.part3[index].trim().toLowerCase()
            const correctAnswer = q.correctAnswer.trim().toLowerCase()
            const isCorrect = userAnswer === correctAnswer
            return (
              <Card
                key={index}
                className={`mb-3 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}
                bodyStyle={{ padding: 16 }}
              >
                <div className="flex items-start gap-2 mb-2">
                  {isCorrect ? (
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20, marginTop: 2 }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 20, marginTop: 2 }} />
                  )}
                  <Text strong>Câu {25 + index}. {q.question}</Text>
                </div>
                <div className="ml-8 space-y-2">
                  <Text>
                    Đáp án của bạn: <Text strong>{result.answers.part3[index] || '(Để trống)'}</Text>
                  </Text>
                  <Text>
                    Đáp án đúng: <Text strong className="text-green-700">{q.correctAnswer}</Text>
                  </Text>
                </div>
                {!isCorrect && (
                  <div className="ml-8 mt-2 p-2 bg-blue-50 rounded">
                    <Text className="text-blue-700 text-sm">
                      <strong>Giải thích:</strong> {q.explanation}
                    </Text>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      <Divider />

      {/* Feedback Section */}
      {loadingFeedback ? (
        <div className="text-center py-8">
          <Text>Đang tạo nhận xét...</Text>
        </div>
      ) : feedback && (
        <div className="mb-8">
          <Title level={3} className="!mb-4">Nhận xét chi tiết</Title>
          <Card bodyStyle={{ padding: 20 }}>
            <div className="mb-4">
              <Text strong>Họ và tên học sinh:</Text> <Text>{result.studentName}</Text>
            </div>
            <div className="mb-4">
              <Text strong>Điểm số:</Text> <Text>{result.score.toFixed(1)}/10 ({Math.round(result.score * 2)}/20 câu)</Text>
            </div>
            <div className="mb-4">
              <Text strong>Ưu điểm:</Text>
              <ul className="ml-6 mt-2">
                {feedback.strengths.map((s: string, i: number) => (
                  <li key={i}><Text>{s}</Text></li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <Text strong>Cần cải thiện:</Text>
              <ul className="ml-6 mt-2">
                {feedback.weaknesses.map((w: string, i: number) => (
                  <li key={i}><Text>{w}</Text></li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <Text strong>Bài tập đề xuất:</Text> <Text>Làm lại bài</Text>
            </div>
            <div>
              <Text strong>Lộ trình học tập gợi ý:</Text>
              <ul className="ml-6 mt-2">
                {feedback.studyPlan.map((step: string, i: number) => (
                  <li key={i}><Text>{step}</Text></li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      )}

      {/* Retry Button */}
      <div className="text-center">
        <Button
          type="primary"
          size="large"
          onClick={onRetry}
          className="!bg-orange-500 !border-orange-500"
          style={{ minWidth: 200 }}
        >
          Làm lại
        </Button>
      </div>
    </Card>
  )
}

export default AdvancedQuiz
