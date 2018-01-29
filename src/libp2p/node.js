import WebRTCStar from 'libp2p-webrtc-star'
import WebSockets from 'libp2p-websockets'
import Multiplex from 'libp2p-multiplex'
import SECIO from 'libp2p-secio'
import libp2p from 'libp2p'

export default class Node extends libp2p {
  constructor (peerInfo) {
    const wstar = new WebRTCStar()
    super({
      transport: [
        wstar,
        new WebSockets(),
      ],
      connection: {
        muxer: [Multiplex],
        crypto: [SECIO], // NOTE: Can be removed to simplify the prohect :]
      },
      discovery: [
        wstar.discovery,
      ]
    }, peerInfo)
  }
}
