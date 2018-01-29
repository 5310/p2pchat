import libp2pInit from './libp2p/init.js'

// Initialize app;
document.onreadystatechange = async function () {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    document.onreadystatechange = () => {}

    window.node = await libp2pInit()
  }
}

// Redirect to secure
if (location.protocol === 'http:' && document.location.host.split(':')[0] !== 'localhost') location.protocol = 'https:'

// Setup service worker:
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => console.log('Service Worker registered', reg))
    .catch(err => console.warn('Service Worker **not** registered', err))
} else {
  console.warn('Service Worker not supported in this browser')
}
