
# Guía de Procesamiento de Sprites: Rim Lighting & Integración Atmosférica (Estilo Silksong)

Esta guía establece los parámetros técnicos para procesar sprites de personajes (ej. Hornet o Lace) y asegurar su correcta integración visual en entornos de alto contraste, específicamente para fondos de incendios urbanos (Petare en llamas).

## 1. Concepto Visual: Rim Lighting (Luz de Contorno)
El **Rim Lighting** es esencial para separar al personaje del fondo oscuro y simular que la luz del incendio impacta en su silueta.

### Especificaciones de Color (Paleta Ígnea)
* **Highlight Primario (Bordes):** `#FF4400` (Naranja intenso) a `#FFCC00` (Amarillo fuego).
* **Luz Ambiental (Tinte):** `#552200` (Marrón rojizo profundo) para las sombras.

## 2. Instrucciones para la IA de Generación/Edición
Al solicitar retoques o nuevos frames, utiliza las siguientes directrices:

* **Direccionalidad:** La luz debe ser **trasera-lateral**. Los bordes externos del sprite deben tener una línea de luz vibrante, mientras que el centro del personaje permanece en sombra relativa para mantener el drama.
* **Contraste:** Mantener negros profundos en las zonas donde la luz no llega. Evitar degradados suaves; preferir bordes afilados (cel shading o pintura digital definida).
* **Interacción de Materiales:** * La máscara blanca de Hornet debe reflejar el naranja con alta intensidad.
    * La capa roja debe absorber más la luz, mostrando un brillo más difuso y rojizo.



## 3. Implementación Técnica en Phaser (TypeScript)
Para un estudiante de ingeniería que ya maneja TypeScript, la integración debe hacerse vía código para permitir dinamismo:

### A. Uso de FX Glow (Phaser 3.60+)
```typescript
// Aplicar brillo exterior dinámico
player.postFX.addGlow(0xff4400, 2, 0); 

```

### B. Mapeo de Tintes Asimétricos

Simula que la luz del suelo (fuego) es más fuerte que la luz superior:

```typescript
// Colores: Superior-Izquierda, Superior-Derecha, Inferior-Izquierda, Inferior-Derecha
player.setTint(0xffffff, 0xffaa00, 0xffffff, 0xff4400); 

```

## 4. Checklist de Calidad

1. **¿El sprite se "separa" del fondo?** Si se pierde en la oscuridad de los edificios, aumenta el grosor del Rim Light.
2. **¿Hay consistencia?** Todos los sprites de la secuencia de animación deben tener el brillo en el mismo ángulo.
3. **¿El brillo parpadea?** (Opcional) Implementar un `tween` en el Alpha del resplandor para simular la inestabilidad de las llamas.

---
