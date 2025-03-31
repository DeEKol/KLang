// ? Layer Imports
// import type { TStudyStackParamListKey } from "screens/StudyScreen/ui/StudyScreen";

// ? Types
export type TLessonsModel = {
  key: string;
  title: string;
  // navigate: Extract<TStudyStackParamListKey, "LessonScreen">;
  navigate: "LessonScreen";
};

// ? Models
export const lessonsModel: TLessonsModel[] = [
  {
    key: "lesson_1",
    title: "Lesson 1",
    navigate: "LessonScreen",
  },
  {
    key: "lesson_2",
    title: "Lesson 2",
    navigate: "LessonScreen",
  },
  {
    key: "lesson_3",
    title: "Lesson 3",
    navigate: "LessonScreen",
  },
  {
    key: "lesson_4",
    title: "Lesson 4",
    navigate: "LessonScreen",
  },
  {
    key: "lesson_5",
    title: "Lesson 5",
    navigate: "LessonScreen",
  },
  {
    key: "lesson_6",
    title: "lesson 6",
    navigate: "LessonScreen",
  },
];
