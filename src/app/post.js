export default class Post {
  constructor (post) {
    if (post) {
      this.id = post.id
      this.content = post.content
      // NOTE: timestamp?
    }
  }
  toString () {
    return JSON.stringify(this)
  }
  static fromString (string) {
    return new Post(JSON.parse(string))
  }
}