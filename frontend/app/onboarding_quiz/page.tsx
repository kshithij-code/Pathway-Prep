"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import toast, { Toaster } from 'react-hot-toast'

type Question = {
  question: string
  options: string[]
  category: string
}

type QuizData = {
  questions: Question[]
}

export default function TechnicalInterviewQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [interests, setInterests] = useState<string[]>(["", "", ""])
  const [resume, setResume] = useState("")
  const [portfolio, setPortfolio] = useState("")
  const [quizStarted, setQuizStarted] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/init_1_out')
        if (!response.ok) {
          throw new Error('Failed to fetch questions')
        }
        const data: QuizData = await response.json()
        setQuestions(data.questions)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to load questions. Please try again later.')
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  useEffect(() => {
    if (!quizStarted || isLoading) return

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          handleNextQuestion()
          return 60
        }
        return prevTime - 1
      })
    }, 1000)

    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.error("Warning: Don't switch tabs during the quiz!", {
          duration: 3000,
          position: 'top-center',
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [quizStarted, currentQuestionIndex, isLoading])

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].question]: value
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setTimeLeft(60)
    } else {
      setQuizCompleted(true)
    }
  }

  const handleInterestChange = (index: number, value: string) => {
    const newInterests = [...interests]
    newInterests[index] = value
    setInterests(newInterests)
  }

  const handleStartQuiz = () => {
    if (interests.filter(Boolean).length < 3 || !resume || !portfolio) {
      toast.error("Please fill in all fields before starting the quiz.")
      return
    }
    setQuizStarted(true)
  }

  const calculateResults = () => {
    const categories: Record<string, number> = {}

    questions.forEach((question) => {
      if (!categories[question.category]) {
        categories[question.category] = 0
      }
      if (answers[question.question] === question.options[0]) { // Assuming first option is always correct for this example
        categories[question.category] += 1
      }
    })

    const percentages = Object.fromEntries(
      Object.entries(categories).map(([key, value]) => [key, (value / questions.filter(q => q.category === key).length) * 100])
    )

    return percentages
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="flex items-center justify-center h-64">
          <p>Loading questions...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!quizStarted) {
    return (
      <Card className="w-full max-w-3xl mx-auto ml-10">
        <CardHeader>
          <CardTitle>Technical Interview Preparation</CardTitle>
          <CardDescription>Please fill in your details to start the quiz</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            {interests.map((interest, index) => (
              <div key={`interest-${index}`}>
                <Label htmlFor={`interest-${index}`}>Interest {index + 1}</Label>
                <Input
                  id={`interest-${index}`}
                  value={interest}
                  onChange={(e) => handleInterestChange(index, e.target.value)}
                />
              </div>

            ))}
            <div>
              <Label htmlFor="resume">Resume (file path)</Label>
              <Input
                id="resume"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="./path/to/resume"
              />
            </div>
            <div>
              <Label htmlFor="portfolio">Portfolio URL</Label>
              <Input
                id="portfolio"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="www.example.com"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleStartQuiz}>Start Quiz</Button>
        </CardFooter>
      </Card>
    )
  }

  if (quizCompleted) {
    const results = calculateResults()
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Quiz Completed</CardTitle>
          <CardDescription>Here are your results:</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(results).map(([category, percentage]) => (
              <div key={category}>
                <Label>{category}</Label>
                <Progress value={percentage} className="w-full" />
                <p>{percentage.toFixed(2)}%</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Label>Your answers:</Label>
            {Object.entries(answers).map(([question, answer]) => (
              <div key={question} className="mt-2">
                <p className="font-semibold">{question}</p>
                <p>Your answer: {answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <Toaster />
      <CardHeader>
        <CardTitle>Technical Interview Quiz</CardTitle>
        <CardDescription>Question {currentQuestionIndex + 1} of {questions.length}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={(timeLeft / 60) * 100} className="w-full" />
          <p className="text-center mt-2">Time left: {timeLeft} seconds</p>
        </div>
        <form>
          <div className="space-y-4">
            <Label>{currentQuestion.question}</Label>
            <RadioGroup
              value={answers[currentQuestion.question] || ""}
              onValueChange={handleAnswerChange}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={`${currentQuestion.question}-${index}`} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${currentQuestionIndex}-${index}`} />
                  <Label htmlFor={`option-${currentQuestionIndex}-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleNextQuestion}>
          {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
        </Button>
      </CardFooter>
    </Card>
  )
}