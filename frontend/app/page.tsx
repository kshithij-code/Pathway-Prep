import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Welcome to the Interview Platform</h1>
      <p>Please select a feature from the sidebar to get started:</p>
      <ul className="list-disc list-inside space-y-2">
        <li><Link href="/meet" className="text-blue-500 hover:underline">Video Conferencing</Link></li>
        <li><Link href="/onboarding_quiz" className="text-blue-500 hover:underline">Technical Interview Quiz</Link></li>
        <li><Link href="/peer-messaging" className="text-blue-500 hover:underline">Peer Messaging</Link></li>
      </ul>
    </div>
  )
}

