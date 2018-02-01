import App from './app'
import Post from './post'
import Channel from './channel'

export default function init (node) {
  const app = new App(node)
  app.joinChannel(new Channel({ name: 'global', key: '' }))
  app.joinChannel(new Channel({ name: 'test', key: 'test' }))
  setInterval(
    () => app.sendPost(new Post({ content: Date.now() })),
    5000
  ) // DEBUG: Mock
  return app
}
