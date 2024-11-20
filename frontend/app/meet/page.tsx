'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Share } from 'lucide-react'
import { Input } from "@/components/ui/input"

type Interviewer = {
  id: number
  name: string
  isRequested: boolean
}

export default function VideoConferencing() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [interviewers, setInterviewers] = useState<Interviewer[]>([
    { id: 1, name: 'John Doe', isRequested: false },
    { id: 2, name: 'Jane Smith', isRequested: true },
    { id: 3, name: 'Mike Johnson', isRequested: false },
    { id: 4, name: 'Emily Brown', isRequested: true },
    { id: 5, name: 'Chris Lee', isRequested: false },
    { id: 6, name: 'Sarah Wilson', isRequested: false },
  ])

  const toggleRequest = (id: number) => {
    setInterviewers(interviewers.map(interviewer => 
      interviewer.id === id ? { ...interviewer, isRequested: !interviewer.isRequested } : interviewer
    ))
  }

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen bg-background">
      {/* Sidebar */}
      <div className="border-r p-4 flex flex-col gap-4">
        <Input type="search" placeholder="search" className="w-full" />
        <div className="space-y-4">
          {interviewers.map((interviewer) => (
            <div key={interviewer.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{interviewer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{interviewer.name}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toggleRequest(interviewer.id)}
              >
                {interviewer.isRequested ? 'requested' : 'request'}
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-auto">
          <h2 className="text-lg font-semibold">Mock Interview Booking</h2>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex flex-col">
        <div className="flex-1 p-4">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            {isScreenSharing ? (
              <div>
                <p>Screen Sharing Active</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Screen Share Preview</p>
            )}
          </div>
        </div>

        <div className="border-t p-4">
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setIsScreenSharing(!isScreenSharing)}>
              <Share className="w-4 h-4 mr-2" />
              {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
            </Button>
            <Button variant="outline" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
              {isMuted ? 'Unmute' : 'Mute'} Audio
            </Button>
            <Button variant="outline" onClick={() => setIsVideoOn(!isVideoOn)}>
              {isVideoOn ? <VideoOff className="w-4 h-4 mr-2" /> : <Video className="w-4 h-4 mr-2" />}
              {isVideoOn ? 'Stop' : 'Start'} Camera
            </Button>
            <Button variant="destructive">
              <PhoneOff className="w-4 h-4 mr-2" />
              End Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}