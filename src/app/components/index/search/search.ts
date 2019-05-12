import LiveRoom from 'class/live-room';
import Course from 'class/course';
import Note from 'class/note';

export interface SearchData {
  liveRoom: LiveRoom;
  course: Course[];
  note: Note[];
}
