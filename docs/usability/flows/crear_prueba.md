# Flujo: Crear prueba (start → finish)

Tarea: Crear una nueva prueba (test) en el sistema.

Precondiciones: Usuario autenticado; participantes disponibles.

Pasos (capturas esperadas):
1. Start — Dashboard → Pruebas (`..._step01_pruebas_dashboard.png`)
2. Click "Crear prueba" → formulario vacío (`..._step02_form_empty.png`)
3. Rellenar título y fecha (`..._step03_fill_title.png`, `..._step04_fill_date.png`)
4. Seleccionar participantes (`..._step05_select_participants.png`)
5. Presionar `Crear` (`..._step06_submit.png`)
6. Finish — Ver prueba en lista/detalle (`..._step07_confirmation_and_list.png`)

Evidencias obligatorias: Network request en DevTools, DOM inspector de campos, tiempo en `results_template.csv`.
