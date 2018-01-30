import createNode from './create-node.js'

export default async function init () {
  const node = await createNode()

  node.start((err) => {
    if (err) return console.error('WebRTC not supported')

    const idStr = node.peerInfo.id.toB58String()
    console.log('Node is listening o/')

    // DEBUG: Mock
    const $id = document.createTextNode('Node is ready. ID: ' + idStr)
    document.querySelector('#debug .debug__node').append($id)
    const channel = 'test'
    node.pubsub.subscribe(channel)
    node.pubsub.on(channel, (msg) => console.log(msg.from, msg.data.toString()))
    setInterval(() => node.pubsub.publish(channel, Buffer.from('Hullo!')), 1000)
  })

  node.on('peer:discovery', (peerInfo) => {
    const idStr = peerInfo.id.toB58String()
    console.debug('Discovered: ' + idStr)
    node.dial(peerInfo, (err, conn) => {
      if (err) return console.warn('Failed to dial:', idStr)
    })
  })
  node.on('peer:connect', (peerInfo) => {
    const idStr = peerInfo.id.toB58String()
    console.log('Got connection to: ' + idStr)
    // DEBUG: Mock
    const $connPeer = document.createElement('div')
    $connPeer.innerHTML = 'Connected to: ' + idStr
    $connPeer.id = idStr
    document.querySelector('#debug .debug__peers').append($connPeer)
  })
  node.on('peer:disconnect', (peerInfo) => {
    const idStr = peerInfo.id.toB58String()
    console.log('Lost connection to: ' + idStr)
    // DEBUG: Mock
    document.getElementById(idStr).remove()
  })

  return node
}
