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
    tshake: 0,
    karma: 0,       // hidden: positive = empathy, negative = cruelty
    secretItems: 0,  // hidden: count of secret collectibles found
    liesCount: 0,    // hidden: how many times Orson lied
    silenceCount: 0, // hidden: how many times player chose silence
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
        { text: 'Продолжить', next: null, effect: () => { GameState.scene = 'intro_2'; }},
    ]
},

'intro_2': {
    speaker: '', text: 'Орсон печатает. Быстро. Яростно. Ответ на форуме. 2847 слов. Контраргумент, который никто не просил. В соседней вкладке — его собственный пост с нулём лайков.',
    choices: [
        { text: '(Отправить ответ)', next: null, effect: () => { GameState.scene = 'intro_3'; }},
        { text: '(Удалить и лечь спать)', next: null, effect: () => { GameState.karma += 1; GameState.scene = 'intro_3'; }},
    ]
},

'intro_3': {
    speaker: 'Орсон', text: '*зевает* ...Ещё одна вкладка. Последняя. Ладно — предпоследняя. Ладно — ещё час. Ладно — до рассвета. Кому нужен сон когда есть ИСТИНА...',
    choices: [
        { text: '(Экран мерцает...)', next: null, effect: () => { GameState.scene = 'intro_blackout'; }},
    ]
},

