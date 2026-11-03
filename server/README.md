# Multijugador local (misma red wifi)

Varias personas juegan en el mismo barrio desde sus celulares: se ven caminar, entran juntas a las casas y tiendas, se saludan, mandan gestos y mensajes.

## 1. Encender el servidor (una sola vez, en un aparato)

Necesitás **Node.js 16 o más nuevo** y nada más (el servidor no tiene dependencias).

**En una compu** (Windows, Mac o Linux), dentro de la carpeta del juego:

```
node server/server.js
```

**En un celular Android** con [Termux](https://termux.dev):

```
pkg install nodejs
cd /sdcard/Download/mi-barrio      # o donde esté la carpeta del juego
node server/server.js
```

El servidor muestra algo así:

```
  Abrí esta dirección en cada celular (misma red wifi):
     http://192.168.1.23:8080
```

Si el puerto 8080 está ocupado: `node server/server.js 8081`.

## 2. Entrar desde cada celular

1. Abrí la dirección que mostró el servidor en el navegador del celular. El juego carga directo, no hay que copiar archivos.
2. En el menú tocá **👥 Multijugador**, poné tu nombre y escogé el color de tu camiseta.
3. Una persona toca **Crear sala** y les pasa el código de 4 letras a los demás.
4. Los demás escriben el código y tocan **Unirme**.
5. **Entrar al barrio**.

Si abriste el juego como archivo (sin el servidor), en el campo **Servidor** escribí la dirección, por ejemplo `192.168.1.23:8080`.

## Qué se comparte y qué no

| Compartido | De cada quien |
|---|---|
| La hora, el día y la lluvia | Plata, mochila, misiones e historia |
| Dónde están y qué hacen los vecinos, peatones y animales | La partida guardada |
| El bus | |

- **Gestos y chat:** botones 😀 y 💬 (en la compu: tecla **G** para gestos, 1 a 8 para escoger, y **T** para escribir).
- **Saludar:** acercate a otro jugador y tocá **A** (o E).
- Si alguien está hablando con un vecino, ese vecino queda ocupado para los demás (aparece 💬) hasta que termine.
- El mundo lo lleva el celular de quien creó la sala. Si esa persona se va, bloquea la pantalla o entra a un pleito, otro celular lo toma solo y nadie nota el cambio.
- Si se cae el wifi o se reinicia el servidor, el juego se reconecta solo a la misma sala.
- Máximo 6 personas por sala. Chepe, el bus a San José, los pleitos y los minijuegos siguen siendo de un solo jugador.

## Problemas comunes

- **«No se pudo conectar»:** revisá que todos estén en el mismo wifi y que el servidor siga abierto. Algunas redes (de escuelas, hoteles o redes «de invitados») no dejan que los aparatos se hablen entre sí. Solución: que un celular comparta datos (hotspot) y todos, incluido el servidor, se conecten a ese hotspot.
- **Windows pregunta por el firewall:** aceptá «redes privadas» para Node.js.
- **La pantalla se apaga:** el juego pide al celular que no se apague mientras estás en una sala. Si igual se bloquea, al volver se pone al día solo.

## Para pruebas (desarrollo)

Retraso y pérdida artificiales: `LAG=80 LOSS=0.05 node server/server.js`.
Ver salas abiertas: `http://localhost:8080/estado`.
