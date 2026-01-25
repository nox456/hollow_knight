# 🏛️ Arquitectura de Desarrollo: Clon de Silksong (Phaser 3 + JS)

Este documento resume la estructura modular para el desarrollo de **Hornet**, enfocada en la escalabilidad, el mantenimiento y la separación de responsabilidades (SOLID).

---

## 1. El Paradigma: Composición sobre Herencia
En lugar de crear una clase gigante para Hornet, utilizamos una **Arquitectura Basada en Componentes**. 

* **Entidad (Hornet):** Es el "chasis" o contenedor. No tiene lógica de negocio, solo orquesta.
* **Componentes:** Módulos de lógica pura (Salud, Movimiento, Input).
* **Estados (FSM):** El contexto actual del personaje (Idle, Dash, Attack).

---

## 2. Construcción de la Entidad (Hornet)
La entidad debe instanciar sus componentes en el constructor y pasarse a sí misma (`this`) como referencia. Esto crea un **enlace bidireccional**.

### Estructura del Constructor (Hornet.js)
1. **Físicas:** Activar `scene.physics.add.existing(this)`.
2. **Componentes:** Instanciar `Movement`, `Health`, e `Input`.
3. **Mente (FSM):** Instanciar la `StateMachine` pasando la referencia de la entidad.



---

## 3. Lógica de Comunicación: "La Referencia al Dueño"
La duda común es: *¿Cómo sabe el Estado que existe el Movimiento?*

* **Enlace:** Al crear un Estado, la FSM le pasa la instancia de Hornet (`owner`).
* **Acceso:** El Estado accede a los "hermanos" componentes a través del dueño: `this.owner.movement.applyDash()`.
* **Beneficio:** No necesitas pasar 10 parámetros al estado; con el `owner` tienes acceso a todo el "hardware" de Hornet.

---

## 4. El Ciclo de Vida (Update Loop)
Para mantener el rendimiento óptimo en tu proyecto universitario:

1. **Entidad (`preUpdate`):** Solo llama al `update` de la Máquina de Estados.
2. **StateMachine:** Llama al `update` del **Estado Activo**.
3. **Estado Activo:** Lee el `InputComponent` y le dice al `MovementComponent` qué hacer.
4. **VFX:** Los efectos (cenizas, chispas) no se procesan aquí; escuchan **Eventos** (`this.scene.events.on`) para no saturar el hilo principal.

---

## 5. Guía de Refactorización (Tips de Ingeniería)

Si decides limpiar tu código actual, sigue este checklist:

* **Separar el Input:** El componente de movimiento **no** debe leer el teclado. Debe recibir órdenes (`moveLeft()`, `jump()`). Esto permitirá que Lace use el mismo componente de movimiento pero controlado por una IA.
* **Diccionario de Estados:** No uses Strings sueltos para los estados. Crea un objeto constante:
  ```javascript
  const HORNET_STATES = { IDLE: 'idle', DASH: 'dash', HURT: 'hurt' };

```

* **Eventos para el Feedback:** Si Hornet recibe daño, el `HealthComponent` no debe cambiar la animación. Debe emitir un evento `"PLAYER_HURT"`. El `VFXManager` y el `AnimationComponent` reaccionarán a ese evento de forma independiente.
* **Configuración Centralizada:** Mueve todas las constantes (velocidad de dash, fuerza de salto) a un archivo `Config.js`. Esto facilita el balanceo del juego sin buscar entre miles de líneas de código.

---

## 6. Consideraciones con Phaser Editor

* **Prefabs:** Mantén a Hornet como un Prefab independiente.
* **User Components:** Utiliza la pestaña de componentes del editor para asignar el script de `HealthComponent` o `MovementComponent` visualmente, pero mantén la lógica lógica de enlace en el archivo `.js`.

```
