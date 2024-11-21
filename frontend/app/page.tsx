import Image from "next/image";
import VideoConferencing from "./meet/page";
import PeerMessaging from "./peer-messaging/page";
import { TechnicalInterviewQuiz } from "./onboarding_quiz/page";

export default function Home() {
  return (
    <div>
      <TechnicalInterviewQuiz/>
    </div>
  );
}
