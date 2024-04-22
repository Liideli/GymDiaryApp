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

type AddWorkoutModalProps = {
  onAdd: (workout: WorkoutInput) => void;
};

export type { Workout, AddWorkoutModalProps };