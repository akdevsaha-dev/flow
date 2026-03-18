import { ElementType } from "react";
import { HandHeart, Zap, ShieldCheck, Globe } from "lucide-react";

export const navLinks = [
    {label: "About"},
    {label: "App"},
    {label: "Benefits"},
    {label: "Feature"},
    {label: "Reviews"},
    {label: "Plans"}
];

export interface Benefit {
  icon: ElementType;
  title: string;
  description: string;
  rightSubtitle: string;
  rightTitle: string;
}

export const benefitsData: Benefit[] = [
  {
    icon: HandHeart,
    title: "Instant chat",
    description:
      "We help you communicate effortlessly, turning everyday chats into meaningful, real-time connections that feel natural.",
    rightSubtitle: "We are here to",
    rightTitle: "Elevate conversation",
  },
  {
    icon: Zap,
    title: "Lightning fast",
    description:
      "Experience zero latency. Messages, files, and media are delivered instantly, keeping your workflow completely uninterrupted.",
    rightSubtitle: "Designed for",
    rightTitle: "Ultimate speed",
  },
  {
    icon: ShieldCheck,
    title: "Secure platform",
    description:
      "End-to-end encryption ensures that your ideas, data, and personal conversations remain private and fully protected.",
    rightSubtitle: "Committed to",
    rightTitle: "Protect privacy",
  },
  {
    icon: Globe,
    title: "Global sync",
    description:
      "Access your messages from any device, anywhere in the world. Stay in the flow whether you are at your desk or on the move.",
    rightSubtitle: "Built to",
    rightTitle: "Keep you moving",
  },
];
