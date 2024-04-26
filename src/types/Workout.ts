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

type AddWorkoutModalProps = {
  onAdd: (workout: WorkoutInput) => void;
  onWorkoutAdded: () => void;
};

export type { Workout, WorkoutUpdateInput, AddWorkoutModalProps };