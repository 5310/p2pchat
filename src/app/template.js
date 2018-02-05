function getPropertyRecursively (object, properties) {
  if (properties.length === 1) {
    return object[properties[0]]
  } else {
    return getPropertyRecursively(object[properties[0]], properties.slice(1))
  }
}

function setPropertyRecursively (object, properties, value) {
  if (properties.length === 1) {
    object[properties[0]] = value
  } else {
    setPropertyRecursively(object[properties[0]], properties.slice(1), value)
  }
}

export default function template ($template, data) {
  if ($template.tagName !== 'TEMPLATE') throw new Error('Template element invalid.')

  const element = $template.content.cloneNode(true)
  const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, () => NodeFilter.FILTER_ACCEPT)

  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode
    for (let bindAttr in node.dataset) {
      let isBindableAttr = (bindAttr.indexOf('bind_') === 0)
      if (isBindableAttr) {
        const dataKeys = node.dataset[bindAttr].split('.')
        const bindKeys = bindAttr.substr(5).split('.')
        setPropertyRecursively(node, bindKeys, getPropertyRecursively(data, dataKeys))
      }
    }
  }

  return element
}
