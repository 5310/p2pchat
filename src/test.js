import Node from './libp2p/node.js'

import template from './app/template.js'

import Post from './app/post'
import Channel from './app/channel'
import App from './app/app.js'

console.log(321)

export default async function test () {
  // libp2p
  const node = await Node.create()
  console.assert(node instanceof Node, 'Node failed to be created')
  console.assert(node.isStarted(), 'Node failed to start')
  // template
  const $templated = template(Document.createElement('template'), {})
  console.assert($templated instanceof HTMLElement, 'template() failed to stamp a DOM element')
  // app
  const post = new Post({id: 'QmPem2JT79izwbwrYC6crgguWJAEHYgPtHbLfZNVuoc5X2', content: 'test'})
  console.assert(post.toString() === '{"id":"foo","content":"bar"}', 'Post serialization failed.')
  console.assert(post.avatar === 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc2NCcgaGVpZ2h0PSc2NCcgc3R5bGU9J2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwwKTsnPjxnIHN0eWxlPSdmaWxsOnJnYmEoMjU1LDI1NSwyNTUsMSk7IHN0cm9rZTpyZ2JhKDI1NSwyNTUsMjU1LDEpOyBzdHJva2Utd2lkdGg6MC4zMjsnPjxyZWN0ICB4PScyOScgeT0nMjknIHdpZHRoPSc2JyBoZWlnaHQ9JzYnLz48cmVjdCAgeD0nMjknIHk9JzM1JyB3aWR0aD0nNicgaGVpZ2h0PSc2Jy8+PHJlY3QgIHg9JzI5JyB5PSc0MScgd2lkdGg9JzYnIGhlaWdodD0nNicvPjxyZWN0ICB4PScyMycgeT0nMjMnIHdpZHRoPSc2JyBoZWlnaHQ9JzYnLz48cmVjdCAgeD0nMzUnIHk9JzIzJyB3aWR0aD0nNicgaGVpZ2h0PSc2Jy8+PHJlY3QgIHg9JzIzJyB5PScyOScgd2lkdGg9JzYnIGhlaWdodD0nNicvPjxyZWN0ICB4PSczNScgeT0nMjknIHdpZHRoPSc2JyBoZWlnaHQ9JzYnLz48cmVjdCAgeD0nMjMnIHk9JzM1JyB3aWR0aD0nNicgaGVpZ2h0PSc2Jy8+PHJlY3QgIHg9JzM1JyB5PSczNScgd2lkdGg9JzYnIGhlaWdodD0nNicvPjxyZWN0ICB4PScyMycgeT0nNDEnIHdpZHRoPSc2JyBoZWlnaHQ9JzYnLz48cmVjdCAgeD0nMzUnIHk9JzQxJyB3aWR0aD0nNicgaGVpZ2h0PSc2Jy8+PHJlY3QgIHg9JzE3JyB5PScxNycgd2lkdGg9JzYnIGhlaWdodD0nNicvPjxyZWN0ICB4PSc0MScgeT0nMTcnIHdpZHRoPSc2JyBoZWlnaHQ9JzYnLz48cmVjdCAgeD0nMTcnIHk9JzIzJyB3aWR0aD0nNicgaGVpZ2h0PSc2Jy8+PHJlY3QgIHg9JzQxJyB5PScyMycgd2lkdGg9JzYnIGhlaWdodD0nNicvPjxyZWN0ICB4PScxNycgeT0nMjknIHdpZHRoPSc2JyBoZWlnaHQ9JzYnLz48cmVjdCAgeD0nNDEnIHk9JzI5JyB3aWR0aD0nNicgaGVpZ2h0PSc2Jy8+PHJlY3QgIHg9JzE3JyB5PSczNScgd2lkdGg9JzYnIGhlaWdodD0nNicvPjxyZWN0ICB4PSc0MScgeT0nMzUnIHdpZHRoPSc2JyBoZWlnaHQ9JzYnLz48cmVjdCAgeD0nMTcnIHk9JzQxJyB3aWR0aD0nNicgaGVpZ2h0PSc2Jy8+PHJlY3QgIHg9JzQxJyB5PSc0MScgd2lkdGg9JzYnIGhlaWdodD0nNicvPjwvZz48L3N2Zz4=', 'Post avatar generation failed.')
  const channel = new Channel({name: 'test', key: 'test'})
  console.assert(channel.toString() === '{"name":"test","key":"test"}', 'Channel serialization failed.')
  console.assert(channel.code === 'space.scio.p2pchat.channel.test.test', 'Channel code failed to be generated')
  const app = new App(node)
  app.joinChannel({name: 'global', key: 'global'})
  console.assert(app.activeChannel.name === 'global', 'App could not join channel.')
  app.sendPost({content: 'test'})
  console.assert(document.querySelector('#app-chats .app-chat.own:last-child .app-chat__content').innerText === 'test', 'App could not exchange posts.')
}
