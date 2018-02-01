import Post from './post'
// import Channel from './channel'
import template from './template'

const namespace = 'space.scio.p2pchat'
const $channelInfo = document.getElementById('app-channel-info')

export default class App {
  constructor (node) {
    /* Actual app stuff */
    this.node = node
    this.channels = new Set()
    this.update()

    /* Setup UI stuff */

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
  }
  get activeChannelCode () {
    return this.activeChannel ? namespace + this.activeChannel.name + this.activeChannel.key : undefined
  }
  joinChannel (channel) {
    this.activeChannel = channel
    if (!this.channels.has(channel)) {
      this.channels.add(this.activeChannel)
      // TODO: Save channels to localStorage
      this.node.pubsub.subscribe(this.activeChannelCode)
      this.node.pubsub.on(
        this.activeChannelCode,
        (msg) => this.receivePost(Post.fromString(msg.data.toString()))
      )
    }
    this.update()
  }
  leaveChannel () {
    this.channels.remove(this.activeChannel)
    this.activeChannel = Array.from(this.channels)[0]
    // TODO: Save channels to localStorage
    this.update()
  }
  update () {
    if (this.activeChannel) {
      $channelInfo.classList.remove('hide')
      // TODO: update chats
      // TODO: update channels
    } else $channelInfo.classList.add('hide')
  }
  sendPost (post) {
    if (this.activeChannel) {
      this.node.pubsub.publish(
        this.activeChannelCode,
        Buffer.from(post.toString()),
      )
    }
  }
  receivePost (post) {
    console.debug('Received:', post)
    if (this.activeChannel) {
      const $chats = document.getElementById('app-chats')
      const $newestChat = $chats.querySelector('.app-chat:last-child')
      if (!$newestChat || $newestChat.dataset.appChatId !== post.id) {
        const $templateChat = document.querySelector('template#app-chat')
        $chats.appendChild(template($templateChat, post))
        if (post.id === this.node.id) $chats.querySelector('.app-chat:last-child').classList.add('own')
      } else {
        const $templateChatContent = document.querySelector('template#app-chat__content')
        $newestChat.querySelector('.app-chat__contents').appendChild(template($templateChatContent, post))
      }
    }
  }
}
