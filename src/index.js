import initLibp2p from './libp2p/init'
import initApp from './app/init'

// Initialization:
document.onreadystatechange = async function () {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    document.onreadystatechange = () => {}
    window.node = await initLibp2p()
    window.app = initApp(window.node)
  }
}

// Setup Service Worker:
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => console.log('Service Worker registered', reg))
    .catch(err => console.warn('Service Worker **not** registered', err))
} else {
  console.warn('Service Worker not supported in this browser')
}
