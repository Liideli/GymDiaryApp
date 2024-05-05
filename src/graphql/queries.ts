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

const getUsers = `
query getUsers {
  users {
    id
    user_name
    email
    workoutCount
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
    owner {
      id
    }
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
    owner
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

const createGroup = `
mutation createGroup($input: GroupInput!) {
  createGroup(input: $input) {
    group {
      id
      name
      description
      owner {
        id
        user_name
        email
        workoutCount
      }
      members {
        id
        user_name
        email
        workoutCount
      }
    }
    message
  }
}`;

const getGroup = `
query Group($groupId: ID!) {
  group(id: $groupId) {
    id
    name
    description
    owner {
      id
      user_name
      email
      workoutCount
    }
    members {
      id
      user_name
      email
      workoutCount
    }
  }
}`;

const getGroups = `
query GetGroups {
  groups {
    id
    name
    description
    owner {
      id
      user_name
      email
      workoutCount
    }
    members {
      id
      user_name
      email
      workoutCount
    }
  }
}`;

const deleteGroup = `mutation DeleteGroup($deleteGroupId: ID!) {
  deleteGroup(id: $deleteGroupId) {
    group {
      id
      name
      description
      owner {
        id
        user_name
        email
        workoutCount
      }
      members {
        id
        user_name
        email
        workoutCount
      }
    }
    message
  }
}`;

export {
  login,
  register,
  getUsers,
  createWorkout,
  getWorkoutsByOwner,
  workoutBySearch,
  deleteWorkout,
  modifyWorkout,
  createExercise,
  getExercisesByWorkout,
  deleteExercise,
  modifyExercise,
  createGroup,
  getGroup,
  getGroups,
  deleteGroup,
};
