import dialogPolyfill from 'dialog-polyfill'

Array.from(document.querySelectorAll('dialog')).forEach((e) => dialogPolyfill.registerDialog(e))
