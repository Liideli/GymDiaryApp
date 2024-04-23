import { ExerciseType } from "./Exercise";

type ExerciseMessegeResponse = {
  addExercise: {
    message: string;
    exercise: ExerciseType;
  };
}

export type { ExerciseMessegeResponse };
