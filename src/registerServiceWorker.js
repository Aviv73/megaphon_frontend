/* eslint-disable no-console */

import { register } from 'register-service-worker'

if ((process.env.NODE_ENV === 'production')) {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('Service worker has been registered.')
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated () {
      console.log('New content is available; please refresh.')
      
      // from gpt::
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload page to apply the new version
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}