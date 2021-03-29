export function groupBy(key: any) {
  return function group(array: any[]) {
    return array.reduce((acc: any, obj: any) => {
      const property = obj[key]
      acc[property] = acc[property] || []
      acc[property].push(obj)
      return acc
    }, {})
  }
}
