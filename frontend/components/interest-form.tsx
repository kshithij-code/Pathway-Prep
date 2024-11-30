"use client"


import { useState } from "react"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { fileURLToPath } from "url"
import path from 'path'
// import { writeFile } from "fs/promises";
// const { writeFile } = require('fs/promises');


export default function InterestForm() {
    const [interests, setInterests] = useState<string[]>([])
    const [currentInterest, setCurrentInterest] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleAddInterest = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (currentInterest.trim()) {
            if (!interests.includes(currentInterest.trim())) {
                setInterests([...interests, currentInterest.trim()]);
            }
            setCurrentInterest("");
        }
    };

    const handleRemoveInterest = (interest: string) => {
        setInterests(interests.filter((i) => i !== interest))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (!file) {
                throw new Error("No file selected")
            }

            const formData = new FormData()
            interests.forEach((interest) => {
                formData.append("interests[]", interest)
            })
            console.log(file.name)
            formData.append("resume", file)
            // formData.append("resume","resume")

            const UPLOAD_DIR = path.join(process.cwd(), 'uploads')

            const buffer = Buffer.from(await file.arrayBuffer())
            const fileName = `${Date.now()}-${file.name}`
            const filePath = path.join(UPLOAD_DIR, fileName)

            // await writeFile(filePath, buffer)


            // const response = await fetch("/api/upload", {
            //     method: "POST",
            //     body: formData,
            // })

            console.log(interests)
            const response = await fetch('http://127.0.0.1:5000/genarate_ques', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "resume":filePath,
                    "interests":interests,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to submit form")
            }

            const data = await response.json()
            localStorage.setItem("quizQuestions", JSON.stringify(data.questions))
            router.push("/quiz")
        } catch (error) {
            console.error("Error submitting form:", error)
            toast({
                title: "Error",
                description: "Failed to submit form. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-xl mx-auto p-6">
            <div className="space-y-2">
                <Label htmlFor="interest">Interest</Label>
                <div className="flex space-x-2">
                    <Input
                        id="interest"
                        type="text"
                        value={currentInterest}
                        onChange={(e) => setCurrentInterest(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddInterest(e)}
                        placeholder="Type an interest"
                        disabled={isLoading}
                    />
                    <Button
                        type="button"
                        onClick={handleAddInterest}
                        disabled={isLoading || !currentInterest.trim()}
                    >
                        Add
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {interests.map((interest) => (
                        <span
                            key={interest}
                            className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                            {interest}
                            <button
                                type="button"
                                onClick={() => handleRemoveInterest(interest)}
                                className="hover:text-red-400 transition-colors"
                                disabled={isLoading}
                                title="interest"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="resume">Resume</Label>
                <Input
                    id="resume"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    accept=".pdf,.doc,.docx"
                    disabled={isLoading}
                />
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={isLoading || interests.length === 0 || !file}
            >
                {isLoading ? "Submitting..." : "Submit"}
            </Button>
        </form>
    )
}

