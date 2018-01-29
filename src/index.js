import libp2pInit from './libp2p/init.js'

// Initialize app;
document.onreadystatechange = async function () {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    document.onreadystatechange = () => {}

    window.node = await libp2pInit()
  }
}

// // Setup service worker:
// if (location.protocol === 'http:') location.protocol = 'https:'
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('sw.js')
//     .then(reg => console.log('Service Worker registered', reg))
//     .catch(err => console.error('Service Worker **not** registered', err))
// } else {
//   console.warn('Service Worker not supported in this browser')
// }
