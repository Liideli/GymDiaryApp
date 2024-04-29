import React from "react";
import { Workout } from "./types/Workout";


export const SearchContext = React.createContext<{
  searchResults: { workoutBySearch: Workout[] };
  setSearchResults: (results: { workoutBySearch: Workout[] }) => void;
}>({
  searchResults: { workoutBySearch: [] },
  setSearchResults: () => {}
});