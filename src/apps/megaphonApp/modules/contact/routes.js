import ContactApp from './ContactApp';
import ContactPage from './views/ContactPage';
import ContactEdit from './views/ContactEdit';

export const contactRoutes = [
  {
    path: '/contact/:organizationId',
    component: ContactApp,
    name: 'ContactApp',
    children: [
      {
        path: '/',
        component: ContactPage,
        name: 'ContactPage'
      },
      {
        path: 'edit/:id?',
        component: ContactEdit,
        name: 'ContactEdit'
      }
    ]
  }
]