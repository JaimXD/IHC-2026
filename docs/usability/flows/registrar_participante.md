# Flujo: Registrar participante (start → finish)

Tarea: Registrar participante

Objetivo: Añadir un participante con nombre y correo.

Precondiciones: Usuario autenticado y en el dashboard.

Pasos (describir y pegar nombres de capturas):
1. Start — Punto de inicio (Dashboard → Participantes)
   - captura: `YYYYMMDD_responsable_registrar_participante_step01_dashboard.png`
2. Click "Nuevo participante" — formulario vacío
   - captura: `..._step02_form_empty.png`
3. Llenar `Nombre`
   - captura: `..._step03_fill_name.png`
4. Llenar `Email`
   - captura: `..._step04_fill_email.png`
5. Presionar `Guardar` (submit)
   - captura: `..._step05_submit.png`
6. Finish — Confirmación y nueva entrada en lista
   - captura: `..._step06_confirmation_and_list.png`

Validaciones y errores esperados:
- Email inválido: captura `..._step03_error_email_invalid.png`

Evidencias obligatorias:
- DOM inspector mostrando `label` y `aria-*` para el campo email: `..._step03_dom.png`
- Keyboard focus (tab hasta botón Guardar): `..._step03_keyboard_focus.png`
- Tiempo total (añadir a `results_template.csv`)

Recomendación: anotar tiempo y completar `manifest.csv` con cada archivo.
