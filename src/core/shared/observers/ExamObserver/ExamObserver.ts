import { ExamDTO } from "../../../exams/models/Exam";
import { Observer } from "../Observer";

type ListenerParam = ExamDTO & { userId: string };

class ExamsObserver extends Observer<ListenerParam> {}

export const examObserver = new ExamsObserver();
