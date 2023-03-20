import ExampleApp from './ExampleApp';
import ExamplePage from './views/ExamplePage';
import ExampleDetails from './views/ExampleDetails';
import ExampleEdit from './views/ExampleEdit';

export const exampleRoutes = [
  {
    name: 'ExampleApp',
    path: '/example',
    component: ExampleApp,
    children: [
      {
        name: 'ExamplePage',
        path: '/',
        component: ExamplePage
      },
      {
        name: 'ExampleEdit',
        path: 'edit/:id?',
        component: ExampleEdit
      },
      {
        name: 'ExampleDetails',
        path: ':id',
        component: ExampleDetails
      }
    ]
  }
]