# Guía de Resolución de Errores: Phaser Editor + Código Manual

Esta guía documenta los **conflictos recurrentes** que ocurren al mezclar Phaser Editor con lógica manual, y **cómo resolverlos permanentemente**.

---

## 🚨 Top 4 Errores Recurrentes y Soluciones

### 1. Error: "Texture not found" (Rutas Incorrectas)
**El problema:** Phaser dice que falta una imagen, aunque el código de carga parece bien.
**La causa:** A menudo los assets están dispersos en carpetas diferentes (`assets/platform`, `assets/backgroundObjects`) pero en el código intentamos cargarlos todos desde una sola ruta genérica (`assets/background`).
**Solución:**
1.  No asumas la ruta. Verifica dónde está **físicamente** el archivo.
2.  En `preload()`, sé explícito con la ruta real:
    ```javascript
    // ❌ Mal: Asumir que todo está en background
    this.load.image("baranda", "src/assets/background/baranda.png"); 
    
    // ✅ Bien: Verificar ruta real
    this.load.image("baranda", "src/assets/platform/baranda.png");
    ```

### 2. Error: Objetos pequeños o desplazados (Desajuste de Resolución)
**El problema:** El juego se ve bien en Phaser Editor, pero en el navegador se ve pequeño o centrado incorrectamente con mucho espacio negro.
**La causa:** `main.js` define una resolución (ej. 1400x600) diferente a la que usaste para diseñar en el editor (ej. 800x600).
**Solución:**
1.  **Alinea las resoluciones:** Asegúrate de que tu escena en Phaser Editor tenga el mismo tamaño que `main.js`.
2.  **Ajuste Manual Rápido:** Si no puedes cambiar el editor, recálcula el centro y la escala en código:
    ```javascript
    // Si la pantalla es 1400 ancho, el centro es 700
    const background = this.add.image(700, 300, "bg");
    
    // Escalar para cubrir diferencia (1400 / 800 = ~1.75)
    background.setScale(1.75); 
    ```

### 3. Error: `ReferenceError: Cannot access 'X' before initialization`
**El problema:** El juego crashea al iniciar.
**La causa:** Conflicto de nombres. Creas una constante con el mismo nombre que la Clase.
**Solución:**
Usar `this.` y nombres distintos.
```javascript
// ❌ Mal
const platform_prefab = new platform_prefab(this, x, y);

// ✅ Bien
this.platform = new platform_prefab(this, x, y);
```

### 4. Error: Personaje cae al infinito (Físicas Estáticas)
**El problema:** Las plataformas creadas visualmente se caen o el personaje las atraviesa.
**La causa:** Phaser Editor crea imágenes simples por defecto, o les damos físicas dinámicas (con gravedad).
**Solución:**
Configura explícitamente la inmovilidad para suelos/paredes:
```javascript
this.platform.body.setImmovable(true);   // No se mueve al chocar
this.platform.body.allowGravity = false; // No se cae
```

---

## 🛠️ Estructura "A Prueba de Balas" para `battle.js`

Cada vez que toques la escena, verifica que cumpla este patrón:

```javascript
class battle extends Phaser.Scene {
    constructor() { super("battle"); }

    // 1️⃣ PRELOAD: OBLIGATORIO. Verifica rutas aquí.
    preload() {
        this.load.image("bg", "src/assets/ruta/correcta/bg.png");
        this.load.pack("hornet", "src/assets/hornet/pack.json");
    }

    // 2️⃣ EDITORCREATE: Generado, pero editado para usar 'this'.
    editorCreate() {
        // Fondo centrado
        const bg = this.add.image(700, 300, "bg"); // Ajustar a config.width / 2
        bg.setScale(1.5); // Ajustar si es necesario

        // Plataformas: Usar 'this' y configurar físicas
        this.platform = new platform_prefab(this, 700, 580);
        this.add.existing(this.platform);
        this.platform.body.setImmovable(true);
        this.platform.body.allowGravity = false;

        // Personaje: Usar 'this'
        this.player = new hornetPrefab(this, 100, 500);
        this.add.existing(this.player);

        // Colisiones
        this.physics.add.collider(this.player, this.platform);
    }

    // 3️⃣ CREATE: Inicialización lógica
    create() {
        this.editorCreate();
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Físicas del jugador
        this.player.setGravityY(500);
    }

    // 4️⃣ UPDATE: Bucle de juego
    update() {
        // Necesitas 'this.player' aquí, por eso lo definimos arriba
        this.player.update();
        
        // Input manual para saltar (evita bucles de animación)
        if (this.cursors.up.isDown && this.player.body.onFloor()) {
             this.player.setVelocityY(-400);
             this.player.playJump();
        }
    }
}
```

---

## ✅ Checklist de Verificación Final
Antes de decir "ya está listo", revisa:
- [ ] ¿Están todas las rutas de imágenes verificadas en `src/assets/...`?
- [ ] ¿El fondo cubre toda la pantalla (1400px)?
- [ ] ¿`platform` y `player` usan `this.`?
- [ ] ¿La plataforma tiene `setImmovable(true)`?
- [ ] ¿`preload()` está cargando todo lo que usas?
