import {
  Book,
  BookOpen,
  Code,
  Code2,
  Terminal,
  Globe,
  Database,
  Server,
  Cloud,
  Palette,
  Layout,
  Smartphone,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  Lock,
  Shield,
  Key,
  Wrench,
  Settings,
  Cog,
  GitBranch,
  Github,
  Folder,
  FolderOpen,
  File,
  FileCode,
  FileText,
  Footprints,
  Trophy,
  Medal,
  Award,
  Star,
  Crown,
  Gem,
  Diamond,
  Zap,
  Flame,
  Sparkles,
  PartyPopper,
  Target,
  Crosshair,
  Flag,
  Rocket,
  Plane,
  Send,
  CheckCircle,
  CheckCircle2,
  Circle,
  CircleDot,
  Play,
  PlayCircle,
  Boxes,
  Box,
  Package,
  Layers,
  Blocks,
  Puzzle,
  Lightbulb,
  GraduationCap,
  Brain,
  Heart,
  HeartHandshake,
  Users,
  UserCircle,
  User,
  MessageSquare,
  MessageCircle,
  Bug,
  TestTube,
  FlaskConical,
  Beaker,
  Microscope,
  Search,
  Eye,
  Telescope,
  Compass,
  Map,
  MapPin,
  Navigation,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Activity,
  Gauge,
  Timer,
  Clock,
  Calendar,
  Sunrise,
  Sunset,
  Sun,
  Moon,
  CloudSun,
  TreeDeciduous,
  Leaf,
  Sprout,
  Mountain,
  type LucideIcon,
} from 'lucide-react'
import React from 'react'

// Map of icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  // Books & Learning
  book: Book,
  'book-open': BookOpen,
  graduation: GraduationCap,
  'graduation-cap': GraduationCap,
  lightbulb: Lightbulb,
  brain: Brain,

  // Code & Development
  code: Code,
  code2: Code2,
  terminal: Terminal,
  'file-code': FileCode,
  'git-branch': GitBranch,
  github: Github,

  // Web & Infrastructure
  globe: Globe,
  database: Database,
  server: Server,
  cloud: Cloud,
  wifi: Wifi,
  cpu: Cpu,
  'hard-drive': HardDrive,

  // Design & UI
  palette: Palette,
  layout: Layout,
  smartphone: Smartphone,
  monitor: Monitor,

  // Security
  lock: Lock,
  shield: Shield,
  key: Key,

  // Tools & Settings
  wrench: Wrench,
  settings: Settings,
  cog: Cog,

  // Files & Folders
  folder: Folder,
  'folder-open': FolderOpen,
  file: File,
  'file-text': FileText,

  // Achievements & Rewards
  footprints: Footprints,
  trophy: Trophy,
  medal: Medal,
  award: Award,
  star: Star,
  crown: Crown,
  gem: Gem,
  diamond: Diamond,

  // Energy & Effects
  zap: Zap,
  flame: Flame,
  fire: Flame,
  sparkles: Sparkles,
  'party-popper': PartyPopper,

  // Progress & Goals
  target: Target,
  crosshair: Crosshair,
  flag: Flag,
  rocket: Rocket,
  plane: Plane,
  send: Send,

  // Status
  'check-circle': CheckCircle,
  check: CheckCircle2,
  circle: Circle,
  'circle-dot': CircleDot,
  play: Play,
  'play-circle': PlayCircle,

  // Structure & Components
  boxes: Boxes,
  box: Box,
  package: Package,
  layers: Layers,
  blocks: Blocks,
  puzzle: Puzzle,

  // Social
  heart: Heart,
  'heart-handshake': HeartHandshake,
  users: Users,
  'user-circle': UserCircle,
  user: User,
  'message-square': MessageSquare,
  'message-circle': MessageCircle,

  // Testing & Debug
  bug: Bug,
  'test-tube': TestTube,
  flask: FlaskConical,
  beaker: FlaskConical,
  microscope: Microscope,

  // Search & Discovery
  search: Search,
  eye: Eye,
  telescope: Telescope,
  compass: Compass,
  map: Map,
  'map-pin': MapPin,
  navigation: Navigation,

  // Charts & Analytics
  'bar-chart': BarChart3,
  'line-chart': LineChart,
  'pie-chart': PieChart,
  'trending-up': TrendingUp,
  activity: Activity,
  gauge: Gauge,

  // Time
  timer: Timer,
  clock: Clock,
  calendar: Calendar,

  // Nature & Weather
  sunrise: Sunrise,
  sunset: Sunset,
  sun: Sun,
  moon: Moon,
  'cloud-sun': CloudSun,
  tree: TreeDeciduous,
  leaf: Leaf,
  sprout: Sprout,
  mountain: Mountain,
}

// Get a Lucide icon component by name
export function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName.toLowerCase()] || Circle
}

// Render an icon by name with optional className and style
interface DynamicIconProps {
  name: string
  className?: string
  style?: React.CSSProperties
  size?: number
}

export function DynamicIcon({ name, className = '', style, size }: DynamicIconProps) {
  const IconComponent = getIconComponent(name)
  return <IconComponent className={className} style={style} size={size} />
}

// Export the map for type checking
export const availableIcons = Object.keys(iconMap)
export type IconName = keyof typeof iconMap
