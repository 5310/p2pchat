import Identicon from 'identicon.js'

export default class Post {
  constructor (post) {
    if (post) {
      this.id = post.id
      this.content = post.content
      this.code = post.code
      // NOTE: Consider timestamp?
    }
  }
  get avatar () {
    return Post.generateAvatar(this.id)
  }
  toString () {
    return JSON.stringify(this)
  }
  static fromString (string) {
    return new Post(JSON.parse(string))
  }
  static generateAvatar (id) {
    // NOTE: It actualyl wants a hexadecimal string, but we've collapsed already so /shrug
    return 'data:image/svg+xml;base64,' + new Identicon(id.slice(8), {
      foreground: [255, 255, 255, 255],
      background: [0, 0, 0, 0],
      margin: 0.25,
      format: 'svg',
    }).toString()
  }
}
