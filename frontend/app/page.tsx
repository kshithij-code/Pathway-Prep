import Image from "next/image";
import VideoConferencing from "./meet/page";
import PeerMessaging from "./peer-messaging/page";
import QuizPage from "./quiz/page";
import InterestForm from "@/components/interest-form";
import UserEntryPage from "./user-entry/page";
import FlowChartPage from "./flowchart/page";

export default function Home() {
  return (
    <main className="min-h-screen py-12">
      <div className="container">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome to Pathway Prep!</h1>
        <UserEntryPage/>
        {/* <FlowChartPage/> */}
      </div>
    </main>
    // <PeerMessaging/>
  );
}
