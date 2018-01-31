const namespace = 'space.scio.p2pchat'
const $channelInfo = document.getElementById('app-channel-info')

export default class App {
  constructor (node) {
    this.node = node

    // Setup UI stuff

    // Hide loader
    document.getElementById('loading').classList.add('hide')

    // Hook-up profile
    const $profile = document.querySelector('.app-profile')
    $profile.querySelector('.app__id').innerHTML = this.node.id
    const updatePeers = () => {
      $profile.querySelector('.app__peercount').innerHTML = this.node.peers
    }
    this.node.on('peer:connect', updatePeers)
    this.node.on('peer:disconnect', updatePeers)

    // Hook-up dialogs
    Array.from(document.querySelectorAll('[data-dialog-open]')).forEach(($e) =>
      $e.addEventListener('click', (ev) => {
        ev.preventDefault()
        // For some reason, <i>s always intercept this event if any :|
        if (ev.target.tagName.toLowerCase() === 'i') document.getElementById(ev.target.parentNode.dataset.dialogOpen).showModal()
        else document.getElementById(ev.target.dataset.dialogOpen).showModal()
      })
    )
    Array.from(document.querySelectorAll('[data-dialog-close]')).forEach(($e) =>
      $e.addEventListener('click', (ev) => {
        document.getElementById(ev.target.dataset.dialogClose).close()
        ev.preventDefault()
      })
    )

    // Actual app stuff

    this.channels = new Set()
    this.channels.add({name: 'test', key: 'test'}) // DEBUG:
    // TODO: Load localStored channels list
    this.activeChannel = Array.from(this.channels)[0]
    this.render()
  }
  joinChannel (channel) {
    this.channels.add(channel)
    this.activeChannel = channel
    // TODO: Save channels to localStorage
    this.render()
  }
  leaveChannel () {
    this.channels.remove(this.activeChannel)
    this.activeChannel = Array.from(this.channels)[0]
    // TODO: Save channels to localStorage
    this.render()
  }
  render () {
    if (this.activeChannel) {
      $channelInfo.classList.remove('hide')
      // DEBUG: Mock
      const channel = namespace + this.activeChannel.name + this.activeChannel.key
      this.node.pubsub.subscribe(channel)
      this.node.pubsub.on(channel, (msg) => console.log(msg.from, msg.data.toString()))
      setInterval(() => this.node.pubsub.publish(channel, Buffer.from('Hullo!')), 1000)
      // TODO: render chats
      // TODO: render channels
    } else $channelInfo.classList.add('hide')
  }
  sendPost () {}
  receivePost () {}
}
