function showToast(message, type) {
    const toastNode = document.createElement('div')
    toastNode.innerHTML = `
    <div class="notification is-${type}" style="position: fixed; bottom: 1em; right: 1em;">
        <button class="delete"></button>
        ${message}
    </div>
    `
    document.body.appendChild(toastNode)
}