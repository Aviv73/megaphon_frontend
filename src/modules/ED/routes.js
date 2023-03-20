import EdApp from './EdApp';
import MapPage from './views/MapPage';
import MsgEdit from './views/MsgEdit';

export const edRoutes = [
  {
    name: 'EdApp',
    path: '/ED',
    component: EdApp,
    children: [
      {
        name: 'EdMapPage',
        path: '/',
        component: MapPage
      },
      {
        name: 'EdMsgEdit',
        path: 'msgs',
        component: MsgEdit
      },
    ]
  }
]