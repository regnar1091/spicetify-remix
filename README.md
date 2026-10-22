# spicetify-remix

Extensión de [Spicetify](https://spicetify.app) que agrega un **Remix mode**:
reproduce un fragmento de cada canción y las encadena con fades.

## Instalación
1. Copia `remix.js` a tu carpeta de extensiones de Spicetify
   (`%appdata%\spicetify\Extensions` en Windows, `~/.config/spicetify/Extensions` en Linux/macOS).
2. Ejecuta:
   ```
   spicetify config extensions remix.js
   spicetify apply
   ```
3. En Spotify, menú de perfil → **Remix mode**.

## Configuración
Edita `cfg` al inicio de `remix.js`: `segmentSec`, `startRatio`, `fadeMs`.

## Limitaciones
Spotify no da acceso al audio crudo, así que no hay mezcla real con dos
canciones sonando a la vez ni beatmatching. Esto trabaja con seek, volumen y next().

## Roadmap
- [ ] Ajustes desde la UI
- [ ] Detectar el estribillo con audio analysis
- [ ] Botón en la barra del reproductor
