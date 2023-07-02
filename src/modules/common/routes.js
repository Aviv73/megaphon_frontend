import Home from './views/Home';
import About from './views/About';
import FileViewer from './views/FileViewer';

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
  {
    path: '/file-viewer',
    component: FileViewer,
    name: 'FileViewer'
  }
]