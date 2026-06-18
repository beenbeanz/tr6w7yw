export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) {
    const map: Record<string, string> = {
      '/':          'url("/bg0.png")',
      '/dress_up':  'url("/insideBg.png")',
      '/share':     '',   // share.vue manages its own dynamically
      '/sign_up':   'url("/bg0.png")',
      '/user_account':   'url("/bg0.png")',
    }

    const bg = map[to.path]
    if (bg !== undefined) {
      document.body.style.backgroundImage = bg
      document.body.style.backgroundColor = ''
    }
  }
})