'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, User } from 'lucide-react'

type Message = {
  id: number
  sender: string
  recipient: string
  content: string
  timestamp: Date
}

type Contact = {
  id: number
  name: string
  isFollowing: boolean
}

export default function PeerMessaging() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'Alice Johnson', recipient: 'You', content: 'Hey, can someone explain the difference between props and state in React?', timestamp: new Date('2023-05-10T10:00:00') },
    { id: 2, sender: 'You', recipient: 'Alice Johnson', content: 'Props are passed to a component from its parent and are read-only. State is managed within the component and can be updated.', timestamp: new Date('2023-05-10T10:05:00') },
  ])
  const [newMessage, setNewMessage] = useState('')
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: 'Alice Johnson', isFollowing: true },
    { id: 2, name: 'Bob Smith', isFollowing: false },
    { id: 3, name: 'Carol Williams', isFollowing: true },
    { id: 4, name: 'David Brown', isFollowing: false },
    { id: 5, name: 'Eva Davis', isFollowing: true },
    { id: 6, name: 'Frank Wilson', isFollowing: false },
  ])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedContact) {
      const message: Message = {
        id: messages.length + 1,
        sender: 'You',
        recipient: selectedContact.name,
        content: newMessage.trim(),
        timestamp: new Date(),
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  const toggleFollow = (id: number) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, isFollowing: !contact.isFollowing } : contact
    ))
  }

  const selectContact = (contact: Contact) => {
    setSelectedContact(contact)
  }

  const filteredMessages = selectedContact
    ? messages.filter(m => m.sender === selectedContact.name || m.recipient === selectedContact.name)
    : []

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen bg-background">
      {/* Sidebar */}
      <div className="border-r p-4 flex flex-col gap-4">
        <Input type="search" placeholder="Search" className="w-full" />
        <ScrollArea className="flex-grow">
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 w-full justify-start p-2"
                  onClick={() => selectContact(contact)}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{contact.name}</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFollow(contact.id)
                  }}
                >
                  {contact.isFollowing ? 'following' : 'follow'}
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-auto">
          <h2 className="text-lg font-semibold">Peer messaging</h2>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col">
        <div className="border-b p-4 flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{selectedContact ? selectedContact.name.split(' ').map(n => n[0]).join('') : 'XYZ'}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{selectedContact ? selectedContact.name : 'Select a contact'}</span>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div key={message.id} className={`max-w-[80%] ${message.sender === 'You' ? 'ml-auto' : ''} rounded-lg border p-3`}>
                <p className="font-semibold">{message.sender}</p>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4 flex gap-2">
          <Input 
            className="flex-1" 
            placeholder={selectedContact ? "Type your message..." : "Select a contact to start chatting"}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={!selectedContact}
          />
          <Button onClick={handleSendMessage} disabled={!selectedContact}>Send</Button>
        </div>
      </div>
    </div>
  )
}