import Home from './views/agam_Home';
import About from './views/agam_About';
// import FileViewer from './views/FileViewer';
// import FileViewer from '@/apps/common/modules/common/views/FileViewer';

export const commonRoutes = [
  {
    path: '/',
    component: Home,
    name: 'HomePage'
  },
  {
    path: '/about',
    component: About,
    name: 'AboutPage'
  },
  // {
  //   path: '/file-viewer',
  //   component: FileViewer,
  //   name: 'FileViewer'
  // }
]