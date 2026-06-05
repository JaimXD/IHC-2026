export interface UserStory {
  id: string
  title: string
  description: string
  priority: number
  acceptanceCriteria: string[]
}

export interface TechnicalTask {
  userStoryId: string
  title: string
  estimatedHours: number
  technicalNotes?: string
}

export interface PrioritizationItem {
  userStoryId: string
  score: number
  justification: string
}

export interface SprintPlanDay {
  day: number
  activities: string[]
  suggestedOwner?: string
}

export interface SprintBacklogData {
  userStories: UserStory[]
  tasks: TechnicalTask[]
  prioritization: PrioritizationItem[]
  sprintPlan: SprintPlanDay[]
  markdown: string
}

export type SprintBacklogState = SprintBacklogData | null

export type SprintBacklogAction =
  | { type: "SET_DATA"; payload: SprintBacklogData }
  | { type: "CLEAR_DATA" }
  | { type: "UPDATE_STORY"; id: string; field: keyof UserStory; value: UserStory[keyof UserStory] }
  | { type: "UPDATE_TASK"; index: number; field: keyof TechnicalTask; value: TechnicalTask[keyof TechnicalTask] }
  | { type: "ADD_TASK" }
  | { type: "REMOVE_TASK"; index: number }
  | {
      type: "UPDATE_PRIORITIZATION"
      id: string
      field: keyof PrioritizationItem
      value: PrioritizationItem[keyof PrioritizationItem]
    }
  | {
      type: "UPDATE_SPRINT_PLAN"
      dayIndex: number
      field: keyof SprintPlanDay
      value: SprintPlanDay[keyof SprintPlanDay]
    }
