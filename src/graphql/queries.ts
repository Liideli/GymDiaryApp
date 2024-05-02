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

const modifyUser = `
mutation ModifyUser($user: UserInput!, $modifyUserId: ID!) {
  modifyUser(user: $user, id: $modifyUserId) {
    message
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

const workoutBySearch = `query WorkoutBySearch($search: String!, $owner: ID!) {
  workoutBySearch(search: $search, owner: $owner) {
    id
    title
    description
    date
    owner {
      id
      user_name
      email
    }
  }
}`;

const deleteWorkout = `mutation DeleteWorkout($deleteWorkoutId: ID!) {
  deleteWorkout(id: $deleteWorkoutId) {
    message
  }
}`;

const modifyWorkout = `
mutation ModifyWorkout($modifyWorkoutId: ID!, $input: WorkoutUpdateInput!) {
  modifyWorkout(id: $modifyWorkoutId, input: $input) {
    message
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

const deleteExercise = `
mutation deleteExercise($deleteExerciseId: ID!) {
  deleteExercise(id: $deleteExerciseId) {
    message
  }
}`;

const modifyExercise = `
mutation modifyExercise($modifyExerciseId: ID!, $input: ExerciseUpdateInput!) {
  modifyExercise(id: $modifyExerciseId, input: $input) {
    message
  }
}`;

export { login, register, modifyUser, createWorkout, getWorkoutsByOwner, workoutBySearch, deleteWorkout, modifyWorkout, createExercise, getExercisesByWorkout, deleteExercise, modifyExercise};