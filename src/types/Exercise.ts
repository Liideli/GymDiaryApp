type ExerciseType = {
  id: string;
  name: string;
  description: string;
  weight: number;
  sets: number;
  reps: number;
  duration: number;
  workout: string;
};

type ExerciseTypeInput = {
  name: string;
  description: string;
  weight: number;
  sets: number;
  reps: number;
  duration: number;
  workout: string;
};

export type { ExerciseType, ExerciseTypeInput };