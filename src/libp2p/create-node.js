import pify from 'pify'
import PeerInfo from 'peer-info'
import Node from './node'
import FloodSub from 'libp2p-floodsub'
const createPeerInfo = pify(PeerInfo.create)

export default async function createNode () {
  const peerId = window.localStorage.getItem('peerId')
  const peerInfo = peerId ? await createPeerInfo(JSON.parse(peerId)) : await createPeerInfo()
  if (!peerInfo) throw new Error('PerrInfo could not be generated.')
  window.localStorage.setItem('peerId', JSON.stringify(peerInfo.id.toJSON()))

  const peerIdStr = peerInfo.id.toB58String()
  peerInfo.multiaddrs.add(`/dns4/star-signal.cloud.ipfs.team/tcp/443/wss/p2p-webrtc-star/ipfs/${peerIdStr}`)

  const node = new Node(peerInfo)
  if (!node) throw new Error('LibP2P node could not be initialized.')
  node.pubsub = new FloodSub(node)
  node.pubsub.start((err) => {
    if (err) throw new Error('PubSub failed to start.')
  })

  return node
}
