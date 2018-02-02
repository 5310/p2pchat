import pify from 'pify'
import PeerInfo from 'peer-info'
import Node from './node'
import FloodSub from 'libp2p-floodsub'
const createPeerInfo = pify(PeerInfo.create)

export default async function createNode () {
  const peerId = window.localStorage.getItem('peerId')
  const peerInfo = peerId ? await createPeerInfo(JSON.parse(peerId)) : await createPeerInfo()
  window.localStorage.setItem('peerId', JSON.stringify(peerInfo.id.toJSON()))

  const peerIdStr = peerInfo.id.toB58String()
  const ma = `/dns4/star-signal.cloud.ipfs.team/tcp/443/wss/p2p-webrtc-star/ipfs/${peerIdStr}`
  peerInfo.multiaddrs.add(ma)

  const node = new Node(peerInfo)
  node.pubsub = new FloodSub(node)
  node.pubsub.start((err) => {
    if (err) return console.error('PubSub failed to start.')
  })

  return node
}
