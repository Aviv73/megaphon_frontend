import ShoppingListApp from './ShoppingListApp';
import ShoppingListPage from './views/ShoppingListPage';
import ShoppingListDetails from './views/ShoppingListDetails';
import ShoppingListEdit from './views/ShoppingListEdit';

export const shoppingListRoutes = [
  {
    name: 'ShoppingListApp',
    path: '/shopping-list/:organizationId',
    component: ShoppingListApp,
    children: [
      {
        name: 'ShoppingListPage',
        path: '/',
        component: ShoppingListPage
      },
      {
        name: 'ShoppingListEdit',
        path: 'edit/:id?',
        component: ShoppingListEdit
      },
      {
        name: 'ShoppingListDetails',
        path: ':id',
        component: ShoppingListDetails
      }
    ]
  }
]