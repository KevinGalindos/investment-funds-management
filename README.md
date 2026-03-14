# 🚀 Dashbord de Gestión de Inversiones - Investment Funds Management App

Este proyecto es una aplicación web-mobile moderna construida con **Angular 21** para la gestión de fondos de inversión. Permite a los usuarios visualizar fondos disponibles, suscribirse a ellos atendiendo a montos mínimos, y realizar un seguimiento detallado de su historial de transacciones en una interfaz premium y altamente responsiva.

---

## 🌟 Puntos Fuertes

- **Estructura Atómica**: Implementación de componentes pequeños y reutilizables para una mantenibilidad superior.
- **Gestión de Estado Moderna**: Uso intensivo de **Angular Signals** para una reactividad eficiente y predecible sin sobrecostes innecesarios.
- **Diseño UI/UX**: Interfaz oscura estéticamente atractiva con **Tailwind CSS v4**, incluyendo animaciones fluidas, efectos de desenfoque (backdrop blur) y gradientes dinámicos.
- **Historial de Transacciones**: Registro para suscripciones y cancelaciones con filtrado en tiempo real.
- **Simulación de Notificaciones**: Sistema integrado que simula el envío de confirmaciones vía Email y SMS tras cada operación.
- **Validaciones Robustas**: Control estricto de saldos y montos mínimos de inversión para garantizar la integridad de las operaciones.

---

## 🛠️ Librerías y Herramientas

| Herramienta      | Versión   | Propósito                                 |
| :--------------- | :-------- | :---------------------------------------- |
| **Angular**      | `^21.2.0` | Framework principal para SPA              |
| **Tailwind CSS** | `^4.2.1`  | Motor de estilos                          |
| **RxJS**         | `~7.8.0`  | Manejo de flujos de datos asíncronos      |
| **JSON Server**  | `^0.17.4` | Mock API para persistencia de datos local |
| **Vitest**       | `^4.0.8`  | Runner de pruebas unitarias               |
| **TypeScript**   | `~5.9.2`  | Lenguaje base con tipado fuerte           |

---

## ⚙️ Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd investment-funds-management-app
```

### 2. Instalar dependencias

Se recomienda el uso de **yarn** para una gestión de paquetes óptima.

```bash
yarn install
# o alternativamente
npm install
```

### 3. Ejecutar el Servidor Mock (API)

Este paso es crucial para que la aplicación pueda leer y guardar datos.

```bash
npm run api
```

_El API estará disponible en `http://localhost:3000`_

### 4. Ejecutar la aplicación de Angular

En una nueva terminal, inicia el servidor de desarrollo:

```bash
npm start
```

_Abre tu navegador en `http://localhost:4200`_

---

## 🧪 Pruebas Unitarias

Para ejecutar las pruebas del sistema utilizando Vitest:

```bash
npm test
```

---

## 🔗 Enlace del Proyecto Desplegado

Puedes acceder a la versión en producción del proyecto aquí:
👉 **[Link del Proyecto Desplegado](AQUÍ_VA_TU_LINK_DE_VERCEL_O_NETLIFY)**

---

_Desarrollado Por Kevin Galindo - Sr Frontend Developer Angular 2026_
