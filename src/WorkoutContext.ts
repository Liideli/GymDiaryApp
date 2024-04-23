import React, { createContext } from 'react';

type WorkoutContextProps = {
  workoutId: string | null;
  setWorkoutId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const WorkoutContext = createContext<WorkoutContextProps>({
  workoutId: null,
  setWorkoutId: () => {},
});

export default WorkoutContext;
