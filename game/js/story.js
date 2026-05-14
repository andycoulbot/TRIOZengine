const GameState = {
    hp: 20, maxHp: 20,
    chapter: 0, scene: 'title',
    stats: { respect: 50, friendship: 50, chaos: 0, wisdom: 0, shiza: 0 },
    reputation: { orson: 0, vaituz: 0, kob: 0, cheb: 0 },
    inventory: [],
    flags: {},
    choices: [],
    kobSecrets: 0,
    endingId: null,
    pathCount: 0,
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
        { text: 'СЕКРЕТЫ', next: null, effect: () => { GameState.scene = 'secrets_menu'; }},
    ]
},

// ============== INTRO ==============
'intro': {
    speaker: '', text: 'Где-то в глубинах интернета существует чатик... Место, где герои спорят о видеокартах, обсуждают Heroes 5 и решают судьбы миров.',
    choices: [
        { text: 'Войти в чатик', next: null, effect: () => { GameState.scene = 'ch1_start'; GameState.chapter = 1; }},
    ]
},

// ============== CHAPTER 1: ЧАТИК ==============
'ch1_start': {
    speaker: 'Вайтуз', text: 'Ээээ... Привет. Ты новенький? У меня мозг не кипит, но вроде тебя тут раньше не видел. Хочешь яблоко?',
    choices: [
        { text: 'Привет! Да, возьму яблоко', next: null, effect: () => {
            R.vaituz += 10; S.friendship += 5;
            GameState.inventory.push({ id: 'apple', name: 'Яблоко Вайтуза', desc: '+8 HP' });
            GameState.scene = 'ch1_apple_taken';
        }},
        { text: 'Не надо, спасибо', next: null, effect: () => {
            R.vaituz -= 5;
            GameState.scene = 'ch1_apple_refused';
        }},
        { text: 'А ты кто вообще?', next: null, effect: () => {
            S.wisdom += 3;
            GameState.scene = 'ch1_who_vaituz';
        }},
        { text: '*молча уйти*', next: null, effect: () => {
            S.chaos += 5;
            GameState.scene = 'ch1_silent_leave';
        }},
    ]
},

