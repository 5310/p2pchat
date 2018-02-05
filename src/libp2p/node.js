import WebRTCStar from 'libp2p-webrtc-star'
import WebSockets from 'libp2p-websockets'
import Multiplex from 'libp2p-multiplex'
import libp2p from 'libp2p'

export default class Node extends libp2p {
  constructor (peerInfo) {
    const webrtcstar = new WebRTCStar()
    super({
      transport: [
        webrtcstar,
        new WebSockets(),
      ],
      connection: {
        muxer: [Multiplex],
      },
      discovery: [
        webrtcstar.discovery,
      ]
    }, peerInfo)
  }
}
