export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface VideoItem {
  id: string;
  type: "video";
  title: string;
  duration: string;
  src: {
    english: string;
    hindi: string;
  };
  transcript?: string;
}

export interface AudioItem {
  id: string;
  type: "audio";
  title: string;
  duration: string;
  src: string;
  coverImage: string;
  artist: string;
}

export interface TextItem {
  id: string;
  type: "text";
  title: string;
  duration: string;
  src: string;
}

export interface QuizItem {
  id: string;
  type: "quiz";
  title: string;
  questions: Question[];
}

export interface ExerciseItem {
  id: string;
  type: "exercise";
  title: string;
  questions: Question[];
}

export type CourseItem =
  | VideoItem
  | AudioItem
  | TextItem
  | QuizItem
  | ExerciseItem;

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  items: CourseItem[];
}
