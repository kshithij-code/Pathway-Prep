import Image from "next/image";
import VideoConferencing from "./meet/page";
import PeerMessaging from "./peer-messaging/page";

export default function Home() {
  return (
    <div>
      <PeerMessaging></PeerMessaging>
    </div>
  );
}
