import { Workout } from "./Workout";

type WorkoutMessageResponse = {
  addWorkout: {
    message: string;
    workout: Workout;
  };
}

export type { WorkoutMessageResponse };