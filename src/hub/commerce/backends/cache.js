let cache = {}

module.exports = {
    get: url => {
        return cache[url]
    },
    set: (url, response) => {
        cache[url] = response
    }
}