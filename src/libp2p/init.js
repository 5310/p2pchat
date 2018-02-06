import Node from './node.js'

export default async function init () {
  const node = await Node.create()

  node.peers = 0

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
    node.peers++
  })
  node.on('peer:disconnect', (peerInfo) => {
    const idStr = peerInfo.id.toB58String()
    console.log('Lost connection to: ' + idStr)
    // DEBUG: Mock
    document.getElementById(idStr).remove()
    node.peers--
  })

  await new Promise((resolve, reject) => {
    node.start((err) => {
      if (err) return console.error('WebRTC not supported')
      console.log('Node is listening o/')
      node.id = node.peerInfo.id.toB58String()
      const $id = document.createTextNode('Node is ready. ID: ' + node.id)
      document.querySelector('#debug .debug__node').append($id)
      resolve()
    })
  })

  return node
}
