"use client"

import { useEffect, useState } from "react"
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    ConnectionMode,
    MarkerType,
} from "reactflow"
import "reactflow/dist/style.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FlowChartProps {
    usn: string
}

interface FlowData {
    nodes: Node[]
    edges: Edge[]
    title: string
}

export default function FlowChart({ usn }: FlowChartProps) {
    const [flowData, setFlowData] = useState<FlowData | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchFlowData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/genarate_roadmap`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        usn
                    }),
                })
                if (!response.ok) {
                    throw new Error('Failed to fetch flow data')
                }
                const data = await response.json()
                setFlowData(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch flow data')
            }
        }

        fetchFlowData()
    }, [usn])

    if (error) {
        return <div className="text-red-500">Error: {error}</div>
    }

    if (!flowData) {
        return <div className="animate-pulse">Loading...</div>
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{flowData.title}</CardTitle>
            </CardHeader>
            <CardContent className="h-[800px]">
                <ReactFlow
                    nodes={flowData.nodes}
                    edges={flowData.edges}
                    connectionMode={ConnectionMode.Loose}
                    fitView
                    attributionPosition="bottom-right"
                >
                    <Controls />
                    <Background />
                </ReactFlow>
            </CardContent>
        </Card>
    )
}

