Prueba Técnica Frontend - Angular
Descripción del Proyecto
Esta es una aplicación Angular que implementa dos ejercicios técnicos:

Componente de Búsqueda Reactiva - Implementa búsqueda en tiempo real con RxJS operadores avanzados

Carrito de Compras con Signals - Manejo de estado reactivo usando Angular Signals

Características Principales
Ejercicio 1: Búsqueda Reactiva de Clientes
Debounce de 400ms - Evita múltiples peticiones mientras el usuario escribe

SwitchMap - Cancela peticiones anteriores si hay nuevas

DistinctUntilChanged - No busca si el texto es idéntico al anterior

Filter - Solo busca con 3+ caracteres

Manejo de estados - Loading, error, sin resultados

Diseño responsive - Adaptable a móviles y tablets

Ejercicio 2: Carrito de Compras con Signals
Angular Signals - Estado reactivo moderno

Computed Signals - Total precio y cantidad calculados automáticamente

Effects - Console.log automático en cambios del carrito

Operaciones CRUD - Agregar, eliminar, actualizar cantidades, vaciar carrito

Interfaz intuitiva - Diseño limpio y fácil de usar

Tecnologías Utilizadas
Angular 17+ - Framework principal

TypeScript - Tipado estático

RxJS - Programación reactiva

Angular Signals - Estado reactivo

CSS3 - Estilos y animaciones

Standalone Components - Arquitectura moderna

Estructura del Proyecto
text
src/app/
├── components/
│   ├── customer-search/
│   │   ├── customer-search.component.ts
│   │   ├── customer-search.component.html
│   │   └── customer-search.component.css
│   └── cart-demo/
│       ├── cart-demo.component.ts
│       ├── cart-demo.component.html
│       └── cart-demo.component.css
├── services/
│   ├── cart.service.ts      # Servicio del carrito con Signals
│   └── mock.service.ts      # Servicio mock para búsqueda
├── app.component.ts         # Componente principal
└── app.config.ts           # Configuración de la aplicación
🔧 Instalación y Configuración
Prerrequisitos
Node.js 18+

Angular CLI 17+

Git

Pasos de Instalación
Clonar el repositorio

bash
git clone <url-del-repositorio>
cd prueba-tecnica-frontend
Instalar dependencias

bash
npm install
Iniciar servidor de desarrollo

bash
ng serve
Abrir en el navegador

text
http://localhost:4200
Guía de Uso
Búsqueda Reactiva de Clientes
Escribe en el campo de búsqueda

El sistema espera 400ms después de que dejes de escribir

Se muestran resultados en tiempo real

Puedes seleccionar clientes de la lista

Carrito de Compras
Agrega productos desde la sección "Productos"

Ajusta cantidades con los botones +/-

Elimina productos individualmente

Vacía todo el carrito con un solo clic

Observa cómo se actualizan los totales automáticamente

Implementación Técnica
Búsqueda Reactiva (RxJS Operadores)
typescript
this.searchSubject.pipe(
  debounceTime(400),          // Espera 400ms
  distinctUntilChanged(),     // Evita búsquedas duplicadas
  filter(term => term.length >= 3), // Mínimo 3 caracteres
  switchMap(term => this.mockService.search(term)) // Cancela anteriores
)
Carrito con Signals
typescript
// Signals reactivos
private cartItems = signal<CartItem[]>([]);

// Computed signals
totalPrice = computed(() => {
  return this.cartItems().reduce((total, item) => 
    total + (item.product.price * item.quantity), 0);
});

// Effects para side effects
effect(() => {
  console.log('🛒 Carrito actualizado:', this.cartItems());
});
Diseño y UX
Diseño responsivo - Funciona en móviles, tablets y desktop

Animaciones suaves - Transiciones CSS para mejor experiencia

Feedback visual - Estados claros (loading, error, éxito)

Accesibilidad - Navegación por teclado y ARIA labels

Consistencia - Paleta de colores y tipografía uniforme

Testing
Ejecutar pruebas unitarias
bash
ng test
Ejecutar pruebas e2e
bash
ng e2e
Construir para producción
bash
ng build --configuration production
Decisiones Técnicas
Standalone Components - Por simplicidad y modernidad

Signals vs RxJS - Signals para estado local, RxJS para flujos async

Mock Service - Simula API real sin dependencias externas

CSS puro - Sin frameworks CSS para demostrar habilidades básicas

Responsive first - Mobile-first design approach

Características Futuras
Persistencia del carrito en localStorage

Autenticación de usuarios

Integración con API real

Internationalization (i18n)

Dark mode

Tests unitarios completos

Contribución
Fork el proyecto

Crea una rama (git checkout -b feature/nueva-funcionalidad)

Commit cambios (git commit -m 'Agrega nueva funcionalidad')

Push a la rama (git push origin feature/nueva-funcionalidad)

Abre un Pull Request

Autor
Diego Alexander Ocampo

GitHub: @alexanderocampo

LinkedIn: (https://www.linkedin.com/in/alexanderocampo-webdeveloper/)