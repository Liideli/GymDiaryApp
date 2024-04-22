import { Workout } from "./Workout";

type WorkoutMessegeResponse = {
  addWorkout: {
    message: string;
    workout: Workout;
  };
}

export type { WorkoutMessegeResponse };