'ch1_apple_taken': {
    speaker: 'Вайтуз', text: 'Бля, как же ахуенно после энергетика и яблок! Кста, тут сейчас тусит Орсон... Он немного... специфичный. Но вроде не кусается. А это тут причём?)',
    choices: [
        { text: 'Пойдём к Орсону', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
        { text: 'Расскажи про Орсона сначала', next: null, effect: () => { S.wisdom += 5; GameState.scene = 'ch1_about_orson'; }},
        { text: 'Может лучше не надо?', next: null, effect: () => { GameState.scene = 'ch1_avoid_orson'; }},
        { text: 'Кобика зовём?)', next: null, effect: () => { GameState.kobSecrets++; F.mentioned_kob_early = true; GameState.scene = 'ch1_mention_kob'; }},
    ]
},

'ch1_apple_refused': {
    speaker: 'Вайтуз', text: 'Ну ладно... Веду себя так же, как и ты, брат). Орсон тут где-то бродит, может к нему?',
    choices: [
        { text: 'Пойдём к Орсону', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
        { text: 'Нет, хочу осмотреться', next: null, effect: () => { GameState.scene = 'ch1_explore_chat'; }},
    ]
},

'ch1_who_vaituz': {
    speaker: 'Вайтуз', text: 'Я Вайтуз. Ну, или Витус. Бля, без рофлов — я тут типа... ну, тусуюсь. Играю в игры, но плохо. Очень плохо. Но у меня мозг не кипит! А ещё у меня зелёные наушники, видишь? И смокинг иногда ношу. Для стиля.',
    choices: [
        { text: 'Круто. А что тут вообще происходит?', next: null, effect: () => { GameState.scene = 'ch1_whats_up'; }},
        { text: 'Ты и правда тормозишь', next: null, effect: () => { R.vaituz -= 10; S.chaos += 5; GameState.scene = 'ch1_insult_vaituz'; }},
        { text: 'Пойдём, покажешь тут всё', next: null, effect: () => { R.vaituz += 5; GameState.scene = 'ch1_explore_with_vaituz'; }},
    ]
},

'ch1_silent_leave': {
    speaker: '', text: 'Вы молча уходите. Вайтуз стоит с яблоком и непонимающе смотрит вам вслед. "Ээээ..." — доносится позади.',
    choices: [
        { text: 'Идти дальше одному', next: null, effect: () => { GameState.scene = 'ch1_alone_explore'; }},
        { text: 'Вернуться и извиниться', next: null, effect: () => { R.vaituz += 3; GameState.scene = 'ch1_start'; }},
    ]
},

'ch1_mention_kob': {
    speaker: 'Вайтуз', text: 'О, Кобик! Ну... Коб это... как сказать. Он любит выпить, моды у людей подтырить и выдать за свои. Ещё он себя пиарит как бешеный. А потом просит 200 монет на ресторан в центре. Нарцисс, короче. Но знает бургерные в Москве! Может позвать его?',
    choices: [
        { text: 'Давай, позовём!', next: null, effect: () => { F.kob_invited = true; GameState.kobSecrets++; GameState.scene = 'ch1_kob_invited'; }},
        { text: 'Нет, сначала к Орсону', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
        { text: 'Он звучит подозрительно', next: null, effect: () => { S.wisdom += 5; GameState.scene = 'ch1_kob_suspicious'; }},
    ]
},

'ch1_kob_invited': {
    speaker: '', text: 'Вайтуз набирает Коба в чате. Через минуту появляется ответ: "200 монет и буду через 5 минут. Заодно покажу новый мод. Ну, не совсем мой, но..."',
    choices: [
        { text: 'Подождать Коба', next: null, effect: () => { GameState.scene = 'ch1_wait_kob'; }},
        { text: 'Пока ждём, поговорить с Вайтузом', next: null, effect: () => { GameState.scene = 'ch1_chat_while_waiting'; }},
    ]
},

'ch1_kob_suspicious': {
    speaker: 'Вайтуз', text: 'Ну, подозрительный — это мягко сказано. Но он знает все секреты чатика. Все. И он в курсе всех модов Heroes 5. Правда, половина из них... заимствованные. Ладно, давай к Орсону?',
    choices: [
        { text: 'Да, пойдём', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
        { text: 'Расскажи ещё про секреты', next: null, effect: () => { S.wisdom += 3; GameState.kobSecrets++; GameState.scene = 'ch1_kob_secrets_hint'; }},
    ]
},

'ch1_kob_secrets_hint': {
    speaker: 'Вайтуз', text: 'Ну, говорят, если найти три предмета Коба — его фляжку, украденный мод и VIP-карту ресторана — то можно разблокировать секретную линию. Но это, наверное, враки...',
    choices: [
        { text: 'Интересно... Пойдём искать!', next: null, effect: () => { F.kob_quest_started = true; GameState.kobSecrets++; GameState.scene = 'ch1_explore_chat'; }},
        { text: 'Ладно, пойдём к Орсону', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
    ]
},

'ch1_about_orson': {
    speaker: 'Вайтуз', text: 'Орсон? Бля, без рофлов — похвалил его один раз, а он обиделся как девочка. Он параноик, шизофреник, помешан на Heroes 5. Вообразил, что может всё в этом мире. У него есть гарнитура, и он ВСЕГДА в войсе. Покупает видеокарту за 160 000, чтобы играть в 30-35 фпс. Голова не репа, как он говорит.',
    choices: [
        { text: 'Звучит... интересно. Пойдём!', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
        { text: 'Может лучше не связываться?', next: null, effect: () => { GameState.scene = 'ch1_avoid_orson'; }},
        { text: 'Что за Реборн?', next: null, effect: () => { S.shiza += 3; GameState.scene = 'ch1_about_reborn'; }},
    ]
},

'ch1_about_reborn': {
    speaker: 'Вайтуз', text: 'Реборн? Ээээ... Это типа перерождение Heroes 5 в шизоидной интерпретации Орсона. Он верит, что может воскресить игру, переделать её, сделать великой. Секта свидетелей Реборна, как говорят. Он реально верит в исходный код Нивала.',
    choices: [
        { text: 'Он безумен. Хочу увидеть это!', next: null, effect: () => { S.shiza += 5; S.chaos += 3; GameState.scene = 'ch1_meet_orson'; }},
        { text: 'Это грустно на самом деле', next: null, effect: () => { S.wisdom += 5; GameState.scene = 'ch1_meet_orson'; }},
        { text: 'А Чеб что думает об этом?', next: null, effect: () => { GameState.scene = 'ch1_about_cheb'; }},
    ]
},

'ch1_about_cheb': {
    speaker: 'Вайтуз', text: 'Чеб? Он лётчик из Казахстана. Летает на дельтаплане и делает моды на игру. Орсон его обожает — даже коронацию ему устраивал. "Коронация Чеба начнётся сегодня в 8 часов вечера" — прям целую церемонию замутили! Чеб нормальный, правда.',
    choices: [
        { text: 'Хочу познакомиться с Чебом!', next: null, effect: () => { R.cheb += 5; GameState.scene = 'ch1_find_cheb'; }},
        { text: 'Ладно, давай к Орсону', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
    ]
},

'ch1_avoid_orson': {
    speaker: 'Вайтуз', text: 'А это тут причём? Ну ладно... Можем тут потусить. Кста, я МЕДЛЕННО несу аптечки. Всегда. Я всё медленно делаю. Но у меня мозг не кипит!',
    choices: [
        { text: 'Осмотреть чатик', next: null, effect: () => { GameState.scene = 'ch1_explore_chat'; }},
        { text: 'Поиграть с Вайтузом', next: null, effect: () => { R.vaituz += 10; GameState.scene = 'ch1_play_with_vaituz'; }},
        { text: 'Ладно, пойдём к Орсону', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
    ]
},

'ch1_explore_chat': {
    speaker: '', text: 'Вы осматриваете чатик. В углу стоит пыльный ПК. На стене — плакат Heroes 5. На столе — энергетик и недоеденное яблоко. В другом углу — загадочная дверь с надписью "КОБ. ВХОД: 200 МОНЕТ".',
    choices: [
        { text: 'Осмотреть ПК', next: null, effect: () => { GameState.scene = 'ch1_examine_pc'; }},
        { text: 'Осмотреть дверь Коба', next: null, effect: () => { GameState.kobSecrets++; GameState.scene = 'ch1_kob_door'; }},
        { text: 'Взять энергетик', next: null, effect: () => { GameState.inventory.push({ id: 'energy', name: 'Энергетик', desc: '+5 HP, +3 хаос' }); GameState.scene = 'ch1_take_energy'; }},
        { text: 'Идти к Орсону', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
    ]
},

'ch1_examine_pc': {
    speaker: '', text: 'На экране ПК — открытый Heroes 5. Видно незаконченную партию. В чате написано: "Орсон: Покупаю видеокарту за 160 000. Чеб: а я на дельтаплане летаю, мне норм." В углу экрана — файл "reborn_plan.txt".',
    choices: [
        { text: 'Прочитать reborn_plan.txt', next: null, effect: () => { S.shiza += 5; F.read_reborn = true; GameState.scene = 'ch1_read_reborn'; }},
        { text: 'Доиграть партию в Героев', next: null, effect: () => { S.wisdom += 3; GameState.scene = 'ch1_play_heroes'; }},
        { text: 'Уйти от ПК', next: null, effect: () => { GameState.scene = 'ch1_explore_chat'; }},
    ]
},

'ch1_read_reborn': {
    speaker: '', text: '"ПЛАН РЕБОРНА: 1) Получить исходный код Нивал. 2) Переписать ВСЮ игру. 3) Сделать Heroes 5 великой снова. 4) Доказать всем, что Орсон был прав. 5) ??? 6) PROFIT. Подпись: Орсон. P.S. Пятёрка лучше тройки во всём."',
    choices: [
        { text: 'Этот человек... гений или безумец', next: null, effect: () => { S.shiza += 3; GameState.scene = 'ch1_meet_orson'; }},
        { text: 'Удалить файл', next: null, effect: () => { S.chaos += 10; F.deleted_reborn = true; GameState.scene = 'ch1_deleted_reborn'; }},
        { text: 'Скопировать себе', next: null, effect: () => { F.has_reborn_plan = true; GameState.inventory.push({ id: 'reborn_plan', name: 'План Реборна' }); GameState.scene = 'ch1_meet_orson'; }},
    ]
},

'ch1_deleted_reborn': {
    speaker: '', text: 'Вы удалили файл. Где-то в чатике раздался нечеловеческий крик Орсона: "КТО УДАЛИЛ МОЙ ПЛАН?! У ВАС 3 СУТОК, ЧТОБЫ ВЗЯТЬСЯ ЗА ГОЛОВУ!!!"',
    choices: [
        { text: 'Бежать!', next: null, effect: () => { GameState.scene = 'ch1_orson_angry_chase'; }},
        { text: 'Притвориться невиновным', next: null, effect: () => { S.chaos += 5; GameState.scene = 'ch1_meet_orson_angry'; }},
    ]
},

'ch1_play_heroes': {
    speaker: '', text: 'Вы пытаетесь играть в Heroes 5. Ваш герой ходит... Вражеский герой с именем "ОрсонЛорд" уничтожает вашу армию за один ход. На экране появляется: "30-35 фпс, брат. Ты проиграл."',
    choices: [
        { text: 'Реванш!', next: null, effect: () => { S.chaos += 3; GameState.scene = 'ch1_heroes_rematch'; }},
        { text: 'Эта игра не для меня', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
    ]
},

'ch1_heroes_rematch': {
    speaker: '', text: 'Снова проигрыш. "ОрсонЛорд" слишком силён. Но вы заметили в углу карты скрытый артефакт — "Фляжка Коба". Странно...',
    choices: [
        { text: 'Взять фляжку', next: null, effect: () => { F.has_kob_flask = true; GameState.kobSecrets++; GameState.inventory.push({ id: 'kob_flask', name: 'Фляжка Коба', desc: 'Секретный предмет' }); GameState.scene = 'ch1_found_flask'; }},
        { text: 'Проигнорировать', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
    ]
},

'ch1_found_flask': {
    speaker: '', text: 'Вы подобрали загадочную фляжку. Пахнет... алкоголем и амбициями. На донышке выгравировано: "КОБ. Собственность не трогать. P.S. Мод мой, отвалите." (Секретный предмет 1/3)',
    choices: [
        { text: 'Продолжить', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
    ]
},

'ch1_kob_door': {
    speaker: '', text: 'Дверь с надписью: "КОБ. ВХОД: 200 МОНЕТ. Лучшие бургеры, лучшие моды (оригинальные!). VIP-зона." Дверь заперта.',
    choices: [
        { text: 'Постучать', next: null, effect: () => { GameState.scene = 'ch1_knock_kob'; }},
        { text: 'Попытаться взломать', next: null, effect: () => { S.chaos += 5; GameState.scene = 'ch1_break_kob_door'; }},
        { text: 'Уйти', next: null, effect: () => { GameState.scene = 'ch1_explore_chat'; }},
    ]
},

'ch1_knock_kob': {
    speaker: '', text: 'Из-за двери раздаётся голос: "200 монет, и я открою. Или покажи мод, который я могу... заимствовать. Ахах, шутка. Или нет."',
    choices: [
        { text: 'У меня нет 200 монет', next: null, effect: () => { GameState.scene = 'ch1_no_money_kob'; }},
        { text: 'Ты кто такой вообще?', next: null, effect: () => { GameState.scene = 'ch1_who_kob'; }},
    ]
},

'ch1_who_kob': {
    speaker: '', text: '"Я Коб. Известный модмейкер, ресторанный критик, и вообще важная персона. Подписывайся на мой канал. Лайк, шер, репост. А теперь — 200 монет или вали."',
    choices: [
        { text: 'Ладно, потом зайду', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
        { text: 'Ты нарцисс', next: null, effect: () => { S.chaos += 3; R.kob -= 5; GameState.scene = 'ch1_kob_offended'; }},
    ]
},

'ch1_kob_offended': {
    speaker: '', text: '"Нарцисс? Я? Ну может чуть-чуть. Но мои моды — произведение искусства! Ну, частично мои. В общем, дверь закрыта. Пока."',
    choices: [
        { text: 'Продолжить', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
    ]
},

'ch1_no_money_kob': {
    speaker: '', text: '"Ну что за народ... Все бедные, а Кобу ресторан оплачивать кто будет? Ладно, приходи когда найдёшь монеты. Или принеси мне чужой мод, я его... доработаю."',
    choices: [
        { text: 'Продолжить', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
    ]
},

'ch1_take_energy': {
    speaker: 'Вайтуз', text: 'О, ты тоже любишь энергетики? Бля, как же ахуенно после энергетика и яблок! Я всегда говорю!',
    choices: [
        { text: 'Выпить прямо сейчас', next: null, effect: () => { S.chaos += 3; GameState.hp = Math.min(GameState.maxHp, GameState.hp + 5); GameState.scene = 'ch1_meet_orson'; }},
        { text: 'Сохранить на потом', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
    ]
},

'ch1_insult_vaituz': {
    speaker: 'Вайтуз', text: '...Моё сердце подсказывает, что ты пидорас. Хотя не, извини, я просто обозлился. Хотя не, иди нахуй. Хотя... ладно, давай просто к Орсону пойдём.',
    choices: [
        { text: 'Извини, погорячился', next: null, effect: () => { R.vaituz += 5; GameState.scene = 'ch1_meet_orson'; }},
        { text: '*молча идти к Орсону*', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
    ]
},

'ch1_explore_with_vaituz': {
    speaker: 'Вайтуз', text: 'Го! Тут у нас чатик, типа главная комната. Там дальше Храм Пятёрки — это где Орсон молится Heroes 5. Ещё есть Войс-Каньон — там орут. И Чебовка — аэродром.',
    choices: [
        { text: 'Пойдём в Храм Пятёрки', next: null, effect: () => { GameState.scene = 'ch1_temple_h5'; }},
        { text: 'Пойдём в Войс-Каньон', next: null, effect: () => { GameState.scene = 'ch1_voice_canyon'; }},
        { text: 'Пойдём на Чебовку', next: null, effect: () => { GameState.scene = 'ch1_chebovka'; }},
        { text: 'Сначала к Орсону', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
    ]
},

'ch1_whats_up': {
    speaker: 'Вайтуз', text: 'Тут... ну... Орсон воюет со всеми. Он верит в Реборн — перерождение Heroes 5. Секта свидетелей Реборна, ахах. Чеб летает на дельтаплане в Казахстане и делает моды. Коб... ну, Коб пьёт и ворует моды. Обычный день, короче.',
    choices: [
        { text: 'Пойдём к Орсону', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
        { text: 'Хочу на Чебовку', next: null, effect: () => { GameState.scene = 'ch1_chebovka'; }},
        { text: 'Что за Реборн?', next: null, effect: () => { GameState.scene = 'ch1_about_reborn'; }},
    ]
},

'ch1_play_with_vaituz': {
    speaker: 'Вайтуз', text: 'Го в Героев! Я правда плохо играю... Кста, я МЕДЛЕННО несу аптечки. Всегда. Эээ... О, мой ход! *проигрывает за 3 хода* Ну... у меня мозг не кипит.',
    choices: [
        { text: 'Ничего, бывает', next: null, effect: () => { R.vaituz += 10; S.friendship += 5; GameState.scene = 'ch1_after_game'; }},
        { text: 'Давай ещё раз!', next: null, effect: () => { R.vaituz += 5; GameState.scene = 'ch1_play_again'; }},
    ]
},

'ch1_after_game': {
    speaker: 'Вайтуз', text: 'Спасибо, что не орёшь как Орсон. Он бы уже ультиматум выкатил: "У вас 3 суток, чтобы взяться за голову!" Ладно, пора двигать.',
    choices: [
        { text: 'К Орсону!', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
        { text: 'Осмотреться', next: null, effect: () => { GameState.scene = 'ch1_explore_chat'; }},
    ]
},

'ch1_play_again': {
    speaker: 'Вайтуз', text: '*проигрывает снова* Ээээ... Я не учавствовал в войне с Юником! То есть... я помогал разрушать Юник, когда была война. Блин, сам себя запутал.',
    choices: [
        { text: 'Ладно, идём дальше', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
    ]
},

'ch1_alone_explore': {
    speaker: '', text: 'Вы бродите по чатику в одиночестве. Тишина. Только гудит сервер. Вдруг за углом — кто-то.',
    choices: [
        { text: 'Подойти', next: null, effect: () => { GameState.scene = Math.random() > 0.5 ? 'ch1_meet_orson' : 'ch1_find_cheb'; }},
        { text: 'Спрятаться', next: null, effect: () => { S.chaos += 3; GameState.scene = 'ch1_hide_eavesdrop'; }},
    ]
},

'ch1_hide_eavesdrop': {
    speaker: '', text: 'Вы слышите разговор: "...я говорю, 4090 для ноута — это кайф! ПК мощь, ноут пародия, но ноуты путешествуют до дивана за 2 секунды!" Это Орсон.',
    choices: [
        { text: 'Выйти и поздороваться', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
        { text: 'Продолжить подслушивать', next: null, effect: () => { S.wisdom += 3; GameState.scene = 'ch1_eavesdrop_more'; }},
    ]
},

'ch1_eavesdrop_more': {
    speaker: '', text: '"...и потом я купил видеокарту за 160 000, брат! 30-35 фпс, как в 2009! Классно, классно! Кто не в Чебовке, тот лол!" Орсон замолкает. "...кто-то тут?" Вас заметили!',
    choices: [
        { text: 'Привет, я новенький!', next: null, effect: () => { GameState.scene = 'ch1_meet_orson'; }},
        { text: 'Бежать!', next: null, effect: () => { S.chaos += 5; GameState.scene = 'ch1_run_from_orson'; }},
    ]
},

'ch1_run_from_orson': {
    speaker: 'Орсон', text: 'СТОЙ! Ты не устал позориться?! Зайди в войс, пж! Продолжим там! СТОЙ, Я СКАЗАЛ!',
    choices: [
        { text: 'Остановиться', next: null, effect: () => { GameState.scene = 'ch1_meet_orson_tense'; }},
        { text: 'Продолжать бежать', next: null, effect: () => { S.chaos += 10; GameState.scene = 'ch1_escape_to_canyon'; }},
    ]
},

// === MEETING ORSON ===
'ch1_meet_orson': {
    speaker: 'Орсон', text: 'Здравствуй. На связи, браток. Ты новенький? Хм. Надеюсь ты не из этих... БТДшеров. У меня такой вопрос неловкий — ты за Пятёрку или за Тройку?',
    choices: [
        { text: 'За Пятёрку, конечно!', next: null, effect: () => { R.orson += 20; S.respect += 10; GameState.scene = 'ch1_orson_happy'; }},
        { text: 'За Тройку!', next: null, effect: () => { R.orson -= 30; S.chaos += 10; GameState.scene = 'ch1_orson_rage'; }},
        { text: 'Мне всё равно', next: null, effect: () => { R.orson -= 5; GameState.scene = 'ch1_orson_confused'; }},
        { text: 'Что за Пятёрка?', next: null, effect: () => { S.shiza += 3; GameState.scene = 'ch1_orson_explains'; }},
    ]
},

'ch1_meet_orson_tense': {
    speaker: 'Орсон', text: 'Та-а-ак. Подслушиваешь? Какие же вы жалкие, ребят. Ладно, я устал слышать оправдания. Ты за Пятёрку или нет?',
    choices: [
        { text: 'Да! За Пятёрку!', next: null, effect: () => { R.orson += 10; GameState.scene = 'ch1_orson_happy'; }},
        { text: 'Я просто мимо проходил', next: null, effect: () => { GameState.scene = 'ch1_orson_confused'; }},
    ]
},

'ch1_meet_orson_angry': {
    speaker: 'Орсон', text: 'КТО?! КТО УДАЛИЛ МОЙ ФАЙЛ?! Реборн! Мой великий план! Ты! Ты это сделал?! Голова не репа! Ничего святого!',
    choices: [
        { text: 'Нет, это не я!', next: null, effect: () => { S.chaos += 5; GameState.scene = 'ch1_orson_interrogate'; }},
        { text: 'Да, и что?', next: null, effect: () => { R.orson -= 30; S.chaos += 20; GameState.scene = 'ch1_battle_orson_angry'; }},
        { text: 'У меня есть копия плана', next: null, effect: () => { if (F.has_reborn_plan) { R.orson += 20; GameState.scene = 'ch1_orson_grateful'; } else { GameState.scene = 'ch1_orson_liar'; }}},
    ]
},

'ch1_orson_grateful': {
    speaker: 'Орсон', text: 'Ты... ты сохранил план Реборна?! Брат! Наш человек! Пятёрку хвалит! Крутое видео, я глянул! ...То есть, спасибо! Реборн будет жить! Ты в команде!',
    choices: [
        { text: 'Рад помочь!', next: null, effect: () => { R.orson += 20; F.orson_ally = true; GameState.scene = 'ch1_orson_ally'; }},
        { text: 'Что мне за это будет?', next: null, effect: () => { GameState.scene = 'ch1_orson_reward'; }},
    ]
},

'ch1_orson_liar': {
    speaker: 'Орсон', text: 'Враньё! У тебя нет никакой копии! Ты обосрался, бро! Без мозгов и чести!',
    choices: [
        { text: 'Ладно, извини...', next: null, effect: () => { R.orson -= 10; GameState.scene = 'ch1_orson_confused'; }},
    ]
},

'ch1_orson_happy': {
    speaker: 'Орсон', text: 'Наш человек! Пятёрку хвалит! Классно, классно, брат! Покупаю видеокарту за 160 000, чтобы поиграть в 30-35 фпс! Ну а если будет плохо, оправдаюсь у себя в голове, что так играли в 2009! Пойдём, покажу тебе Храм!',
    choices: [
        { text: 'Пойдём в Храм!', next: null, effect: () => { GameState.scene = 'ch1_temple_h5'; }},
        { text: 'Расскажи про Реборн', next: null, effect: () => { GameState.scene = 'ch1_orson_reborn_talk'; }},
        { text: 'Кто такой Чеб?', next: null, effect: () => { GameState.scene = 'ch1_orson_about_cheb'; }},
        { text: 'Зачем тебе видеокарта за 160к?', next: null, effect: () => { S.wisdom += 3; GameState.scene = 'ch1_orson_videocard'; }},
    ]
},

'ch1_orson_rage': {
    speaker: 'Орсон', text: 'ЧТО?! ТРОЙКА?! Чем меньше ты будешь писать, что тройка нагибает Пятёрку, тем меньше ты будешь походить на лицо со своей авы! Ты не устал позориться?! ЗАЙДИ В ВОЙС! ПРЯМО! СЕЙЧАС!',
    choices: [
        { text: 'Ладно, зайду в войс', next: null, effect: () => { GameState.scene = 'ch1_voice_confrontation'; }},
        { text: 'Нет, не зайду', next: null, effect: () => { R.orson -= 20; GameState.scene = 'ch1_orson_mute'; }},
        { text: 'Я пошутил, Пятёрка лучше!', next: null, effect: () => { R.orson += 5; S.chaos -= 5; GameState.scene = 'ch1_orson_forgive'; }},
        { text: 'БИТВА!', next: null, effect: () => { GameState.scene = 'ch1_battle_orson'; }},
    ]
},

'ch1_orson_confused': {
    speaker: 'Орсон', text: 'Тебе всё равно? Тебе... ВСЕМ ВСЁ РАВНО?! Бог есть и он всё видит! Ладно, мне кажется, ты просто не понимаешь масштаба. Пойдём, я покажу тебе настоящее искусство — Heroes 5.',
    choices: [
        { text: 'Ладно, покажи', next: null, effect: () => { GameState.scene = 'ch1_temple_h5'; }},
        { text: 'Нет, спасибо', next: null, effect: () => { GameState.scene = 'ch1_free_roam'; }},
    ]
},

'ch1_orson_explains': {
    speaker: 'Орсон', text: 'Heroes of Might and Magic V! ВЕЛИЧАЙШАЯ ИГРА ВСЕХ ВРЕМЁН! Пятёрка! Нивал создали шедевр, а потом бросили! Но я... Я верю в Реборн! Перерождение! Я получу исходный код и сделаю её снова великой!',
    choices: [
        { text: 'Звучит амбициозно', next: null, effect: () => { R.orson += 10; GameState.scene = 'ch1_orson_happy'; }},
        { text: 'Ты безумец', next: null, effect: () => { R.orson -= 15; S.shiza += 5; GameState.scene = 'ch1_orson_rage'; }},
        { text: 'Можно помочь?', next: null, effect: () => { R.orson += 15; F.help_reborn = true; GameState.scene = 'ch1_help_reborn'; }},
    ]
},

'ch1_orson_videocard': {
    speaker: 'Орсон', text: 'Просто делюсь! 8000 шейдеров — хорошо, 7000 — не очень, 6000 — сойдёт. У моей из видео — 24. 32 шейдера. Это как 7 рублей вместо 5. Чтоб ты понимал. Короче, ноуты игровые кайф! Я фетишист ноутбуков, кайф ПК мне не привить!',
    choices: [
        { text: 'Ноут лучше ПК, согласен!', next: null, effect: () => { R.orson += 10; GameState.scene = 'ch1_temple_h5'; }},
        { text: 'ПК всегда был основой гейминга', next: null, effect: () => { R.orson -= 5; GameState.scene = 'ch1_orson_pc_debate'; }},
        { text: 'Это... интересный взгляд', next: null, effect: () => { S.wisdom += 3; GameState.scene = 'ch1_temple_h5'; }},
    ]
},

'ch1_orson_pc_debate': {
    speaker: 'Орсон', text: 'Это так цинично! Честно говоря, да, ПК всегда был основой гейминга. Но ноуты путешествуют до дивана за 2 секунды! И обратно! Кстати, кайф ПК мне не привить. Ладно, пошли в Храм.',
    choices: [
        { text: 'Пойдём', next: null, effect: () => { GameState.scene = 'ch1_temple_h5'; }},
    ]
},

'ch1_orson_reborn_talk': {
    speaker: 'Орсон', text: 'Реборн — это перерождение Heroes 5! Я нашёл мифы исходного кода Нивал! Сделал первый шаг для разоблачения! И медицинское наблюдение... э, это из песни. Неважно. Реборн — это будущее! Секта свидетелей Реборна — это не секта, это ИСТИНА!',
    choices: [
        { text: 'Я верю в Реборн!', next: null, effect: () => { S.shiza += 10; R.orson += 15; F.reborn_believer = true; GameState.scene = 'ch1_reborn_believer'; }},
        { text: 'Это звучит как секта', next: null, effect: () => { R.orson -= 10; GameState.scene = 'ch1_orson_offended'; }},
        { text: 'Какой план действий?', next: null, effect: () => { S.wisdom += 5; GameState.scene = 'ch1_reborn_plan'; }},
    ]
},

'ch1_reborn_believer': {
    speaker: 'Орсон', text: 'БРАТ! Ты понял! Ты ПОНЯЛ! Пойдём в Храм Пятёрки, я проведу обряд посвящения! Коронация нового Чеба — может и тебя короновать? Шучу. Или нет.',
    choices: [
        { text: 'В Храм!', next: null, effect: () => { GameState.scene = 'ch1_temple_h5'; }},
    ]
},

'ch1_orson_offended': {
    speaker: 'Орсон', text: 'Не секта?! Ладно, посидишь недельку в чарующем муте. Какие же вы жалкие, ребят. Вильгефорц ещё ищет оправдания... Вильгефорц рвётся как собака с ободранным боком!',
    choices: [
        { text: 'Кто такой Вильгефорц?', next: null, effect: () => { GameState.scene = 'ch1_about_vilgefortz'; }},
        { text: 'Ладно, извини', next: null, effect: () => { R.orson += 5; GameState.scene = 'ch1_temple_h5'; }},
    ]
},

'ch1_about_vilgefortz': {
    speaker: 'Орсон', text: 'Вильгефорц? Враг! Подлый враг! Он высмеивал меня перед всеми! Я доверился ему, хотел с ним дружить! А что в итоге? Ты высмеиваешь меня перед всеми! ...Прости, Никита. Так что ты слит.',
    choices: [
        { text: 'Я не Никита...', next: null, effect: () => { GameState.scene = 'ch1_temple_h5'; }},
        { text: 'Все тебя предают, да?', next: null, effect: () => { S.wisdom += 5; R.orson += 5; GameState.scene = 'ch1_orson_deep'; }},
    ]
},

'ch1_orson_deep': {
    speaker: 'Орсон', text: '...Мне плевать. Я доверился, я хотел быть другом. Думал, будем вместе комьюнити поднимать. Умная голова с точки зрения логики... Левое полушарие. Или правое... Ну как поднимать, новое что-то придумывать. И что в итоге?',
    choices: [
        { text: 'Мне жаль это слышать', next: null, effect: () => { S.wisdom += 10; R.orson += 15; GameState.scene = 'ch1_orson_opens_up'; }},
        { text: 'Может проблема в тебе?', next: null, effect: () => { R.orson -= 20; S.chaos += 5; GameState.scene = 'ch1_orson_rage'; }},
    ]
},

'ch1_orson_opens_up': {
    speaker: 'Орсон', text: '...Спасибо за совет. Расслабился. Знаешь, карма и обычное человеческое желание отомстить всегда преследует. Но может... может пора перестать воевать? Пойдём в Храм, покажу тебе красоту Пятёрки.',
    choices: [
        { text: 'С удовольствием', next: null, effect: () => { F.orson_peaceful = true; GameState.scene = 'ch1_temple_h5'; }},
    ]
},

// === TEMPLE ===
'ch1_temple_h5': {
    speaker: '', text: 'Храм Пятёрки. Стены покрыты скриншотами Heroes 5. В центре — золотой трон (для Чеба, говорят). На алтаре — диск с Heroes 5. Орсон падает на колени.',
    choices: [
        { text: 'Помолиться Пятёрке', next: null, effect: () => { S.shiza += 5; R.orson += 10; GameState.scene = 'ch1_pray_h5'; }},
        { text: 'Осмотреть трон', next: null, effect: () => { GameState.scene = 'ch1_examine_throne'; }},
        { text: 'Поискать секреты', next: null, effect: () => { GameState.kobSecrets++; GameState.scene = 'ch1_temple_secret'; }},
        { text: 'Выйти', next: null, effect: () => { GameState.scene = 'ch1_free_roam'; }},
    ]
},

'ch1_pray_h5': {
    speaker: 'Орсон', text: 'Да! ДА! Пятёрка услышала нас! Чувствуешь? Это вайб 2009 года! 30-35 фпс! Классно, классно, брат! Ты теперь свидетель Реборна!',
    choices: [
        { text: 'Аминь!', next: null, effect: () => { F.reborn_sworn = true; GameState.scene = 'ch1_chapter1_end'; }},
        { text: 'Это было... необычно', next: null, effect: () => { GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_examine_throne': {
    speaker: 'Орсон', text: 'Это трон Чеба! Коронация Чеба начнётся... ну, когда он прилетит на дельтаплане из Казахстана. Художник-татуировщик нужен. Звёзды на плечах и крылья на спине! Девушек не зовите, Чеб сказал — гарем не нужен.',
    choices: [
        { text: 'Когда коронация?', next: null, effect: () => { GameState.scene = 'ch1_coronation_info'; }},
        { text: 'Пойдём дальше', next: null, effect: () => { GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_coronation_info': {
    speaker: 'Орсон', text: 'Сегодня в 8 вечера! Будет обильное празднество и активное фыр-фыр на Чебовке! Не опоздай!',
    choices: [
        { text: 'Буду!', next: null, effect: () => { F.coronation_planned = true; GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_temple_secret': {
    speaker: '', text: 'За алтарём — скрытый проход! Там стоит пыльная полка с мод-файлами для Heroes 5. На одном написано: "УКРАДЕНО У: [имя зачёркнуто]. Доработано: КОБ". Это краденый мод!',
    choices: [
        { text: 'Взять мод', next: null, effect: () => { F.has_stolen_mod = true; GameState.inventory.push({ id: 'stolen_mod', name: 'Краденый мод Коба', desc: 'Секретный предмет' }); GameState.scene = 'ch1_found_mod'; }},
        { text: 'Оставить', next: null, effect: () => { GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_found_mod': {
    speaker: '', text: 'Вы подобрали краденый мод. На обложке — плохо замазанное чужое имя и подпись Коба маркером. (Секретный предмет 2/3)',
    choices: [
        { text: 'Продолжить', next: null, effect: () => { GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

// === LOCATIONS ===
'ch1_voice_canyon': {
    speaker: '', text: 'Войс-Каньон. Эхо голосов отражается от стен. Кто-то кричит. Кто-то спорит. "ЗАЙДИ В ВОЙС ПЖ!" — раздаётся откуда-то сверху.',
    choices: [
        { text: 'Зайти в войс', next: null, effect: () => { GameState.scene = 'ch1_join_voice'; }},
        { text: 'Послушать споры', next: null, effect: () => { S.wisdom += 5; GameState.scene = 'ch1_listen_voice'; }},
        { text: 'Уйти', next: null, effect: () => { GameState.scene = 'ch1_free_roam'; }},
    ]
},

'ch1_join_voice': {
    speaker: 'Орсон', text: 'О! Новенький в войсе! Го лучше в войс, если хочешь что-то добавить! Ты как — будешь говорить или послушаешь? Кто молчит — тот БТДшер!',
    choices: [
        { text: 'Буду говорить!', next: null, effect: () => { S.respect += 5; GameState.scene = 'ch1_voice_debate'; }},
        { text: 'Послушаю', next: null, effect: () => { S.wisdom += 3; GameState.scene = 'ch1_voice_listen'; }},
    ]
},

'ch1_voice_debate': {
    speaker: 'Орсон', text: 'Хорошо! Тема: Пятёрка лучше тройки во всём — докажи или будешь слит! У тебя 30 секунд!',
    choices: [
        { text: 'Пятёрка имеет лучший геймплей...', next: null, effect: () => { R.orson += 15; GameState.scene = 'ch1_debate_win'; }},
        { text: 'Ну... графика красивая?', next: null, effect: () => { R.orson += 5; GameState.scene = 'ch1_debate_meh'; }},
        { text: 'Тройка тоже неплохая', next: null, effect: () => { R.orson -= 20; GameState.scene = 'ch1_debate_loss'; }},
        { text: '*молчание*', next: null, effect: () => { S.chaos += 3; GameState.scene = 'ch1_debate_silence'; }},
    ]
},

'ch1_debate_win': {
    speaker: 'Орсон', text: 'БРАЗО! Наш человек! Виктор Пегноливич Гертер одобряет! Ты прошёл испытание войсом! Крутое видео, я глянул! То есть... крутая речь!',
    choices: [
        { text: 'Спасибо!', next: null, effect: () => { F.voice_champion = true; GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_debate_meh': {
    speaker: 'Орсон', text: 'Графика?! ГРАФИКА?! Там ДУША! Там МАГИЯ! Там... 30-35 фпс! Но ладно, хоть что-то сказал. Не как эти космонавты безъязыкие.',
    choices: [
        { text: 'Продолжить', next: null, effect: () => { GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_debate_loss': {
    speaker: 'Орсон', text: 'ТЫ СЛИТ! Обосрался, бро! Созерцаем вторую строчку оправданий после животрепещащего страха войса! Посидишь в муте!',
    choices: [
        { text: 'Принять мут', next: null, effect: () => { F.muted = true; GameState.scene = 'ch1_chapter1_end'; }},
        { text: 'Вызвать Орсона на битву!', next: null, effect: () => { GameState.scene = 'ch1_battle_orson'; }},
    ]
},

'ch1_debate_silence': {
    speaker: 'Орсон', text: 'Молчание... Собирался написать что-то, испугался войса. Удалил. Оставил только это, бро. Хорошо. Ты обосрался, бро.',
    choices: [
        { text: '...', next: null, effect: () => { GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_voice_listen': {
    speaker: '', text: 'Вы слушаете часовой спор Орсона с невидимым оппонентом о Heroes 5. В конце Орсон объявляет победу. Никто не возражает. Это круче, чем кажется.',
    choices: [
        { text: 'Продолжить', next: null, effect: () => { S.wisdom += 5; GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_listen_voice': {
    speaker: '', text: 'Вы слышите обрывки: "...Шиз-Колян! Fake news maker! Хей, безликий хер ты! Зум-зум, шиз-шиз!..." Это... песня?',
    choices: [
        { text: 'Подпевать', next: null, effect: () => { S.shiza += 5; S.chaos += 3; GameState.scene = 'ch1_sing_along'; }},
        { text: 'Это очень странно', next: null, effect: () => { GameState.scene = 'ch1_free_roam'; }},
    ]
},

'ch1_sing_along': {
    speaker: '', text: '"Хей, Коля Шизик! Хей, Коля Шизик! Прощенье хер те!" Вы подпеваете, и Орсон замечает вас. Он... улыбается?',
    choices: [
        { text: 'Привет!', next: null, effect: () => { R.orson += 10; F.song_friend = true; GameState.scene = 'ch1_meet_orson'; }},
    ]
},

'ch1_chebovka': {
    speaker: '', text: 'Чебовка — аэродром. Вдалеке виден дельтаплан. На стене — карта Казахстана и расписание рейсов. "Рейс: Казахстан → Чатик. Пилот: Чеб. Статус: Летит."',
    choices: [
        { text: 'Подождать Чеба', next: null, effect: () => { GameState.scene = 'ch1_wait_cheb'; }},
        { text: 'Осмотреть дельтаплан', next: null, effect: () => { GameState.scene = 'ch1_examine_delta'; }},
        { text: 'Уйти', next: null, effect: () => { GameState.scene = 'ch1_free_roam'; }},
    ]
},

'ch1_wait_cheb': {
    speaker: '', text: 'Через минуту на горизонте появляется дельтаплан! Чеб приземляется — немного кривовато, но с апломбом. Он в лётной форме.',
    choices: [
        { text: 'Привет, Чеб!', next: null, effect: () => { R.cheb += 10; GameState.scene = 'ch1_meet_cheb'; }},
    ]
},

'ch1_meet_cheb': {
    speaker: 'Чеб', text: 'Салам! Я Чеб, лётчик из Казахстана! На дельтаплане прилетел. Красиво тут у вас. Я ещё моды делаю — настоящие моды, не как у Коба. У меня всё оригинальное! Как дела в чатике?',
    choices: [
        { text: 'Орсон тебе коронацию готовит!', next: null, effect: () => { R.cheb += 5; GameState.scene = 'ch1_cheb_coronation'; }},
        { text: 'Можно полетать на дельтаплане?', next: null, effect: () => { R.cheb += 10; GameState.scene = 'ch1_cheb_fly'; }},
        { text: 'Расскажи про свои моды', next: null, effect: () => { GameState.scene = 'ch1_cheb_mods'; }},
        { text: 'Ты знаешь Коба?', next: null, effect: () => { GameState.scene = 'ch1_cheb_about_kob'; }},
    ]
},

'ch1_cheb_coronation': {
    speaker: 'Чеб', text: 'Опять коронация? Ахах, Орсон каждый месяц это устраивает. Художник с чернилами из крови дракона, звёзды на плечах... Ладно, пусть повеселится. Я без гарема, кстати.',
    choices: [
        { text: 'Пойдём к нему', next: null, effect: () => { F.cheb_met = true; GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_cheb_fly': {
    speaker: 'Чеб', text: 'Конечно! Садись! Только держись крепче, тут ветер сильный! Вперёд, в небо! Казахстан → Чатик, класс бизнес!',
    choices: [
        { text: '(Летите над чатиком)', next: null, effect: () => { F.flew_delta = true; S.wisdom += 10; GameState.scene = 'ch1_flying'; }},
    ]
},

'ch1_flying': {
    speaker: '', text: 'С высоты видно весь мир: Чатик, Храм Пятёрки, Войс-Каньон, секретная дверь Коба, Поле Яблок Вайтуза... И далеко на горизонте — Финальная Башня. Красиво.',
    choices: [
        { text: 'Потрясающе!', next: null, effect: () => { GameState.scene = 'ch1_chapter1_end'; }},
        { text: 'Что за Финальная Башня?', next: null, effect: () => { S.wisdom += 5; GameState.scene = 'ch1_about_tower'; }},
    ]
},

'ch1_about_tower': {
    speaker: 'Чеб', text: 'Финальная Башня? Туда все пути сходятся. Говорят, там решается судьба чатика. Но путь туда долгий... Пять глав минимум!',
    choices: [
        { text: 'Интересно...', next: null, effect: () => { F.knows_tower = true; GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_cheb_mods': {
    speaker: 'Чеб', text: 'Мои моды — это искусство! Я каждый делаю с нуля. Не как Коб, который чужие воруёт и подписывает. Я на дельтаплане вдохновение ловлю — там, в небе, приходят идеи!',
    choices: [
        { text: 'Можно посмотреть?', next: null, effect: () => { F.saw_cheb_mods = true; GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_cheb_about_kob': {
    speaker: 'Чеб', text: 'Коб? Он... ну, как сказать. Пьёт, ворует моды, пиарится. Просит 200 монет на ресторан. Нарцисс. Но если подружиться — он знает ВСЕ секреты чатика. Вообще все.',
    choices: [
        { text: 'Интересно...', next: null, effect: () => { GameState.kobSecrets++; GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_examine_delta': {
    speaker: '', text: 'Дельтаплан Чеба. Самодельный, но крепкий. На крыле надпись: "Казахстан → Мир". Под сиденьем — VIP-карта ресторана с надписью "КОБ — Почётный гость".',
    choices: [
        { text: 'Взять VIP-карту', next: null, effect: () => { F.has_vip_card = true; GameState.kobSecrets++; GameState.inventory.push({ id: 'vip_card', name: 'VIP-карта Коба', desc: 'Секретный предмет' }); GameState.scene = 'ch1_found_vip'; }},
        { text: 'Оставить', next: null, effect: () => { GameState.scene = 'ch1_chebovka'; }},
    ]
},

'ch1_found_vip': {
    speaker: '', text: 'Вы подобрали VIP-карту ресторана. На обороте: "Бургеры за счёт заведения. Чаевые: 200 монет (обязательно)". (Секретный предмет 3/3)',
    choices: [
        { text: 'Продолжить', next: null, effect: () => {
            if (F.has_kob_flask && F.has_stolen_mod && F.has_vip_card) {
                GameState.scene = 'ch1_kob_unlocked';
            } else {
                GameState.scene = 'ch1_chebovka';
            }
        }},
    ]
},

'ch1_kob_unlocked': {
    speaker: '', text: '!! Три предмета Коба собраны! Фляжка, краденый мод и VIP-карта начинают светиться! Секретная линия РАЗБЛОКИРОВАНА!',
    choices: [
        { text: 'Открыть секретный путь!', next: null, effect: () => { F.kob_line_unlocked = true; GameState.scene = 'ch1_kob_secret_start'; }},
    ]
},

'ch1_kob_secret_start': {
    speaker: '', text: 'Предметы указывают путь к двери Коба. Дверь открывается сама...',
    choices: [
        { text: 'Войти', next: null, effect: () => { GameState.scene = 'ch1_kob_lair'; }},
    ]
},

'ch1_kob_lair': {
    speaker: 'Коб', text: 'А-а-а, ты нашёл мои вещички! Неплохо, неплохо. Я Коб. Модмейкер... ну, в своём роде. Ресторанный критик. VIP-персона. Подписывайся! И да, у меня тут лучшие бургеры Москвы. Хочешь?',
    choices: [
        { text: 'Расскажи о себе', next: null, effect: () => { GameState.scene = 'ch1_kob_story'; }},
        { text: 'Дай бургер!', next: null, effect: () => { GameState.inventory.push({ id: 'burger', name: 'Бургер Коба', desc: '+15 HP' }); GameState.scene = 'ch1_kob_burger'; }},
        { text: 'Зачем ты воруешь моды?', next: null, effect: () => { R.kob -= 5; GameState.scene = 'ch1_kob_mods_truth'; }},
    ]
},

'ch1_kob_story': {
    speaker: 'Коб', text: 'Я — легенда. Самопровозглашённая, но всё же. Люблю выпить, люблю моды, люблю хорошие рестораны. 200 монет — это не много за мою компанию! Я знаю секреты этого мира. ВСЕ секреты. Хочешь узнать?',
    choices: [
        { text: 'Да! Расскажи!', next: null, effect: () => { S.wisdom += 10; GameState.scene = 'ch1_kob_secrets'; }},
        { text: 'Ты нарцисс', next: null, effect: () => { R.kob -= 10; GameState.scene = 'ch1_kob_narcissist'; }},
    ]
},

'ch1_kob_secrets': {
    speaker: 'Коб', text: 'Секрет чатика: все тут — и Орсон, и Вайтуз, и Чеб, и я — мы все ищем одно. Связь. Дружбу. Просто... по-разному. Орсон — через контроль. Вайтуз — через доверие. Чеб — через творчество. А я... через бургеры и чужие моды. Не суди.',
    choices: [
        { text: 'Это... глубоко', next: null, effect: () => { S.wisdom += 15; F.kob_wisdom = true; GameState.scene = 'ch1_chapter1_end'; }},
        { text: 'Философ из тебя так себе', next: null, effect: () => { R.kob -= 5; S.chaos += 3; GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_kob_narcissist': {
    speaker: 'Коб', text: 'Нарцисс? Я предпочитаю термин "самодостаточная личность с повышенным чувством собственной важности". А теперь... 200 монет за бургер. Или уходи.',
    choices: [
        { text: 'Ладно-ладно', next: null, effect: () => { GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_kob_burger': {
    speaker: 'Коб', text: 'Вот! Лучший бургер в Москве! ...Ну, может не лучший, но точно самый дорогой. 200 монет, помнишь? Ладно, за счёт VIP-карты, так и быть.',
    choices: [
        { text: 'Спасибо!', next: null, effect: () => { R.kob += 10; GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_kob_mods_truth': {
    speaker: 'Коб', text: '...Ворую? Я ЗАИМСТВУЮ. С доработкой! Это как... ремикс. Да. Ремикс. Творчество. Подписывайся на канал, кстати. Лайк, шер, репост.',
    choices: [
        { text: 'Ладно, "ремикс"...', next: null, effect: () => { GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

// === BATTLES ===
'ch1_battle_orson': {
    speaker: '', text: '* Орсон преграждает путь! "Шиз-Колян, Fake news maker!" *',
    choices: [
        { text: 'БИТВА!', next: null, effect: () => {
            GameState.scene = 'battle';
            GameState.battleData = {
                id: 'orson', name: 'ОРСОН', hp: 25,
                acts: ['Обсудить Героев', 'Комплимент', 'Подколоть', 'Игнор'],
                actResponses: {
                    talk: 'Орсон начинает рассказывать о Heroes 5... Его глаза горят!',
                    praise: 'Орсон польщён! "Классно, классно, брат!"',
                    troll: 'Орсон в ЯРОСТИ! "У ВАС 3 СУТОК!!!"',
                    ignore: '"Собирался написать что-то. Удалил."',
                },
                patterns: ['horizontal', 'spiral', 'random'],
            };
            GameState.afterBattle = 'ch1_after_orson_battle';
        }},
    ]
},

'ch1_battle_orson_angry': {
    speaker: '', text: '* РАЗЪЯРЁННЫЙ Орсон атакует! "КТО УДАЛИЛ МОЙ ФАЙЛ?!" *',
    choices: [
        { text: 'БИТВА!', next: null, effect: () => {
            GameState.scene = 'battle';
            GameState.battleData = {
                id: 'orson', name: 'ОРСОН (ЯРОСТЬ)', hp: 35,
                acts: ['Извиниться', 'Показать план', 'Убежать', 'Потроллить'],
                actResponses: {
                    talk: '"Мне плевать! Ты удалил мой РЕБОРН!"',
                    praise: '"Не подлизывайся!"',
                    troll: '"ВСЁ! ТЫ СЛИТ НАВЕЧНО!"',
                    ignore: '"ТЫ НЕ МОЖЕШЬ МЕНЯ ИГНОРИТЬ!"',
                },
                patterns: ['spiral', 'spiral', 'horizontal'],
            };
            GameState.afterBattle = 'ch1_after_orson_battle';
        }},
    ]
},

'ch1_after_orson_battle': {
    speaker: '', text: 'Битва окончена. Орсон тяжело дышит.',
    choices: [
        { text: 'Протянуть руку', next: null, effect: () => { R.orson += 10; S.friendship += 5; GameState.scene = 'ch1_chapter1_end'; }},
        { text: 'Уйти', next: null, effect: () => { GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_orson_angry_chase': {
    speaker: 'Орсон', text: 'СТОООООЙ! У ВАС 3 СУТОК, ЧТОБЫ ВЗЯТЬСЯ ЗА ГОЛОВУ!!! *гонится*',
    choices: [
        { text: 'Бежать к Войс-Каньону!', next: null, effect: () => { GameState.scene = 'ch1_escape_to_canyon'; }},
        { text: 'Остановиться и сражаться', next: null, effect: () => { GameState.scene = 'ch1_battle_orson_angry'; }},
    ]
},

'ch1_escape_to_canyon': {
    speaker: '', text: 'Вы убегаете в Войс-Каньон! Эхо скрывает ваши шаги. Орсон теряет вас в лабиринте голосов.',
    choices: [
        { text: 'Отдышаться и продолжить', next: null, effect: () => { GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_orson_mute': {
    speaker: 'Орсон', text: 'Не зайдёшь?! Ладно, посидишь недельку в чарующем муте! Я устал слышать оправдания от 30-летнего мужика!',
    choices: [
        { text: '(Получить мут)', next: null, effect: () => { F.muted = true; GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_orson_forgive': {
    speaker: 'Орсон', text: '...Хм. Ладно. Прости, Никита. То есть... не Никита. Ладно, прощаю. Пятёрка — это святое, шутки неуместны. Пойдём в Храм.',
    choices: [
        { text: 'Пойдём', next: null, effect: () => { R.orson += 5; GameState.scene = 'ch1_temple_h5'; }},
    ]
},

'ch1_orson_interrogate': {
    speaker: 'Орсон', text: 'Точно не ты?! Бог есть и он всё видит! Карма тебя найдёт! Ладно... верю. Пока. Но я слежу.',
    choices: [
        { text: 'Ок', next: null, effect: () => { GameState.scene = 'ch1_temple_h5'; }},
    ]
},

'ch1_orson_ally': {
    speaker: 'Орсон', text: 'Ты теперь часть команды Реборна! Записывай: 1) Собрать исходники. 2) Переписать движок. 3) PROFIT! Пойдём, покажу тебе Храм!',
    choices: [
        { text: 'За Реборн!', next: null, effect: () => { GameState.scene = 'ch1_temple_h5'; }},
    ]
},

'ch1_orson_reward': {
    speaker: 'Орсон', text: 'Тебе за это будет... уважение! И VIP-доступ в Чебовку! Кто не в Чебовке, тот лол! Ну, и может видеокарту подарю. Может.',
    choices: [
        { text: 'Годится!', next: null, effect: () => { R.orson += 15; GameState.scene = 'ch1_temple_h5'; }},
    ]
},

'ch1_help_reborn': {
    speaker: 'Орсон', text: 'ПОМОЧЬ?! Ты хочешь ПОМОЧЬ Реборну?! Брат! Классно! Нам нужны люди! Чеб делает моды, ты поможешь с кодом! Коронация нового свидетеля!',
    choices: [
        { text: 'Готов!', next: null, effect: () => { F.reborn_helper = true; R.orson += 20; GameState.scene = 'ch1_temple_h5'; }},
    ]
},

'ch1_reborn_plan': {
    speaker: 'Орсон', text: 'План? 1) Получить исходники Нивала. 2) Переписать ВСЮ игру. 3) Запустить Реборн. 4) Мир увидит истину. 5) Все извинятся. Все. Особенно Вильгефорц.',
    choices: [
        { text: 'Амбициозно', next: null, effect: () => { GameState.scene = 'ch1_temple_h5'; }},
    ]
},

'ch1_find_cheb': {
    speaker: '', text: 'Вы натыкаетесь на человека в лётной форме с ноутбуком.',
    choices: [
        { text: 'Привет!', next: null, effect: () => { GameState.scene = 'ch1_meet_cheb'; }},
    ]
},

'ch1_orson_about_cheb': {
    speaker: 'Орсон', text: 'Чеб? Путешествия Чебика по серверам комьюнити! Лётчик, моддер, красавчик! Из Казахстана на дельтаплане прилетел! Я его коронацию готовлю — звёзды на плечах, крылья на спине! Девушек не звать!',
    choices: [
        { text: 'Хочу на коронацию!', next: null, effect: () => { F.coronation_planned = true; GameState.scene = 'ch1_temple_h5'; }},
        { text: 'Пойдём в Храм', next: null, effect: () => { GameState.scene = 'ch1_temple_h5'; }},
    ]
},

'ch1_wait_kob': {
    speaker: '', text: 'Через 5 минут появляется Коб. Он слегка пошатывается и держит в руках пакет из ресторана.',
    choices: [
        { text: 'Привет, Коб!', next: null, effect: () => { R.kob += 5; GameState.scene = 'ch1_kob_arrives'; }},
    ]
},

'ch1_kob_arrives': {
    speaker: 'Коб', text: 'Йо! Коб в деле! Принёс бургеры — 200 монет каждый, но для друзей... 180. Скидка! Кста, у меня новый мод готов. Ну, почти мой. Процентов на 60. Подписывайтесь!',
    choices: [
        { text: 'Расскажи про мод', next: null, effect: () => { GameState.scene = 'ch1_kob_mod_talk'; }},
        { text: 'Дай бургер!', next: null, effect: () => { GameState.inventory.push({ id: 'burger', name: 'Бургер Коба', desc: '+15 HP' }); R.kob += 5; GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_kob_mod_talk': {
    speaker: 'Коб', text: 'Этот мод добавляет новую фракцию в Heroes 5! Я его... нашёл. В интернете. И доработал! Добавил свою подпись. Это творчество! Не кража!',
    choices: [
        { text: 'Конечно, "творчество"', next: null, effect: () => { GameState.scene = 'ch1_chapter1_end'; }},
    ]
},

'ch1_chat_while_waiting': {
    speaker: 'Вайтуз', text: 'Пока ждём Коба... Знаешь, Орсон — он не плохой. Просто... шизоидный. Но у него сердце на месте. Иногда. Когда про Пятёрку не говорит. То есть... всегда говорит. Ну ладно.',
    choices: [
        { text: 'Ты добрый, Вайтуз', next: null, effect: () => { R.vaituz += 10; GameState.scene = 'ch1_wait_kob'; }},
        { text: 'Ты слишком доверчивый', next: null, effect: () => { S.wisdom += 3; GameState.scene = 'ch1_wait_kob'; }},
    ]
},

'ch1_free_roam': {
    speaker: '', text: 'Вы стоите на перекрёстке чатика. Куда пойдём?',
    choices: [
        { text: 'Храм Пятёрки', next: null, effect: () => { GameState.scene = 'ch1_temple_h5'; }},
        { text: 'Войс-Каньон', next: null, effect: () => { GameState.scene = 'ch1_voice_canyon'; }},
        { text: 'Чебовка', next: null, effect: () => { GameState.scene = 'ch1_chebovka'; }},
        { text: 'Дверь Коба', next: null, effect: () => { GameState.scene = 'ch1_kob_door'; }},
    ]
},

'ch1_break_kob_door': {
    speaker: '', text: 'Вы пытаетесь взломать дверь. Из-за неё раздаётся: "Ахахаха! Дверь бронированная! Как мой нарциссизм — непробиваемая! 200 монет или вали!"',
    choices: [
        { text: 'Уйти', next: null, effect: () => { GameState.scene = 'ch1_explore_chat'; }},
    ]
},

// === CHAPTER 1 END ===
'ch1_chapter1_end': {
    speaker: '', text: 'Первый день в чатике подходит к концу. Вы узнали много нового. Завтра предстоит ещё больше приключений...',
    choices: [
        { text: 'Продолжить → Глава 2', next: null, effect: () => { GameState.chapter = 2; GameState.scene = 'ch2_start'; }},
    ]
},

// ============== CHAPTER 2: ВОЙНЫ ЧАТИКА ==============
'ch2_start': {
    speaker: '', text: 'ГЛАВА 2: ВОЙНЫ ЧАТИКА. Ночь прошла. Утром в чатике — хаос. Орсон объявил войну БТДшерам. Вайтуз в панике ест яблоки. Чеб готовит дельтаплан к вылету.',
    choices: [
        { text: 'Идти к Орсону', next: null, effect: () => { GameState.scene = 'ch2_orson_war'; }},
        { text: 'Найти Вайтуза', next: null, effect: () => { GameState.scene = 'ch2_vaituz_panic'; }},
        { text: 'Помочь Чебу', next: null, effect: () => { GameState.scene = 'ch2_cheb_prep'; }},
        { text: 'Искать Коба (секретно)', next: null, effect: () => { if (F.kob_line_unlocked) GameState.scene = 'ch2_kob_secret'; else GameState.scene = 'ch2_kob_locked'; }},
    ]
},

'ch2_orson_war': {
    speaker: 'Орсон', text: 'ВОЙНА! БТДшеры зарвались! Мне кажется, ему отвечать = позволять ему оправдывать своё ничтожное неумение! Какие же вы жалкие, ребят! Ты с нами или против?!',
    choices: [
        { text: 'С вами!', next: null, effect: () => { R.orson += 15; S.chaos += 10; F.orson_side = true; GameState.scene = 'ch2_war_orson_side'; }},
        { text: 'Может поговорить мирно?', next: null, effect: () => { S.wisdom += 10; GameState.scene = 'ch2_peace_attempt'; }},
        { text: 'Я нейтрален', next: null, effect: () => { GameState.scene = 'ch2_neutral'; }},
        { text: 'Против!', next: null, effect: () => { R.orson -= 30; S.chaos += 15; GameState.scene = 'ch2_against_orson'; }},
    ]
},

'ch2_war_orson_side': {
    speaker: 'Орсон', text: 'Отлично! Первое задание — Передай привет всем БТДшерам. Через 4 года полегче станет. Поверьте. Без левого полушария логики тяжело жить! Идём в Войс-Каньон — дебаты!',
    choices: [
        { text: 'В Войс!', next: null, effect: () => { GameState.scene = 'ch2_voice_war'; }},
        { text: 'Может сначала стратегию?', next: null, effect: () => { S.wisdom += 5; GameState.scene = 'ch2_war_strategy'; }},
    ]
},

'ch2_peace_attempt': {
    speaker: 'Орсон', text: '...Мирно? Хм. Ну если не придираться к человеку на месте ровно, то жизнь легче. Ладно. Но если они первые начнут — я в ответе!',
    choices: [
        { text: 'Пойдём к Вайтузу, он поможет', next: null, effect: () => { GameState.scene = 'ch2_peace_with_vaituz'; }},
        { text: 'Я сам попробую переговоры', next: null, effect: () => { S.wisdom += 10; GameState.scene = 'ch2_solo_peace'; }},
    ]
},

'ch2_neutral': {
    speaker: 'Орсон', text: 'Нейтрален?! В любом споре надо сказать, что Орсон виноват — тогда можно сказать, что затащил. Ладно. Но запомни: кто не в Чебовке, тот лол.',
    choices: [
        { text: 'Осмотреться', next: null, effect: () => { GameState.scene = 'ch2_explore_war'; }},
    ]
},

'ch2_against_orson': {
    speaker: 'Орсон', text: 'ПРОТИВ?! Хорошо, ты признал, что ты пиздабол! Который не может и не хочет работать! Ему лень, впадлу! А потом посидит и поплачет! БИТВА!',
    choices: [
        { text: 'БИТВА!', next: null, effect: () => {
            GameState.scene = 'battle';
            GameState.battleData = {
                id: 'orson', name: 'ОРСОН (ВОЙНА)', hp: 30,
                acts: ['Перемирие', 'Аргумент', 'Провокация', 'Уклонение'],
                actResponses: {
                    talk: '"Перемирие?! Через мой труп!"',
                    praise: '"Лесть не спасёт тебя!"',
                    troll: '"Раз в год Орсон выдаёт перформанс! Мемы создают резонанс!"',
                    ignore: '"НЕЛЬЗЯ ИГНОРИТЬ ПРАВДУ!"',
                },
                patterns: ['spiral', 'horizontal', 'vertical'],
            };
            GameState.afterBattle = 'ch2_after_war_battle';
        }},
    ]
},

'ch2_after_war_battle': {
    speaker: '', text: 'Бой окончен. Обе стороны устали. Может, пора мириться?',
    choices: [
        { text: 'Предложить мир', next: null, effect: () => { S.friendship += 10; GameState.scene = 'ch2_war_peace'; }},
        { text: 'Победа!', next: null, effect: () => { S.chaos += 5; GameState.scene = 'ch2_war_victory'; }},
    ]
},

'ch2_vaituz_panic': {
    speaker: 'Вайтуз', text: 'Ээээ... Война?! Я не учавствовал! То есть... я помогал. Но МЕДЛЕННО! У меня мозг не кипит! Что делать?!',
    choices: [
        { text: 'Успокойся, давай разберёмся', next: null, effect: () => { R.vaituz += 10; GameState.scene = 'ch2_calm_vaituz'; }},
        { text: 'Бежим!', next: null, effect: () => { S.chaos += 5; GameState.scene = 'ch2_run_together'; }},
        { text: 'Ты должен выбрать сторону', next: null, effect: () => { GameState.scene = 'ch2_vaituz_choose'; }},
    ]
},

'ch2_calm_vaituz': {
    speaker: 'Вайтуз', text: 'Ок... ок... *ест яблоко* Бля, как же ахуенно после энергетика и яблок. Ладно. Думаю, надо попробовать помирить всех. Орсон же не плохой, он просто... параноик.',
    choices: [
        { text: 'Пойдём мирить!', next: null, effect: () => { GameState.scene = 'ch2_peace_with_vaituz'; }},
        { text: 'Или просто подождём, пока устанут', next: null, effect: () => { S.wisdom += 5; GameState.scene = 'ch2_wait_it_out'; }},
    ]
},

'ch2_cheb_prep': {
    speaker: 'Чеб', text: 'Салам! Война? Опять? Я не лезу, я лётчик. Мне моды делать надо, а не воевать. Но если хочешь — могу на дельтаплане разведку провести. Или свалить в Казахстан. Что скажешь?',
    choices: [
        { text: 'Давай разведку!', next: null, effect: () => { R.cheb += 10; GameState.scene = 'ch2_cheb_recon'; }},
        { text: 'Может в Казахстан?', next: null, effect: () => { S.chaos += 3; GameState.scene = 'ch2_cheb_escape'; }},
        { text: 'Помоги помирить всех', next: null, effect: () => { R.cheb += 5; GameState.scene = 'ch2_cheb_peace'; }},
    ]
},

'ch2_kob_secret': {
    speaker: 'Коб', text: 'А, ты пришёл! Война, говоришь? Хе-хе. Я знаю, как её закончить. Но это будет стоить... 200 монет. Шучу. На самом деле — нужен один мод. Украденный. Ну, заимствованный. Он может изменить баланс сил.',
    choices: [
        { text: 'Расскажи подробнее', next: null, effect: () => { S.wisdom += 10; GameState.scene = 'ch2_kob_war_plan'; }},
        { text: 'Ты хочешь всех обмануть?', next: null, effect: () => { GameState.scene = 'ch2_kob_honest'; }},
    ]
},

'ch2_kob_locked': {
    speaker: '', text: 'Дверь Коба заперта. "200 МОНЕТ" мигает неоном.',
    choices: [
        { text: 'Уйти', next: null, effect: () => { GameState.scene = 'ch2_explore_war'; }},
    ]
},

// Ch2 additional scenes
'ch2_voice_war': {
    speaker: '', text: 'В Войс-Каньоне гремят дебаты! Голоса эхом отражаются от стен. Орсон уже разогрет.',
    choices: [
        { text: 'Вступить в дебаты', next: null, effect: () => { GameState.scene = 'ch2_debate_war'; }},
        { text: 'Наблюдать', next: null, effect: () => { S.wisdom += 5; GameState.scene = 'ch2_observe_debate'; }},
    ]
},

'ch2_debate_war': {
    speaker: 'Орсон', text: 'Говори! Скажи на яйцах! Прямо! Пожалуйста! Империалист, как тебя в реале зовут?!',
    choices: [
        { text: 'Назвать своё имя', next: null, effect: () => { S.respect += 10; GameState.scene = 'ch2_gave_name'; }},
        { text: 'Не скажу', next: null, effect: () => { S.chaos += 5; GameState.scene = 'ch2_no_name'; }},
    ]
},

'ch2_war_strategy': {
    speaker: 'Орсон', text: 'Стратегия? Хм. 1) Дисс. 2) Мут. 3) Победа. 4) PROFIT. Простой план. Как Реборн, только для войны.',
    choices: [
        { text: 'Отличный план!', next: null, effect: () => { GameState.scene = 'ch2_voice_war'; }},
    ]
},

'ch2_peace_with_vaituz': {
    speaker: 'Вайтуз', text: 'Я попробую... Ээээ... Орсон! Привет! Слушай, может хватит воевать? Бля, без рофлов, ты же нормальный когда про Героев не говоришь!',
    choices: [
        { text: 'Поддержать Вайтуза', next: null, effect: () => { R.vaituz += 10; R.orson += 5; GameState.scene = 'ch2_peace_works'; }},
        { text: 'Молча наблюдать', next: null, effect: () => { GameState.scene = 'ch2_peace_attempt_result'; }},
    ]
},

'ch2_peace_works': {
    speaker: 'Орсон', text: '...Ну если не придираться к человеку на месте ровно, то жизнь легче. Ладно. ПЕРЕМИРИЕ. Но только до коронации Чеба!',
    choices: [
        { text: 'Отлично!', next: null, effect: () => { F.peace_achieved = true; S.friendship += 15; GameState.scene = 'ch2_chapter2_end'; }},
    ]
},

'ch2_solo_peace': {
    speaker: '', text: 'Вы идёте к обеим сторонам и пытаетесь договориться. Это долго. Это трудно. Но в конце концов...',
    choices: [
        { text: 'Удалось! (Мудрость > 30)', next: null, effect: () => { if (S.wisdom > 30) { F.peace_achieved = true; GameState.scene = 'ch2_peace_success'; } else { GameState.scene = 'ch2_peace_fail'; }}},
    ]
},

'ch2_peace_success': {
    speaker: '', text: 'Ваша мудрость и дипломатия победили! Перемирие установлено!',
    choices: [{ text: 'Далее', next: null, effect: () => { GameState.scene = 'ch2_chapter2_end'; }}],
},

'ch2_peace_fail': {
    speaker: '', text: 'Увы, мудрости не хватило. Война продолжается...',
    choices: [{ text: 'Далее', next: null, effect: () => { GameState.scene = 'ch2_chapter2_end'; }}],
},

'ch2_explore_war': {
    speaker: '', text: 'Чатик в хаосе. Повсюду разбросаны мемы и скриншоты. Кто-то спамит "Шиз-Колян!" в общий чат.',
    choices: [
        { text: 'К Орсону', next: null, effect: () => { GameState.scene = 'ch2_orson_war'; }},
        { text: 'К Вайтузу', next: null, effect: () => { GameState.scene = 'ch2_vaituz_panic'; }},
        { text: 'К Чебу', next: null, effect: () => { GameState.scene = 'ch2_cheb_prep'; }},
    ]
},

'ch2_run_together': {
    speaker: 'Вайтуз', text: 'БЕЖИМ!!! *хватает яблоки и бежит* Ээээ... куда?!',
    choices: [
        { text: 'На Чебовку! Улетим!', next: null, effect: () => { GameState.scene = 'ch2_cheb_escape'; }},
        { text: 'В Поле Яблок — спрячемся!', next: null, effect: () => { GameState.scene = 'ch2_apple_field'; }},
    ]
},

'ch2_apple_field': {
    speaker: '', text: 'Поле Яблок. Тихо. Мирно. Яблони шелестят. Вайтуз успокоился и жуёт яблоко.',
    choices: [
        { text: 'Поговорить о жизни', next: null, effect: () => { S.wisdom += 10; R.vaituz += 10; GameState.scene = 'ch2_deep_talk_vaituz'; }},
        { text: 'Вернуться к войне', next: null, effect: () => { GameState.scene = 'ch2_explore_war'; }},
    ]
},

'ch2_deep_talk_vaituz': {
    speaker: 'Вайтуз', text: 'Знаешь... Я может и тормоз. И плохо играю. Но у меня мозг не кипит — это хорошо, правда? Значит, я спокойный. А спокойные люди... они правы чаще. Наверное. Ээээ...',
    choices: [
        { text: 'Ты прав, Вайтуз. Мудрость в спокойствии.', next: null, effect: () => { S.wisdom += 15; F.vaituz_wisdom = true; GameState.scene = 'ch2_chapter2_end'; }},
        { text: 'Не знаю... пойдём обратно', next: null, effect: () => { GameState.scene = 'ch2_chapter2_end'; }},
    ]
},

'ch2_vaituz_choose': {
    speaker: 'Вайтуз', text: 'Выбрать?! Я... я... Моё сердце подсказывает, что все правы и неправы одновременно! А это тут причём?! Ладно, я за мир. Вот.',
    choices: [
        { text: 'Правильный выбор', next: null, effect: () => { R.vaituz += 5; GameState.scene = 'ch2_peace_with_vaituz'; }},
    ]
},

'ch2_cheb_recon': {
    speaker: 'Чеб', text: '*летит на дельтаплане* Вижу! Орсон в Войс-Каньоне! Вайтуз в Поле Яблок ест яблоки! Коб... Коб сидит в ресторане и считает чужие монеты! Всё как обычно!',
    choices: [
        { text: 'Лети к Орсону!', next: null, effect: () => { GameState.scene = 'ch2_cheb_to_orson'; }},
        { text: 'Вернуться', next: null, effect: () => { GameState.scene = 'ch2_chapter2_end'; }},
    ]
},

'ch2_cheb_to_orson': {
    speaker: 'Орсон', text: 'Чеб! Брат! Прилетел! Путешествия Чебика по серверам комьюнити! Коронация скоро!',
    choices: [
        { text: 'Давайте мириться!', next: null, effect: () => { S.friendship += 10; F.peace_achieved = true; GameState.scene = 'ch2_chapter2_end'; }},
    ]
},

'ch2_cheb_escape': {
    speaker: 'Чеб', text: 'Казахстан? Хорошая идея! Там тихо, степь, дельтаплан... Но мы же вернёмся, да?',
    choices: [
        { text: 'Вернёмся. Обязательно.', next: null, effect: () => { F.visited_kazakhstan = true; GameState.scene = 'ch2_kazakhstan'; }},
        { text: 'Может и нет', next: null, effect: () => { GameState.scene = 'ch2_ending_escape'; }},
    ]
},

'ch2_kazakhstan': {
    speaker: '', text: 'Казахстан. Бескрайняя степь. Тишина. Чеб парит на дельтаплане. Красиво. Мирно. Далеко от войн чатика.',
    choices: [
        { text: 'Это прекрасно', next: null, effect: () => { S.wisdom += 10; GameState.scene = 'ch2_chapter2_end'; }},
        { text: 'Скучаю по чатику', next: null, effect: () => { GameState.scene = 'ch2_chapter2_end'; }},
    ]
},

'ch2_cheb_peace': {
    speaker: 'Чеб', text: 'Мир? Я за! Давай соберём всех на Чебовке. Устроим коронацию, пир, фыр-фыр! Все помирятся!',
    choices: [
        { text: 'Отличная идея!', next: null, effect: () => { F.peace_party = true; GameState.scene = 'ch2_peace_party'; }},
    ]
},

'ch2_peace_party': {
    speaker: '', text: 'Вечеринка на Чебовке! Все собрались: Орсон, Вайтуз, Чеб, даже Коб (за 200 монет). Музыка, бургеры, Heroes 5 на большом экране.',
    choices: [
        { text: 'Предложить тост за мир!', next: null, effect: () => { S.friendship += 20; F.peace_achieved = true; GameState.scene = 'ch2_chapter2_end'; }},
        { text: 'Тихо наблюдать', next: null, effect: () => { S.wisdom += 5; GameState.scene = 'ch2_chapter2_end'; }},
    ]
},

'ch2_kob_war_plan': {
    speaker: 'Коб', text: 'План такой: я "заимствую" мод, который объединяет все фракции Heroes 5. Орсон увидит — поймёт, что вместе сильнее. Мудро, да? Ну, и подписка на мой канал обязательна.',
    choices: [
        { text: 'Гениально!', next: null, effect: () => { R.kob += 10; F.kob_plan = true; GameState.scene = 'ch2_kob_execute_plan'; }},
        { text: 'Это манипуляция', next: null, effect: () => { S.wisdom += 10; GameState.scene = 'ch2_kob_caught'; }},
    ]
},

'ch2_kob_execute_plan': {
    speaker: '', text: 'Коб активирует мод. Heroes 5 на экране мерцает... Все фракции объединяются! Орсон видит это и замирает.',
    choices: [
        { text: 'Смотреть реакцию', next: null, effect: () => { GameState.scene = 'ch2_orson_sees_mod'; }},
    ]
},

'ch2_orson_sees_mod': {
    speaker: 'Орсон', text: '...Это... Это РЕБОРН?! Все фракции... вместе?! Это то, о чём я мечтал! КТО СДЕЛАЛ ЭТОТ МОД?!',
    choices: [
        { text: 'Это Коб!', next: null, effect: () => { R.kob += 15; R.orson += 5; GameState.scene = 'ch2_kob_hero'; }},
        { text: 'Неважно кто. Главное — мир.', next: null, effect: () => { S.wisdom += 10; F.peace_achieved = true; GameState.scene = 'ch2_chapter2_end'; }},
    ]
},

'ch2_kob_hero': {
    speaker: 'Орсон', text: 'Коб?! Тот самый вор мо— ...Модмейкер? Хм. Может я его недооценивал. Может. ПЕРЕМИРИЕ!',
    choices: [
        { text: 'Мир!', next: null, effect: () => { F.peace_achieved = true; F.kob_hero = true; GameState.scene = 'ch2_chapter2_end'; }},
    ]
},

'ch2_kob_honest': {
    speaker: 'Коб', text: '...Обмануть? Нет. Ну, может чуть-чуть. Но цель-то благая! И подписка на канал — это бонус, не условие. Почти.',
    choices: [
        { text: 'Ладно, давай твой план', next: null, effect: () => { GameState.scene = 'ch2_kob_war_plan'; }},
    ]
},

'ch2_kob_caught': {
    speaker: 'Коб', text: 'Манипуляция?! Я?! Я просто... стратегически мыслю. И да, я нарцисс. Но мой нарциссизм ПОМОГАЕТ ЛЮДЯМ. Иногда. За 200 монет.',
    choices: [
        { text: 'Ладно, помоги по-своему', next: null, effect: () => { GameState.scene = 'ch2_kob_execute_plan'; }},
    ]
},

'ch2_war_peace': {
    speaker: '', text: 'Мир восстановлен! Все пожимают руки. Орсон бурчит, но мирится.',
    choices: [{ text: 'Далее', next: null, effect: () => { F.peace_achieved = true; GameState.scene = 'ch2_chapter2_end'; }}],
},

'ch2_war_victory': {
    speaker: '', text: 'Вы победили! Но ценой мира в чатике...',
    choices: [{ text: 'Далее', next: null, effect: () => { GameState.scene = 'ch2_chapter2_end'; }}],
},

'ch2_gave_name': {
    speaker: 'Орсон', text: 'Храбрый! Не как эти космонавты безъязыкие! Уважаю! Ладно, ты прошёл.',
    choices: [{ text: 'Далее', next: null, effect: () => { S.respect += 10; GameState.scene = 'ch2_chapter2_end'; }}],
},

'ch2_no_name': {
    speaker: 'Орсон', text: 'Не скажешь?! Насколько ты фейк от 100 до 100?! Космонавт!',
    choices: [{ text: 'Далее', next: null, effect: () => { GameState.scene = 'ch2_chapter2_end'; }}],
},

'ch2_observe_debate': {
    speaker: '', text: 'Дебаты продолжаются часами. Итог: Пятёрка всё ещё лучше. По мнению Орсона.',
    choices: [{ text: 'Далее', next: null, effect: () => { S.wisdom += 5; GameState.scene = 'ch2_chapter2_end'; }}],
},

'ch2_peace_attempt_result': {
    speaker: '', text: 'Вайтуз старается... но Орсон упрям. Полу-перемирие.',
    choices: [{ text: 'Далее', next: null, effect: () => { GameState.scene = 'ch2_chapter2_end'; }}],
},

'ch2_wait_it_out': {
    speaker: '', text: 'Проходит время. Война утихает сама. Все устали.',
    choices: [{ text: 'Далее', next: null, effect: () => { F.peace_achieved = true; GameState.scene = 'ch2_chapter2_end'; }}],
},

'ch2_ending_escape': {
    speaker: '', text: 'Вы решили остаться в Казахстане навсегда.',
    choices: [{ text: 'ФИНАЛ: Побег в степь', next: null, effect: () => { GameState.scene = 'ending_escape_steppe'; }}],
},

'ch2_chapter2_end': {
    speaker: '', text: 'Глава 2 завершена. Ваш выбор определил дальнейший путь...',
    choices: [
        { text: 'Продолжить → Глава 3', next: null, effect: () => { GameState.chapter = 3; GameState.scene = 'ch3_start'; }},
    ]
},

// ============== CHAPTER 3: КОРОНАЦИЯ ==============
'ch3_start': {
    speaker: '', text: `ГЛАВА 3: КОРОНАЦИЯ ЧЕБА. ${F.peace_achieved ? 'Мир восстановлен.' : 'Война ещё тлеет.'} Но сегодня — особый день. Коронация Чеба!`,
    choices: [
        { text: 'Идти на коронацию!', next: null, effect: () => { GameState.scene = 'ch3_coronation'; }},
        { text: 'Сначала подготовиться', next: null, effect: () => { GameState.scene = 'ch3_prepare'; }},
    ]
},

'ch3_coronation': {
    speaker: 'Орсон', text: '@everyone! Ребят, коронация Чеба начнётся сегодня в 8 часов вечера! Художник-татуировщик немного опоздает — звёзды на плечах и крылья на спине Чеба потребуют редкие чернила из крови дракона! Не опоздайте! Девушек не зовите — Чеб сказал, гарем не нужен!',
    choices: [
        { text: 'Это будет эпично!', next: null, effect: () => { GameState.scene = 'ch3_ceremony'; }},
        { text: 'Зачем коронация лётчику?', next: null, effect: () => { S.wisdom += 3; GameState.scene = 'ch3_why_coronation'; }},
        { text: 'А Коб придёт?', next: null, effect: () => { GameState.scene = 'ch3_kob_at_coronation'; }},
    ]
},

'ch3_ceremony': {
    speaker: '', text: 'Все собрались в Храме Пятёрки. Чеб сидит на золотом троне. Орсон произносит речь. Вайтуз стоит с яблоком. Даже Коб тут (за 200 монет).',
    choices: [
        { text: 'Аплодировать', next: null, effect: () => { R.cheb += 10; R.orson += 5; GameState.scene = 'ch3_coronation_speech'; }},
        { text: 'Тихо наблюдать', next: null, effect: () => { S.wisdom += 5; GameState.scene = 'ch3_coronation_observe'; }},
        { text: 'Устроить свою коронацию!', next: null, effect: () => { S.chaos += 15; GameState.scene = 'ch3_rival_coronation'; }},
    ]
},

'ch3_coronation_speech': {
    speaker: 'Орсон', text: 'ЧЕБА КОРОНУЕМ! Лётчик из Казахстана, моддер, герой чатика! Его дельтаплан — символ свободы! Обильное празднество и активное фыр-фыр на Чебовке! Да здравствует Король Чеб!',
    choices: [
        { text: 'Да здравствует!', next: null, effect: () => { F.cheb_crowned = true; GameState.scene = 'ch3_after_coronation'; }},
        { text: 'Подождите... у меня речь!', next: null, effect: () => { GameState.scene = 'ch3_player_speech'; }},
    ]
},

'ch3_player_speech': {
    speaker: '', text: 'Все смотрят на вас. Тишина.',
    choices: [
        { text: 'За дружбу! За чатик! За Героев!', next: null, effect: () => { S.friendship += 20; S.respect += 10; GameState.scene = 'ch3_great_speech'; }},
        { text: 'Тройка лучше Пятёрки!', next: null, effect: () => { S.chaos += 30; GameState.scene = 'ch3_chaos_speech'; }},
        { text: '*забыть слова*', next: null, effect: () => { S.chaos += 5; GameState.scene = 'ch3_forget_speech'; }},
        { text: 'Шиз-Колян! Fake news maker!', next: null, effect: () => { S.shiza += 10; GameState.scene = 'ch3_sing_speech'; }},
    ]
},

'ch3_great_speech': {
    speaker: '', text: 'Зал взрывается аплодисментами! Даже Орсон хлопает. Вайтуз плачет от радости. Чеб улыбается. Коб... считает, сколько можно заработать на видео с этой речью.',
    choices: [{ text: 'Далее', next: null, effect: () => { F.great_speech = true; GameState.scene = 'ch3_after_coronation'; }}],
},

'ch3_chaos_speech': {
    speaker: 'Орсон', text: 'ЧТО?! НА КОРОНАЦИИ?! ТРОЙКА?! Ты бы набил ебало за тройку?! БИТВА!!!',
    choices: [
        { text: 'БИТВА!', next: null, effect: () => {
            GameState.scene = 'battle';
            GameState.battleData = {
                id: 'orson', name: 'ОРСОН (ЯРОСТЬ КОРОНАЦИИ)', hp: 40,
                acts: ['Извиниться', 'Шутка', 'Философия', 'Бежать'],
                actResponses: {
                    talk: '"НЕ ВРЕМЯ ДЛЯ РАЗГОВОРОВ!"',
                    praise: '"ПОЗДНО ЛЬСТИТЬ!"',
                    troll: '"ЕЩЁ ЧЁ ПРИДУМАЛ, ТУПАЯ ТЫ МОРДА НА!"',
                    ignore: '"НЕЛЬЗЯ ИГНОРИТЬ ИСТИНУ!"',
                },
                patterns: ['spiral', 'spiral', 'horizontal', 'vertical'],
            };
            GameState.afterBattle = 'ch3_after_chaos_battle';
        }},
    ]
},

'ch3_after_chaos_battle': {
    speaker: '', text: 'Коронация испорчена. Чеб грустно смотрит с трона.',
    choices: [
        { text: 'Извиниться перед всеми', next: null, effect: () => { R.orson += 5; R.cheb += 5; GameState.scene = 'ch3_after_coronation'; }},
        { text: 'Уйти', next: null, effect: () => { GameState.scene = 'ch3_after_coronation'; }},
    ]
},

'ch3_forget_speech': {
    speaker: 'Вайтуз', text: 'Ээээ... Бывает. У меня мозг тоже не кипит.',
    choices: [{ text: '...', next: null, effect: () => { GameState.scene = 'ch3_after_coronation'; }}],
},

'ch3_sing_speech': {
    speaker: '', text: 'Вы начинаете петь! "Шиз-Колян! Fake news maker! Хей, безликий хер ты!" Орсон... подпевает? Все подпевают! Это стало гимном коронации!',
    choices: [{ text: 'Ещё куплет!', next: null, effect: () => { S.shiza += 10; F.song_at_coronation = true; GameState.scene = 'ch3_after_coronation'; }}],
},

'ch3_coronation_observe': {
    speaker: '', text: 'Вы тихо наблюдаете. Церемония проходит гладко. Чеб коронован. Орсон доволен.',
    choices: [{ text: 'Далее', next: null, effect: () => { F.cheb_crowned = true; GameState.scene = 'ch3_after_coronation'; }}],
},

'ch3_rival_coronation': {
    speaker: 'Орсон', text: 'СВОЮ КОРОНАЦИЮ?! ТУТ ТОЛЬКО ОДИН КОРОНУЕТСЯ! И ЭТО ЧЕБ! БИТВА!',
    choices: [
        { text: 'Шучу-шучу!', next: null, effect: () => { GameState.scene = 'ch3_ceremony'; }},
        { text: 'НЕТ! Я ТОЖЕ ХОЧУ КОРОНУ!', next: null, effect: () => { S.chaos += 20; GameState.scene = 'ch3_chaos_speech'; }},
    ]
},

'ch3_why_coronation': {
    speaker: 'Орсон', text: 'Зачем?! Потому что Чеб — это ЛЁТЧИК! Он летает на ДЕЛЬТАПЛАНЕ! Из КАЗАХСТАНА! И делает НАСТОЯЩИЕ моды! Не как Коб!',
    choices: [{ text: 'Понятно', next: null, effect: () => { GameState.scene = 'ch3_ceremony'; }}],
},

'ch3_kob_at_coronation': {
    speaker: 'Коб', text: 'Я тут! За 200 монет, конечно. VIP-место. Бургеры принёс. Подписывайтесь на канал! Прямая трансляция коронации! Лайк!',
    choices: [
        { text: 'Коб, ты неисправим', next: null, effect: () => { R.kob += 3; GameState.scene = 'ch3_ceremony'; }},
    ]
},

'ch3_prepare': {
    speaker: '', text: 'Перед коронацией можно подготовиться.',
    choices: [
        { text: 'Поговорить с Вайтузом', next: null, effect: () => { GameState.scene = 'ch3_vaituz_prep'; }},
        { text: 'Найти подарок для Чеба', next: null, effect: () => { GameState.scene = 'ch3_find_gift'; }},
        { text: 'Идти на коронацию', next: null, effect: () => { GameState.scene = 'ch3_coronation'; }},
    ]
},

'ch3_vaituz_prep': {
    speaker: 'Вайтуз', text: 'Коронация! Круто! Я надену смокинг! И возьму яблоко! Бля, как же ахуенно!',
    choices: [
        { text: 'Ты отлично выглядишь!', next: null, effect: () => { R.vaituz += 5; GameState.scene = 'ch3_coronation'; }},
    ]
},

'ch3_find_gift': {
    speaker: '', text: 'Вы ищете подарок. Находите: старую карту Heroes 5, мини-дельтаплан из бумаги, или бургер Коба (за 200 монет).',
    choices: [
        { text: 'Карта Heroes 5', next: null, effect: () => { F.gift_heroes = true; R.cheb += 10; GameState.scene = 'ch3_coronation'; }},
        { text: 'Мини-дельтаплан', next: null, effect: () => { F.gift_delta = true; R.cheb += 15; GameState.scene = 'ch3_coronation'; }},
        { text: 'Бургер Коба', next: null, effect: () => { F.gift_burger = true; R.cheb += 5; R.kob += 5; GameState.scene = 'ch3_coronation'; }},
    ]
},

'ch3_after_coronation': {
    speaker: '', text: 'Коронация завершена. Чеб — Король Чебовки. Но впереди — ещё более серьёзные испытания...',
    choices: [
        { text: 'Продолжить → Глава 4', next: null, effect: () => { GameState.chapter = 4; GameState.scene = 'ch4_start'; }},
    ]
},

// ============== CHAPTER 4: РЕБОРН ==============
'ch4_start': {
    speaker: '', text: 'ГЛАВА 4: РЕБОРН. Орсон наконец нашёл то, что искал — мифический исходный код Нивал. Или так ему кажется...',
    choices: [
        { text: 'К Орсону!', next: null, effect: () => { GameState.scene = 'ch4_orson_found_code'; }},
        { text: 'К друзьям сначала', next: null, effect: () => { GameState.scene = 'ch4_gather_friends'; }},
    ]
},

'ch4_orson_found_code': {
    speaker: 'Орсон', text: 'Я НАШЁЛ! ИСХОДНЫЙ КОД! РЕБОРН НАЧИНАЕТСЯ! Heroes 5 будет ПЕРЕРОЖДЕНА! В моей интерпретации! Шизоидной? Может! Но ВЕЛИКОЙ! Мне нужна помощь! Все! В Храм!',
    choices: [
        { text: 'Помочь Орсону с Реборном!', next: null, effect: () => { R.orson += 15; F.help_reborn_ch4 = true; GameState.scene = 'ch4_reborn_work'; }},
        { text: 'Орсон, это не исходный код...', next: null, effect: () => { S.wisdom += 10; GameState.scene = 'ch4_orson_truth'; }},
        { text: 'Позвать друзей', next: null, effect: () => { GameState.scene = 'ch4_gather_friends'; }},
    ]
},

'ch4_reborn_work': {
    speaker: 'Орсон', text: 'ДА! Вместе мы сделаем Пятёрку великой! Чеб — моды! Вайтуз — тестирование (медленное)! Коб — маркетинг (и бургеры)! Ты — кодинг!',
    choices: [
        { text: 'За работу!', next: null, effect: () => { GameState.scene = 'ch4_work_montage'; }},
        { text: 'А это реально?', next: null, effect: () => { S.wisdom += 5; GameState.scene = 'ch4_reborn_doubt'; }},
    ]
},

'ch4_work_montage': {
    speaker: '', text: '*монтаж работы* Чеб делает арт. Вайтуз медленно тестирует. Коб пиарит (и ворует идеи). Орсон командует. Проходят дни...',
    choices: [
        { text: 'Результат?', next: null, effect: () => { GameState.scene = 'ch4_reborn_result'; }},
    ]
},

'ch4_reborn_result': {
    speaker: '', text: 'Реборн... получился? На экране — Heroes 5, но другая. Странная. Шизоидная интерпретация Орсона. Все фракции перемешаны. Баланс безумный. Но... красиво.',
    choices: [
        { text: 'Это шедевр!', next: null, effect: () => { S.shiza += 10; R.orson += 20; GameState.scene = 'ch4_reborn_success'; }},
        { text: 'Это... хаос', next: null, effect: () => { S.wisdom += 5; GameState.scene = 'ch4_reborn_chaos'; }},
        { text: 'Мне нравится, но нужны правки', next: null, effect: () => { S.wisdom += 10; GameState.scene = 'ch4_reborn_improve'; }},
    ]
},

'ch4_reborn_success': {
    speaker: 'Орсон', text: 'Я ЗНАЛ! РЕБОРН ЖИВ! ПЯТЁРКА ВЕРНУЛАСЬ! Классно, классно, брат! Мы сделали это! ВСЕ УВИДЯТ!',
    choices: [{ text: 'Далее', next: null, effect: () => { F.reborn_complete = true; GameState.scene = 'ch4_chapter4_end'; }}],
},

'ch4_reborn_chaos': {
    speaker: 'Орсон', text: 'Хаос?! Это не хаос! Это ВИДЕНИЕ! Ты не понимаешь искусство! Как Вильгефорц — только критикуешь!',
    choices: [
        { text: 'Ладно, может ты прав', next: null, effect: () => { GameState.scene = 'ch4_chapter4_end'; }},
        { text: 'Нет, Орсон, тут проблемы', next: null, effect: () => { R.orson -= 10; GameState.scene = 'ch4_reborn_argue'; }},
    ]
},

'ch4_reborn_improve': {
    speaker: 'Орсон', text: 'Правки? Хм... Ну если не придираться к человеку на месте ровно... Ладно. Давай. Что предлагаешь?',
    choices: [
        { text: 'Сбалансировать фракции', next: null, effect: () => { S.wisdom += 5; F.reborn_balanced = true; GameState.scene = 'ch4_chapter4_end'; }},
        { text: 'Добавить новый контент', next: null, effect: () => { F.reborn_new_content = true; GameState.scene = 'ch4_chapter4_end'; }},
        { text: 'Оставить как есть — это уникально', next: null, effect: () => { R.orson += 10; GameState.scene = 'ch4_reborn_success'; }},
    ]
},

'ch4_reborn_argue': {
    speaker: 'Орсон', text: 'ПРОБЛЕМЫ?! Я пошёл. У вас 3 суток, чтобы взяться за голову! БИТВА!',
    choices: [
        { text: 'БИТВА!', next: null, effect: () => {
            GameState.scene = 'battle';
            GameState.battleData = {
                id: 'orson', name: 'ОРСОН (РЕБОРН)', hp: 35,
                acts: ['Похвалить Реборн', 'Конструктивная критика', 'Мудрость', 'Пощада'],
                actResponses: {
                    talk: '"Реборн — это МОЯ жизнь!"',
                    praise: '"...Правда нравится?"',
                    troll: '"Ты как Вильгефорц!"',
                    ignore: '"Не игнорь мечту!"',
                },
                patterns: ['spiral', 'vertical', 'random'],
            };
            GameState.afterBattle = 'ch4_after_reborn_battle';
        }},
    ]
},

'ch4_after_reborn_battle': {
    speaker: 'Орсон', text: '...Ладно. Может... может ты прав. Может Реборн не идеален. Но это моя мечта, понимаешь?',
    choices: [
        { text: 'Понимаю. Давай доработаем вместе.', next: null, effect: () => { R.orson += 15; F.reborn_together = true; GameState.scene = 'ch4_chapter4_end'; }},
        { text: 'Мечты важны.', next: null, effect: () => { S.wisdom += 10; GameState.scene = 'ch4_chapter4_end'; }},
    ]
},

'ch4_orson_truth': {
    speaker: 'Орсон', text: '...Не исходный код? А что тогда?! Я... я был уверен! Мифы исходного кода Нивал! Первый шаг для разоблачения!',
    choices: [
        { text: 'Это просто readme файл...', next: null, effect: () => { R.orson -= 5; S.wisdom += 10; GameState.scene = 'ch4_orson_sad'; }},
        { text: 'Но идея Реборна — хорошая!', next: null, effect: () => { R.orson += 10; GameState.scene = 'ch4_reborn_from_scratch'; }},
    ]
},

'ch4_orson_sad': {
    speaker: 'Орсон', text: '...Readme? Просто... readme? Я столько лет... Голова не репа. Голова не репа...',
    choices: [
        { text: 'Не грусти. Давай сделаем Реборн по-настоящему!', next: null, effect: () => { R.orson += 20; GameState.scene = 'ch4_reborn_from_scratch'; }},
        { text: '...Извини', next: null, effect: () => { GameState.scene = 'ch4_chapter4_end'; }},
    ]
},

'ch4_reborn_from_scratch': {
    speaker: 'Орсон', text: 'С нуля?! ДАААА! Но теперь — по-настоящему! С командой! Чеб — моды! Вайтуз — яблоки! То есть тестирование!',
    choices: [
        { text: 'За работу!', next: null, effect: () => { F.reborn_real = true; GameState.scene = 'ch4_work_montage'; }},
    ]
},

'ch4_reborn_doubt': {
    speaker: 'Орсон', text: 'Реально?! Конечно реально! Надеюсь ты реально будешь поддерживать игру на Unreal Engine 5, а не Silent Storm 2002 года! Шутка. Или нет.',
    choices: [
        { text: 'Ладно, начнём!', next: null, effect: () => { GameState.scene = 'ch4_work_montage'; }},
    ]
},

'ch4_gather_friends': {
    speaker: '', text: 'Вы собираете друзей.',
    choices: [
        { text: 'Позвать Вайтуза', next: null, effect: () => { GameState.scene = 'ch4_vaituz_join'; }},
        { text: 'Позвать Чеба', next: null, effect: () => { GameState.scene = 'ch4_cheb_join'; }},
        { text: 'Позвать Коба', next: null, effect: () => { if (F.kob_line_unlocked) GameState.scene = 'ch4_kob_join'; else GameState.scene = 'ch4_kob_locked'; }},
        { text: 'Идти к Орсону', next: null, effect: () => { GameState.scene = 'ch4_orson_found_code'; }},
    ]
},

'ch4_vaituz_join': {
    speaker: 'Вайтуз', text: 'Ээээ... Реборн? Ну я могу помочь! Я МЕДЛЕННО тестирую, но зато тщательно! У меня мозг не кипит — значит, баги найду!',
    choices: [{ text: 'Отлично!', next: null, effect: () => { R.vaituz += 5; GameState.scene = 'ch4_orson_found_code'; }}],
},

'ch4_cheb_join': {
    speaker: 'Чеб', text: 'Реборн? Я за! Моды — моя специальность! Настоящие моды, не как у Коба! Я готов!',
    choices: [{ text: 'Отлично!', next: null, effect: () => { R.cheb += 5; GameState.scene = 'ch4_orson_found_code'; }}],
},

'ch4_kob_join': {
    speaker: 'Коб', text: 'Реборн? Интересно... Могу помочь с маркетингом. И бургерами. 200 монет за консультацию. Шучу. 150.',
    choices: [{ text: 'Идёт!', next: null, effect: () => { R.kob += 5; GameState.scene = 'ch4_orson_found_code'; }}],
},

'ch4_kob_locked': {
    speaker: '', text: '200 МОНЕТ. Дверь заперта.',
    choices: [{ text: 'Уйти', next: null, effect: () => { GameState.scene = 'ch4_orson_found_code'; }}],
},

'ch4_chapter4_end': {
    speaker: '', text: 'Глава 4 завершена. Реборн — мечта или безумие? Ответ ждёт в финале...',
    choices: [
        { text: 'Продолжить → Глава 5 (Финал)', next: null, effect: () => { GameState.chapter = 5; GameState.scene = 'ch5_start'; }},
    ]
},

// ============== CHAPTER 5: ФИНАЛЬНАЯ БАШНЯ ==============
'ch5_start': {
    speaker: '', text: 'ГЛАВА 5: ФИНАЛЬНАЯ БАШНЯ. Все пути сходятся здесь. Впереди — Башня, где решится судьба чатика. За спиной — всё, что вы пережили.',
    choices: [
        { text: 'Войти в Башню', next: null, effect: () => { GameState.scene = 'ch5_tower_entrance'; }},
        { text: 'Поговорить с друзьями перед входом', next: null, effect: () => { GameState.scene = 'ch5_final_talks'; }},
    ]
},

'ch5_tower_entrance': {
    speaker: '', text: 'Финальная Башня. Массивная. Перед входом стоят все: Орсон, Вайтуз, Чеб, и может Коб.',
    choices: [
        { text: 'Войти всем вместе', next: null, effect: () => { GameState.scene = 'ch5_together'; }},
        { text: 'Войти одному', next: null, effect: () => { GameState.scene = 'ch5_alone'; }},
    ]
},

'ch5_final_talks': {
    speaker: '', text: 'Последний шанс поговорить.',
    choices: [
        { text: 'Орсон', next: null, effect: () => { GameState.scene = 'ch5_talk_orson'; }},
        { text: 'Вайтуз', next: null, effect: () => { GameState.scene = 'ch5_talk_vaituz'; }},
        { text: 'Чеб', next: null, effect: () => { GameState.scene = 'ch5_talk_cheb'; }},
        { text: 'Войти в Башню', next: null, effect: () => { GameState.scene = 'ch5_tower_entrance'; }},
    ]
},

'ch5_talk_orson': {
    speaker: 'Орсон', text: 'Брат... Спасибо. За всё. За Реборн. За то, что слушал. Я знаю, я параноик и шизик. Но... Бог есть и он всё видит. И он видит, что ты — друг.',
    choices: [{ text: 'И ты, Орсон. Пойдём.', next: null, effect: () => { R.orson += 10; GameState.scene = 'ch5_tower_entrance'; }}],
},

'ch5_talk_vaituz': {
    speaker: 'Вайтуз', text: 'Ээээ... Знаешь... У меня мозг не кипит, и мне кажется, это хорошо. Спокойные люди видят больше. Бля, как же ахуенно прожить такое приключение!',
    choices: [{ text: 'Ты прав, Вайтуз. Пойдём.', next: null, effect: () => { R.vaituz += 10; GameState.scene = 'ch5_tower_entrance'; }}],
},

'ch5_talk_cheb': {
    speaker: 'Чеб', text: 'Из Казахстана сюда — долгий путь. Но он того стоил. Дельтаплан, моды, друзья. Давай закончим это дело!',
    choices: [{ text: 'За небо! Пойдём.', next: null, effect: () => { R.cheb += 10; GameState.scene = 'ch5_tower_entrance'; }}],
},

'ch5_together': {
    speaker: '', text: 'Все вместе входят в Башню. Внутри — зеркала. В каждом отражается другая версия событий. Другой путь. Другой выбор. Тысячи путей, ведущих сюда.',
    choices: [
        { text: 'Подняться на вершину', next: null, effect: () => { GameState.scene = 'ch5_summit'; }},
    ]
},

'ch5_alone': {
    speaker: '', text: 'Вы входите один. Тишина. Только эхо ваших шагов.',
    choices: [
        { text: 'Подняться на вершину', next: null, effect: () => { GameState.scene = 'ch5_summit_alone'; }},
    ]
},

'ch5_summit': {
    speaker: '', text: 'Вершина Башни. Панорама всего мира: Чатик, Храм, Каньон, Чебовка, Поле Яблок... Здесь нужно сделать ФИНАЛЬНЫЙ ВЫБОР.',
    choices: [
        { text: 'МИР — помирить всех навсегда', next: null, effect: () => { GameState.scene = computeEnding(); }},
        { text: 'ХАОС — пусть будет как будет', next: null, effect: () => { S.chaos += 20; GameState.scene = computeEnding(); }},
        { text: 'МУДРОСТЬ — каждый сам решает', next: null, effect: () => { S.wisdom += 20; GameState.scene = computeEnding(); }},
        { text: 'РЕБОРН — перерождение всего', next: null, effect: () => { S.shiza += 20; GameState.scene = computeEnding(); }},
    ]
},

'ch5_summit_alone': {
    speaker: '', text: 'На вершине — только вы и ветер. Без друзей. Один.',
    choices: [
        { text: 'Принять одиночество', next: null, effect: () => { GameState.scene = 'ending_lone_wolf'; }},
        { text: 'Позвать друзей!', next: null, effect: () => { GameState.scene = 'ch5_summit'; }},
    ]
},

// ============== ENDINGS ==============
'ending_peace': {
    speaker: '', text: 'ФИНАЛ: МИР В ЧАТИКЕ\n\nВсе помирились. Орсон извинился (первый раз в жизни). Вайтуз раздал всем яблоки. Чеб устроил авиашоу на дельтаплане. Коб открыл бесплатную бургерную (врёт, 200 монет). Heroes 5 живёт. Дружба побеждает.\n\n"Если не придираться к человеку на месте ровно, то жизнь легче." — Орсон',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_war': {
    speaker: '', text: 'ФИНАЛ: ВЕЧНАЯ ВОЙНА\n\nКонфликт не решён. Чатик погряз в войне. Орсон рассылает ультиматумы. "У ВАС 3 СУТОК!" Никто не мирится. Но... может так и надо? Войны — тоже часть жизни.\n\n"Какие же вы жалкие, ребят." — Орсон',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_escape': {
    speaker: '', text: 'ФИНАЛ: ПОБЕГ\n\nВы ушли из чатика. Навсегда. Тишина. Покой. Но иногда по ночам снится: "Зайди в войс, пж..."',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_king_cheb': {
    speaker: '', text: 'ФИНАЛ: КОРОЛЬ ЧЕБ\n\nЧеб правит мудро. Его дельтаплан — символ свободы. Моды процветают. Из Казахстана пришёл золотой век. Орсон — главный советник. Вайтуз — придворный дегустатор яблок. Коб — министр финансов (200 монет налог).\n\n"Салам!" — Король Чеб',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_shiza': {
    speaker: '', text: 'ФИНАЛ: ШИЗА ПОБЕДИЛА\n\nРеборн поглотил всё. Орсон создал свою Heroes 5 — безумную, хаотичную, прекрасную. Секта свидетелей Реборна стала официальной религией чатика. Все играют в 30-35 фпс и счастливы.\n\n"Шиз-Колян! Fake news maker! Хей, безликий хер ты!" — Гимн Реборна',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_brain_no_boil': {
    speaker: '', text: 'ФИНАЛ: У МЕНЯ МОЗГ НЕ КИПИТ\n\nВайтуз случайно спас всех. Как? Он МЕДЛЕННО нёс аптечку, споткнулся об яблоко, упал на рубильник и выключил серверы войны. Случайность? Судьба? У него мозг не кипит.\n\n"Ээээ... Что?" — Вайтуз',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_burger_zen': {
    speaker: '', text: 'ФИНАЛ: БУРГЕРНЫЙ ДЗЕН\n\nКоб научил всех готовить бургеры. Оказалось, что за бургером все споры утихают. Орсон забыл про войну. Вайтуз нашёл смысл жизни (бургер + яблоко = совершенство). Чеб доставляет бургеры на дельтаплане.\n\n"200 монет. Но для друзей... 199." — Коб',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_mod_reality': {
    speaker: '', text: 'ФИНАЛ: МОД РЕАЛЬНОСТИ\n\nЧеб модифицировал саму реальность. Теперь чатик — это игра, а игра — это чатик. Мета-петля. Вы играете в игру про людей, которые играют в игру. Которые играют в Heroes 5. Рекурсия.\n\n"Мод установлен. Перезагрузка..." — Чеб',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_song': {
    speaker: '', text: 'ФИНАЛ: ПЕСНЯ ШИЗ-КОЛЯН\n\n♪ Шиз-Колян, Fake news maker! ♪\n♪ Хей, безликий хер ты! ♪\n♪ Зум-зум, шиз-шиз! ♪\n♪ Хей, Коля Шизик! ♪\n♪ Прощенье хер те! ♪\n\nВся история стала песней. И песня — стала историей.\n\nЗанавес.',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_heroes6': {
    speaker: '', text: 'ФИНАЛ: HEROES 6\n\nОрсон наконец создал идеальную игру. Heroes 6: Реборн. 60 фпс (не 30-35!). Все фракции сбалансированы. Вайтуз даже выигрывает! Иногда. Мир счастлив.\n\n"Классно, классно, брат!" — Орсон',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_apple_discord': {
    speaker: '', text: 'ФИНАЛ: ЯБЛОКО РАЗДОРА\n\nЯблоко Вайтуза оказалось ключом ко всему. Золотое яблоко. Кто его держит — тот решает судьбу чатика. Вайтуз выбрал: никому. Съел.\n\n"Бля, как же ахуенно после энергетика и яблок!" — Вайтуз',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_reborn': {
    speaker: '', text: 'ФИНАЛ: РЕБОРН\n\nHeroes 5 перерождена. Не как игра — как идея. Идея о том, что даже самые безумные мечты могут стать реальностью. Орсон доказал всем. Или всем всё равно. Но ему — нет.\n\n"Секта свидетелей Реборна — это не секта. Это ИСТИНА." — Орсон',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_voice_forever': {
    speaker: '', text: 'ФИНАЛ: ВОЙС НАВСЕГДА\n\nВсе застряли в войсе на вечность. Орсон спорит бесконечно. Вайтуз говорит "ээээ" каждые 5 секунд. Чеб комментирует погоду в Казахстане. Коб просит 200 монет.\n\n"Зайди в войс, пж. Продолжим там. Навсегда." — Орсон',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_videocard': {
    speaker: '', text: 'ФИНАЛ: 4090 VS 5090\n\nФинальная битва решилась выбором видеокарты. 4090 — ноутбук, путешествует до дивана за 2 секунды. 5090 — ПК, основа гейминга. Орсон выбрал ноутбук. Как всегда.\n\n"Ноуты игровые кайф!" — Орсон',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_forgiveness': {
    speaker: '', text: 'ФИНАЛ: ПРОЩЕНЬЕ ХЕР ТЕ!\n\nНикто никого не простил. И это нормально. Не все истории заканчиваются прощением. Иногда достаточно просто... жить дальше.\n\n"Прощенье хер те! Прощенье хер те!" — Хор чатика',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_left_brain': {
    speaker: '', text: 'ФИНАЛ: ЛЕВОЕ ПОЛУШАРИЕ\n\nФилософский финал. О логике и чувствах. О левом и правом полушарии. О том, что быть умным — не значит быть правым. И быть глупым — не значит быть неправым.\n\nВайтуз: "У меня мозг не кипит."\nОрсон: "Умная голова с точки зрения логики... Левое полушарие. Или правое."\n\nМудрость — в балансе.',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_undertale': {
    speaker: '', text: 'ФИНАЛ: ПАЦИФИСТ\n\nВы никого не обидели. Ни разу. Даже когда Орсон кричал. Даже когда Коб просил 200 монет. Вы были добры ко всем.\n\n* Вы чувствуете... что-то тёплое.\n* Это дружба.\n* Или яблоко.\n\n♥ КОНЕЦ ♥',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_speedrun': {
    speaker: '', text: 'ФИНАЛ: СПИДРАН\n\nВы прошли всё за рекордное время! Орсон бы гордился (если бы успел сказать). Время: БЫСТРО.\n\n"Ты обосрался, бро. Но быстро." — Орсон',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_100percent': {
    speaker: '', text: 'ФИНАЛ: 100% ПРОХОЖДЕНИЕ\n\nВы нашли ВСЁ. Каждый секрет. Каждый путь. Каждый бургер Коба. Каждое яблоко Вайтуза. Каждый дисс Орсона. Каждый мод Чеба.\n\nВы — легенда чатика.',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_new_game_plus': {
    speaker: '', text: 'ФИНАЛ: НОВАЯ ИГРА+\n\nВсё начинается сначала. Но вы помните. Все помнят. "Дежавю," — говорит Вайтуз. "Ээээ... Мы уже тут были?"',
    choices: [{ text: 'НАЧАТЬ ЗАНОВО', next: null, effect: () => { resetGame(); GameState.scene = 'intro'; }}],
},

'ending_escape_steppe': {
    speaker: '', text: 'ФИНАЛ: ПОБЕГ В СТЕПЬ\n\nВы и Чеб улетели в Казахстан навсегда. Дельтаплан парит над бескрайней степью. Тишина. Свобода. Никаких споров о видеокартах.\n\n"Салам, друг. Мы свободны." — Чеб',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_lone_wolf': {
    speaker: '', text: 'ФИНАЛ: ОДИНОКИЙ ВОЛК\n\nВы решили идти один. Без друзей. Без чатика. Без Героев. Только вы и тишина. Иногда это нужно.\n\n"..." — Тишина',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_kob_secret': {
    speaker: '', text: 'ФИНАЛ: СЕКРЕТ КОБА\n\nВы прошли секретную линию Коба. Оказалось, за его нарциссизмом скрывался... ещё больший нарциссизм. Но также — мудрость. "Все ищут связь. Дружбу. Просто по-разному."\n\n"200 монет. За мудрость. Скидка для друзей: 199." — Коб',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_karma': {
    speaker: '', text: 'ФИНАЛ: КАРМА\n\nКарма настигла всех. Орсон получил то, что заслужил — мир. Вайтуз получил яблоки. Чеб — небо. Коб — 200 монет.\n\n"Карма и обычное человеческое желание отомстить всегда тебя преследует." — Орсон',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

'ending_god_sees': {
    speaker: '', text: 'ФИНАЛ: БОГ ВИДИТ\n\n"Бог есть и он всё видит." Орсон был прав. Кто-то наблюдает за всем этим. Может это вы. Может — игрок за экраном.\n\n"Если есть что сказать, пожалуйста. Но... Я никогда тебя не прощу за это!" — Орсон\n\n...Или прощу.',
    choices: [{ text: 'КОНЕЦ', next: null, effect: () => { GameState.scene = 'credits'; }}],
},

// ============== CREDITS ==============
'credits': {
    speaker: '', text: `ГЕРОИ ЧАТИКА\n\nПерсонажи: Орсон, Вайтуз, Коб, Чеб\nПройдено путей: ${GameState.pathCount}\nСтатистика:\n  Уважение: ${S.respect}\n  Дружба: ${S.friendship}\n  Хаос: ${S.chaos}\n  Мудрость: ${S.wisdom}\n  Шиза: ${S.shiza}\n\nСпасибо за игру!`,
    choices: [
        { text: 'В ГЛАВНОЕ МЕНЮ', next: null, effect: () => { resetGame(); GameState.scene = 'title'; }},
    ]
},

'secrets_menu': {
    speaker: '', text: `СЕКРЕТЫ:\n- Соберите 3 предмета Коба (фляжка, мод, VIP-карта)\n- Каждый выбор меняет статистику\n- 30+ финалов зависят от ваших решений\n- Секретная линия Коба\n- Пасхалки в каждой локации\n\nНайдено путей: ${GameState.pathCount}`,
    choices: [
        { text: 'Назад', next: null, effect: () => { GameState.scene = 'title'; }},
    ]
},

        };

        return nodes[sceneId] || nodes['title'];
    }

    function computeEnding() {
        const S = GameState.stats;
        const R = GameState.reputation;
        const F = GameState.flags;

        if (F.kob_line_unlocked && F.kob_wisdom) return 'ending_kob_secret';
        if (S.chaos === 0 && S.friendship > 50) return 'ending_undertale';
        if (GameState.pathCount > 200) return 'ending_100percent';
        if (GameState.chapter <= 3 && GameState.pathCount < 30) return 'ending_speedrun';

        if (S.shiza > 40) return 'ending_shiza';
        if (S.wisdom > 60 && S.friendship > 40) return 'ending_left_brain';
        if (F.peace_achieved && S.friendship > 50) return 'ending_peace';
        if (F.cheb_crowned && R.cheb > 20) return 'ending_king_cheb';
        if (F.reborn_complete || F.reborn_real) return 'ending_reborn';
        if (F.song_at_coronation || F.song_friend) return 'ending_song';
        if (S.chaos > 40) return 'ending_war';
        if (F.kob_hero) return 'ending_burger_zen';
        if (F.flew_delta) return 'ending_mod_reality';
        if (F.vaituz_wisdom) return 'ending_brain_no_boil';
        if (R.orson > 30) return 'ending_heroes6';
        if (R.orson < -20) return 'ending_forgiveness';
        if (S.wisdom > 40) return 'ending_god_sees';
        if (F.visited_kazakhstan) return 'ending_escape_steppe';

        return 'ending_karma';
    }

    function resetGame() {
        GameState.hp = 20;
        GameState.maxHp = 20;
        GameState.chapter = 0;
        GameState.scene = 'title';
        GameState.stats = { respect: 50, friendship: 50, chaos: 0, wisdom: 0, shiza: 0 };
        GameState.reputation = { orson: 0, vaituz: 0, kob: 0, cheb: 0 };
        GameState.inventory = [];
        GameState.flags = {};
        GameState.choices = [];
        GameState.kobSecrets = 0;
        GameState.endingId = null;
        GameState.pathCount = 0;
    }

    return { getNode, computeEnding, resetGame };
})();
