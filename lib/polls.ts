export type PollMode = "quiz" | "vote"
export type PollStatus = "live" | "scheduled" | "ended" | "draft"

export type Poll = {
  id: string
  title: string
  mode: PollMode
  roomCode: string
  status: PollStatus
  participants: number
  questions: number
  updated: string
}

export const polls: Poll[] = [
  {
    id: "1",
    title: "Q2 All-Hands Trivia",
    mode: "quiz",
    roomCode: "482913",
    status: "live",
    participants: 214,
    questions: 12,
    updated: "Live now",
  },
  {
    id: "2",
    title: "New Logo Direction",
    mode: "vote",
    roomCode: "705512",
    status: "live",
    participants: 88,
    questions: 1,
    updated: "Live now",
  },
  {
    id: "3",
    title: "Onboarding Knowledge Check",
    mode: "quiz",
    roomCode: "331204",
    status: "scheduled",
    participants: 0,
    questions: 8,
    updated: "Starts 4:00 PM",
  },
  {
    id: "4",
    title: "Office Snack Preferences",
    mode: "vote",
    roomCode: "619007",
    status: "ended",
    participants: 156,
    questions: 1,
    updated: "Ended 2d ago",
  },
  {
    id: "5",
    title: "Security Awareness Quiz",
    mode: "quiz",
    roomCode: "204418",
    status: "ended",
    participants: 342,
    questions: 15,
    updated: "Ended 5d ago",
  },
  {
    id: "6",
    title: "Next Offsite Location",
    mode: "vote",
    roomCode: "880231",
    status: "draft",
    participants: 0,
    questions: 1,
    updated: "Draft",
  },
]

export const stats = {
  activePolls: 2,
  totalVotes: 12840,
  participantsToday: 514,
}
