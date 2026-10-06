import type { Settings } from '#shared/utils/labels'

// Sample content so the prototype has something to show.
// Photos are Unsplash stand-ins until the real Instagram posts are imported from /admin.
type SeedUpdate = [date: string, stage: string, title: string, body: string, images?: string[]]
interface SeedStory { name: string, species: string, status: string, cover: string, summary: string, featured?: boolean, updates: SeedUpdate[] }

export const seedStories: SeedStory[] = [
  {
    name: 'Canela', species: 'perro', status: 'adoptado', cover: '/seed/canela.jpg', featured: true,
    summary: 'Vivía bajo un puesto del mercado, con sarna y una pata lastimada. Hoy duerme en su propio sillón.',
    updates: [
      ['2026-03-02', 'rescate', 'La encontramos bajo un puesto del mercado', 'Una vecina nos escribió por Instagram. Canela tenía sarna en el lomo, cojeaba de la pata trasera y no dejaba que nadie se acercara. Le llevamos comida tres días seguidos hasta que se dejó cargar.', ['/seed/canela.jpg']],
      ['2026-03-10', 'tratamiento', 'Primera semana en la veterinaria', 'Diagnóstico: sarna sarcóptica y una fisura en la pata. Empezamos baños medicados, desparasitación y reposo. Come con muchas ganas.'],
      ['2026-04-05', 'recuperacion', 'Le volvió a crecer el pelo', 'Ya camina sin cojear y aprendió a pedir cariño con la pata. Está lista para conocer familias.', ['/seed/canela.jpg']],
      ['2026-05-18', 'adopcion', 'Canela tiene familia', 'Después de dos visitas y una entrevista, Canela se fue a casa con Daniela y sus dos hijos. Nos mandan fotos cada semana.'],
    ],
  },
  {
    name: 'Simba', species: 'gato', status: 'en_recuperacion', cover: '/seed/simba.jpg', featured: true,
    summary: 'Lo sacamos de un techo después de dos días de lluvia. Llegó deshidratado y con un ojo infectado.',
    updates: [
      ['2026-07-21', 'rescate', 'Dos días atrapado en un techo', 'Lo escuchábamos maullar desde la calle. Con una escalera prestada y mucha paciencia logramos bajarlo.', ['/seed/simba.jpg']],
      ['2026-07-23', 'tratamiento', 'Suero y gotas para el ojo', 'Llegó deshidratado y con conjuntivitis. Pasó dos noches con suero y ahora recibe gotas tres veces al día.'],
      ['2026-08-30', 'recuperacion', 'El ojo se salvó', 'La infección cedió y ya ve bien de los dos ojos. Es curioso, juguetón y le encanta dormir sobre la ropa limpia.', ['/seed/simba.jpg']],
    ],
  },
  {
    name: 'Rocky', species: 'perro', status: 'buscando_hogar', cover: '/seed/rocky.jpg', featured: true,
    summary: 'Lo abandonaron atado a un poste en la carretera. Es el perro más alegre del refugio y busca familia.',
    updates: [
      ['2026-06-04', 'rescate', 'Atado a un poste en la carretera', 'Un conductor lo vio y se detuvo. Rocky llevaba al menos un día sin agua. Movía la cola igual.', ['/seed/rocky.jpg']],
      ['2026-06-12', 'tratamiento', 'Vacunas y esterilización', 'Recibió todas sus vacunas, desparasitación y fue esterilizado. Se recuperó en tiempo récord.'],
      ['2026-08-15', 'actualizacion', 'Listo para adopción', 'Rocky convive bien con otros perros y con niños. Necesita un patio y una familia con ganas de pasear.', ['/seed/rocky.jpg']],
    ],
  },
  {
    name: 'Oreo', species: 'gato', status: 'en_tratamiento', cover: '/seed/oreo.jpg', featured: true,
    summary: 'Gato callejero con una herida profunda en el cuello. Está en curaciones diarias.',
    updates: [
      ['2026-09-10', 'rescate', 'Una herida que no cerraba', 'Oreo se acercaba a una tienda a pedir comida. La dueña notó la herida y nos avisó. Lo atrapamos con una jaula trampa.', ['/seed/oreo.jpg']],
      ['2026-09-14', 'tratamiento', 'Curaciones todos los días', 'La herida está limpia y empezó a cerrar. Sigue con antibióticos dos semanas más. Cada curación cuesta, cualquier aporte ayuda.'],
    ],
  },
  {
    name: 'Bruno', species: 'perro', status: 'adoptado', cover: '/seed/bruno.jpg', featured: true,
    summary: 'Tenía miedo de todo. Seis meses después corre en la orilla del lago con su nueva familia.',
    updates: [
      ['2025-11-08', 'rescate', 'Escondido debajo de un auto', 'Bruno temblaba y no salía. Pasamos la tarde sentados a su lado hasta que confió.', ['/seed/bruno.jpg']],
      ['2026-01-20', 'recuperacion', 'Aprendiendo a confiar', 'Con paseos cortos y mucha paciencia, Bruno ya busca a las personas para jugar.'],
      ['2026-04-02', 'adopcion', 'Bruno se fue a casa', 'Su familia lo lleva al lago Titicaca los fines de semana. Nos dicen que no le teme al agua.', ['/seed/bruno.jpg']],
    ],
  },
  {
    name: 'Mango', species: 'gato', status: 'buscando_hogar', cover: '/seed/mango.jpg',
    summary: 'Nació en una obra en construcción. Es tranquilo, mimoso y está esterilizado.',
    updates: [
      ['2026-05-30', 'rescate', 'Una camada en la obra', 'Los obreros encontraron cuatro gatitos entre los ladrillos. Mango es el último que falta adoptar.', ['/seed/mango.jpg']],
      ['2026-08-01', 'actualizacion', 'Mango ya está esterilizado', 'Vacunado, desparasitado y esterilizado. Solo le falta una familia.'],
    ],
  },
  {
    name: 'Pinta', species: 'perro', status: 'rescatado', cover: '/seed/pinta.jpg',
    summary: 'La rescatamos esta semana con una pata fracturada. Necesita cirugía.',
    updates: [
      ['2026-09-27', 'rescate', 'Atropellada y sola', 'Pinta estaba al costado de la avenida sin poder levantarse. La radiografía muestra una fractura que necesita cirugía.', ['/seed/pinta.jpg']],
    ],
  },
  {
    name: 'Kiwi', species: 'gato', status: 'adoptado', cover: '/seed/kiwi.jpg',
    summary: 'Llegó con gripe felina y bajo peso. Hoy vive con una abuelita que lo consiente.',
    updates: [
      ['2026-02-11', 'rescate', 'Con gripe y muy flaco', 'Pesaba la mitad de lo que debería. Lo encontraron en una caja en la puerta de una iglesia.', ['/seed/kiwi.jpg']],
      ['2026-03-01', 'tratamiento', 'Nebulizaciones y comida blanda', 'Dos semanas de tratamiento y ya respira sin dificultad.'],
      ['2026-04-22', 'adopcion', 'Kiwi tiene abuelita', 'Doña Rosa lo adoptó y dice que es su mejor compañía.', ['/seed/kiwi.jpg']],
    ],
  },
  {
    name: 'Nube', species: 'perro', status: 'en_recuperacion', cover: '/seed/nube.jpg',
    summary: 'Vivía encadenada en un terreno baldío. Ahora aprende a correr libre.',
    updates: [
      ['2026-08-05', 'rescate', 'Cadena corta, sin sombra', 'Gracias a una denuncia y a la policía forestal pudimos sacarla del terreno.', ['/seed/nube.jpg']],
      ['2026-09-01', 'recuperacion', 'Primer día sin cadena', 'Corrió en círculos por el patio durante media hora. Fue un día muy bonito.'],
    ],
  },
  {
    name: 'Pancho', species: 'perro', status: 'buscando_hogar', cover: '/seed/pancho.jpg',
    summary: 'Cachorro de tres meses, encontrado en una bolsa junto a sus hermanos.',
    updates: [
      ['2026-08-20', 'rescate', 'Una bolsa junto al río', 'Pancho y tres hermanos estaban dentro de una bolsa. Todos sobrevivieron.', ['/seed/pancho.jpg']],
      ['2026-09-18', 'actualizacion', 'Busca familia paciente', 'Ya tiene sus primeras vacunas. Muerde todo, como buen cachorro.'],
    ],
  },
]

export const defaultSettings: Settings = {
  // Sample figures: edit them from /admin/ajustes
  impact: { rescued: 1180, sterilized: 640, adopted: 715, since: '2022' },
  donation: {
    qrImage: '',
    bankName: 'Banco por confirmar',
    accountHolder: 'Al ResCate',
    accountNumber: '',
    accountType: 'Caja de ahorro en bolivianos',
    paypalUrl: '',
  },
  needs: [
    { item: 'Alimento para cachorros', note: 'Sacos de 15 kg o más' },
    { item: 'Antiparasitarios', note: 'Pipetas y pastillas' },
    { item: 'Arena para gatos', note: 'Cualquier marca' },
    { item: 'Mantas y frazadas', note: 'Usadas, en buen estado' },
    { item: 'Gasas y desinfectante', note: 'Para curaciones diarias' },
    { item: 'Transportadoras', note: 'Para traslados a la veterinaria' },
  ],
  social: {
    instagram: 'https://www.instagram.com/kevyn_alrescate',
    facebook: 'https://www.facebook.com/AlresCate2022',
    whatsapp: '',
  },
}
