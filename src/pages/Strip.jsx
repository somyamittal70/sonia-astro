import { Reveal } from "../components/Shared";
import {
  Globe,
  Users,
  Video,
  Award,
  Laptop,
  HeartHandshake,
} from "lucide-react";

const socialProofs = [
  {
    icon: <Globe size={18} />,
    text: "Trusted by Clients Worldwide",
  },
  {
    icon: <Users size={18} />,
    text: "200K+ Instagram Community",
  },
  {
    icon: <Video size={18} />,
    text: "70K+ YouTube Subscribers",
  },
  {
    icon: <Award size={18} />,
    text: "15+ Years Experience",
  },
  {
    icon: <Laptop size={18} />,
    text: "Online Worldwide Consultations",
  },
  {
    icon: <HeartHandshake size={18} />,
    text: "Relationship & Emotional Healing Specialist",
  },
];

const Strip = () => {
  return (
    <>
      <section className="social-proof-section">
        <Reveal>
          <div className="social-strip">
            {[...socialProofs, ...socialProofs].map((item, index) => (
              <div key={index} className="social-pill">
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
};

export default Strip;