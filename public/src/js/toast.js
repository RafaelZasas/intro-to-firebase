/**
 * Displays a dismissable message in the bottom-right corner of the screen
 * @param {string} message Message to display in the toast 
 * @param {'primary'|'info'|'error'|'success'|'warning'|'danger'} type The type of toast to display
 */
function showToast(message, type) {
    const toastNode = document.createElement('div')
    toastNode.innerHTML = `
    <div class="notification is-${type}" style="position: fixed; bottom: 1em; left: 1em;">
        <button class="delete" onclick="this.parentNode.remove()"></button>
        ${message}
    </div>`
    document.body.appendChild(toastNode)
    setTimeout(() => toastNode.remove(), 5000)
}
