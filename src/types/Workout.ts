type Workout = {
  id: string;
  title: string;
  description: string;
  date: string;
};

type WorkoutInput = {
  title: string;
  description: string;
  date: string;
};

type WorkoutUpdateInput = {
  title: string;
  description: string;
  date: string;
  id: string;
};

type WorkoutContextType = {
  workouts: Workout[];
  addWorkout: (workout: WorkoutInput) => void;
  updateWorkout: (workout: WorkoutUpdateInput) => void;
};

type AddWorkoutModalProps = {
  show: boolean;
  onHide: () => void;
  onWorkoutAdded: () => void;
};

export type { Workout, WorkoutUpdateInput, WorkoutContextType, AddWorkoutModalProps };