import libp2pInit from './libp2p/init.js'

// Initialization:
document.onreadystatechange = async function () {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    document.onreadystatechange = () => {}
    window.node = await libp2pInit()
  }
}

// Redirect to secure:
if (location.protocol === 'http:') location.protocol = 'https:'

// Setup Service Worker:
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => console.log('Service Worker registered', reg))
    .catch(err => console.warn('Service Worker **not** registered', err))
} else {
  console.warn('Service Worker not supported in this browser')
}