'intro_blackout': {
    speaker: '', text: '*Экран гаснет. Свет мерцает. Квартира растворяется. Последнее что видит Орсон — часы. 3:47. Всегда 3:47.*\n\n. . .',
    choices: [
        { text: '(Темнота)', next: null, effect: () => { GameState.chapter = 1; GameState.scene = 'ch1_wake'; }},
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
    speaker: 'Периклес', text: 'Путь начинается с первого шага. Или с правого. Я всегда путаю. Я Периклес, гном-проводник! Позволь старому гному дать тебе совет... ты наконец проснулся! Три дня ждали! Твоя миссия — пройти через мир Меча и Шизофрении!',
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
    speaker: '', text: 'Вы обыскиваете замок. Находите: потрёпанный багет (может использоваться как оружие), зарядку (без розетки), и свиток с надписью: "Если ты это читаешь — беги." За гобеленом что-то виднеется...',
    choices: [
        { text: '🍞 Взять багет-оружие', next: null, effect: () => { GameState.inventory.push({id:'baguette', name:'Боевой Багет', desc:'+3 к атаке, -5 к достоинству'}); GameState.scene = 'ch1_castle_armory'; }},
        { text: '🔌 Взять зарядку', next: null, effect: () => { GameState.inventory.push({id:'charger', name:'Зарядка', desc:'Нет розетки в средневековье'}); GameState.scene = 'ch1_castle_armory'; }},
        { text: '📜 Прочитать свиток', next: null, effect: () => { S.paranoia += 3; GameState.scene = 'ch1_scroll_warning'; }},
        { text: '🔍 Проверить гобелен', next: null, effect: () => { GameState.scene = 'ch1_hidden_door'; }},
    ]
},

'ch1_scroll_warning': {
    speaker: '', text: 'Свиток: "Предупреждение: этот мир реагирует на твоё поведение. Чем больше ты провоцируешь — тем сильнее мир провоцирует тебя. Чем больше тряска — тем ближе финал. С уважением, Е.Г."',
    choices: [
        { text: 'Кто такая Е.Г.?', next: null, effect: () => { F.noticed_eg = true; GameState.scene = 'ch1_castle_exit'; }},
        { text: 'Тряска? Какая тряска?', next: null, effect: () => { GameState.scene = 'ch1_castle_exit'; }},
    ]
},

'ch1_hidden_door': {
    speaker: '', text: 'За гобеленом на стене вы обнаруживаете скрытую дверь. Она покрыта символами, похожими на код. Замок — в виде головоломки из цифр: 3, 4, 7.',
    choices: [
        { text: '(Ввести 347)', next: null, effect: () => { GameState.secretItems++; F.found_hidden_room = true; GameState.scene = 'ch1_secret_room'; }},
        { text: '(Ввести 573)', next: null, effect: () => { S.paranoia += 2; GameState.scene = 'ch1_wrong_code'; }},
        { text: '(Не трогать)', next: null, effect: () => { GameState.scene = 'ch1_corridor'; }},
    ]
},

'ch1_wrong_code': {
    speaker: '', text: '*Из двери раздаётся звук: "Неверный код. Попробуйте подумать. Как время на часах."*',
    choices: [
        { text: '3:47! (Ввести 347)', next: null, effect: () => { GameState.secretItems++; F.found_hidden_room = true; GameState.scene = 'ch1_secret_room'; }},
        { text: '(Уйти)', next: null, effect: () => { GameState.scene = 'ch1_corridor'; }},
    ]
},

'ch1_secret_room': {
    speaker: '', text: 'Тайная комната. На стенах — фрески с историей этого мира. В центре — алтарь с зеркалом. На алтаре записка: "Тот кто найдёт это место — ближе к истине, чем думает. — Е.Г." Под запиской — странный предмет.',
    choices: [
        { text: '🔮 Взять "Осколок правды"', next: null, effect: () => { GameState.inventory.push({id:'truth_shard', name:'Осколок правды', desc:'Светится когда рядом ложь'}); GameState.scene = 'ch1_secret_room_2'; }},
        { text: '(Посмотреть в зеркало)', next: null, effect: () => { GameState.scene = 'ch1_secret_mirror'; }},
    ]
},

'ch1_secret_room_2': {
    speaker: 'Орсон', text: '*осматривает предмет* Осколок правды... Светится... Это не Heroes 5, это что-то другое. Что-то... настоящее? Кто такая Е.Г.?',
    choices: [
        { text: '(Запомнить инициалы)', next: null, effect: () => { F.eg_curious = true; GameState.scene = 'ch1_corridor'; }},
    ]
},

'ch1_secret_mirror': {
    speaker: '', text: 'В зеркале — не ваше отражение. Там — Орсон. Но другой. В больничной рубашке. С браслетом на руке. Он смотрит на вас и говорит беззвучно: "Проснись."',
    choices: [
        { text: '...ЧТО?!', next: null, effect: () => { S.paranoia += 10; S.shiza += 5; F.saw_hospital_vision = true; GameState.scene = 'ch1_mirror_shock'; }},
    ]
},

'ch1_mirror_shock': {
    speaker: 'Орсон', text: '*отшатывается* Нет. Нет нет нет. Это глюк. Зеркало сломанное. Я миллионер из Франции, а не... не... *трёт глаза* ...Показалось. Точно показалось.',
    choices: [
        { text: '(Уйти быстро)', next: null, effect: () => { GameState.scene = 'ch1_corridor'; }},
    ]
},

'ch1_castle_armory': {
    speaker: '', text: 'Оружейная комната замка. На стенах — мечи, щиты, арбалеты. Один меч отличается от остальных — он деревянный и на нём написано: "Меч и Шизофрения". Лезвие сделано из клавиш клавиатуры.',
    choices: [
        { text: '⚔️ Взять Меч Шизофрении', next: null, effect: () => { GameState.inventory.push({id:'schizo_sword', name:'Меч Шизофрении', desc:'Наносит урон аргументами'}); S.shiza += 3; GameState.scene = 'ch1_took_sword'; }},
        { text: '🛡️ Взять щит "Игнор"', next: null, effect: () => { GameState.inventory.push({id:'ignore_shield', name:'Щит Игнора', desc:'+5 к защите от провокаций'}); GameState.scene = 'ch1_castle_exit'; }},
        { text: '(Пройти мимо)', next: null, effect: () => { GameState.scene = 'ch1_castle_exit'; }},
    ]
},

'ch1_took_sword': {
    speaker: 'Орсон', text: '*берёт меч* Меч из клавиш клавиатуры. Моё идеальное оружие. Каждый удар — аргумент. Каждый блок — контраргумент. Это... ВЕЛИКОЛЕПНО.',
    choices: [
        { text: '(Идти к выходу)', next: null, effect: () => { GameState.scene = 'ch1_castle_exit'; }},
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

'ch2_tavern': {
    speaker: '', text: 'Таверна "Оффтопик". Тёмная, дымная, шумная. У стойки — бармен полирует кружку. В углу — спор на повышенных тонах. На стене — доска объявлений.',
    choices: [
        { text: '(К бармену)', next: null, effect: () => { GameState.scene = 'ch2_bartender'; }},
        { text: '(Посмотреть на спор)', next: null, effect: () => { GameState.scene = 'ch2_tavern_argument'; }},
        { text: '(Доска объявлений)', next: null, effect: () => { GameState.scene = 'ch2_board'; }},
        { text: '(Уйти)', next: null, effect: () => { GameState.scene = 'ch2_park'; }},
    ]
},

'ch2_bartender': {
    speaker: 'Бармен', text: 'О, свежее лицо! Обычно тут одни и те же. Что будешь? Чай "Антитролль", пиво "404 Not Found", или коктейль "Бан Хаммер"?',
    choices: [
        { text: 'Чай "Антитролль"', next: null, effect: () => { GameState.hp = Math.min(GameState.hp + 5, GameState.maxHp); GameState.scene = 'ch2_bartender_chat'; }},
        { text: 'Коктейль "Бан Хаммер"', next: null, effect: () => { S.chaos += 3; GameState.tshake += 5; GameState.scene = 'ch2_bartender_chat'; }},
        { text: 'Инфу давай', next: null, effect: () => { GameState.scene = 'ch2_bartender_info'; }},
    ]
},

'ch2_bartender_chat': {
    speaker: 'Бармен', text: 'Ты же Орсон, да? Тот самый? У нас тут ставки — сколько минут ты продержишься без спора. Рекорд — 7 минут. Побьёшь?',
    choices: [
        { text: 'ЭТО ОСКОРБЛЕНИЕ!', next: null, effect: () => { S.chaos += 5; GameState.tshake += 5; GameState.scene = 'ch2_tavern_argue'; }},
        { text: '...Может побью', next: null, effect: () => { S.charisma += 5; GameState.karma += 2; GameState.scene = 'ch2_bartender_respect'; }},
    ]
},

'ch2_bartender_info': {
    speaker: 'Бармен', text: '*наклоняется* Слушай... видел тут одного типа. В тёмном плаще. Спрашивал о тебе. Имя — Вильгефортс. Сказал что будет ждать на Площади. И ещё — "передай ему что зеркало не врёт". Странный мужик.',
    choices: [
        { text: 'Зеркало?!', next: null, effect: () => { S.paranoia += 5; F.heard_about_vilgefortz = true; GameState.scene = 'ch2_park'; }},
        { text: 'Спасибо за инфу', next: null, effect: () => { F.heard_about_vilgefortz = true; GameState.scene = 'ch2_park'; }},
    ]
},

'ch2_bartender_respect': {
    speaker: 'Бармен', text: '*удивлён* Ого. Не ожидал. Знаешь что — на дорожку. Бесплатно. *ставит на стол флягу* Эликсир "Ясный Ум". Пригодится когда Тряска зашкалит.',
    choices: [
        { text: '(Взять)', next: null, effect: () => { GameState.inventory.push({id:'clear_mind', name:'Эликсир "Ясный Ум"', desc:'Снижает Тряску на 20'}); GameState.scene = 'ch2_park'; }},
    ]
},

'ch2_tavern_argue': {
    speaker: 'Бармен', text: '4 секунды. Новый антирекорд. *записывает на доске* Ладно, допивай и иди. Тут не место для твоей энергии, приятель.',
    choices: [
        { text: '(Уйти, хлопнув дверью)', next: null, effect: () => { S.chaos += 3; GameState.scene = 'ch2_park'; }},
    ]
},

'ch2_tavern_argument': {
    speaker: '', text: 'Двое спорят о том, что лучше — Heroes 3 или Heroes 5. Спор идёт уже 4 дня. Оба выглядят ужасно. Вокруг них — стена из распечатанных аргументов.',
    choices: [
        { text: 'ПЯТЁРКА ЛУЧШЕ!', next: null, effect: () => { S.chaos += 5; S.troll += 3; GameState.tshake += 10; GameState.scene = 'ch2_tavern_chaos'; }},
        { text: '(Наблюдать молча)', next: null, effect: () => { GameState.silenceCount++; GameState.scene = 'ch2_tavern_observe'; }},
        { text: 'Ребята, может хватит?', next: null, effect: () => { S.charisma += 5; GameState.karma += 3; GameState.scene = 'ch2_tavern_peace'; }},
    ]
},

'ch2_tavern_chaos': {
    speaker: '', text: '*Оба спорщика замолкают. Смотрят на Орсона. Потом — друг на друга. Потом — снова на Орсона. И говорят хором: "А вот и главный токсик пришёл."*',
    choices: [
        { text: 'Я НЕ ТОКСИК!', next: null, effect: () => { S.chaos += 3; GameState.scene = 'ch2_park'; }},
        { text: '...Ладно, ладно. Ухожу.', next: null, effect: () => { GameState.scene = 'ch2_park'; }},
    ]
},

'ch2_tavern_observe': {
    speaker: '', text: '*Орсон молча слушает. Через 5 минут понимает: он слышит себя. Те же аргументы. Те же интонации. Те же "ты неправ и вот почему". Это как смотреть в зеркало, только хуже.*',
    choices: [
        { text: '(Уйти потрясённым)', next: null, effect: () => { S.charisma += 5; F.saw_himself_in_others = true; GameState.scene = 'ch2_park'; }},
    ]
},

'ch2_tavern_peace': {
    speaker: 'Спорщик 1', text: '*оба замолкают* ...Он прав. 4 дня. Я не ел. Я забыл как зовут жену. ...Спасибо, незнакомец. *обнимает второго спорщика*',
    choices: [
        { text: '(Улыбнуться)', next: null, effect: () => { GameState.karma += 5; GameState.scene = 'ch2_tavern_reward'; }},
    ]
},

'ch2_tavern_reward': {
    speaker: 'Спорщик 2', text: 'Держи. *даёт предмет* Это "Камень Согласия". Древний артефакт. Когда его держишь — хочется перестать спорить. Мы больше не будем. Обещаем.',
    choices: [
        { text: '(Взять)', next: null, effect: () => { GameState.secretItems++; GameState.inventory.push({id:'agree_stone', name:'Камень Согласия', desc:'Снижает агрессию вокруг'}); GameState.scene = 'ch2_park'; }},
    ]
},

'ch2_board': {
    speaker: '', text: 'Доска объявлений:\n- "ВНИМАНИЕ: Разыскивается тролль по кличке OrsonGPT. Награда: 0 монет. Мотивация: покой"\n- "Продам мод для Heroes 5 (краденый) — Коб"\n- "Дельтаплан б/у. Казахстан. Почти не бит. — Чеб"\n- "Приём пациентов по четвергам. — Е.Г."',
    choices: [
        { text: 'Пациентов?! Е.Г.?!', next: null, effect: () => { S.paranoia += 5; F.eg_board = true; GameState.scene = 'ch2_tavern'; }},
        { text: 'Краденый мод?! Это КОБ!', next: null, effect: () => { S.troll += 2; GameState.scene = 'ch2_tavern'; }},
        { text: '(Уйти)', next: null, effect: () => { GameState.scene = 'ch2_park'; }},
    ]
},

'ch2_fountain': {
    speaker: '', text: 'В центре площади — фонтан. Вода течёт... текстом. Буквально — вместо воды льются строки кода. На дне фонтана — монеты и записки с желаниями.',
    choices: [
        { text: '(Бросить монету и загадать)', next: null, effect: () => { GameState.scene = 'ch2_fountain_wish'; }},
        { text: '(Прочитать записки)', next: null, effect: () => { GameState.scene = 'ch2_fountain_notes'; }},
        { text: '(Идти дальше)', next: null, effect: () => { GameState.scene = 'ch2_park'; }},
    ]
},

'ch2_fountain_wish': {
    speaker: '', text: 'Что загадать?',
    choices: [
        { text: 'Чтобы все признали мою правоту', next: null, effect: () => { S.shiza += 5; GameState.scene = 'ch2_fountain_response_ego'; }},
        { text: 'Чтобы вернуться домой', next: null, effect: () => { S.charisma += 3; GameState.scene = 'ch2_fountain_response_home'; }},
        { text: 'Чтобы перестать спорить', next: null, effect: () => { S.charisma += 10; GameState.karma += 5; GameState.scene = 'ch2_fountain_response_peace'; }},
    ]
},

'ch2_fountain_response_ego': {
    speaker: '', text: '*Фонтан булькает. Из воды выскакивает рыбка-текст: "Ваше желание отклонено. Причина: неосуществимо. Подпись: Реальность."*',
    choices: [
        { text: 'Даже ФОНТАН против меня!', next: null, effect: () => { S.paranoia += 5; GameState.scene = 'ch2_park'; }},
    ]
},

'ch2_fountain_response_home': {
    speaker: '', text: '*Фонтан светится. Тёплый свет. На секунду кажется что вы видите свою квартиру... ноутбук... 47 вкладок... Потом — исчезает.*',
    choices: [
        { text: '...', next: null, effect: () => { GameState.scene = 'ch2_park'; }},
    ]
},

'ch2_fountain_response_peace': {
    speaker: '', text: '*Фонтан замирает. Тишина. Потом шёпот: "Это желание... возможно. Но цена — молчание. Ты готов?" Из воды появляется "Жетон тишины".*',
    choices: [
        { text: '(Взять жетон)', next: null, effect: () => { GameState.secretItems++; GameState.inventory.push({id:'silence_token', name:'Жетон тишины', desc:'Мощный артефакт. Что он делает?'}); F.has_silence_token = true; GameState.scene = 'ch2_park'; }},
        { text: 'Нет. Молчание — смерть.', next: null, effect: () => { S.paranoia += 3; GameState.scene = 'ch2_park'; }},
    ]
},

'ch2_fountain_notes': {
    speaker: '', text: 'Записки:\n- "Хочу чтобы Орсон перестал спорить" — Вайтуз\n- "Хочу 200 монет на ресторан" — Коб\n- "Хочу чтобы мой дельтаплан не разбивался" — Чеб\n- "Хочу чтобы он проснулся" — Е.Г.',
    choices: [
        { text: '...проснулся?', next: null, effect: () => { S.paranoia += 5; F.eg_note = true; GameState.scene = 'ch2_park'; }},
    ]
},

'ch2_park': {
    speaker: '', text: 'Парк Форум-Сити. Деревья из ASCII-арта. Скамейки с табличками: "Модератор сидел здесь". На одной скамейке сидит человек в зелёных наушниках и жуёт яблоко. В центре — фонтан. Рядом — вход в таверну.',
    choices: [
        { text: '(Подойти к человеку)', next: null, effect: () => { GameState.scene = 'ch2_meet_vaituz_park'; }},
        { text: '(Сесть на другую скамейку)', next: null, effect: () => { GameState.scene = 'ch2_bench_rest'; }},
        { text: '(К фонтану)', next: null, effect: () => { GameState.scene = 'ch2_fountain'; }},
        { text: '(В таверну "Оффтопик")', next: null, effect: () => { GameState.scene = 'ch2_tavern'; }},
        { text: '(Идти к магазину)', next: null, effect: () => { GameState.chapter = 3; GameState.scene = 'ch3_start'; }},
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
        { text: '(Остыть)', next: null, effect: () => { GameState.scene = 'ch3_basement'; }},
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

'ch3_basement': {
    speaker: 'Аркадий', text: '*оглядывается* Слушай... У меня внизу кое-что есть. Для особых клиентов. Хочешь посмотреть?',
    choices: [
        { text: 'Показывай', next: null, effect: () => { GameState.scene = 'ch3_basement_enter'; }},
        { text: 'Нет, спасибо', next: null, effect: () => { GameState.scene = 'ch3_after_shop'; }},
    ]
},

'ch3_basement_enter': {
    speaker: '', text: 'Подвал магазина. На полках — странные предметы. "Записи терапевтических сессий — 2023". "Дневник пациента К.". Фотографии людей, которых вы не знаете. Или знаете?',
    choices: [
        { text: '(Читать "Дневник пациента К.")', next: null, effect: () => { S.paranoia += 10; GameState.secretItems++; GameState.scene = 'ch3_diary'; }},
        { text: '(Посмотреть фотографии)', next: null, effect: () => { S.paranoia += 5; GameState.scene = 'ch3_photos'; }},
        { text: '(Быстро уйти)', next: null, effect: () => { GameState.scene = 'ch3_after_shop'; }},
    ]
},

'ch3_diary': {
    speaker: '', text: '"Дневник пациента К." Запись 47:\n"Он снова видит замки. Говорит что нашёл код. Настаивает что мир игры — реальный. Диагноз без изменений. Рекомендовано увеличить дозировку. — Е.Г."',
    choices: [
        { text: '...Пациент К.?', next: null, effect: () => { F.read_diary = true; S.shiza += 5; GameState.scene = 'ch3_diary_reaction'; }},
    ]
},

'ch3_diary_reaction': {
    speaker: 'Орсон', text: 'Кто... кто этот "пациент К."? Почему инициалы К.? Коля? ...НЕТ. Это совпадение. Это ДРУГОЙ человек. Я не пациент. Я миллионер. Из ФРАНЦИИ.',
    choices: [
        { text: '(Выйти из подвала)', next: null, effect: () => { GameState.scene = 'ch3_after_shop'; }},
    ]
},

'ch3_photos': {
    speaker: '', text: 'Фотографии: палата больницы (белая, стерильная), человек за столом (лицо размыто), женщина в белом халате (знакомая?), часы на стене — 3:47.',
    choices: [
        { text: 'Это те же часы!', next: null, effect: () => { S.paranoia += 10; F.saw_hospital_photos = true; GameState.scene = 'ch3_after_shop'; }},
        { text: '(Не думать об этом)', next: null, effect: () => { GameState.scene = 'ch3_after_shop'; }},
    ]
},

'ch3_arkadiy_truth': {
    speaker: 'Аркадий', text: 'Орсон... Я скажу тебе кое-что. Этот магазин — не магазин. Это... перекрёсток. Место, где ты можешь услышать правду. Если захочешь. Большинство не хочет.',
    choices: [
        { text: 'Скажи мне правду', next: null, effect: () => { S.charisma += 10; GameState.scene = 'ch3_truth_told'; }},
        { text: 'Мне не нужна твоя правда', next: null, effect: () => { S.paranoia += 5; GameState.scene = 'ch3_after_shop'; }},
    ]
},

'ch3_truth_told': {
    speaker: 'Аркадий', text: 'Всё что ты видишь... замки, гномы, мечи... это декорации. Настоящий мир — за ними. И он не такой красивый. Но зато — настоящий. Ты готов его увидеть?',
    choices: [
        { text: 'Не сейчас', next: null, effect: () => { GameState.scene = 'ch3_after_shop'; }},
        { text: '...Покажи', next: null, effect: () => { F.arkadiy_truth = true; S.charisma += 15; GameState.scene = 'ch3_glimpse'; }},
    ]
},

'ch3_glimpse': {
    speaker: '', text: '*На секунду стены магазина исчезают. Вы видите белую комнату. Капельницу. Кровать. Блокнот с надписью "сессия 47". Потом — всё возвращается.* ...Что это было?',
    choices: [
        { text: '(Молчать)', next: null, effect: () => { GameState.silenceCount++; GameState.scene = 'ch3_after_shop'; }},
    ]
},

'ch3_pericles_worried': {
    speaker: 'Периклес', text: '*тянет за рукав* Герой... ты бледный. Что ты видел в подвале? Не надо туда ходить. Аркадий... он не тот за кого себя выдаёт. Он не продавец.',
    choices: [
        { text: 'А кто он?', next: null, effect: () => { GameState.scene = 'ch3_pericles_who'; }},
        { text: '(Проигнорировать)', next: null, effect: () => { GameState.scene = 'ch3_after_shop'; }},
    ]
},

'ch3_pericles_who': {
    speaker: 'Периклес', text: '*шёпотом* Никто не знает. Одни говорят — он бывший модератор. Другие — что он из реального мира. Третьи — что его не существует. Выбирай что нравится. Но будь осторожен.',
    choices: [
        { text: '(Запомнить)', next: null, effect: () => { GameState.scene = 'ch3_after_shop'; }},
    ]
},

'ch3_after_shop': {
    speaker: 'Периклес', text: 'Ну что, закупился? Дальше нам надо... *замечает что Орсон задумался* ...Ты в порядке?',
    choices: [
        { text: 'Мне нужен интернет. Срочно.', next: null, effect: () => { GameState.chapter = 4; GameState.scene = 'ch4_start'; }},
        { text: 'Просто идём дальше', next: null, effect: () => { GameState.chapter = 4; GameState.scene = 'ch4_start'; }},
        { text: 'Периклес... что тут происходит?', next: null, effect: () => { GameState.scene = 'ch3_pericles_worried'; }},
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
        { text: '💬 Открыть Discord', next: null, effect: () => { GameState.scene = 'ch4_discord'; }},
        { text: '(Выключить компьютер)', next: null, effect: () => { GameState.scene = 'ch4_dream_sequence'; }},
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

'ch4_discord': {
    speaker: '', text: 'Рядом с форумом — портал с надписью "DISCORD". Из него доносятся голоса. Много голосов. Одновременно. Хаос.',
    choices: [
        { text: '(Войти в Discord)', next: null, effect: () => { GameState.scene = 'ch4_discord_enter'; }},
        { text: '(Не надо)', next: null, effect: () => { GameState.scene = 'ch4_end'; }},
    ]
},

'ch4_discord_enter': {
    speaker: '', text: 'Discord-сервер "HEROES_ULTIMATE". Каналы: #общий (47 непрочитанных), #споры (∞ непрочитанных), #мемы-орсона (закреплено: "не кормите"), #войс-караоке.',
    choices: [
        { text: '#общий', next: null, effect: () => { GameState.scene = 'ch4_discord_general'; }},
        { text: '#споры', next: null, effect: () => { GameState.scene = 'ch4_discord_arguments'; }},
        { text: '#мемы-орсона', next: null, effect: () => { S.paranoia += 5; GameState.scene = 'ch4_discord_memes'; }},
        { text: '#войс-караоке', next: null, effect: () => { GameState.scene = 'ch4_discord_voice'; }},
    ]
},

'ch4_discord_general': {
    speaker: '', text: '#общий:\nKob420: "кто хочет мод? дёшево (краденый, но качественный)"\nCheb_Pilot: "я сделал карту казахстана для Heroes 5! (и разбил ноутбук)"\nVaituz: "эээ... привет... у меня яблоко"\nModerBot: "Орсон забанен на 24 часа (причина: существование)"',
    choices: [
        { text: 'Я ЗАБАНЕН?! ЗА СУЩЕСТВОВАНИЕ?!', next: null, effect: () => { S.paranoia += 10; S.chaos += 5; GameState.scene = 'ch4_discord_banned'; }},
        { text: '(Читать молча)', next: null, effect: () => { GameState.silenceCount++; GameState.scene = 'ch4_discord_lurk'; }},
    ]
},

'ch4_discord_banned': {
    speaker: 'Орсон', text: 'ЗАБАНЕН ЗА СУЩЕСТВОВАНИЕ?! ЭТО ДИСКРИМИНАЦИЯ! ЭТО ЦЕНЗУРА! ЭТО... *создаёт альт-аккаунт за 3 секунды* ...ЭТО ОБХОД БАНА!',
    choices: [
        { text: '(Написать от альта)', next: null, effect: () => { S.troll += 5; S.chaos += 5; GameState.scene = 'ch4_discord_alt'; }},
    ]
},

'ch4_discord_alt': {
    speaker: '', text: 'TotallyNotOrson: "Привет! Я новенький! Кстати, все кто тут сидят — жалкие, а Heroes 5 — лучшая игра..."\nModerBot: "Орсон, мы узнали тебя за 4 слова. Бан на 48 часов."',
    choices: [
        { text: '...Как?!', next: null, effect: () => { GameState.scene = 'ch4_discord_arguments'; }},
    ]
},

'ch4_discord_lurk': {
    speaker: '', text: '*Орсон молча читает чат 20 минут. Видит: люди общаются. Шутят. Смеются. Без него. Мир продолжается без Орсона. И это... больно.*',
    choices: [
        { text: '...', next: null, effect: () => { S.charisma += 5; GameState.karma += 3; F.discord_lurked = true; GameState.scene = 'ch4_end'; }},
    ]
},

'ch4_discord_arguments': {
    speaker: '', text: '#споры:\nТема дня: "Орсон — гений или шизофреник?"\nОпрос: Гений: 3 голоса. Шизофреник: 847 голосов. Третий вариант "и то и другое": 1 голос (Вайтуз).',
    choices: [
        { text: 'ГЕНИЙ! КОНЕЧНО ГЕНИЙ!', next: null, effect: () => { S.shiza += 5; GameState.scene = 'ch4_discord_debate'; }},
        { text: '...847', next: null, effect: () => { S.charisma += 3; GameState.scene = 'ch4_end'; }},
    ]
},

'ch4_discord_debate': {
    speaker: '', text: '*Орсон пишет 3000 слов почему он гений. Через минуту — 12 ответов: "не читал", "tldr", "кто это?", "опять он", и один "респект за упорство" (Вайтуз).*',
    choices: [
        { text: '(Закрыть Discord)', next: null, effect: () => { GameState.scene = 'ch4_end'; }},
    ]
},

'ch4_discord_memes': {
    speaker: '', text: '#мемы-орсона. Закреплено: 347 мемов. Топ-3:\n1. "Орсон_спорит_со_стеной.gif" — 2М просмотров\n2. "Какие_же_вы_жалкие.mp4" — 1.5М\n3. "Тряска_в_войсе_17часов.webm" — 847К',
    choices: [
        { text: 'УДАЛИТЕ ВСЁ!', next: null, effect: () => { S.chaos += 10; GameState.tshake += 10; GameState.scene = 'ch4_discord_memes_rage'; }},
        { text: '...2 миллиона просмотров?', next: null, effect: () => { S.charisma += 3; GameState.scene = 'ch4_discord_memes_fame'; }},
    ]
},

'ch4_discord_memes_rage': {
    speaker: '', text: '*Орсон пытается удалить мемы. У него нет прав. Пытается забанить Акулбота. У него нет прав. Пытается удалить сервер. У него нет прав.* "У ВАС НЕТ ПРАВ" — написано красным.',
    choices: [
        { text: '(Закрыть в ярости)', next: null, effect: () => { GameState.scene = 'ch4_end'; }},
    ]
},

'ch4_discord_memes_fame': {
    speaker: 'Орсон', text: '...Два миллиона. Два МИЛЛИОНА людей видели как я... *задумывается* ...Это слава? Или это позор? В чём разница вообще?',
    choices: [
        { text: '(Закрыть)', next: null, effect: () => { GameState.scene = 'ch4_end'; }},
    ]
},

'ch4_discord_voice': {
    speaker: '', text: 'Войс-канал "Караоке-Конфликт". Внутри: Коб поёт (фальшиво), Чеб комментирует (из Казахстана, связь ужасная), Вайтуз говорит "эээ" каждые 3 секунды.',
    choices: [
        { text: '(Присоединиться)', next: null, effect: () => { GameState.scene = 'ch4_voice_join'; }},
        { text: '(Послушать молча)', next: null, effect: () => { GameState.silenceCount++; GameState.scene = 'ch4_voice_listen'; }},
    ]
},

'ch4_voice_join': {
    speaker: 'Коб', text: 'О! Орсон! Споёшь? У нас тут караоке! Я только что спел "Шиз-Колян"! Все плакали! От радости! ...Или от боли.',
    choices: [
        { text: 'НЕ СМЕЙ ПЕТЬ ЭТУ ПЕСНЮ!', next: null, effect: () => { S.chaos += 10; GameState.tshake += 10; GameState.scene = 'ch4_voice_rage'; }},
        { text: '...Давайте что-нибудь другое', next: null, effect: () => { GameState.karma += 2; GameState.scene = 'ch4_voice_karaoke'; }},
    ]
},

'ch4_voice_rage': {
    speaker: '', text: '*Орсон кричит в микрофон 5 минут. Все мутят его. Продолжает кричать. Его кикают. Заходит снова. Кикают. Заходит. Кикают. 47 раз.*',
    choices: [
        { text: '(Сдаться)', next: null, effect: () => { GameState.scene = 'ch4_end'; }},
    ]
},

'ch4_voice_karaoke': {
    speaker: '', text: '*Неожиданно — момент мира. Коб поёт. Фальшиво, но искренне. Чеб подпевает из Казахстана. Вайтуз говорит "эээ" в ритм. И это... почти красиво.*',
    choices: [
        { text: '(Подпеть)', next: null, effect: () => { S.charisma += 10; GameState.karma += 5; F.sang_karaoke = true; GameState.scene = 'ch4_voice_peace'; }},
        { text: '(Молча слушать)', next: null, effect: () => { GameState.silenceCount++; S.charisma += 5; GameState.scene = 'ch4_end'; }},
    ]
},

'ch4_voice_peace': {
    speaker: 'Вайтуз', text: 'Орсон... ты... поёшь? *восторженный шёпот* У тебя... эээ... красивый голос. Я серьёзно. Без шуток.',
    choices: [
        { text: '...Спасибо, Витус', next: null, effect: () => { R.vaituz += 5; GameState.scene = 'ch4_end'; }},
    ]
},

'ch4_voice_listen': {
    speaker: '', text: '*Орсон слушает. Просто слушает. Впервые за долгое время — не говорит. Не спорит. Не доказывает. Просто... является частью чего-то. Тихо.*',
    choices: [
        { text: '(Выйти)', next: null, effect: () => { S.charisma += 5; GameState.karma += 3; GameState.scene = 'ch4_end'; }},
    ]
},

'ch4_dream_sequence': {
    speaker: '', text: '*Экран мерцает. Орсон моргает. Он в другом месте. Discord превратился в лабиринт. Коридоры из сообщений. Все адресованы ему. Все — негативные.*',
    choices: [
        { text: '(Идти по лабиринту)', next: null, effect: () => { GameState.scene = 'ch4_dream_maze'; }},
    ]
},

'ch4_dream_maze': {
    speaker: '', text: 'Стены из комментариев:\n"Ты неправ"\n"Выйди на улицу"\n"Кто это вообще"\n"Шизик"\n"Прости Орсон, но..."\n\nВ конце коридора — дверь. На ней: "ВЫХОД. или ПРОБУЖДЕНИЕ."',
    choices: [
        { text: '(Открыть дверь)', next: null, effect: () => { GameState.scene = 'ch4_dream_door'; }},
        { text: '(Сесть и ждать)', next: null, effect: () => { GameState.silenceCount++; GameState.scene = 'ch4_dream_sit'; }},
    ]
},

'ch4_dream_door': {
    speaker: '', text: 'За дверью — клавиатура. Огромная. Как поле. Клавиши размером с человека. Орсон пытается нажать "Enter". Клавиша превращается в багет. Остальные тоже.',
    choices: [
        { text: '...Это сон, да?', next: null, effect: () => { F.dream_awareness = true; GameState.scene = 'ch4_dream_wake'; }},
    ]
},

'ch4_dream_sit': {
    speaker: '', text: '*Орсон сидит среди комментариев. Тишина. Потом — голос: "Орсон, ты опять ушёл. Вернись. Мы продолжим сессию в четверг." Голос Германовны.*',
    choices: [
        { text: '...Четверг?', next: null, effect: () => { F.heard_germanovna_voice = true; S.paranoia += 10; GameState.scene = 'ch4_dream_wake'; }},
    ]
},

'ch4_dream_wake': {
    speaker: '', text: '*Рывок. Орсон снова перед компьютером. Периклес трясёт его за плечо. "Ты заснул! За компьютером! Как обычно!" Руки трясутся. На часах 3:47.*',
    choices: [
        { text: '(Потереть глаза)', next: null, effect: () => { GameState.scene = 'ch4_end'; }},
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
    speaker: '', text: 'На площади собрались ВСЕ. Вильгефортс (тёмный плащ, скрестив руки). Коб (бутылка вина, золотые часы). Чеб (в костюме креветки, с глайдером). Вайтуз (яблоко, зелёные наушники). Акулбот (планшет с мемами, белые волосы). Мадьяр (ноутбук, очки, щетина). Периклес (лысый гном, прищурился). Чекист (красная форма, серьёзный). Герострат (в футболке, ухмыляется). Ауромолин (тёмный капюшон, молчит).',
    choices: [
        { text: '(К Вильгефортсу)', next: null, effect: () => { GameState.scene = 'ch5_vilgefortz_start'; }},
        { text: '(К Кобу)', next: null, effect: () => { GameState.scene = 'ch5_kob_start'; }},
        { text: '(К Чебу)', next: null, effect: () => { GameState.scene = 'ch5_cheb_start'; }},
        { text: '(К Чекисту)', next: null, effect: () => { GameState.scene = 'ch5_chekist_start'; }},
        { text: '(К Герострату)', next: null, effect: () => { GameState.scene = 'ch5_gerostrat_start'; }},
        { text: '(К Ауромолину)', next: null, effect: () => { GameState.scene = 'ch5_auromolin_start'; }},
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
    speaker: 'Коб', text: '*поднимает бокал, монеты сыплются из карманов* Орсон! Дружище! Я тут подумал — ты мне должен. Я не украл — я вдохновился. 200 монет. На ресторан. В центре. Они пожалеют что не донатили.',
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
    speaker: 'Коб', text: 'Нарцисс?! Я не проиграл — я стратегически вышел. *поправляет золотые часы* Это не читы — это честный читерский труд. Я вернусь. Они пожалеют. *напевает* Я на тусовку подрываю свои пятки!',
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
    speaker: 'Чеб', text: '*в костюме креветки, с ноутбуком и глайдером* Подожди, я щас взлечу — с высоты лучше думается. Орсон, я прилетел из Казахстана специально ради этого. Нейросеть сказала — значит правда, что ты тут.',
    choices: [
        { text: 'Ты лётчик и моддер?', next: null, effect: () => { GameState.scene = 'ch5_cheb_pilot'; }},
        { text: 'Моды были нормальные', next: null, effect: () => { R.cheb += 10; GameState.scene = 'ch5_cheb_happy'; }},
        { text: 'Из Казахстана на дельтаплане?!', next: null, effect: () => { GameState.scene = 'ch5_cheb_delta'; }},
    ]
},

'ch5_cheb_pilot': {
    speaker: 'Чеб', text: 'Дайте взлечу, сразу думать лучше начну! Днём летаю, ночью кодирую. Это не баг мода, это фича казахского геймдизайна. Нейросеть написала — значит норм! Слишком увлекаюсь полётом и забываю о посадке...',
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
    speaker: 'Акулбот', text: '*показывает планшет, белые волосы развеваются* Горит? Значит попал. Я собрал ВСЕ мемы про тебя. 347 штук. Есть классика: "Орсон vs Здравый Смысл", "Тряска.gif", и мой шедевр — "Это не троллинг. Это социальный эксперимент."',
    choices: [
        { text: 'УДАЛИ ЭТО!', next: null, effect: () => { S.chaos += 5; R.akulbot -= 10; GameState.scene = 'ch5_akulbot_refuse'; }},
        { text: '...Покажи "Тряска.gif"', next: null, effect: () => { S.charisma += 5; GameState.scene = 'ch5_akulbot_show'; }},
        { text: 'Ты зарабатываешь на мне?', next: null, effect: () => { GameState.scene = 'ch5_akulbot_money'; }},
    ]
},

'ch5_akulbot_refuse': {
    speaker: 'Акулбот', text: 'Мем уже в интернете. Что сделано — то сделано. Это ИСКУССТВО! Через 100 лет историки будут изучать эти мемы как артефакты эпохи! Мем уже живёт. Его не остановить.',
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
    speaker: '', text: 'Акулбот фотографирует вашу реакцию. "Это не я — это интернет", — бормочет он.',
    choices: [
        { text: '(К Мадьяру)', next: null, effect: () => { GameState.scene = 'ch5_madyar_start'; }},
        { text: '(К Герострату)', next: null, effect: () => { GameState.scene = 'ch5_gerostrat_start'; }},
        { text: '(К Ауромолину)', next: null, effect: () => { GameState.scene = 'ch5_auromolin_start'; }},
        { text: '(Ко всем сразу)', next: null, effect: () => { GameState.scene = 'ch5_everyone_attacks'; }},
    ]
},

'ch5_madyar_start': {
    speaker: 'Мадьяр', text: '*открывает ноутбук, поправляет очки* Лаунчер работает. Остальное — ваши проблемы. Орсон, ты знаешь что такое код? Не фантазии про "исходный код Нивал", а реальный, работающий, тестированный код?',
    choices: [
        { text: 'Я знаю про код больше тебя!', next: null, effect: () => { S.shiza += 5; R.madyar -= 10; GameState.scene = 'ch5_madyar_argue'; }},
        { text: 'Покажи', next: null, effect: () => { S.charisma += 3; GameState.scene = 'ch5_madyar_show'; }},
    ]
},

'ch5_madyar_argue': {
    speaker: 'Мадьяр', text: 'Нет. *коротко* Я слышал этот аргумент. Он не стал лучше со временем. Ты скачал PDF с форума и думаешь что нашёл исходный код. Это как найти инструкцию к микроволновке и думать что ты физик-ядерщик.',
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
    speaker: '', text: 'Мадьяр закрывает ноутбук. "Нет." — финально, лаконично.',
    choices: [
        { text: '(К Вайтузу)', next: null, effect: () => { GameState.scene = 'ch5_vaituz_start'; }},
        { text: '(К Чекисту)', next: null, effect: () => { GameState.scene = 'ch5_chekist_start'; }},
        { text: '(К Ауромолину)', next: null, effect: () => { GameState.scene = 'ch5_auromolin_start'; }},
        { text: '(Обратиться ко всем)', next: null, effect: () => { GameState.scene = 'ch5_everyone_attacks'; }},
    ]
},

'ch5_vaituz_start': {
    speaker: 'Вайтуз', text: 'Эээ... Орсон... ты... *жуёт яблоко, зелёные наушники болтаются* Подожди, а это правда? ...Окей, верю. Ты помнишь тот раз, когда орал 3 часа потому что я сказал что Тройка тоже неплохая? Ну, наверное, так и есть...',
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

// === ЧЕКИСТ ===
'ch5_chekist_start': {
    speaker: 'Чекист', text: 'Орсон. Я хотел тебя спасти. Вернуть в реальность. Дать якорь. Но ты ушёл слишком глубоко в свой мир, где инопланетяне, йети и враги-заговорщики. *поправляет фуражку*',
    choices: [
        { text: 'Мои идеи опережают время!', next: null, effect: () => { S.shiza += 5; GameState.scene = 'ch5_chekist_ideas'; }},
        { text: 'Ты просто хотел меня переделать', next: null, effect: () => { S.paranoia += 5; GameState.scene = 'ch5_chekist_reform'; }},
        { text: '...может ты прав', next: null, effect: () => { R.chekist = (R.chekist||0) + 10; GameState.karma += 5; GameState.scene = 'ch5_chekist_agree'; }},
    ]
},
'ch5_chekist_ideas': {
    speaker: 'Чекист', text: 'История рассудит. Я подожду. Лет сто, может. Но пока ты не готов к разговору — мои слова бесполезны. Орсон был бы нормальным человеком. Если бы захотел.',
    choices: [
        { text: 'Я нормальный!', next: null, effect: () => { GameState.tshake += 5; GameState.scene = 'ch5_chekist_end'; }},
        { text: '(Задуматься)', next: null, effect: () => { GameState.karma += 3; GameState.scene = 'ch5_chekist_end'; }},
    ]
},
'ch5_chekist_reform': {
    speaker: 'Чекист', text: 'Нет, Коля. Не переделать. Просто вернуть тебя к тебе самому. Тому, кто был до форумов. До «тряски». До всего этого... безумия. Но ты выбрал свой путь.',
    choices: [
        { text: 'Мой путь — единственный верный', next: null, effect: () => { S.chaos += 5; GameState.scene = 'ch5_chekist_end'; }},
        { text: '(Промолчать)', next: null, effect: () => { GameState.silenceCount++; GameState.scene = 'ch5_chekist_end'; }},
    ]
},
'ch5_chekist_agree': {
    speaker: 'Чекист', text: '*поднимает бровь* Ты... согласен? Это... неожиданно. Идея правильная. Время неправильное. Но может, сейчас — оно и пришло. *протягивает руку*',
    choices: [
        { text: '(Пожать руку)', next: null, effect: () => { F.chekist_ally = true; R.chekist = (R.chekist||0) + 15; GameState.scene = 'ch5_chekist_end'; }},
        { text: '(Не пожать)', next: null, effect: () => { GameState.scene = 'ch5_chekist_end'; }},
    ]
},
'ch5_chekist_end': {
    speaker: '', text: 'Чекист отступает, сложив руки за спину. Его терпение буддийского монаха не исчерпано.',
    choices: [
        { text: '(К Герострату)', next: null, effect: () => { GameState.scene = 'ch5_gerostrat_start'; }},
        { text: '(К Ауромолину)', next: null, effect: () => { GameState.scene = 'ch5_auromolin_start'; }},
        { text: '(Обратиться ко всем)', next: null, effect: () => { GameState.scene = 'ch5_everyone_attacks'; }},
    ]
},

// === ГЕРОСТРАТ ===
'ch5_gerostrat_start': {
    speaker: 'Герострат', text: '*стоит, скрестив руки, с видом человека, который просто живёт свою жизнь* О, Орсон. Ты пришёл. Как PUBG, только без оружия. Хотя... *ухмыляется*',
    choices: [
        { text: 'Что ты тут делаешь?!', next: null, effect: () => { S.paranoia += 5; GameState.scene = 'ch5_gerostrat_why'; }},
        { text: 'В PUBG я бы тебя уничтожил', next: null, effect: () => { S.troll += 5; GameState.scene = 'ch5_gerostrat_pubg'; }},
        { text: '(Попытаться игнорировать)', next: null, effect: () => { GameState.scene = 'ch5_gerostrat_ignore'; }},
    ]
},
'ch5_gerostrat_why': {
    speaker: 'Герострат', text: 'Я? Ничего не делаю. Просто существую рядом. Это тебя бесит? Потому что я ничего не делал. Ты сам. Всегда сам. *пожимает плечами* В PUBG таких, как ты, убивают быстро.',
    choices: [
        { text: 'ТЫ МЕНЯ БЕСИШЬ!', next: null, effect: () => { GameState.tshake += 10; S.chaos += 10; GameState.scene = 'ch5_gerostrat_rage'; }},
        { text: '...ладно, точка', next: null, effect: () => { GameState.scene = 'ch5_gerostrat_end'; }},
    ]
},
'ch5_gerostrat_pubg': {
    speaker: 'Герострат', text: '*смеётся* Ты? В PUBG? Ты бы написал в чат стену текста о заговоре синей зоны, пока она тебя убивала. Споры — это одно. Стрельба — другое. Я выигрываю и то, и другое. Но молча.',
    choices: [
        { text: 'Споры выигрывает тот, кто прав!', next: null, effect: () => { S.shiza += 5; GameState.scene = 'ch5_gerostrat_debate'; }},
        { text: '(Признать поражение)', next: null, effect: () => { GameState.karma += 5; GameState.scene = 'ch5_gerostrat_end'; }},
    ]
},
'ch5_gerostrat_ignore': {
    speaker: 'Герострат', text: '*молча смотрит* ...Спорить с тобой? Нет. Просто существовать рядом — уже достаточно. *достаёт телефон, открывает PUBG*',
    choices: [
        { text: '(Уйти)', next: null, effect: () => { GameState.scene = 'ch5_gerostrat_end'; }},
    ]
},
'ch5_gerostrat_rage': {
    speaker: 'Герострат', text: 'Вот. Видишь? Я ничего не сделал. Он сам. *обращается к остальным* Это его проблема, не моя. Я просто стою.',
    choices: [
        { text: '(Глубоко вздохнуть)', next: null, effect: () => { GameState.tshake -= 5; GameState.scene = 'ch5_gerostrat_end'; }},
    ]
},
'ch5_gerostrat_debate': {
    speaker: 'Герострат', text: 'Орсон. Ты споришь даже с людьми, которые с тобой согласны. Это не поиск правды — это зависимость. Как PUBG, только разрушительнее. *уходит играть*',
    choices: [
        { text: '...', next: null, effect: () => { GameState.scene = 'ch5_gerostrat_end'; }},
    ]
},
'ch5_gerostrat_end': {
    speaker: '', text: 'Герострат возвращается к телефону. Его миссия бесить тебя выполнена — без единого усилия.',
    choices: [
        { text: '(К Ауромолину)', next: null, effect: () => { GameState.scene = 'ch5_auromolin_start'; }},
        { text: '(К Чекисту)', next: null, effect: () => { GameState.scene = 'ch5_chekist_start'; }},
        { text: '(Обратиться ко всем)', next: null, effect: () => { GameState.scene = 'ch5_everyone_attacks'; }},
    ]
},

// === АУРОМОЛИН ===
'ch5_auromolin_start': {
    speaker: 'Ауромолин', text: '*из-под капюшона* Орсон. Я просто разрабатываю. Остальное — не моя проблема. Ты объявил меня врагом Реборна. Я узнал об этом из твоего же мема.',
    choices: [
        { text: 'Ты предал идею Реборна!', next: null, effect: () => { S.shiza += 10; GameState.scene = 'ch5_auromolin_betray'; }},
        { text: 'Реборн — мой проект!', next: null, effect: () => { S.paranoia += 5; GameState.scene = 'ch5_auromolin_project'; }},
        { text: 'Я... погорячился', next: null, effect: () => { GameState.karma += 10; GameState.scene = 'ch5_auromolin_sorry'; }},
    ]
},
'ch5_auromolin_betray': {
    speaker: 'Ауромолин', text: 'Предал? Я единственный, кто его СТРОИТ. Ты — генератор идей и обвинений. Я — исполнитель. Реборн живёт. Несмотря на тебя, Орсон. Несмотря ни на что. *разворачивает экран с кодом*',
    choices: [
        { text: 'Это мой исходный код!', next: null, effect: () => { S.shiza += 5; GameState.scene = 'ch5_auromolin_code'; }},
        { text: '...продолжай', next: null, effect: () => { GameState.scene = 'ch5_auromolin_end'; }},
    ]
},
'ch5_auromolin_project': {
    speaker: 'Ауромолин', text: 'Твой проект? Ты написал 47000 слов на форуме. Я написал 47000 строк кода. Разница между нами — в том, что мой результат запускается. *пауза* Реборн будет. Несмотря на Орсона.',
    choices: [
        { text: '(Промолчать)', next: null, effect: () => { GameState.silenceCount++; GameState.scene = 'ch5_auromolin_end'; }},
        { text: 'Без моих идей не было бы ничего!', next: null, effect: () => { GameState.tshake += 5; GameState.scene = 'ch5_auromolin_end'; }},
    ]
},
'ch5_auromolin_sorry': {
    speaker: 'Ауромолин', text: '*медленно поднимает голову* ...Что? *снимает капюшон* Ты извиняешься? Орсон? Я... не ожидал. Может, ещё не всё потеряно. Я разрабатываю. Остальное — шум. Но... спасибо.',
    choices: [
        { text: '(Кивнуть)', next: null, effect: () => { F.auromolin_ally = true; R.auromolin = (R.auromolin||0) + 15; GameState.scene = 'ch5_auromolin_end'; }},
    ]
},
'ch5_auromolin_code': {
    speaker: 'Ауромолин', text: 'Нет, Орсон. Это мой код. Вдохновлённый — возможно — твоим безумием. Но написанный моими руками. Продолжай верить в заговоры. Я продолжу строить.',
    choices: [
        { text: '(Уйти)', next: null, effect: () => { GameState.scene = 'ch5_auromolin_end'; }},
    ]
},
'ch5_auromolin_end': {
    speaker: '', text: 'Ауромолин натягивает капюшон и возвращается к экрану. Реборн живёт — несмотря ни на что.',
    choices: [
        { text: '(К Герострату)', next: null, effect: () => { GameState.scene = 'ch5_gerostrat_start'; }},
        { text: '(К Чекисту)', next: null, effect: () => { GameState.scene = 'ch5_chekist_start'; }},
        { text: '(Обратиться ко всем)', next: null, effect: () => { GameState.scene = 'ch5_everyone_attacks'; }},
    ]
},

'ch5_everyone_attacks': {
    speaker: '', text: 'Все десять персонажей окружают Орсона. Говорят одновременно. Обвинения, претензии, упрёки — со всех сторон. Акулбот показывает мемы, Герострат молча бесит, Чекист качает головой, Ауромолин кодит. Уровень ТРЯСКИ растёт.',
    choices: [
        { text: '(Кричать в ответ)', next: null, effect: () => { S.chaos += 15; GameState.tshake += 20; GameState.scene = 'ch5_chaos_peak'; }},
        { text: '(Молчать)', next: null, effect: () => { S.charisma += 15; GameState.scene = 'ch5_silence_power'; }},
        { text: '(Сказать "Я просто шучу")', next: null, effect: () => { S.troll += 10; GameState.scene = 'ch5_just_joking'; }},
    ]
},

'ch5_chaos_peak': {
    speaker: 'Орсон', text: 'У ТЕБЯ СВЯЗИ НЕВЗАИМОСВЯЗАНЫ! ЗАГОВОР! Я найду тебя и закопаю твою башку как ёбаную шишку! КОБ — ВОР! АУРОМОЛИН — ВРАГ РЕБОРНА! ИНОПЛАНЕТЯНЕ ПОДТВЕРДЯТ! Чёрная магия объясняет всё, что я не могу объяснить! ВЫ ВСЕ... *голос срывается* ...вы все правы.',
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
    speaker: '', text: 'ГЛАВА 6: ЭКРАН ЗАГРУЗКИ.\n\nПустая комната. Компьютер. Heroes 5 на экране. Орсон один. Впервые — осознанно один. Стены комнаты — то ли каменные, то ли больничные.',
    choices: (() => {
        const c = [
            { text: '(Сесть за компьютер)', next: null, effect: () => { GameState.scene = 'ch6_heroes'; }},
            { text: '(Просто сидеть)', next: null, effect: () => { GameState.scene = 'ch6_sit'; }},
            { text: '(Осмотреть комнату)', next: null, effect: () => { GameState.scene = 'ch6_walk_hospital'; }},
        ];
        if (GameState.tshake >= 60) c.push({ text: '(Голос из тени?)', next: null, effect: () => { GameState.scene = 'ch6_shadowban'; }});
        return c;
    })()
},

'ch6_heroes': {
    speaker: '', text: 'Heroes 5. Главное меню. Музыка. Та самая. 30-35 фпс. Орсон помнит. Ему было 15. Мир был проще. Форумов не было. Споров не было. Была только игра.',
    choices: [
        { text: '(Начать новую игру)', next: null, effect: () => { GameState.scene = 'ch6_new_game'; }},
        { text: '(Загрузить сохранение)', next: null, effect: () => { GameState.scene = 'ch6_load_save'; }},
        { text: '(Вспомнить прошлое)', next: null, effect: () => { GameState.scene = 'ch6_memory_childhood'; }},
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

'ch6_memory_childhood': {
    speaker: '', text: '*Вспышка. Орсону 12. Компьютерный класс. Первая установка Heroes 5. Диск с трещиной, но работает. Мир открывается. Замки. Герои. Магия. Ощущение бесконечных возможностей.*',
    choices: [
        { text: '(Вспоминать дальше)', next: null, effect: () => { GameState.scene = 'ch6_memory_first_post'; }},
    ]
},

'ch6_memory_first_post': {
    speaker: '', text: '*Орсону 17. Первый пост на форуме. "Привет! Я новичок! Heroes 5 — лучшая игра!" 3 лайка. 2 ответа. "Добро пожаловать!" Такие простые слова. Такие тёплые.*',
    choices: [
        { text: '(Дальше...)', next: null, effect: () => { GameState.scene = 'ch6_memory_turn'; }},
    ]
},

'ch6_memory_turn': {
    speaker: '', text: '*Орсону 20. Пост номер 500. "Вы все неправы и вот почему:" Первый бан. Первый спор на 17 часов. Первая бессонная ночь ради ответа, который никто не прочитает.*',
    choices: [
        { text: '(Дальше...)', next: null, effect: () => { GameState.scene = 'ch6_memory_spiral'; }},
    ]
},

'ch6_memory_spiral': {
    speaker: '', text: '*Орсону 23. Пост 2847. Теория Реборна. Исходный код Нивал. "Я нашёл правду!" Никто не верит. 847 негативных комментариев. Орсон пишет ещё больше. Круг замыкается.*',
    choices: [
        { text: '(Дальше...)', next: null, effect: () => { GameState.scene = 'ch6_memory_now'; }},
    ]
},

'ch6_memory_now': {
    speaker: '', text: '*Орсону 25. Миллионер. Франция. Дорогие часы. 47 вкладок. 0 друзей. Красные глаза. 3:47 ночи. Всегда 3:47.*\n\n...Когда это перестало быть игрой и стало жизнью?',
    choices: [
        { text: '(Продолжить)', next: null, effect: () => { GameState.scene = 'ch6_germanovna'; }},
    ]
},

'ch6_walk_hospital': {
    speaker: '', text: 'Коридор. Белые стены. Лампы гудят. Двери с номерами. Палата 1. Палата 2. Палата 3. Палата 4. Палата 5 — дверь открыта. Внутри — кровать, тумбочка, часы (3:47).',
    choices: [
        { text: '(Войти в палату)', next: null, effect: () => { GameState.scene = 'ch6_ward'; }},
        { text: '(Идти дальше по коридору)', next: null, effect: () => { GameState.scene = 'ch6_corridor_end'; }},
    ]
},

'ch6_ward': {
    speaker: '', text: 'На тумбочке: блокнот (ваш почерк), ручка, фото (вы с кем-то, лицо стёрто), таблетки и... яблоко с запиской.',
    choices: [
        { text: '(Читать блокнот)', next: null, effect: () => { GameState.scene = 'ch6_ward_notebook'; }},
        { text: '(Читать записку на яблоке)', next: null, effect: () => { GameState.scene = 'ch6_ward_apple'; }},
        { text: '(Посмотреть на фото)', next: null, effect: () => { GameState.scene = 'ch6_ward_photo'; }},
    ]
},

'ch6_ward_notebook': {
    speaker: '', text: 'Блокнот. Ваш почерк, но... странный. Записи:\n"День 1: Они не понимают. Я НОРМАЛЬНЫЙ."\n"День 15: Германовна сказала что прогресс. Вру ей."\n"День 47: Может она права. Может я..."\n"День 48: НЕТ. Я ПРАВ. НИВАЛ СКРЫВАЕТ."',
    choices: [
        { text: '...День 47', next: null, effect: () => { GameState.liesCount++; S.charisma += 5; GameState.scene = 'ch6_germanovna'; }},
    ]
},

'ch6_ward_apple': {
    speaker: '', text: 'Записка: "Эээ... привет. Это Витус. Я прихожу каждый вторник. Ты не узнаёшь меня, но я всё равно прихожу. Яблоко помогает. Мне. Надеюсь тебе тоже. — В."',
    choices: [
        { text: '...Каждый вторник?', next: null, effect: () => { R.vaituz += 10; GameState.karma += 5; F.vaituz_visits = true; GameState.scene = 'ch6_germanovna'; }},
    ]
},

'ch6_ward_photo': {
    speaker: '', text: 'Фото. Вы узнаёте себя — моложе, улыбаетесь. Рядом — кто-то. Лицо стёрто. Но... зелёные наушники? Яблоко в руке? ...Вайтуз?',
    choices: [
        { text: '...Мы были друзьями?', next: null, effect: () => { S.charisma += 5; F.old_friendship = true; GameState.scene = 'ch6_germanovna'; }},
    ]
},

'ch6_corridor_end': {
    speaker: '', text: 'В конце коридора — окно. За окном — двор. Скамейка. На скамейке сидит человек в зелёных наушниках и жуёт яблоко. Он смотрит вверх — на ваше окно. И машет.',
    choices: [
        { text: '(Помахать в ответ)', next: null, effect: () => { GameState.karma += 10; R.vaituz += 10; GameState.scene = 'ch6_germanovna'; }},
        { text: '(Отойти от окна)', next: null, effect: () => { GameState.scene = 'ch6_germanovna'; }},
    ]
},

'ch6_shadowban': {
    speaker: '???', text: '*шёпот из ниоткуда* Псс... Орсон. Ты слышишь? Это я. Shadowban. Я — то, что происходит когда тебя забывают. Когда посты не видит никто. Когда крик уходит в пустоту.',
    choices: [
        { text: 'Кто ты?!', next: null, effect: () => { GameState.scene = 'ch6_shadowban_reveal'; }},
        { text: '(Игнорировать)', next: null, effect: () => { GameState.silenceCount++; GameState.scene = 'ch6_germanovna'; }},
    ]
},

'ch6_shadowban_reveal': {
    speaker: 'Shadowban', text: 'Я — твоя тень. Та часть тебя, которую забанили навсегда. Я знаю правду, Орсон. Хочешь услышать? Бесплатно. Без споров. Просто... правда.',
    choices: [
        { text: 'Говори', next: null, effect: () => { GameState.scene = 'ch6_shadowban_truth'; }},
        { text: 'Мне достаточно правды', next: null, effect: () => { GameState.scene = 'ch6_germanovna'; }},
    ]
},

'ch6_shadowban_truth': {
    speaker: 'Shadowban', text: 'Все миры одинаковы, Орсон. Форумы, Discord, этот мир, палата — везде ты делаешь одно и то же. Спор. Тряска. Одиночество. Единственный способ выйти — перестать играть.',
    choices: [
        { text: 'Перестать... играть?', next: null, effect: () => { F.shadowban_advice = true; GameState.secretItems++; GameState.scene = 'ch6_germanovna'; }},
    ]
},

'ch6_germanovna': {
    speaker: '', text: (() => {
        if (GameState.tshake > 80) return '*Дверь открывается. Входит женщина в белом халате. Руки Орсона трясутся. Тряска зашкаливает.*';
        if (F.saw_hospital_vision) return '*Дверь открывается. Входит женщина в белом халате. Вы её узнаёте. Из зеркала. Из видений.*';
        return '*Дверь открывается. Входит женщина в белом халате. Спокойная. Уверенная. С блокнотом.*';
    })(),
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
        const totalCharisma = S.charisma || 0;
        const totalShiza = S.shiza || 0;
        const totalChaos = S.chaos || 0;
        const karma = GameState.karma || 0;
        const secrets = GameState.secretItems || 0;
        const silence = GameState.silenceCount || 0;
        const roll = Math.random() * 100;

        // Hidden mechanic: collecting 3+ secret items unlocks secret ending path
        if (secrets >= 3 && F.shadowban_advice && roll <= 5) {
            F.ending = 'truth';
            return '*Осколок правды в кармане светится. Жетон тишины вибрирует. Камень Согласия тёплый. Мир трескается...*';
        }
        // 1% base + bonus from high shiza
        else if (totalShiza > 50 && roll <= 1 + totalShiza/20) {
            F.ending = 'truth';
            return '*Экран мерцает. Реальность трещит. Стены палаты растворяются...*';
        }
        // Hidden: silence path - choosing silence 5+ times + high karma
        else if (silence >= 5 && karma >= 15 && roll <= 15) {
            F.ending = 'victory';
            return '*Тишина. Но не пустая. Наполненная. Орсон улыбается впервые за долгое время...*';
        }
        // 9% base + bonus from charisma
        else if (totalCharisma > 40 && totalChaos < 30 && roll <= 9 + totalCharisma/5) {
            F.ending = 'victory';
            return '*Орсон чувствует прилив сил. Всё вокруг замирает...*';
        }
        // Hidden: empathy ending variant (hospital but hopeful)
        else if (karma >= 20 && F.accepted_help) {
            F.ending = 'hospital_good';
            return '*Тёплый свет. Не холодный больничный — а утренний. Запах кофе. Звук шагов.*';
        }
        else {
            F.ending = 'hospital';
            return '*Белый свет. Запах антисептика. Звук капельницы.*';
        }
    })(),
    choices: [
        { text: '(Открыть глаза)', next: null, effect: () => {
            if (F.ending === 'truth') GameState.scene = 'ending_truth';
            else if (F.ending === 'victory') GameState.scene = 'ending_victory';
            else if (F.ending === 'hospital_good') GameState.scene = 'ending_hospital_good';
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

// === СКРЫТАЯ КОНЦОВКА: БОЛЬНИЦА С НАДЕЖДОЙ ===
'ending_hospital_good': {
    speaker: '', text: 'СКРЫТАЯ КОНЦОВКА: РАССВЕТ\n\nОрсон открывает глаза. Палата. Но... другая. Светлая. Окна открыты. Свежий воздух. На тумбочке — не таблетки, а цветы. И яблоко.',
    choices: [
        { text: '(Продолжить)', next: null, effect: () => { GameState.scene = 'ending_hospital_good_2'; }},
    ]
},

'ending_hospital_good_2': {
    speaker: 'Евгения Германовна', text: 'Доброе утро, Орсон. *улыбается* Ты сегодня не спорил во сне. Впервые за три месяца. Я думаю... мы делаем прогресс. Настоящий.',
    choices: [
        { text: '(Продолжить)', next: null, effect: () => { GameState.scene = 'ending_hospital_good_3'; }},
    ]
},

'ending_hospital_good_3': {
    speaker: '', text: 'За окном — двор. Скамейка. На ней сидят: Вайтуз (с яблоком), Чеб (без дельтаплана, но в лётной форме), и даже Коб (с кофе, не с вином). Они ждут. Они пришли навестить.\n\nОрсон улыбается. Часы показывают 8:00. Утро. Новое утро.',
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
