import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  Bot,
  CheckCircle,
  CheckSquare,
  Compass,
  Flag,
  Frame,
  Hammer,
  Inbox,
  Rocket,
  Scale,
  Search,
  Shield,
  ShieldCheck,
  User,
  Users,
  UsersRound,
  XCircle,
} from 'lucide-react'

export const SUMMARY_ICONS: LucideIcon[] = [AlertTriangle, Compass, Scale]

export const STATE_ICONS: Record<string, LucideIcon> = {
  funnel: Inbox,
  framed: Frame,
  analyzed: Search,
  ready: CheckCircle,
  doing: Hammer,
  done: Flag,
  cancelled: XCircle,
}

export const PHASE_ICONS: LucideIcon[] = [Compass, CheckSquare, Rocket]

export const ROLE_ICONS: LucideIcon[] = [User, Users, Shield, ShieldCheck, UsersRound, Bot]
