import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EnrolledCourse } from "../interfaces/enrolledCourse";
import { Module } from "../interfaces/module";

interface userState {
  course: EnrolledCourse | null;
  module: Module | null;
  completedChapters: string[];
}

const initialState: userState = {
  course: null,
  module: null,
  completedChapters: [],
};

const enrolledCourseSlice = createSlice({
  name: "enrolledCourseSlice",
  initialState,
  reducers: {
    selectCourse(state, action: PayloadAction<EnrolledCourse | null>) {
      state.course = action.payload;
    },
    addModule(state, action: PayloadAction<string | null>) {
      state.course = {
        ...state.course,
        progression: [...(state.course?.progression || []), action.payload!],
      };
    },
      addChapterToProgression(state, action: PayloadAction<string>) {
        // Add the chapter to the completed list if not already completed
        if (!state.completedChapters.includes(action.payload)) {
          state.completedChapters.push(action.payload);
        }
      },
      setCompletedChapters(state, action: PayloadAction<string[]>) {
        state.completedChapters = action.payload;
      },
    
    selectModule(state, action: PayloadAction<Module | null>) {
      state.module = action.payload;
    },
  },
});

export default enrolledCourseSlice.reducer;
export const enrolledCourseActions = enrolledCourseSlice.actions;