
# Guía de Implementación: Sistema de Partículas Atmosféricas (Cenizas y Chispas)

Esta guía detalla el flujo de trabajo para integrar assets de partículas generados por IA en un entorno de **TypeScript** y **Phaser 3**, optimizando el rendimiento para tu duelo en la autopista de Petare.

---

## 1. Preparación del Asset (Slicing)

La IA genera una "hoja" con varios puntos. Como ingeniero, debes decidir el método de carga:

* **Opción A (Sencilla):** Cargar la imagen como un `spritesheet` si las partículas están alineadas en una cuadrícula.
* **Opción B (Profesional):** Usar un **Texture Atlas** (JSON) para definir cada partícula individualmente. Esto es más eficiente si las formas son irregulares.

```typescript
// En tu escena (preload)
this.load.spritesheet('vfx_particles', 'assets/vfx/particles.png', {
    frameWidth: 16,
    frameHeight: 16
});

```

---

## 2. Configuración de Emisores en Phaser

Para lograr la atmósfera de incendio, necesitamos dos comportamientos distintos: uno para las **Cenizas** (pesadas y lentas) y otro para las **Chispas** (ligeras y erráticas).

### A. Emisor de Cenizas (Ash)

Simula restos quemados flotando en el aire.

```typescript
const ashEmitter = this.add.particles(0, 0, 'vfx_particles', {
    frame: [0, 1, 2], // Selecciona frames de ceniza
    x: { min: 0, max: 1280 },
    y: -20,
    lifespan: 5000,
    speedX: { min: -150, max: -50 }, // Viento hacia la izquierda
    speedY: { min: 20, max: 100 },
    scale: { start: 0.5, end: 0 },
    alpha: { start: 0.6, end: 0 },
    rotate: { min: 0, max: 360 }, // Giro aleatorio
    frequency: 100,
    blendMode: 'NORMAL'
});

```

### B. Emisor de Chispas Incandescentes (Sparks)

Simula material ardiendo que sube por la convección del calor del incendio de fondo.

```typescript
const sparkEmitter = this.add.particles(0, 0, 'vfx_particles', {
    frame: [3, 4], // Selecciona frames de chispas
    emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(0, 600, 1280, 120) },
    lifespan: 1200,
    speedY: { min: -200, max: -400 }, // Suben rápido por el calor
    speedX: { min: -50, max: 50 },
    scale: { start: 1, end: 0 },
    tint: [0xffcc00, 0xff4400, 0xff0000], // Degradado de calor
    blendMode: 'ADD', // Brillo intenso
    alpha: { start: 1, end: 0 }
});

```

---

## 3. Composición y Profundidad (Z-Index)

Como estás diseñando un entorno con múltiples capas de profundidad para tu proyecto universitario, el orden de las partículas es vital:

1. **Capa Trasera (Depth 5):** Cenizas grandes y oscuras (detrás de los edificios quemados).
2. **Capa Media (Depth 15):** Chispas pequeñas y brillantes (detrás de Hornet).
3. **Capa Frontal (Depth 30):** Ráfagas de viento y humo (delante de todo, tapando parcialmente la pantalla).

```typescript
ashEmitter.setDepth(5);
sparkEmitter.setDepth(20); // Delante de Hornet para que interactúen visualmente

```

---

## 4. Optimización de Ingeniería

Dado que eres estudiante de computación, considera estos puntos de rendimiento:

* **Pool de Objetos:** Phaser gestiona automáticamente el reciclaje de partículas; evita crear múltiples emisores si puedes usar `emitZone`.
* **Update Tick:** No actualices la lógica de las partículas en el `update()` de la escena; deja que el motor de partículas interno de Phaser se encargue vía GPU.
* **Culling:** Asegúrate de que las partículas mueran (`lifespan`) poco después de salir de los límites de la cámara para liberar memoria.

---

## 5. El Toque Final: Reacción al Movimiento

Para que se sienta como un juego AAA, haz que las partículas reaccionen a las habilidades de Hornet.

```typescript
// Si Hornet hace un dash
if (isDashing) {
    ashEmitter.applyForce(new Phaser.Math.Vector2(500, 0)); // El aire se desplaza
}

```
