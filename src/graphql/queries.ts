const login = `
mutation Login($credentials: Credentials!) {
    login(credentials: $credentials) {
      message
      token
      user {
        email
        id
        user_name
      }
    }
  }
  `;

const register = `
mutation Register($user: UserInput!) {
  register(user: $user) {
    user {
      user_name
      email
      id
    }
  }
}`;

const createWorkout = `
mutation CreateWorkout($input: WorkoutInput!) {
  createWorkout(input: $input) {
    message
    workout {
      date
      description
      title
    }
  }
}`;

const getWorkoutsByOwner = `query WorkoutsByOwner($owner: ID!) {
  workoutsByOwner(owner: $owner) {
    description
    date
    title
    id
  }
}`;

const createExercise = `
mutation createExercise($input: ExerciseInput!) {
  createExercise(input: $input) {
    exercise {
      id
      name
      description
      workout
      sets
      reps
      weight
      duration
    }
    message
  }
}`;

const getExercisesByWorkout = `query ExercisesByWorkout($workout: ID!) {
  exercisesByWorkout(workout: $workout) {
    description
    duration
    id
    name
    reps
    sets
    weight
    workout
  }
}`;

export { login, register, createWorkout, getWorkoutsByOwner, createExercise, getExercisesByWorkout};