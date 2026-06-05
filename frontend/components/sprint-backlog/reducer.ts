import type { SprintBacklogState, SprintBacklogAction } from "./types"

export function sprintBacklogReducer(
  state: SprintBacklogState,
  action: SprintBacklogAction,
): SprintBacklogState {
  switch (action.type) {
    case "SET_DATA":
      return action.payload

    case "CLEAR_DATA":
      return null

    case "UPDATE_STORY":
      if (!state) return null
      return {
        ...state,
        userStories: state.userStories.map((us) =>
          us.id === action.id ? { ...us, [action.field]: action.value } : us,
        ),
      }

    case "UPDATE_TASK": {
      if (!state) return null
      const newTasks = [...state.tasks]
      newTasks[action.index] = { ...newTasks[action.index], [action.field]: action.value }
      return { ...state, tasks: newTasks }
    }

    case "ADD_TASK":
      if (!state) return null
      return {
        ...state,
        tasks: [
          ...state.tasks,
          { userStoryId: "", title: "Nueva Tarea", estimatedHours: 0, technicalNotes: "" },
        ],
      }

    case "REMOVE_TASK": {
      if (!state) return null
      const newTasks = [...state.tasks]
      newTasks.splice(action.index, 1)
      return { ...state, tasks: newTasks }
    }

    case "UPDATE_PRIORITIZATION":
      if (!state) return null
      return {
        ...state,
        prioritization: state.prioritization.map((p) =>
          p.userStoryId === action.id ? { ...p, [action.field]: action.value } : p,
        ),
      }

    case "UPDATE_SPRINT_PLAN": {
      if (!state) return null
      const newPlan = [...state.sprintPlan]
      newPlan[action.dayIndex] = { ...newPlan[action.dayIndex], [action.field]: action.value }
      return { ...state, sprintPlan: newPlan }
    }

    default:
      return state
  }
}
