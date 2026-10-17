# Unforgettable Birthdays — prototipo HTML

Prototipo clickeable de diseño de la app de iPhone (datos de ejemplo, sin backend).
Sitio estático: `index.html` + `styles.css` + `app.js`, sin build.

**Ver:** https://sw413sg.github.io/cumpleanos-prototipo/

- `?pantalla=onboarding` abre la bienvenida, `?pantalla=paywall` abre el desbloqueo.
- Cada pantalla de `app.js` está pensada para pasarse 1:1 a una View de SwiftUI
  (stack por pestaña = `NavigationStack`, overlays = `.sheet` / `.fullScreenCover`).
