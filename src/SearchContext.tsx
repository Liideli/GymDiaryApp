import React from "react";
import { Workout } from "./types/Workout";


export const SearchContext = React.createContext<{
  searchResults: Workout[];
  setSearchResults: (results: Workout[]) => void;
}>({
  searchResults: [],
  setSearchResults: () => {}
});