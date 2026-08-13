import {
  Activity,
  Boxes,
  CheckCircle,
  CircleUserRound,
  Gauge,
  Globe,
  Network,
  ShieldCheck,
} from "lucide-react";

export const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Gauge,
  },
  {
    label: "Hosted zones",
    href: "/hosted-zones",
    icon: Globe,
  },
  {
    label: "Traffic policies",
    href: "/traffic-policies",
    icon: Network,
  },
  {
    label: "Health checks",
    href: "/health-checks",
    icon: CheckCircle,
  },
  {
    label: "Resolver",
    href: "/resolver",
    icon: Boxes,
  },
  {
    label: "Profiles",
    href: "/profiles",
    icon: ShieldCheck,
  },
];