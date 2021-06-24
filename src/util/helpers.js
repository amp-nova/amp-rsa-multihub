String.prototype.stripHTML = function() {
    return this.replace(/(<([^>]+)>)/gi, "")
}