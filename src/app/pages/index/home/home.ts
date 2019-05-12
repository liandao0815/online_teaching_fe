import Course from 'class/course';
import LiveRoom from 'class/live-room';
import Note from 'class/note';
import Problem from 'class/problem';

export class HomePageData {
  banner: Course[] = [];
  liveRoom: LiveRoom[] = [];
  course: Course[] = [];
  note: Note[] = [];
  problem: Problem[] = [];
}
