"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

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

export default function ResultsPage() {
    const [result, setResult] = useState<QuizResult | null>(null)
    const router = useRouter()

    useEffect(() => {
        const storedResult = localStorage.getItem('quizResult')
        if (storedResult) {
            setResult(JSON.parse(storedResult))
        } else {
            router.push('/')
        }
    }, [router])

    const handleflow = () => {
        localStorage.removeItem('quizResult')
        router.push('/flowchart')
    }

    if (!result) return null

    const chartData = [result.graph_data]

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Quiz Results</h1>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Category Scores</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {
                                // result.map()
                            }
                            <li>Coding: {result.categories.coding}%</li>
                            <li>Aptitude: {result.categories.aptitude}%</li>
                            <li>Domain: {result.categories.domain}%</li>
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Area of Improvement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{result.area_of_impro || "No specific area of improvement identified."}</p>
                    </CardContent>
                </Card>
            </div>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Performance Graph</CardTitle>
                    <CardDescription>Your performance plotted on a graph</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={{
                            performance: {
                                label: "Performance",
                                color: "hsl(var(--chart-1))",
                            },
                        }}
                        className="h-[300px]"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid />
                                <XAxis type="number" dataKey="x" name="X Axis" unit="%" />
                                <YAxis type="number" dataKey="y" name="Y Axis" unit="%" />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Scatter name="Performance" data={chartData} fill="var(--color-performance)" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
            <div className="mt-8 text-center">
                <Button onClick={handleflow}>Flowchart</Button>
            </div>
        </div>
    )
}

