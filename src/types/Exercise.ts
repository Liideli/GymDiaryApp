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

type ExerciseUpdateInput = {
  name: string;
  description: string;
  weight: number;
  sets: number;
  reps: number;
  duration: number;
  id: string;
};

export type { ExerciseType, ExerciseTypeInput, ExerciseUpdateInput };