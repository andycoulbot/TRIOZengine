const GameState = {
    hp: 25, maxHp: 25,
    chapter: 0, scene: 'title',
    stats: { charisma: 5, shiza: 0, chaos: 0, paranoia: 0, troll: 0 },
    reputation: { vilgefortz: 0, kob: 0, cheb: 0, vaituz: 0, akulbot: 0, madyar: 0, pericles: 0, germanovna: 0 },
    inventory: [],
    flags: {},
    choices: [],
    endingId: null,
    pathCount: 0,
    tshake: 0, // "тряска" meter
};

const Story = (() => {
    function getNode(sceneId) {
        GameState.pathCount++;
        const S = GameState.stats;
        const R = GameState.reputation;
        const F = GameState.flags;
        const nodes = {

// ============== TITLE ==============
'title': {
    speaker: '', text: '',
    choices: [
        { text: 'НАЧАТЬ ИГРУ', next: null, effect: () => { GameState.scene = 'intro'; }},
    ]
},

'intro': {
    speaker: '', text: 'Франция. Квартира миллионера неизвестного происхождения. 3:47 ночи. На экране ноутбука — 47 открытых вкладок: форумы, дискорд, Heroes 5. Рядом — пустые банки от энергетика и дорогие часы.',
    choices: [
        { text: 'Продолжить', next: null, effect: () => { GameState.chapter = 1; GameState.scene = 'ch1_wake'; }},
    ]
},

// ============== ГЛАВА 1: ПРОБУЖДЕНИЕ ==============
'ch1_wake': {
    speaker: '', text: 'ГЛАВА 1: ПРОБУЖДЕНИЕ В МИРЕ МЕЧА И ШИЗОФРЕНИИ.\n\nОрсон открывает глаза. Он лежит на каменном полу. Вокруг — средневековый замок. Стены увиты плющом. В воздухе пахнет магией и багетами.',
    choices: [
        { text: '(Встать и осмотреться)', next: null, effect: () => { GameState.scene = 'ch1_look_around'; }},
        { text: '(Лежать дальше)', next: null, effect: () => { S.chaos += 3; GameState.scene = 'ch1_stay_lying'; }},
    ]
},

'ch1_stay_lying': {
    speaker: 'Орсон', text: '...Серьёзно? Кто-то управляет мной? Я лежу на полу средневекового замка и кто-то решает, встать мне или нет? Какие же вы жалкие, ребят.',
    choices: [
        { text: '(Всё-таки встать)', next: null, effect: () => { GameState.scene = 'ch1_look_around'; }},
    ]
},

'ch1_look_around': {
    speaker: 'Орсон', text: 'Так... Это не моя квартира. Где мой ноутбук? Где мой телефон? Где... *замечает рыцарские доспехи на стене* ...Где я, чёрт возьми?!',
    choices: [
        { text: '(Подойти к окну)', next: null, effect: () => { GameState.scene = 'ch1_window'; }},
        { text: '(Обыскать комнату)', next: null, effect: () => { GameState.scene = 'ch1_search_room'; }},
        { text: '(Крикнуть "Алло!")', next: null, effect: () => { S.chaos += 2; GameState.scene = 'ch1_yell'; }},
    ]
},

'ch1_window': {
    speaker: '', text: 'За окном — фэнтезийный мир. Зелёные холмы, замки вдалеке, драконы в небе. На одном из замков развевается флаг с логотипом Heroes 5.',
    choices: [
        { text: 'Это... это Пятёрка?!', next: null, effect: () => { S.shiza += 3; GameState.scene = 'ch1_orson_excited'; }},
        { text: 'Я сплю. Однозначно.', next: null, effect: () => { GameState.scene = 'ch1_dream_doubt'; }},
    ]
},

'ch1_orson_excited': {
    speaker: 'Орсон', text: 'Я... я ВНУТРИ Heroes 5?! Исходный код Нивал! Мифы были правдой! Реборн — это не просто перерождение игры, это перерождение РЕАЛЬНОСТИ! Ладно... ладно, спокойно. Надо осмотреться.',
    choices: [
        { text: '(Обыскать комнату)', next: null, effect: () => { GameState.scene = 'ch1_search_room'; }},
    ]
},

'ch1_dream_doubt': {
    speaker: 'Орсон', text: 'Сон... Логично. Я заснул после 17 часов на форуме. Классика. Ладно, раз это сон — можно делать что угодно. И никто не может меня остановить.',
    choices: [
        { text: '(Обыскать комнату)', next: null, effect: () => { GameState.scene = 'ch1_search_room'; }},
    ]
},

'ch1_search_room': {
    speaker: '', text: 'В комнате найдено: старый телефон (работает!), дорогие часы (ваши!), помятый французский камзол, и записка: "Выход через главный зал. — П."',
    choices: [
        { text: '🔍 Взять телефон', next: null, effect: () => { GameState.inventory.push({id:'phone', name:'Телефон', desc:'Нет сигнала, но калькулятор работает'}); GameState.scene = 'ch1_take_phone'; }},
        { text: '🔍 Взять часы', next: null, effect: () => { GameState.inventory.push({id:'watch', name:'Дорогие часы', desc:'Показывают 3:47 всегда'}); GameState.scene = 'ch1_take_watch'; }},
        { text: '🔍 Взять всё', next: null, effect: () => { GameState.inventory.push({id:'phone', name:'Телефон', desc:'Нет сигнала'}); GameState.inventory.push({id:'watch', name:'Дорогие часы', desc:'3:47 навсегда'}); GameState.scene = 'ch1_take_all'; }},
    ]
},

'ch1_take_phone': {
    speaker: 'Орсон', text: 'Телефон... Нет сигнала. Нет интернета. Нет дискорда. Это... это хуже смерти. Ладно, хотя бы калькулятор работает. Кому-то может пригодиться.',
    choices: [
        { text: '(Идти к выходу)', next: null, effect: () => { GameState.scene = 'ch1_corridor'; }},
    ]
},

'ch1_take_watch': {
    speaker: 'Орсон', text: 'Мои часы! Дорогие, между прочим. Показывают 3:47. Всегда 3:47. Сломались, видимо. Или время тут не работает. Французский интеллект подсказывает — второе.',
    choices: [
        { text: '(Идти к выходу)', next: null, effect: () => { GameState.scene = 'ch1_corridor'; }},
    ]
},

'ch1_take_all': {
    speaker: 'Орсон', text: 'Забираю всё. Я миллионер — могу себе позволить. Хотя технически это мои вещи... Или нет? Кто вообще меня сюда притащил? Если это розыгрыш — кому-то конец.',
    choices: [
        { text: '(Идти к выходу)', next: null, effect: () => { GameState.scene = 'ch1_corridor'; }},
    ]
},

'ch1_yell': {
    speaker: 'Орсон', text: 'АЛЛО! ЕСТЬ ТУТ КТО?! ...Эхо. Тишина. Замечательно. Даже тут меня игнорируют.',
    choices: [
        { text: '(Крикнуть громче)', next: null, effect: () => { S.paranoia += 2; GameState.scene = 'ch1_yell_louder'; }},
        { text: '(Осмотреть комнату тихо)', next: null, effect: () => { GameState.scene = 'ch1_search_room'; }},
    ]
},

'ch1_yell_louder': {
    speaker: '', text: '*Из стены вылезает маленький гном с бородой до пола.*',
    choices: [
        { text: '...Что?', next: null, effect: () => { GameState.scene = 'ch1_meet_pericles'; }},
    ]
},

'ch1_corridor': {
    speaker: '', text: 'Коридор замка. Факелы на стенах мерцают. На полу — мозаика с картой мира Heroes 5. У выхода стоит маленький гном.',
    choices: [
        { text: '(Подойти к гному)', next: null, effect: () => { GameState.scene = 'ch1_meet_pericles'; }},
        { text: '(Пройти мимо)', next: null, effect: () => { R.pericles -= 5; GameState.scene = 'ch1_ignore_pericles'; }},
    ]
},

'ch1_meet_pericles': {
    speaker: 'Периклес', text: 'Приветствую, путник! Я Периклес, гном-проводник! Ты наконец проснулся! Мы ждали тебя три дня! Твоя миссия — пройти через мир Меча и Шизофрении и найти путь домой!',
    choices: [
        { text: 'Какой ещё мир?', next: null, effect: () => { GameState.scene = 'ch1_pericles_explain'; }},
        { text: 'Отойди, коротышка', next: null, effect: () => { S.troll += 3; R.pericles -= 10; GameState.scene = 'ch1_pericles_insulted'; }},
        { text: 'Три дня?! У меня стрим через час!', next: null, effect: () => { S.paranoia += 2; GameState.scene = 'ch1_pericles_stream'; }},
    ]
},

'ch1_pericles_explain': {
    speaker: 'Периклес', text: 'Это мир, рождённый из коллективного безумия интернета. Здесь форумы становятся лабиринтами, троллинг — магией, а конфликты — настоящими битвами. Ты тут потому что... ну... тебе, видимо, есть что проработать.',
    choices: [
        { text: 'Мне нечего прорабатывать!', next: null, effect: () => { S.paranoia += 3; GameState.scene = 'ch1_denial'; }},
        { text: 'Как мне выбраться?', next: null, effect: () => { GameState.scene = 'ch1_exit_quest'; }},
    ]
},

'ch1_pericles_insulted': {
    speaker: 'Периклес', text: '*вздыхает* Каждый раз одно и то же с вами, токсичными. Ладно, я всё равно обязан тебе помочь. Контракт. Так вот — тебе нужно пройти 6 испытаний, чтобы проснуться.',
    choices: [
        { text: 'Говори быстрее', next: null, effect: () => { GameState.scene = 'ch1_exit_quest'; }},
    ]
},

'ch1_pericles_stream': {
    speaker: 'Периклес', text: 'Стрим?! Тут нет интернета, герой! Тут нет дискорда! Тут нет форумов! Только ты, мир, и последствия твоих решений! ...Кстати, у тебя красные глаза. Ты спал?',
    choices: [
        { text: 'Я спорил на форуме 17 часов', next: null, effect: () => { S.shiza += 2; GameState.scene = 'ch1_exit_quest'; }},
        { text: 'Это не твоё дело', next: null, effect: () => { R.pericles -= 3; GameState.scene = 'ch1_exit_quest'; }},
    ]
},

'ch1_denial': {
    speaker: 'Периклес', text: '...Ладно. Конечно нечего. Ты абсолютно нормальный. Миллионер из Франции который спорит на форумах 17 часов в день — вершина здоровья. Пойдём, покажу выход.',
    choices: [
        { text: 'Это был сарказм?!', next: null, effect: () => { S.paranoia += 5; GameState.scene = 'ch1_pericles_sarcasm'; }},
        { text: 'Пойдём', next: null, effect: () => { GameState.scene = 'ch1_exit_quest'; }},
    ]
},

'ch1_pericles_sarcasm': {
    speaker: 'Периклес', text: 'Конечно нет! Я маленький гном, куда мне до сарказма! *подмигивает* Пойдём, пока ты не начал спорить со стенами.',
    choices: [
        { text: '...Пойдём', next: null, effect: () => { GameState.scene = 'ch1_exit_quest'; }},
    ]
},

'ch1_ignore_pericles': {
    speaker: 'Периклес', text: '*бежит следом* Стой! Ты не можешь просто уйти! Без проводника ты заблудишься! Тут ловушки! Тут монстры! Тут... тут КОММЕНТАРИИ ОЖИЛИ!',
    choices: [
        { text: '...Комментарии?', next: null, effect: () => { GameState.scene = 'ch1_exit_quest'; }},
    ]
},

'ch1_exit_quest': {
    speaker: 'Периклес', text: 'Итак, план простой: выходим из замка, проходим через город, добираемся до Портала Пробуждения. По пути будут... трудности. Ты готов?',
    choices: [
        { text: 'Я всегда готов', next: null, effect: () => { S.charisma += 2; GameState.scene = 'ch1_castle_exit'; }},
        { text: 'Мне нужны припасы', next: null, effect: () => { GameState.scene = 'ch1_castle_loot'; }},
    ]
},

'ch1_castle_loot': {
    speaker: '', text: 'Вы обыскиваете замок. Находите: потрёпанный багет (может использоваться как оружие), зарядку (без розетки), и свиток с надписью: "Если ты это читаешь — беги."',
    choices: [
        { text: '🍞 Взять багет-оружие', next: null, effect: () => { GameState.inventory.push({id:'baguette', name:'Боевой Багет', desc:'+3 к атаке, -5 к достоинству'}); GameState.scene = 'ch1_castle_exit'; }},
        { text: '🔌 Взять зарядку', next: null, effect: () => { GameState.inventory.push({id:'charger', name:'Зарядка', desc:'Нет розетки в средневековье'}); GameState.scene = 'ch1_castle_exit'; }},
        { text: '📜 Прочитать свиток', next: null, effect: () => { S.paranoia += 3; GameState.scene = 'ch1_scroll_warning'; }},
    ]
},

'ch1_scroll_warning': {
    speaker: '', text: 'Свиток: "Предупреждение: этот мир реагирует на твоё поведение. Чем больше ты провоцируешь — тем сильнее мир провоцирует тебя. Чем больше тряска — тем ближе финал. С уважением, Е.Г."',
    choices: [
        { text: 'Кто такая Е.Г.?', next: null, effect: () => { F.noticed_eg = true; GameState.scene = 'ch1_castle_exit'; }},
        { text: 'Тряска? Какая тряска?', next: null, effect: () => { GameState.scene = 'ch1_castle_exit'; }},
    ]
},

'ch1_castle_exit': {
    speaker: '', text: 'Вы выходите из замка. Перед вами — дорога, ведущая к городу. Солнце странное — оно пиксельное. Деревья шумят HTML-тегами. В воздухе пахнет Wi-Fi.',
    choices: [
        { text: '(Идти к городу)', next: null, effect: () => { GameState.scene = 'ch1_road_event'; }},
        { text: '(Осмотреть окрестности)', next: null, effect: () => { GameState.scene = 'ch1_look_outside'; }},
    ]
},

'ch1_look_outside': {
    speaker: 'Орсон', text: 'Так... Пиксельное солнце. HTML-деревья. Запах Wi-Fi. Либо я сошёл с ума, либо Нивал действительно зашифровали в исходном коде Heroes 5 параллельную вселенную. Я знал. Я ЗНАЛ.',
    choices: [
        { text: '(Идти к городу)', next: null, effect: () => { S.shiza += 3; GameState.scene = 'ch1_road_event'; }},
    ]
},

'ch1_road_event': {
    speaker: '', text: 'На дороге вам встречается первое существо — говорящий комментарий. Это буквально текстовый блок с ножками, на котором написано: "Ты неправ и вот почему:"',
    choices: [
        { text: '(Проигнорировать)', next: null, effect: () => { S.charisma += 3; GameState.scene = 'ch1_comment_ignored'; }},
        { text: '(Начать спорить)', next: null, effect: () => { S.troll += 3; S.chaos += 5; GameState.tshake += 5; GameState.scene = 'ch1_comment_argue'; }},
        { text: '(Ударить багетом)', next: null, effect: () => { S.chaos += 5; GameState.scene = 'ch1_comment_hit'; }},
    ]
},

'ch1_comment_ignored': {
    speaker: 'Периклес', text: 'Молодец! Первый комментарий — и ты не клюнул! Обычно гости этого мира застревают на первом споре на три дня. У тебя есть шанс, герой!',
    choices: [
        { text: '(Продолжить путь)', next: null, effect: () => { GameState.scene = 'ch1_city_gates'; }},
    ]
},

'ch1_comment_argue': {
    speaker: 'Орсон', text: '...НЕПРАВ?! ДА ТЫ ДАЖЕ НЕ ЗНАЕШЬ О ЧЁМ ГОВОРИШЬ! ТЫ ПРОСТО ТЕКСТОВЫЙ БЛОК С НОЖКАМИ! У ТЕБЯ ДАЖЕ ШРИФТ КРИВОЙ!',
    choices: [
        { text: '(Продолжать спорить)', next: null, effect: () => { S.chaos += 5; GameState.tshake += 10; GameState.scene = 'ch1_comment_spiral'; }},
        { text: '(Остановиться)', next: null, effect: () => { GameState.scene = 'ch1_comment_stop'; }},
    ]
},

'ch1_comment_spiral': {
    speaker: '', text: '*Через два часа.* Орсон всё ещё спорит с комментарием. Периклес уснул на камне. Комментарий размножился — теперь их 47. Все говорят одновременно.',
    choices: [
        { text: '(Уйти наконец)', next: null, effect: () => { GameState.scene = 'ch1_city_gates'; }},
    ]
},

'ch1_comment_stop': {
    speaker: 'Периклес', text: 'Хвалю за сдержанность! Хотя... ты два часа спорил. С текстовым блоком. На ножках. Ладно, идём дальше.',
    choices: [
        { text: '(Идти к городу)', next: null, effect: () => { GameState.scene = 'ch1_city_gates'; }},
    ]
},

'ch1_comment_hit': {
    speaker: '', text: '*Орсон бьёт комментарий багетом.* Комментарий рассыпается на буквы. Из него выпадает 5 монет и записка: "1★ — ужасный спорщик".',
    choices: [
        { text: '(Забрать лут и идти)', next: null, effect: () => { GameState.inventory.push({id:'coins_5', name:'5 монет'}); GameState.scene = 'ch1_city_gates'; }},
    ]
},

'ch1_city_gates': {
    speaker: '', text: 'Ворота города "Форум-Сити". Над входом надпись: "ДОБРО ПОЖАЛОВАТЬ. ПРАВИЛА: 1) Не кормите троллей. 2) Не спорьте с Орсоном. 3) См. правило 2."',
    choices: [
        { text: 'Правило 2?! Они меня ЗНАЮТ?!', next: null, effect: () => { S.paranoia += 5; GameState.scene = 'ch1_enter_city'; }},
        { text: '(Тихо войти)', next: null, effect: () => { GameState.scene = 'ch1_enter_city'; }},
    ]
},

'ch1_enter_city': {
    speaker: 'Периклес', text: 'Добро пожаловать в Форум-Сити! Тут есть магазин, площадь, и... осторожнее. Местные не любят провокаторов. Ну то есть... тебя.',
    choices: [
        { text: 'Мне нужен хлеб и сигареты', next: null, effect: () => { GameState.chapter = 2; GameState.scene = 'ch2_start'; }},
        { text: 'Покажи мне всё', next: null, effect: () => { GameState.chapter = 2; GameState.scene = 'ch2_start'; }},
    ]
},

// ============== ГЛАВА 2: ЗА ХЛЕБОМ И СИГАРЕТАМИ ==============
'ch2_start': {
    speaker: '', text: 'ГЛАВА 2: ЗА ХЛЕБОМ И СИГАРЕТАМИ.\n\nУлицы Форум-Сити. Дома сделаны из сообщений. Вывески мигают как баннеры. Где-то играет 8-битная музыка.',
    choices: [
        { text: '(Пойти к рынку)', next: null, effect: () => { GameState.scene = 'ch2_market'; }},
        { text: '(Свернуть в переулок)', next: null, effect: () => { GameState.scene = 'ch2_alley'; }},
        { text: '(Заговорить с прохожим)', next: null, effect: () => { GameState.scene = 'ch2_passerby'; }},
    ]
},

'ch2_market': {
    speaker: '', text: 'Рынок Форум-Сити. Торговцы кричат: "ЛУЧШИЕ МОДЫ!", "СКИНЫ ПО СКИДКЕ!", "ГАЙДЫ — 3 МОНЕТЫ!". У одного прилавка — подозрительный тип в плаще продаёт "секретный исходный код Нивал".',
    choices: [
        { text: '(Подойти к типу с кодом)', next: null, effect: () => { S.shiza += 3; GameState.scene = 'ch2_code_seller'; }},
        { text: '(Искать хлеб)', next: null, effect: () => { GameState.scene = 'ch2_bread_search'; }},
        { text: '(Искать сигареты)', next: null, effect: () => { GameState.scene = 'ch2_cig_search'; }},
        { text: '(Устроить сцену)', next: null, effect: () => { S.chaos += 5; S.troll += 3; GameState.tshake += 5; GameState.scene = 'ch2_market_scene'; }},
    ]
},

'ch2_code_seller': {
    speaker: '???', text: '*шёпотом* Исходный код Нивал... настоящий! 50 монет! Мифы — правда! Всё зашифровано! Перерождение возможно!',
    choices: [
        { text: 'Я ЗНАЛ! Давай сюда!', next: null, effect: () => { S.shiza += 10; F.bought_code = true; GameState.inventory.push({id:'fake_code', name:'Исходный код Нивал', desc:'Подозрительно пахнет фейком'}); GameState.scene = 'ch2_code_bought'; }},
        { text: 'Это фейк, отвали', next: null, effect: () => { S.charisma += 3; GameState.scene = 'ch2_bread_search'; }},
    ]
},

'ch2_code_bought': {
    speaker: 'Периклес', text: '*шёпотом* Ты только что купил распечатку из Wikipedia за 50 монет. Ну... по крайней мере ты счастлив. На какое-то время.',
    choices: [
        { text: 'ТЫ НЕ ПОНИМАЕШЬ!', next: null, effect: () => { S.paranoia += 5; GameState.scene = 'ch2_bread_search'; }},
    ]
},

'ch2_bread_search': {
    speaker: '', text: 'Вы находите пекарню "Баг и Багет". На вывеске: "Лучшие багеты за пределами Франции! (Единственные багеты за пределами Франции.)"',
    choices: [
        { text: '(Войти в пекарню)', next: null, effect: () => { GameState.scene = 'ch2_bakery'; }},
    ]
},

'ch2_bakery': {
    speaker: 'Пекарь', text: 'Бонжур! О, французский гость! Наконец-то настоящий ценитель! У нас сегодня свежий багет, круассан с начинкой из критических комментариев, и торт "Слитый аргумент".',
    choices: [
        { text: 'Багет. Просто багет.', next: null, effect: () => { GameState.inventory.push({id:'bread', name:'Свежий багет', desc:'Настоящий! Почти.'}); GameState.scene = 'ch2_got_bread'; }},
        { text: 'Торт "Слитый аргумент"??', next: null, effect: () => { GameState.scene = 'ch2_cake_joke'; }},
        { text: 'Критический круассан?', next: null, effect: () => { GameState.scene = 'ch2_croissant'; }},
    ]
},

'ch2_got_bread': {
    speaker: 'Орсон', text: 'Наконец нормальный багет. Первое нормальное что случилось за весь день. Теперь сигареты.',
    choices: [
        { text: '(Искать сигареты)', next: null, effect: () => { GameState.scene = 'ch2_cig_search'; }},
    ]
},

'ch2_cake_joke': {
    speaker: 'Пекарь', text: 'Торт "Слитый аргумент"! Сверху — крем из оправданий, внутри — пустота, украшен крошками разрушенных отношений! Наш бестселлер!',
    choices: [
        { text: '...Дайте багет и всё', next: null, effect: () => { GameState.inventory.push({id:'bread', name:'Свежий багет'}); GameState.scene = 'ch2_cig_search'; }},
    ]
},

'ch2_croissant': {
    speaker: 'Пекарь', text: 'Критический круассан! При каждом укусе вы слышите чей-то голос, который говорит что вы неправы! Очень бодрит утром!',
    choices: [
        { text: 'Мне хватает таких голосов', next: null, effect: () => { GameState.inventory.push({id:'bread', name:'Свежий багет'}); GameState.scene = 'ch2_cig_search'; }},
    ]
},

'ch2_cig_search': {
    speaker: '', text: 'Вы находите киоск "Последний Нерв". Продавец — уставший мужик с глазами человека, который видел слишком много интернет-споров.',
    choices: [
        { text: 'Сигареты есть?', next: null, effect: () => { GameState.scene = 'ch2_cig_buy'; }},
    ]
},

'ch2_cig_buy': {
    speaker: 'Продавец', text: 'Сигареты? Есть. "Тролль Лайт", "Капс Лок Ментол", и "Форумный Дым" — последние горят три часа, как средний спор.',
    choices: [
        { text: '"Форумный Дым"', next: null, effect: () => { GameState.inventory.push({id:'cigs', name:'Сигареты "Форумный Дым"', desc:'Горят 3 часа'}); GameState.scene = 'ch2_park'; }},
        { text: 'Какой-нибудь энергетик?', next: null, effect: () => { GameState.inventory.push({id:'energy', name:'Энергетик "Бессонница"', desc:'+5 HP, -3 к адекватности'}); GameState.scene = 'ch2_park'; }},
        { text: 'Всё вместе', next: null, effect: () => { GameState.inventory.push({id:'cigs', name:'Сигареты'}); GameState.inventory.push({id:'energy', name:'Энергетик'}); GameState.scene = 'ch2_park'; }},
    ]
},

'ch2_alley': {
    speaker: '', text: 'Тёмный переулок. На стенах граффити: "ОРСОН БЫЛ ЗДЕСЬ", "РЕБОРН — ИСТИНА", "ТРОЙКА > ПЯТЁРКИ" (последнее зачёркнуто трижды). В углу сидит подозрительная фигура.',
    choices: [
        { text: '(Подойти к фигуре)', next: null, effect: () => { GameState.scene = 'ch2_alley_figure'; }},
        { text: '(Уйти на рынок)', next: null, effect: () => { GameState.scene = 'ch2_market'; }},
    ]
},

'ch2_alley_figure': {
    speaker: '???', text: '*фигура поднимает голову* ...Ты... ты Орсон? Тот самый? Который на форуме написал 3000 слов о том, почему все неправы? ...Я твой фанат.',
    choices: [
        { text: 'Наконец-то! Признание!', next: null, effect: () => { S.troll += 3; GameState.scene = 'ch2_fan_happy'; }},
        { text: 'Уходи. Мне не нужны фанаты', next: null, effect: () => { S.charisma += 2; GameState.scene = 'ch2_fan_rejected'; }},
    ]
},

'ch2_fan_happy': {
    speaker: '???', text: 'Можно автограф?! Распишитесь на моём скриншоте спора! Это тот самый спор на 147 страниц! Вы тогда сказали: "Какие же вы жалкие, ребят" — это было ГЕНИАЛЬНО!',
    choices: [
        { text: '(Подписать)', next: null, effect: () => { S.charisma += 5; GameState.inventory.push({id:'fan_note', name:'Благодарность фаната', desc:'Тёплое чувство'}); GameState.scene = 'ch2_market'; }},
    ]
},

'ch2_fan_rejected': {
    speaker: '???', text: '...Ладно. *шёпотом* Я всё равно буду верить в Реборн. *исчезает в тени*',
    choices: [
        { text: '(Идти на рынок)', next: null, effect: () => { GameState.scene = 'ch2_market'; }},
    ]
},

'ch2_passerby': {
    speaker: 'Прохожий', text: 'Привет! Ты новенький? Добро пожаловать в Форум-Сити! Тут всё мирно, если не заходить в раздел "Политика" и не упоминать Heroes при Орсоне. *замечает вас* ...О НЕТ.',
    choices: [
        { text: 'Что "о нет"?', next: null, effect: () => { GameState.scene = 'ch2_passerby_realizes'; }},
    ]
},

'ch2_passerby_realizes': {
    speaker: 'Прохожий', text: 'ТЫ... ТЫ ОРСОН?! *убегает* ОРСОН В ГОРОДЕ! ВСЕ В УКРЫТИЕ! ОРСОН В ГОРОДЕ!',
    choices: [
        { text: 'Почему все убегают?!', next: null, effect: () => { S.paranoia += 5; GameState.scene = 'ch2_market'; }},
        { text: '...Я не настолько плохой', next: null, effect: () => { GameState.scene = 'ch2_market'; }},
    ]
},

'ch2_market_scene': {
    speaker: 'Орсон', text: 'ЭЙ! ТУТ ЕСТЬ КТО-НИБУДЬ КРОМЕ МЕНЯ, КТО УМЕЕТ ДУМАТЬ?! *все замолкают* НАКОНЕЦ ТИШИНА! Так, мне нужен хлеб и сигареты. Где тут магазин?!',
    choices: [
        { text: '(Все показывают в одну сторону)', next: null, effect: () => { GameState.scene = 'ch2_bread_search'; }},
    ]
},

'ch2_park': {
    speaker: '', text: 'Парк Форум-Сити. Деревья из ASCII-арта. Скамейки с табличками: "Модератор сидел здесь". На одной скамейке сидит человек в зелёных наушниках и жуёт яблоко.',
    choices: [
        { text: '(Подойти к человеку)', next: null, effect: () => { GameState.scene = 'ch2_meet_vaituz_park'; }},
        { text: '(Сесть на другую скамейку)', next: null, effect: () => { GameState.scene = 'ch2_bench_rest'; }},
        { text: '(Идти дальше к магазину)', next: null, effect: () => { GameState.chapter = 3; GameState.scene = 'ch3_start'; }},
    ]
},

'ch2_meet_vaituz_park': {
    speaker: 'Вайтуз', text: 'Эээ... привет. Ты тоже тут? Я... эээ... *жуёт яблоко* ...заблудился. Уже три дня. У меня мозг не кипит. Но карту я потерял.',
    choices: [
        { text: 'Идём со мной, я знаю путь', next: null, effect: () => { R.vaituz += 10; F.vaituz_companion = true; GameState.scene = 'ch2_vaituz_joins'; }},
        { text: 'Это не моя проблема', next: null, effect: () => { R.vaituz -= 10; GameState.scene = 'ch2_vaituz_left'; }},
    ]
},

'ch2_vaituz_joins': {
    speaker: 'Вайтуз', text: 'Правда?! Спасибо! Я... эээ... я полезный. Иногда. Ну... могу держать яблоко. И... эээ... моральная поддержка? *неуверенная улыбка*',
    choices: [
        { text: '(Идти к магазину вместе)', next: null, effect: () => { GameState.chapter = 3; GameState.scene = 'ch3_start'; }},
    ]
},

'ch2_vaituz_left': {
    speaker: 'Вайтуз', text: '...Ладно. *грустно жуёт яблоко* Я посижу тут. Может кто-нибудь ещё придёт. Эээ...',
    choices: [
        { text: '(Идти к магазину)', next: null, effect: () => { GameState.chapter = 3; GameState.scene = 'ch3_start'; }},
    ]
},

'ch2_bench_rest': {
    speaker: 'Орсон', text: '*садится, закуривает* ...Тихо. Впервые за долгое время тихо. Никто не спорит. Никто не пишет. Просто... тишина. *пауза* ...Мне не нравится. Слишком тихо. Что-то не так.',
    choices: [
        { text: '(Продолжить сидеть)', next: null, effect: () => { S.paranoia += 3; GameState.scene = 'ch2_bench_paranoia'; }},
        { text: '(Встать и идти)', next: null, effect: () => { GameState.chapter = 3; GameState.scene = 'ch3_start'; }},
    ]
},

'ch2_bench_paranoia': {
    speaker: 'Орсон', text: '...Почему так тихо? Они что-то замышляют. Все они. Город слишком мирный. Это ловушка. Они знают что я тут. Заговор. Однозначно заговор.',
    choices: [
        { text: '(Быстро уйти)', next: null, effect: () => { GameState.chapter = 3; GameState.scene = 'ch3_start'; }},
    ]
},

// ============== ГЛАВА 3: МАГАЗИН ==============
'ch3_start': {
    speaker: '', text: 'ГЛАВА 3: ПРОДАВЕЦ ПРАВДЫ.\n\nМагазин "Всё для Героев". На витрине — моды, гайды, фигурки из Heroes. За прилавком — пожилой продавец с мудрым взглядом и бейджиком "Аркадий".',
    choices: [
        { text: '(Войти)', next: null, effect: () => { GameState.scene = 'ch3_enter_shop'; }},
    ]
},

'ch3_enter_shop': {
    speaker: 'Аркадий', text: 'Добро пожаловать! О... *надевает очки* ...Орсон? Тот самый? Я читал твои посты. Все 3000 из них. У меня есть всё что тебе нужно. И кое-что, чего ты не просил.',
    choices: [
        { text: 'Мне нужен хлеб и...', next: null, effect: () => { GameState.scene = 'ch3_bread_already'; }},
        { text: 'Что у тебя есть по Heroes 5?', next: null, effect: () => { S.shiza += 3; GameState.scene = 'ch3_heroes_shelf'; }},
        { text: 'Что значит "чего я не просил"?', next: null, effect: () => { GameState.scene = 'ch3_unwanted'; }},
    ]
},

'ch3_bread_already': {
    speaker: 'Аркадий', text: 'Хлеб? У тебя же уже есть багет. Я это вижу. Ты пришёл сюда не за хлебом, Орсон. Ты пришёл потому что тебе скучно без конфликта.',
    choices: [
        { text: 'ЧТО?! Это не правда!', next: null, effect: () => { S.chaos += 3; GameState.tshake += 5; GameState.scene = 'ch3_provoked'; }},
        { text: '...Может быть', next: null, effect: () => { S.charisma += 5; GameState.scene = 'ch3_honest_moment'; }},
    ]
},

'ch3_provoked': {
    speaker: 'Аркадий', text: '*спокойно* Вот видишь? Я сказал одну фразу — и ты уже на взводе. Это "Тряска", Орсон. Ты трясёшь не только других. Ты трясёшь себя.',
    choices: [
        { text: 'Ты не знаешь меня!', next: null, effect: () => { S.paranoia += 5; GameState.tshake += 5; GameState.scene = 'ch3_argue_seller'; }},
        { text: '...Тряска?', next: null, effect: () => { GameState.scene = 'ch3_about_shake'; }},
    ]
},

'ch3_honest_moment': {
    speaker: 'Аркадий', text: '*удивлённо* Ого. Честность. Редкий товар. За это — скидка. *достаёт из-под прилавка старую книгу* Вот. "Как перестать спорить с интернетом". Бесплатно.',
    choices: [
        { text: '(Взять книгу)', next: null, effect: () => { GameState.inventory.push({id:'book_peace', name:'Книга мира', desc:'Как перестать спорить'}); F.took_peace_book = true; GameState.scene = 'ch3_after_shop'; }},
        { text: 'Мне не нужна помощь', next: null, effect: () => { S.paranoia += 3; GameState.scene = 'ch3_after_shop'; }},
    ]
},

'ch3_about_shake': {
    speaker: 'Аркадий', text: 'Тряска — это твоя суперсила и проклятие одновременно. Когда ты говоришь — люди теряют самообладание. Но ты тоже. Чем больше трясёшь — тем ближе к краю. К СВОЕМУ краю.',
    choices: [
        { text: 'Я контролирую это', next: null, effect: () => { GameState.scene = 'ch3_after_shop'; }},
        { text: 'Как остановить?', next: null, effect: () => { S.charisma += 3; GameState.scene = 'ch3_stop_shake'; }},
    ]
},

'ch3_stop_shake': {
    speaker: 'Аркадий', text: 'Тишина. Просто... тишина. Но ты же не можешь молчать, Орсон. Для тебя тишина — это смерть. В этом и проблема.',
    choices: [
        { text: '(Задуматься)', next: null, effect: () => { S.charisma += 5; GameState.scene = 'ch3_after_shop'; }},
    ]
},

'ch3_argue_seller': {
    speaker: 'Орсон', text: 'ТЫ ПРОДАВЕЦ В МАГАЗИНЕ ФИГУРОК! ЧТО ТЫ МОЖЕШЬ ЗНАТЬ О МНЕ?! Я МИЛЛИОНЕР! Я ИЗ ФРАНЦИИ! У МЕНЯ ДОРОГИЕ ЧАСЫ!',
    choices: [
        { text: '(Продолжать орать)', next: null, effect: () => { GameState.tshake += 10; GameState.scene = 'ch3_seller_calm'; }},
        { text: '(Остыть)', next: null, effect: () => { GameState.scene = 'ch3_after_shop'; }},
    ]
},

'ch3_seller_calm': {
    speaker: 'Аркадий', text: '*абсолютно спокойно* Часы показывают 3:47. Уже три дня. Ты заметил? Время остановилось, Орсон. Для тебя. Потому что ты застрял. Не здесь. Внутри себя.',
    choices: [
        { text: '...', next: null, effect: () => { S.shiza += 5; GameState.scene = 'ch3_after_shop'; }},
    ]
},

'ch3_heroes_shelf': {
    speaker: 'Аркадий', text: 'Heroes 5? Конечно! Вот тебе: диск с оригиналом, сборник модов (не краденых!), и... *достаёт пыльную коробку* ...Прототип Heroes 6, который Нивал так и не выпустили.',
    choices: [
        { text: 'ПРОТОТИП?! ДАВАЙ!', next: null, effect: () => { S.shiza += 10; GameState.inventory.push({id:'h6_proto', name:'Прототип Heroes 6', desc:'Или просто пустая коробка?'}); GameState.scene = 'ch3_after_shop'; }},
        { text: 'Ты тоже фейки продаёшь', next: null, effect: () => { GameState.scene = 'ch3_after_shop'; }},
    ]
},

'ch3_unwanted': {
    speaker: 'Аркадий', text: 'Зеркало. *ставит на прилавок маленькое зеркало* Посмотри на себя, Орсон. Красные глаза. Помятая одежда. Дорогие часы, которые не идут. Ты выглядишь как человек, который не спал неделю.',
    choices: [
        { text: '(Посмотреть в зеркало)', next: null, effect: () => { S.paranoia += 3; GameState.scene = 'ch3_mirror'; }},
        { text: '(Отвернуться)', next: null, effect: () => { GameState.scene = 'ch3_after_shop'; }},
    ]
},

'ch3_mirror': {
    speaker: 'Орсон', text: '...Ладно, выгляжу не лучшим образом. И что? Я был занят. Важными вещами. Форумами. Дискордом. Разоблачениями. Это ВАЖНО.',
    choices: [
        { text: '(Купить зеркало)', next: null, effect: () => { GameState.inventory.push({id:'mirror', name:'Зеркало правды', desc:'Показывает что есть'}); GameState.scene = 'ch3_after_shop'; }},
        { text: '(Уйти)', next: null, effect: () => { GameState.scene = 'ch3_after_shop'; }},
    ]
},

'ch3_after_shop': {
    speaker: 'Периклес', text: 'Ну что, закупился? Дальше нам надо... *замечает что Орсон задумался* ...Ты в порядке?',
    choices: [
        { text: 'Мне нужен интернет. Срочно.', next: null, effect: () => { GameState.chapter = 4; GameState.scene = 'ch4_start'; }},
        { text: 'Просто идём дальше', next: null, effect: () => { GameState.chapter = 4; GameState.scene = 'ch4_start'; }},
    ]
},

// ============== ГЛАВА 4: ФОРУМ И РЕБОРН ==============
'ch4_start': {
    speaker: '', text: 'ГЛАВА 4: КРОЛИЧЬЯ НОРА.\n\nВы находите заброшенный дом с работающим компьютером. На экране — форум. Орсон садится как к алтарю.',
    choices: [
        { text: '(Открыть форум)', next: null, effect: () => { GameState.scene = 'ch4_forum'; }},
        { text: '(Открыть YouTube)', next: null, effect: () => { GameState.scene = 'ch4_youtube'; }},
    ]
},

'ch4_forum': {
    speaker: '', text: 'Форум "ИСТИНА.ру". Разделы: "Теории Заговора", "Нивал: что скрывают?", "Шизофрения или сверхспособность?", "Реборн: перерождение Heroes 5".',
    choices: [
        { text: '📋 Теории Заговора', next: null, effect: () => { S.paranoia += 5; GameState.scene = 'ch4_conspiracy'; }},
        { text: '🎮 Нивал: что скрывают?', next: null, effect: () => { S.shiza += 5; GameState.scene = 'ch4_nival_secrets'; }},
        { text: '🧠 Шизофрения или сверхспособность?', next: null, effect: () => { GameState.scene = 'ch4_schizo_thread'; }},
        { text: '🔄 Реборн', next: null, effect: () => { GameState.scene = 'ch4_reborn_thread'; }},
        { text: '(Закрыть форум)', next: null, effect: () => { S.charisma += 5; GameState.scene = 'ch4_close_forum'; }},
    ]
},

'ch4_conspiracy': {
    speaker: '', text: 'Тема: "ДОКАЗАТЕЛЬСТВА что Heroes 5 содержит скрытый код реальности". Автор: OrsonGPT. 847 ответов. Последний: "Бро, выйди на улицу."',
    choices: [
        { text: '(Написать ответ на 3000 слов)', next: null, effect: () => { S.shiza += 5; S.chaos += 3; GameState.tshake += 5; GameState.scene = 'ch4_write_essay'; }},
        { text: '(Читать молча)', next: null, effect: () => { GameState.scene = 'ch4_youtube'; }},
    ]
},

'ch4_write_essay': {
    speaker: '', text: '*Орсон печатает два часа. Стена текста. Аргументы, контраргументы, ссылки на несуществующие исследования, цитаты на латыни (неправильные), и финальное: "Какие же вы жалкие, ребят."*',
    choices: [
        { text: '(Отправить)', next: null, effect: () => { GameState.scene = 'ch4_essay_response'; }},
    ]
},

'ch4_essay_response': {
    speaker: '', text: 'Ответ через 3 секунды: "Не читал лол". 47 лайков. Орсон смотрит на экран. Его левый глаз дёргается.',
    choices: [
        { text: '(Написать ещё 3000 слов)', next: null, effect: () => { S.chaos += 10; GameState.tshake += 10; GameState.scene = 'ch4_spiral'; }},
        { text: '(Закрыть вкладку)', next: null, effect: () => { S.charisma += 5; GameState.scene = 'ch4_youtube'; }},
    ]
},

'ch4_spiral': {
    speaker: '', text: '*6 часов спустя. 47 000 слов. 3 бана. 2 разблокировки. 1 смена аккаунта. Орсон забыл зачем пришёл. Периклес давно уснул.*',
    choices: [
        { text: '(Остановиться наконец)', next: null, effect: () => { GameState.scene = 'ch4_youtube'; }},
    ]
},

'ch4_nival_secrets': {
    speaker: '', text: 'Раздел полон скриншотов кода. Большинство — фотошоп. Но Орсон видит ПАТТЕРНЫ. Связи. Числа. 30-35 фпс — это код! 30+35=65. 6+5=11. 1+1=2. ДВА МИРА!',
    choices: [
        { text: 'Я гений!', next: null, effect: () => { S.shiza += 10; GameState.scene = 'ch4_youtube'; }},
        { text: 'Это бред', next: null, effect: () => { S.charisma += 5; GameState.scene = 'ch4_youtube'; }},
    ]
},

'ch4_schizo_thread': {
    speaker: '', text: 'Тема: "Шизофрения — это не болезнь, это расширенное восприятие реальности?" Автор: АнонимныйГений. Орсон читает и кивает. Потом останавливается. Перечитывает. Замирает.',
    choices: [
        { text: '(Задуматься)', next: null, effect: () => { GameState.scene = 'ch4_schizo_think'; }},
        { text: '(Закрыть быстро)', next: null, effect: () => { S.paranoia += 5; GameState.scene = 'ch4_youtube'; }},
    ]
},

'ch4_schizo_think': {
    speaker: 'Орсон', text: '...А если... нет. Нет. Я не... Это просто форум. Люди пишут всякое. Я нормальный. Я НОРМАЛЬНЫЙ. Просто умнее всех. Это не одно и то же. Это РАЗНЫЕ ВЕЩИ.',
    choices: [
        { text: '(Перейти на YouTube)', next: null, effect: () => { GameState.scene = 'ch4_youtube'; }},
    ]
},

'ch4_reborn_thread': {
    speaker: '', text: 'Тема: "РЕБОРН — Перерождение Heroes 5 в моей интерпретации". Автор: OrsonGPT. 12 000 просмотров. 3 лайка. 847 комментариев (все негативные).',
    choices: [
        { text: '(Читать комментарии)', next: null, effect: () => { S.paranoia += 5; GameState.scene = 'ch4_reborn_comments'; }},
        { text: '(Не читать — сразу на YouTube)', next: null, effect: () => { GameState.scene = 'ch4_youtube'; }},
    ]
},

'ch4_reborn_comments': {
    speaker: '', text: '"Бред", "Кто это?", "Вызовите скорую автору", "Респект за упорство, но нет", "Мифы Нивал — это фанфик", "Ты спорил в войсе 17 часов, отдохни".',
    choices: [
        { text: 'ОНИ ВСЕ ЗАБЛУЖДАЮТСЯ', next: null, effect: () => { S.shiza += 5; S.paranoia += 5; GameState.scene = 'ch4_youtube'; }},
        { text: '...847 комментариев. И все негативные.', next: null, effect: () => { S.charisma += 3; GameState.scene = 'ch4_youtube'; }},
    ]
},

'ch4_close_forum': {
    speaker: 'Периклес', text: 'Ты... закрыл форум? Добровольно? *проверяет температуру Орсона* Ты точно себя хорошо чувствуешь?',
    choices: [
        { text: 'Я в порядке', next: null, effect: () => { GameState.scene = 'ch4_youtube'; }},
    ]
},

'ch4_youtube': {
    speaker: '', text: 'YouTube. В рекомендациях: "РЕБОРН Heroes 5 — ПОЛНАЯ ПРАВДА" (47 просмотров, автор: OrsonGPT), "Heroes 5 исходный код РАЗБОР" (3 просмотра), и "Как перестать спорить в интернете" (12 млн просмотров).',
    choices: [
        { text: '▶️ Смотреть видео про Реборн', next: null, effect: () => { S.shiza += 5; GameState.scene = 'ch4_reborn_video'; }},
        { text: '▶️ Смотреть про исходный код', next: null, effect: () => { S.shiza += 3; GameState.scene = 'ch4_source_video'; }},
        { text: '▶️ Смотреть "Как перестать спорить"', next: null, effect: () => { S.charisma += 10; F.watched_peace = true; GameState.scene = 'ch4_peace_video'; }},
        { text: '(Выключить компьютер)', next: null, effect: () => { GameState.scene = 'ch4_end'; }},
    ]
},

'ch4_reborn_video': {
    speaker: '', text: '*Видео OrsonGPT.* На экране — Орсон объясняет теорию Реборна. Монтаж из скриншотов Heroes 5, красных стрелок, и подчёркиваний. BGM — эпичная музыка. 47 просмотров. 2 дизлайка.',
    choices: [
        { text: 'Это гениально (я ведь снял это)', next: null, effect: () => { S.shiza += 5; GameState.scene = 'ch4_end'; }},
        { text: '...47 просмотров', next: null, effect: () => { S.paranoia += 3; GameState.scene = 'ch4_end'; }},
    ]
},

'ch4_source_video': {
    speaker: '', text: '*Видео.* 40 минут разбора кода. Половина — фантазии. Четверть — настоящий код, вырванный из контекста. Четверть — Орсон спорит с комментаторами в реальном времени.',
    choices: [
        { text: '(Досмотреть)', next: null, effect: () => { GameState.scene = 'ch4_end'; }},
    ]
},

'ch4_peace_video': {
    speaker: '', text: '*Видео.* Спокойный голос: "Шаг 1: Закройте вкладку. Шаг 2: Выйдите на улицу. Шаг 3: Поговорите с живым человеком. Шаг 4: НЕ СПОРЬТЕ с ним."',
    choices: [
        { text: 'Хм... может в этом что-то есть', next: null, effect: () => { GameState.scene = 'ch4_end'; }},
        { text: 'Этот человек неправ и вот почему—', next: null, effect: () => { S.troll += 3; S.chaos += 3; GameState.scene = 'ch4_end'; }},
    ]
},

'ch4_end': {
    speaker: 'Периклес', text: 'Ну что, насиделся? Нам пора. Впереди... *мрачнеет* ...Площадь Встречи. Там тебя ждут. Все.',
    choices: [
        { text: 'Кто — все?', next: null, effect: () => { GameState.scene = 'ch4_who_waits'; }},
        { text: 'Пойдём', next: null, effect: () => { GameState.chapter = 5; GameState.scene = 'ch5_start'; }},
    ]
},

'ch4_who_waits': {
    speaker: 'Периклес', text: 'Все, кого ты когда-либо задел. Вильгефортс. Коб. Чеб. Витус. Акулбот. Мадьяр. И... возможно другие. Они собрались. Они ждут. И они настроены серьёзно.',
    choices: [
        { text: 'Пусть ждут. Я готов.', next: null, effect: () => { S.charisma += 5; GameState.chapter = 5; GameState.scene = 'ch5_start'; }},
        { text: '...Может обойдём?', next: null, effect: () => { GameState.scene = 'ch4_no_bypass'; }},
    ]
},

'ch4_no_bypass': {
    speaker: 'Периклес', text: 'Нет. Это единственный путь. Через них — или никуда. Такие правила этого мира. Нельзя убежать от последствий, Орсон. Даже во сне.',
    choices: [
        { text: '(Глубокий вдох) Идём.', next: null, effect: () => { GameState.chapter = 5; GameState.scene = 'ch5_start'; }},
    ]
},

// ============== ГЛАВА 5: ВСТРЕЧА СО ВСЕМИ ==============
'ch5_start': {
    speaker: '', text: 'ГЛАВА 5: ПЛОЩАДЬ ПРАВДЫ.\n\nОгромная площадь. В центре — трибуна. Вокруг — толпа. Орсон выходит один. Тишина. Потом — голоса. Все одновременно.',
    choices: [
        { text: '(Выйти на площадь)', next: null, effect: () => { GameState.scene = 'ch5_enter_square'; }},
    ]
},

'ch5_enter_square': {
    speaker: '', text: 'На площади стоят: Вильгефортс (в тёмном плаще, скрестив руки), Коб (с бутылкой вина), Чеб (в лётной форме, жуёт сушёный конь), Вайтуз (с яблоком), Акулбот (с планшетом мемов), Мадьяр (ноутбук под мышкой), и гном Периклес позади.',
    choices: [
        { text: '(Подойти к Вильгефортсу)', next: null, effect: () => { GameState.scene = 'ch5_vilgefortz_start'; }},
        { text: '(Подойти к Кобу)', next: null, effect: () => { GameState.scene = 'ch5_kob_start'; }},
        { text: '(Подойти к Чебу)', next: null, effect: () => { GameState.scene = 'ch5_cheb_start'; }},
        { text: '(Крикнуть: "Ну что, начнём?!")', next: null, effect: () => { S.chaos += 5; GameState.scene = 'ch5_everyone_attacks'; }},
    ]
},

'ch5_vilgefortz_start': {
    speaker: 'Вильгефортс', text: 'Орсон. Наконец-то. Знаешь, я следил за твоими постами. За каждым. И знаешь что? Ты был прав ровно ноль раз. НИ РАЗУ. Каждый твой аргумент — карточный домик из паранойи и самообмана.',
    choices: [
        { text: 'ТЫ ВЫСМЕИВАЛ МЕНЯ!', next: null, effect: () => { S.chaos += 5; R.vilgefortz -= 10; GameState.scene = 'ch5_vilgefortz_mock'; }},
        { text: 'Давай поговорим спокойно', next: null, effect: () => { S.charisma += 5; GameState.scene = 'ch5_vilgefortz_calm'; }},
        { text: '(Вызвать на битву)', next: null, effect: () => { GameState.scene = 'ch5_vilgefortz_battle'; }},
    ]
},

'ch5_vilgefortz_mock': {
    speaker: 'Вильгефортс', text: 'Я высмеивал? Нет, Орсон. Ты сам себя высмеивал. Каждый раз, когда писал "Какие же вы жалкие, ребят" — зеркало трескалось. Ты проецировал. Всегда проецировал.',
    choices: [
        { text: 'ЗАТКНИСЬ!', next: null, effect: () => { S.chaos += 10; GameState.tshake += 15; GameState.scene = 'ch5_vilgefortz_battle'; }},
        { text: '...Проецировал?', next: null, effect: () => { S.charisma += 5; GameState.scene = 'ch5_vilgefortz_truth'; }},
    ]
},

'ch5_vilgefortz_calm': {
    speaker: 'Вильгефортс', text: '*удивлён* Спокойно? Ты? Хм. Ладно. Орсон, я не враг. Я — зеркало. Ты видел во мне то, что боялся видеть в себе. Того, кто умнее. Того, кто не боится сказать правду.',
    choices: [
        { text: 'Может ты прав', next: null, effect: () => { S.charisma += 10; R.vilgefortz += 10; GameState.scene = 'ch5_vilgefortz_peace'; }},
        { text: 'Ты не умнее меня', next: null, effect: () => { GameState.scene = 'ch5_vilgefortz_battle'; }},
    ]
},

'ch5_vilgefortz_truth': {
    speaker: 'Вильгефортс', text: 'Каждый раз, когда ты обвинял кого-то в тупости — ты боялся что тупой ты. Каждый раз, когда кричал "заговор" — ты знал что заговора нет. Признай это, Орсон. И станет легче.',
    choices: [
        { text: '...', next: null, effect: () => { S.charisma += 10; GameState.scene = 'ch5_vilgefortz_peace'; }},
        { text: 'НЕТ! НИКОГДА!', next: null, effect: () => { GameState.scene = 'ch5_vilgefortz_battle'; }},
    ]
},

'ch5_vilgefortz_peace': {
    speaker: 'Вильгефортс', text: '*протягивает руку* Мир, Орсон? Не ради форума. Ради тебя.',
    choices: [
        { text: '(Пожать руку)', next: null, effect: () => { R.vilgefortz += 20; F.vilgefortz_peace = true; GameState.scene = 'ch5_after_vilgefortz'; }},
        { text: '(Отказаться)', next: null, effect: () => { R.vilgefortz -= 10; GameState.scene = 'ch5_after_vilgefortz'; }},
    ]
},

'ch5_vilgefortz_battle': {
    speaker: '', text: 'БОСС-ФАЙТ: ВИЛЬГЕФОРТС — Зеркало Правды!',
    choices: [
        { text: '⚔️ СРАЖАТЬСЯ', next: null, effect: () => {
            GameState.battleData = { enemy: 'Вильгефортс', hp: 40, atk: 8, def: 5, sprite: 'vilgefortz',
                attacks: ['Зеркальный удар', 'Слова правды', 'Отражение'], flavor: 'Вильгефортс смотрит сквозь вас.' };
            GameState.afterBattle = 'ch5_after_vilgefortz';
            GameState.scene = 'battle';
        }},
        { text: '🕊️ ОТСТУПИТЬ', next: null, effect: () => { S.charisma += 5; GameState.scene = 'ch5_after_vilgefortz'; }},
    ]
},

'ch5_after_vilgefortz': {
    speaker: '', text: 'Вильгефортс отступает в сторону. Следующие — Коб и компания.',
    choices: [
        { text: '(К Кобу)', next: null, effect: () => { GameState.scene = 'ch5_kob_start'; }},
        { text: '(К Акулботу)', next: null, effect: () => { GameState.scene = 'ch5_akulbot_start'; }},
        { text: '(К Мадьяру)', next: null, effect: () => { GameState.scene = 'ch5_madyar_start'; }},
    ]
},

'ch5_kob_start': {
    speaker: 'Коб', text: '*поднимает бокал* Орсон! Дружище! Я тут подумал — ты мне должен. За все те моды, которые ты критиковал. За все те стримы, где ты меня высмеивал. 200 монет. На ресторан. В центре.',
    choices: [
        { text: 'Ты КРАДЁШЬ моды у людей!', next: null, effect: () => { R.kob -= 10; GameState.scene = 'ch5_kob_mods'; }},
        { text: 'Ладно, вот 200 монет', next: null, effect: () => { R.kob += 15; F.paid_kob = true; GameState.scene = 'ch5_kob_paid'; }},
        { text: 'Ты нарцисс, Коб', next: null, effect: () => { S.troll += 3; R.kob -= 15; GameState.scene = 'ch5_kob_narcissist'; }},
    ]
},

'ch5_kob_mods': {
    speaker: 'Коб', text: 'КРАДУ?! Я ДОРАБАТЫВАЮ! Это АПГРЕЙД! Когда Пикассо рисовал поверх чужих картин — это было искусство! Когда я беру чужой мод и ставлю своё имя — это... это...',
    choices: [
        { text: 'Кража?', next: null, effect: () => { GameState.scene = 'ch5_kob_theft'; }},
        { text: 'Коб, ты слышишь себя?', next: null, effect: () => { S.charisma += 3; GameState.scene = 'ch5_kob_selfaware'; }},
    ]
},

'ch5_kob_theft': {
    speaker: 'Коб', text: '...Нет! Ну... может... немного. Но! 200 монет. Ресторан. Центр. Тогда забудем об этом. Деловое предложение.',
    choices: [
        { text: 'Нет.', next: null, effect: () => { GameState.scene = 'ch5_kob_end'; }},
    ]
},

'ch5_kob_selfaware': {
    speaker: 'Коб', text: '...Слышу. К сожалению. Ладно, может я немного... увлекаюсь. Но 200 монет — это объективная потребность! Ресторан в центре сам себя не оплатит!',
    choices: [
        { text: '(Уйти от Коба)', next: null, effect: () => { GameState.scene = 'ch5_kob_end'; }},
    ]
},

'ch5_kob_paid': {
    speaker: 'Коб', text: 'ВОТ ЭТО РАЗГОВОР! Орсон, ты лучший! Теперь я могу заказать устрицы! И вино! И... *уже забыл о конфликте*',
    choices: [
        { text: '(Идти дальше)', next: null, effect: () => { GameState.scene = 'ch5_kob_end'; }},
    ]
},

'ch5_kob_narcissist': {
    speaker: 'Коб', text: 'Нарцисс?! Я?! Ахахаха! Нарциссизм — это когда ты думаешь что лучше всех! А я ЗНАЮ что лучше всех! Это разные вещи! ...Или нет. Ну и что.',
    choices: [
        { text: '(Идти дальше)', next: null, effect: () => { GameState.scene = 'ch5_kob_end'; }},
    ]
},

'ch5_kob_end': {
    speaker: '', text: 'Коб пожимает плечами и возвращается к вину.',
    choices: [
        { text: '(К Чебу)', next: null, effect: () => { GameState.scene = 'ch5_cheb_start'; }},
        { text: '(К Акулботу)', next: null, effect: () => { GameState.scene = 'ch5_akulbot_start'; }},
        { text: '(К Вайтузу)', next: null, effect: () => { GameState.scene = 'ch5_vaituz_start'; }},
    ]
},

'ch5_cheb_start': {
    speaker: 'Чеб', text: '*в лётной форме, с ноутбуком* Орсон, я прилетел из Казахстана на дельтаплане специально ради этого разговора. Ты знаешь сколько модов я сделал для Heroes? А ты ни одного не оценил.',
    choices: [
        { text: 'Ты лётчик и моддер?', next: null, effect: () => { GameState.scene = 'ch5_cheb_pilot'; }},
        { text: 'Моды были нормальные', next: null, effect: () => { R.cheb += 10; GameState.scene = 'ch5_cheb_happy'; }},
        { text: 'Из Казахстана на дельтаплане?!', next: null, effect: () => { GameState.scene = 'ch5_cheb_delta'; }},
    ]
},

'ch5_cheb_pilot': {
    speaker: 'Чеб', text: 'Да! Днём летаю, ночью кодирую. Знаешь как тяжело делать моды на высоте 3000 метров? Турбулентность! Ноутбук падает! Но я всё равно делаю! Ради комьюнити!',
    choices: [
        { text: 'Это... впечатляет', next: null, effect: () => { R.cheb += 10; GameState.scene = 'ch5_cheb_end'; }},
    ]
},

'ch5_cheb_happy': {
    speaker: 'Чеб', text: '*расплывается в улыбке* Правда?! Серьёзно?! Ну... ладно тогда. Может ты не такой плохой, Орсон. Может я зря прилетел 4000 км на дельтаплане чтобы орать на тебя.',
    choices: [
        { text: '(Пожать руку)', next: null, effect: () => { F.cheb_friend = true; GameState.scene = 'ch5_cheb_end'; }},
    ]
},

'ch5_cheb_delta': {
    speaker: 'Чеб', text: 'Да! 4000 километров! Три дня! С посадкой на заправке и в "Макдональдсе"! Дельтаплан назвал "Герой-5"! Потому что это ПЯТЫЙ дельтаплан — первые четыре разбил!',
    choices: [
        { text: 'Ты безумец', next: null, effect: () => { R.cheb += 5; GameState.scene = 'ch5_cheb_end'; }},
    ]
},

'ch5_cheb_end': {
    speaker: '', text: 'Чеб салютует и отходит в сторону.',
    choices: [
        { text: '(К Акулботу)', next: null, effect: () => { GameState.scene = 'ch5_akulbot_start'; }},
        { text: '(К Мадьяру)', next: null, effect: () => { GameState.scene = 'ch5_madyar_start'; }},
        { text: '(К Вайтузу)', next: null, effect: () => { GameState.scene = 'ch5_vaituz_start'; }},
    ]
},

'ch5_akulbot_start': {
    speaker: 'Акулбот', text: '*показывает планшет* Орсон! Смотри! Я собрал ВСЕ мемы про тебя. 347 штук. Есть классика: "Орсон vs Здравый Смысл", "Тряска.gif", и мой любимый — "Я просто шучу (нет)".',
    choices: [
        { text: 'УДАЛИ ЭТО!', next: null, effect: () => { S.chaos += 5; R.akulbot -= 10; GameState.scene = 'ch5_akulbot_refuse'; }},
        { text: '...Покажи "Тряска.gif"', next: null, effect: () => { S.charisma += 5; GameState.scene = 'ch5_akulbot_show'; }},
        { text: 'Ты зарабатываешь на мне?', next: null, effect: () => { GameState.scene = 'ch5_akulbot_money'; }},
    ]
},

'ch5_akulbot_refuse': {
    speaker: 'Акулбот', text: 'Удалить?! Это ИСКУССТВО, Орсон! Это ДОКУМЕНТАЦИЯ! Через 100 лет историки будут изучать эти мемы как артефакты эпохи! Ты — живой мем! Гордись!',
    choices: [
        { text: '(Сражаться с Акулботом)', next: null, effect: () => {
            GameState.battleData = { enemy: 'Акулбот', hp: 25, atk: 6, def: 3, sprite: 'akulbot',
                attacks: ['Мем-атака', 'Скриншот позора', 'Вирусный ролик'], flavor: 'Акулбот листает мемы.' };
            GameState.afterBattle = 'ch5_akulbot_end';
            GameState.scene = 'battle';
        }},
        { text: '(Уйти)', next: null, effect: () => { GameState.scene = 'ch5_akulbot_end'; }},
    ]
},

'ch5_akulbot_show': {
    speaker: 'Акулбот', text: '*показывает* Вот! Это когда ты 17 часов подряд спорил и начал трясти всех в войсе! Кто-то записал! 2 миллиона просмотров! Ты ВИРУСНЫЙ, Орсон!',
    choices: [
        { text: '...2 миллиона?', next: null, effect: () => { S.charisma += 3; GameState.scene = 'ch5_akulbot_end'; }},
    ]
},

'ch5_akulbot_money': {
    speaker: 'Акулбот', text: 'Зарабатываю? Ну... мемы сами себя не делают. Но! Я готов платить тебе 10% от рекламы! Это... *считает* ...4 рубля 37 копеек.',
    choices: [
        { text: 'Щедро', next: null, effect: () => { GameState.scene = 'ch5_akulbot_end'; }},
    ]
},

'ch5_akulbot_end': {
    speaker: '', text: 'Акулбот фотографирует вашу реакцию для нового мема.',
    choices: [
        { text: '(К Мадьяру)', next: null, effect: () => { GameState.scene = 'ch5_madyar_start'; }},
        { text: '(К Вайтузу)', next: null, effect: () => { GameState.scene = 'ch5_vaituz_start'; }},
        { text: '(Ко всем сразу)', next: null, effect: () => { GameState.scene = 'ch5_everyone_attacks'; }},
    ]
},

'ch5_madyar_start': {
    speaker: 'Мадьяр', text: '*открывает ноутбук* Орсон. Я разработчик. Ты знаешь что такое код? Настоящий код? Не те фантазии про "исходный код Нивал", а реальный работающий код?',
    choices: [
        { text: 'Я знаю про код больше тебя!', next: null, effect: () => { S.shiza += 5; R.madyar -= 10; GameState.scene = 'ch5_madyar_argue'; }},
        { text: 'Покажи', next: null, effect: () => { S.charisma += 3; GameState.scene = 'ch5_madyar_show'; }},
    ]
},

'ch5_madyar_argue': {
    speaker: 'Мадьяр', text: '*тяжёлый вздох* Орсон. Ты скачал PDF с форума и думаешь что нашёл исходный код. Это как найти инструкцию к микроволновке и думать что ты физик-ядерщик.',
    choices: [
        { text: 'ЭТО ДРУГОЕ!', next: null, effect: () => { GameState.scene = 'ch5_madyar_battle'; }},
        { text: '...Может ты прав', next: null, effect: () => { S.charisma += 10; R.madyar += 10; GameState.scene = 'ch5_madyar_end'; }},
    ]
},

'ch5_madyar_show': {
    speaker: 'Мадьяр', text: '*показывает экран* Вот. Настоящий код. Модификация Heroes 5. Рабочая. Протестированная. Без теорий заговора. Просто... код. Который работает. Скучно, да?',
    choices: [
        { text: 'Добавь туда Реборн!', next: null, effect: () => { S.shiza += 3; R.madyar -= 5; GameState.scene = 'ch5_madyar_end'; }},
        { text: 'Уважаю работу', next: null, effect: () => { R.madyar += 15; GameState.scene = 'ch5_madyar_end'; }},
    ]
},

'ch5_madyar_battle': {
    speaker: '', text: 'МИНИ-БОСС: МАДЬЯР — Архитектор Кода!',
    choices: [
        { text: '⚔️ СРАЖАТЬСЯ', next: null, effect: () => {
            GameState.battleData = { enemy: 'Мадьяр', hp: 30, atk: 7, def: 4, sprite: 'madyar',
                attacks: ['Компиляция', 'Дебаг-луч', 'Сегфолт'], flavor: 'Мадьяр компилирует контраргументы.' };
            GameState.afterBattle = 'ch5_madyar_end';
            GameState.scene = 'battle';
        }},
        { text: '🕊️ ОТСТУПИТЬ', next: null, effect: () => { GameState.scene = 'ch5_madyar_end'; }},
    ]
},

'ch5_madyar_end': {
    speaker: '', text: 'Мадьяр закрывает ноутбук и кивает.',
    choices: [
        { text: '(К Вайтузу)', next: null, effect: () => { GameState.scene = 'ch5_vaituz_start'; }},
        { text: '(Обратиться ко всем)', next: null, effect: () => { GameState.scene = 'ch5_everyone_attacks'; }},
    ]
},

'ch5_vaituz_start': {
    speaker: 'Вайтуз', text: 'Эээ... Орсон... ты... *жуёт яблоко* ...ты помнишь тот раз, когда ты на меня орал 3 часа потому что я сказал что Тройка тоже неплохая? Я... эээ... я обиделся. Немного. На три года.',
    choices: [
        { text: 'Прости, Витус', next: null, effect: () => { R.vaituz += 20; S.charisma += 10; GameState.scene = 'ch5_vaituz_forgive'; }},
        { text: 'Тройка ДЕЙСТВИТЕЛЬНО хуже!', next: null, effect: () => { S.shiza += 3; R.vaituz -= 10; GameState.scene = 'ch5_vaituz_again'; }},
        { text: 'Три года?!', next: null, effect: () => { GameState.scene = 'ch5_vaituz_years'; }},
    ]
},

'ch5_vaituz_forgive': {
    speaker: 'Вайтуз', text: '...Правда? Ты... извинился? *роняет яблоко* Никто... эээ... ни разу не извинялся передо мной. *подбирает яблоко* Спасибо, Орсон.',
    choices: [
        { text: '(Обнять Вайтуза)', next: null, effect: () => { F.vaituz_friend = true; R.vaituz += 10; GameState.scene = 'ch5_vaituz_end'; }},
    ]
},

'ch5_vaituz_again': {
    speaker: 'Вайтуз', text: '...Вот. Опять. *вздыхает* У меня мозг не кипит, но сердце кипит. Иногда. Ладно, я привык. *грустно жуёт яблоко*',
    choices: [
        { text: '(Идти дальше)', next: null, effect: () => { GameState.scene = 'ch5_vaituz_end'; }},
    ]
},

'ch5_vaituz_years': {
    speaker: 'Вайтуз', text: 'Да. Три. Года. Я каждый вечер вспоминал и жевал яблоко. Яблоко помогает. Когда жуёшь — не плачешь. Эээ... это мудрость.',
    choices: [
        { text: 'Мне жаль', next: null, effect: () => { R.vaituz += 10; S.charisma += 5; GameState.scene = 'ch5_vaituz_end'; }},
        { text: '(Молча отойти)', next: null, effect: () => { GameState.scene = 'ch5_vaituz_end'; }},
    ]
},

'ch5_vaituz_end': {
    speaker: '', text: 'Вайтуз отходит, жуя яблоко.',
    choices: [
        { text: '(Обратиться ко всем)', next: null, effect: () => { GameState.scene = 'ch5_everyone_attacks'; }},
    ]
},

'ch5_everyone_attacks': {
    speaker: '', text: 'Все персонажи окружают Орсона. Говорят одновременно. Обвинения, претензии, упрёки — со всех сторон. Уровень ТРЯСКИ растёт.',
    choices: [
        { text: '(Кричать в ответ)', next: null, effect: () => { S.chaos += 15; GameState.tshake += 20; GameState.scene = 'ch5_chaos_peak'; }},
        { text: '(Молчать)', next: null, effect: () => { S.charisma += 15; GameState.scene = 'ch5_silence_power'; }},
        { text: '(Сказать "Я просто шучу")', next: null, effect: () => { S.troll += 10; GameState.scene = 'ch5_just_joking'; }},
    ]
},

'ch5_chaos_peak': {
    speaker: 'Орсон', text: 'ВЫ ВСЕ ПРОТИВ МЕНЯ! ЗАГОВОР! Я ЗНАЛ! ВИЛЬГЕФОРТС — ПРЕДАТЕЛЬ! КОБ — ВОР! ВАЙТУЗ — ТОРМОЗ! ВЫ ВСЕ... ВЫ ВСЕ... *голос срывается* ...вы все правы. И я это знаю.',
    choices: [
        { text: '...', next: null, effect: () => { GameState.scene = 'ch5_breakdown'; }},
    ]
},

'ch5_silence_power': {
    speaker: '', text: '*Орсон молчит. Впервые — молчит. Все замолкают тоже. Тишина. Минута. Две. Периклес тихо плачет в углу. Вайтуз перестаёт жевать.*',
    choices: [
        { text: '...Я устал', next: null, effect: () => { S.charisma += 10; GameState.scene = 'ch5_tired'; }},
    ]
},

'ch5_just_joking': {
    speaker: '', text: '*Все одновременно:* "НЕТ. НЕ ШУТИШЬ. ТЫ НИКОГДА НЕ ШУТИШЬ. ТЫ ПРОСТО НЕ УМЕЕШЬ ИЗВИНЯТЬСЯ."',
    choices: [
        { text: '(Замолчать)', next: null, effect: () => { GameState.scene = 'ch5_breakdown'; }},
    ]
},

'ch5_breakdown': {
    speaker: 'Орсон', text: '...Я не хотел... Я просто хотел чтобы меня услышали. Заметили. Что кто-то ответит. Что кто-то не проигнорирует. Тишина — хуже смерти. Понимаете?',
    choices: [
        { text: '(Продолжить)', next: null, effect: () => { GameState.scene = 'ch5_catharsis'; }},
    ]
},

'ch5_tired': {
    speaker: 'Орсон', text: 'Я устал спорить. Устал доказывать. Устал быть самым умным в комнате. Может потому что я не самый умный. Может потому что комнаты нет. Может потому что... *пауза* ...забудьте.',
    choices: [
        { text: '(Продолжить)', next: null, effect: () => { GameState.scene = 'ch5_catharsis'; }},
    ]
},

'ch5_catharsis': {
    speaker: 'Периклес', text: '*тихо* Вот и всё, герой. Ты прошёл через них. Теперь — последнее испытание. Ты сам.',
    choices: [
        { text: '(Идти к финалу)', next: null, effect: () => { GameState.chapter = 6; GameState.scene = 'ch6_start'; }},
    ]
},

// ============== ГЛАВА 6: ОДИНОЧЕСТВО И ПРОШЛОЕ ==============
'ch6_start': {
    speaker: '', text: 'ГЛАВА 6: ЭКРАН ЗАГРУЗКИ.\n\nПустая комната. Компьютер. Heroes 5 на экране. Орсон один. Впервые — осознанно один.',
    choices: [
        { text: '(Сесть за компьютер)', next: null, effect: () => { GameState.scene = 'ch6_heroes'; }},
        { text: '(Просто сидеть)', next: null, effect: () => { GameState.scene = 'ch6_sit'; }},
    ]
},

'ch6_heroes': {
    speaker: '', text: 'Heroes 5. Главное меню. Музыка. Та самая. 30-35 фпс. Орсон помнит. Ему было 15. Мир был проще. Форумов не было. Споров не было. Была только игра.',
    choices: [
        { text: '(Начать новую игру)', next: null, effect: () => { GameState.scene = 'ch6_new_game'; }},
        { text: '(Загрузить сохранение)', next: null, effect: () => { GameState.scene = 'ch6_load_save'; }},
        { text: '(Выключить)', next: null, effect: () => { GameState.scene = 'ch6_shutdown'; }},
    ]
},

'ch6_new_game': {
    speaker: 'Орсон', text: 'Новая игра... Как тогда. Когда всё только начиналось. Когда Heroes 5 была просто игрой, а не идеологией. Когда Реборн был просто фантазией, а не... *замолкает*',
    choices: [
        { text: '(Играть молча)', next: null, effect: () => { S.charisma += 5; GameState.scene = 'ch6_memories'; }},
    ]
},

'ch6_load_save': {
    speaker: '', text: 'Сохранение: "Кампания Орсона — День 1". Дата: 2009 год. Орсон загружает. На экране — его старый герой. Тот самый. До форумов. До споров. До всего.',
    choices: [
        { text: '(Вспомнить)', next: null, effect: () => { GameState.scene = 'ch6_memories'; }},
    ]
},

'ch6_memories': {
    speaker: 'Орсон', text: '...Помню. Первый замок. Первая армия. Первая победа. Тогда не нужно было никому ничего доказывать. Просто играл. Просто... был счастлив. Когда это изменилось?',
    choices: [
        { text: 'Когда начал спорить', next: null, effect: () => { S.charisma += 10; GameState.scene = 'ch6_when_changed'; }},
        { text: 'Ничего не изменилось', next: null, effect: () => { S.shiza += 5; GameState.scene = 'ch6_denial_final'; }},
    ]
},

'ch6_when_changed': {
    speaker: 'Орсон', text: 'Да... Когда первый раз написал "ты неправ" на форуме. И получил ответ. Внимание. Реакцию. Это было... как наркотик. Чем больше споришь — тем больше тебя замечают. Пока не перестают.',
    choices: [
        { text: '(Продолжить)', next: null, effect: () => { GameState.scene = 'ch6_germanovna'; }},
    ]
},

'ch6_denial_final': {
    speaker: '', text: '*Экран мерцает. Комната начинает таять. Стены трескаются. Мир Меча и Шизофрении рассыпается.*',
    choices: [
        { text: 'Что происходит?!', next: null, effect: () => { GameState.scene = 'ch6_germanovna'; }},
    ]
},

'ch6_shutdown': {
    speaker: '', text: '*Орсон выключает компьютер. Тишина. Абсолютная тишина. Он сидит в тёмной комнате. Один. Без экрана. Без форума. Без голосов.*',
    choices: [
        { text: '(Сидеть в тишине)', next: null, effect: () => { S.charisma += 10; GameState.scene = 'ch6_germanovna'; }},
    ]
},

'ch6_sit': {
    speaker: 'Орсон', text: '*сидит на полу* ...Тихо. Так тихо что слышно как бьётся сердце. Оно бьётся. Значит я живой. Значит... всё это реально? Или нет?',
    choices: [
        { text: '(Ждать)', next: null, effect: () => { GameState.scene = 'ch6_germanovna'; }},
    ]
},

'ch6_germanovna': {
    speaker: '', text: '*Дверь открывается. Входит женщина в белом халате. Спокойная. Уверенная. С блокнотом.*',
    choices: [
        { text: 'Кто вы?', next: null, effect: () => { GameState.scene = 'ch6_germanovna_intro'; }},
        { text: 'Евгения Германовна?', next: null, effect: () => { F.knows_germanovna = true; GameState.scene = 'ch6_germanovna_knows'; }},
    ]
},

'ch6_germanovna_intro': {
    speaker: 'Евгения Германовна', text: 'Евгения Германовна. Твой лечащий врач. Мы разговариваем каждый четверг, Орсон. Ты снова забыл?',
    choices: [
        { text: 'Лечащий... врач?', next: null, effect: () => { S.paranoia += 5; GameState.scene = 'ch6_doctor_reveal'; }},
    ]
},

'ch6_germanovna_knows': {
    speaker: 'Евгения Германовна', text: 'Помнишь меня? Хорошо. Значит сегодня лучше, чем в прошлый раз. Расскажи мне — что ты видел? Замки? Героев? Форумы?',
    choices: [
        { text: 'Всё... всё это было...', next: null, effect: () => { GameState.scene = 'ch6_doctor_reveal'; }},
    ]
},

'ch6_doctor_reveal': {
    speaker: 'Евгения Германовна', text: 'Орсон, проблема не в мире. Проблема в том, что ты превращаешь любой мир в форум. Даже этот. Даже сны. Ты не можешь остановиться. Но мы можем помочь.',
    choices: [
        { text: 'Я не болен!', next: null, effect: () => { S.paranoia += 10; GameState.scene = 'ch6_not_sick'; }},
        { text: '...Помогите', next: null, effect: () => { S.charisma += 15; GameState.scene = 'ch6_accept_help'; }},
        { text: 'А что если я прав?', next: null, effect: () => { S.shiza += 10; GameState.scene = 'ch6_what_if_right'; }},
    ]
},

'ch6_not_sick': {
    speaker: 'Евгения Германовна', text: 'Орсон. Ты сидишь в палате номер 5 — ирония, да? — уже третий месяц. Ты видишь замки, форумы и гномов. Ты споришь с медсёстрами о Heroes 5. Часы на стене показывают 3:47 — ты остановил их в первый день.',
    choices: [
        { text: '...Палата номер 5?', next: null, effect: () => { GameState.scene = 'ch6_ending_choice'; }},
    ]
},

'ch6_accept_help': {
    speaker: 'Евгения Германовна', text: '*улыбается* Это первый шаг, Орсон. Самый тяжёлый. Признать что нужна помощь — это не слабость. Это самое храброе что ты мог сделать.',
    choices: [
        { text: '(Кивнуть)', next: null, effect: () => { F.accepted_help = true; GameState.scene = 'ch6_ending_choice'; }},
    ]
},

'ch6_what_if_right': {
    speaker: 'Евгения Германовна', text: '*пауза* ...А что если? Хороший вопрос. Но даже если ты прав — это не отменяет того, что ты несчастен, одинок, и не спал три месяца. Правота не заменяет покой.',
    choices: [
        { text: '(Задуматься)', next: null, effect: () => { GameState.scene = 'ch6_ending_choice'; }},
    ]
},

// ============== ФИНАЛ: ОПРЕДЕЛЕНИЕ КОНЦОВКИ ==============
'ch6_ending_choice': {
    speaker: '', text: (() => {
        // Calculate ending based on stats
        const totalCharisma = S.charisma || 0;
        const totalShiza = S.shiza || 0;
        const totalChaos = S.chaos || 0;
        const roll = Math.random() * 100;

        if (totalShiza > 50 && roll <= 1) {
            F.ending = 'truth';
            return '*Экран мерцает. Реальность трещит. Стены палаты растворяются...*';
        } else if (totalCharisma > 40 && totalChaos < 30 && roll <= 9 + totalCharisma/5) {
            F.ending = 'victory';
            return '*Орсон чувствует прилив сил. Всё вокруг замирает...*';
        } else {
            F.ending = 'hospital';
            return '*Белый свет. Запах антисептика. Звук капельницы.*';
        }
    })(),
    choices: [
        { text: '(Открыть глаза)', next: null, effect: () => {
            if (F.ending === 'truth') GameState.scene = 'ending_truth';
            else if (F.ending === 'victory') GameState.scene = 'ending_victory';
            else GameState.scene = 'ending_hospital';
        }},
    ]
},

// === КОНЦОВКА 1: БОЛЬНИЦА (90%) ===
'ending_hospital': {
    speaker: '', text: 'КОНЦОВКА: ПАЛАТА №5\n\nОрсон открывает глаза. Белый потолок. Капельница. За окном — не замки, не пиксели, а обычный двор больницы. Евгения Германовна сидит рядом с блокнотом.',
    choices: [
        { text: '(Продолжить)', next: null, effect: () => { GameState.scene = 'ending_hospital_2'; }},
    ]
},

'ending_hospital_2': {
    speaker: 'Евгения Германовна', text: 'С возвращением, Орсон. Тебе снились замки? Опять Heroes? Расскажи мне всё. Мы работаем над этим. Вместе. Каждый четверг. Как всегда.',
    choices: [
        { text: '(Продолжить)', next: null, effect: () => { GameState.scene = 'ending_hospital_3'; }},
    ]
},

'ending_hospital_3': {
    speaker: '', text: 'Орсон смотрит на часы на стене. Они идут. 3:48. Впервые за долгое время — время движется вперёд.\n\n...На тумбочке лежит яблоко. На нём записка: "Эээ... выздоравливай. — В."',
    choices: [
        { text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }},
    ]
},

// === КОНЦОВКА 2: ПОБЕДА (9%) ===
'ending_victory': {
    speaker: '', text: 'КОНЦОВКА: ЗАКЛИНАТЕЛЬ ТРЯСКИ\n\nОрсон встаёт. Мир Меча и Шизофрении преклоняется перед ним. Все споры выиграны. Все форумы покорены. Все враги побеждены.',
    choices: [
        { text: '(Продолжить)', next: null, effect: () => { GameState.scene = 'ending_victory_2'; }},
    ]
},

'ending_victory_2': {
    speaker: 'Орсон', text: 'Я победил. Всех. Каждого. И знаете что? ...Мне скучно. Некого спорить. Некого трясти. Некого провоцировать. Это... это хуже поражения.',
    choices: [
        { text: '(Продолжить)', next: null, effect: () => { GameState.scene = 'ending_victory_3'; }},
    ]
},

'ending_victory_3': {
    speaker: '', text: 'Орсон сидит на троне из выигранных аргументов. Вокруг — тишина. Та самая тишина, которую он боялся больше всего. Он победил мир. И остался один.\n\nНавсегда.',
    choices: [
        { text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }},
    ]
},

// === КОНЦОВКА 3: ПРАВДА (1%) ===
'ending_truth': {
    speaker: '', text: 'КОНЦОВКА: ИСХОДНЫЙ КОД\n\nСтены палаты рассыпаются. За ними — код. Реальный код. Нивал. Heroes 5. Всё что Орсон говорил — ПРАВДА.',
    choices: [
        { text: '(Продолжить)', next: null, effect: () => { GameState.scene = 'ending_truth_2'; }},
    ]
},

'ending_truth_2': {
    speaker: 'Евгения Германовна', text: '...Невозможно. Ты... ты был прав? Всё это время? Исходный код... параллельная реальность... Реборн... Всё настоящее?!',
    choices: [
        { text: '(Продолжить)', next: null, effect: () => { GameState.scene = 'ending_truth_3'; }},
    ]
},

'ending_truth_3': {
    speaker: 'Орсон', text: 'Я. Был. Прав. *ухмылка превосходства* Какие же вы жалкие, ребят. Все до единого. А теперь... теперь начинается НАСТОЯЩИЙ Реборн.\n\n...30-35 фпс. Как в 2009 году.',
    choices: [
        { text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }},
    ]
},

// === CREDITS ===
'credits': {
    speaker: '', text: 'МЕЧ И ШИЗОФРЕНИЯ\n\nСпасибо за игру!\n\nОрсон — провокатор, манипулятор, гений, одиночка.\nИ иногда — действительно бывает прав.\n\nЭто самое страшное.',
    choices: [
        { text: 'В ГЛАВНОЕ МЕНЮ', next: null, effect: () => { location.reload(); }},
    ]
},

        }; // end nodes

        const node = nodes[sceneId];
        if (!node) return { speaker: '', text: 'Сцена не найдена: ' + sceneId, choices: [{ text: 'Назад', next: null, effect: () => { GameState.scene = 'title'; }}] };
        return node;
    }

    return { getNode };
})();
