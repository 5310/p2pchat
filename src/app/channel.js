const namespace = 'space.scio.p2pchat'

export default class Channel {
  constructor (channel) {
    if (channel) {
      this.name = channel.name
      this.key = channel.key
    }
  }
  get code () {
    return `${namespace}.channel.${this.name}.${this.key}`
  }
  toString () {
    return JSON.stringify(this)
  }
  static fromString (string) {
    return new Channel(JSON.parse(string))
  }
}
