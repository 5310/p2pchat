export default class Channel {
  constructor (channel) {
    if (channel) {
      this.name = channel.name
      this.key = channel.key
    }
  }
  toString () {
    return JSON.stringify(this)
  }
  static fromString (string) {
    return new Channel(JSON.parse(string))
  }
}
