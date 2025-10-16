// ? Layer Imports
// import type { TStudyStackParamListKey } from "screens/StudyScreen/ui/StudyScreen";
import { ENavigation, type TStudyStackParamList } from "shared/config/navigation";

// ? Types
export type TLessonsModel = {
  key: string;
  title: string;
  navigate: keyof TStudyStackParamList;
};

// ? Models
export const lessonsModel: TLessonsModel[] = [
  {
    key: "lesson_1",
    title: "Lesson 1",
    navigate: ENavigation.LESSON,
  },
  {
    key: "lesson_2",
    title: "Lesson 2",
    navigate: ENavigation.LESSON,
  },
  {
    key: "lesson_3",
    title: "Lesson 3",
    navigate: ENavigation.LESSON,
  },
  {
    key: "lesson_4",
    title: "Lesson 4",
    navigate: ENavigation.LESSON,
  },
  {
    key: "lesson_5",
    title: "Lesson 5",
    navigate: ENavigation.LESSON,
  },
  {
    key: "lesson_6",
    title: "lesson 6",
    navigate: ENavigation.LESSON,
  },
];
