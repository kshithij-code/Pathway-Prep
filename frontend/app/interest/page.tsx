import InterestForm from "@/components/interest-form"
import Quiz from "@/components/quiz"



export default function QuizPage() {
    return (
        <main className="min-h-screen py-12">
            <div className="container">
                <h1 className="text-3xl font-bold text-center mb-8">Take Quiz</h1>
                <InterestForm/>
            </div>
        </main>
    )
}

