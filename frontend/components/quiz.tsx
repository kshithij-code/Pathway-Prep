"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface Question {
    question: string
    options: string[]
    category: string
}

interface QuizResult {
    categories: {
        coding: number
        aptitude: number
        domain: number
    }
    area_of_impro: string
    graph_data: {
        x: number
        y: number
    }
}

export default function Quiz() {
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<string[]>([])
    const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        // Load questions from localStorage
        const storedQuestions = localStorage.getItem("quizQuestions")
        if (storedQuestions) {
            setQuestions(JSON.parse(storedQuestions))
            setAnswers(new Array(JSON.parse(storedQuestions).length).fill(""))
        } else {
            router.push("/") // Redirect if no questions found
        }

        // Set up timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleSubmit()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        // Set up visibility change handler
        const handleVisibilityChange = () => {
            if (document.hidden) {
                handleSubmit()
            }
        }
        document.addEventListener("visibilitychange", handleVisibilityChange)

        // Cleanup
        return () => {
            clearInterval(timer)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [])

    const handleSubmit = async () => {
        try {
            console.log({answers},"hmmm")
            // Send answers to your backend
            const response = await fetch("http://127.0.0.1:5000/submit_quiz", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ answers }),
            })

            if (!response.ok) {
                throw new Error("Failed to submit quiz")
            }

            const result: QuizResult = await response.json()

            // Store result in localStorage
            localStorage.setItem('quizResult', JSON.stringify(result))

            router.push("/results")
        } catch (error) {
            console.error("Error submitting quiz:", error)
            toast({
                title: "Error",
                description: "Failed to submit quiz. Please try again.",
                variant: "destructive",
            })
        }
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    if (!questions.length) return null

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="text-lg font-semibold">
                    Question {currentQuestion + 1} of {questions.length}
                </div>
                <div className="text-lg font-semibold text-primary">Time left: {formatTime(timeLeft)}</div>
            </div>

            <Card className="p-6">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">{questions[currentQuestion].question}</h2>
                        <div className="text-sm text-muted-foreground mb-4">
                            Category: {questions[currentQuestion].category}
                        </div>
                        <RadioGroup
                            value={answers[currentQuestion]}
                            onValueChange={(value) => {
                                const newAnswers = [...answers]
                                newAnswers[currentQuestion] = value
                                setAnswers(newAnswers)
                            }}
                        >
                            {questions[currentQuestion].options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option} id={`option-${index}`} />
                                    <Label htmlFor={`option-${index}`}>{option}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                            disabled={currentQuestion === 0}
                        >
                            Previous
                        </Button>
                        {currentQuestion === questions.length - 1 ? (
                            <Button onClick={handleSubmit}>Submit Quiz</Button>
                        ) : (
                            <Button
                                onClick={() => setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1))}
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}
