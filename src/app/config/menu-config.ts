export interface Menu {
  name: string;
  url: string;
  icon?: string;
}

export const indexMenu: Menu[] = [
  { name: '首页', url: '/home' },
  { name: '直播', url: '/live' },
  { name: '课程', url: '/course' },
  { name: '问答', url: '/solution' },
  { name: '笔记', url: '/note' }
];

export const userCenterMenu: Menu[] = [
  { name: '我的消息', url: '/user/my_message' },
  { name: '我的课程', url: '/user/my_course' },
  { name: '我的笔记', url: '/user/my_note' },
  { name: '我的收藏', url: '/user/my_collection' },
  { name: '我的提问', url: '/user/my_question' }
];

export const adminMenu: Menu[] = [
  { name: '网站首页', url: '/admin/home_page', icon: 'home' },
  { name: '用户管理', url: '/admin/user_manage', icon: 'user' },
  { name: '分类管理', url: '/admin/category_manage', icon: 'appstore' },
  { name: '课程管理', url: '/admin/course_manage', icon: 'file-text' },
  { name: '直播管理', url: '/admin/live_manage', icon: 'video-camera' },
  { name: '笔记管理', url: '/admin/note_manage', icon: 'book' },
  { name: '修改信息', url: '/admin/edit_info', icon: 'form' },
  { name: '关于此站', url: '/admin/about_website', icon: 'link' }
];
