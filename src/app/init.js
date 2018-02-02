import App from './app'

export default function init (node) {
  const app = new App(node)
  // app.joinChannel({ name: 'global', key: '' })
  // app.joinChannel({ name: 'test', key: 'test' })
  setInterval(
    () => app.sendPost({ content: Date.now() }),
    2000
  ) // DEBUG: Mock
  return app
}
