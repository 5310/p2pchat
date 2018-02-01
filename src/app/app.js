import Post from './post'
import Channel from './channel'
import template from './template'

export default class App {
  constructor (node) {
    /* Actual app stuff */
    this.node = node
    this.channels = new Set()
    // TODO: Load channels from localStorage
    // TODO: Join channel frm query-string
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

    // // Hook-up chat posts
    const $postInput = document.getElementById('app-post-input')
    const $postSend = document.getElementById('app-post-send')
    $postSend.addEventListener('click', (ev) => {
      this.sendPost({ content: $postInput.value })
      $postInput.value = ''
      $postInput.focus()
      ev.preventDefault()
    })
    $postInput.addEventListener('keyup', (ev) => {
      if (ev.keyCode === 13) {
        $postSend.click()
      }
    })

    // TODO: Hook-up channel input
    const $channelJoinName = document.getElementById('app-channel-name')
    const $channelJoinKey = document.getElementById('app-channel-key')
    const $channelJoinOk = document.getElementById('app-channel-join-ok')
    $channelJoinOk.addEventListener('click', (ev) => {
      this.joinChannel({name: $channelJoinName.value, key: $channelJoinKey.value})
      $channelJoinName.value = ''
      $channelJoinKey.value = ''
    })
    const simulateJoinDialogClosure = (ev) => {
      if (ev.keyCode === 13) {
        $channelJoinOk.click()
      }
    }
    $channelJoinName.addEventListener('keyup', simulateJoinDialogClosure)
    $channelJoinKey.addEventListener('keyup', simulateJoinDialogClosure)
  }

  joinChannel ({name, key}) {
    this.activeChannel = new Channel({name, key})
    if (!this.channels.has(this.activeChannel)) {
      this.channels.add(this.activeChannel)
      // TODO: Save channels to localStorage
      this.node.pubsub.subscribe(this.activeChannel.code)
      this.node.pubsub.on(
        this.activeChannel.code,
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
      /* Chats */
      document.getElementById('app-channel-info').classList.remove('hide')

      const $chats = document.querySelector('#app-chats .app-chats__contents')
      $chats.innerHTML = ''
      document.getElementById('app-post-input').focus()

      // TODO: Load chats from localStorage

      /* Channels */

      document.getElementById('app-channel-label').innerText = '#' + this.activeChannel.name

      const $channels = document.querySelector('#app-channels .app-channels__contents')
      const $templateChannel = document.querySelector('template#app-channel')
      $channels.innerHTML = ''
      Array.from(this.channels).forEach((channel) => {
        $channels.appendChild(template($templateChannel, channel))
      })
      $channels.querySelector(
        `[data-app-channel-name="${this.activeChannel.name}"][data-app-channel-key="${this.activeChannel.key}"]`
      ).classList.add('active')
      Array.from($channels.querySelectorAll('.app-channel')).forEach(($e) =>
        $e.addEventListener('click', (ev) => {
          const channel = Array.from(this.channels)
            .filter((channel) =>
              ev.target.dataset.appChannelName === channel.name &&
              ev.target.dataset.appChannelKey === channel.key)[0]
          this.joinChannel(channel)
          ev.preventDefault()
          // Simulates sidebar closure
          const $obfuscator = document.querySelector('.mdl-layout__obfuscator')
          if ($obfuscator.classList.contains('is-visible')) { document.querySelector('.mdl-layout__obfuscator').click() }
        })
      )
    } else document.getElementById('app-channel-info').classList.add('hide')
  }

  sendPost ({ id = this.node.id, code = this.activeChannel.code, content }) {
    if (this.activeChannel) {
      this.node.pubsub.publish(
        this.activeChannel.code,
        Buffer.from(new Post({ id, code, content }).toString()),
      )
    }
  }

  receivePost (post) {
    console.debug('Received:', post)
    // TODO: localStore chats
    // Render chat
    if (this.activeChannel && this.activeChannel.code === post.code) {
      const $chats = document.querySelector('#app-chats .app-chats__contents')
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
