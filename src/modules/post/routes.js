import PostApp from './PostApp';
import PostPage from './views/PostPage';
import PostDetails from './views/PostDetails';
import PostEdit from './views/PostEdit';

export const postRoutes = [
  {
    name: 'PostApp',
    path: '/post/:organizationId',
    component: PostApp,
    children: [
      {
        name: 'PostPage',
        path: '/',
        component: PostPage
      },
      {
        name: 'PostEdit',
        path: 'edit/:id?',
        component: PostEdit
      },
      {
        name: 'PostDetails',
        path: ':id',
        component: PostDetails
      }
    ]
  }
]