// --- CONFIGURATION ---

const Types = {
    "save": {text: "Save", icon: '<i class="fas fa-shield-heart"></i>'},
}

const SAVE_MAPPING = [
    {name: "Strength", value: "str"},
    {name: "Dexterity", value: "dex"},
    {name: "Constitution", value: "con"},
    {name: "Intelligence", value: "int"},
    {name: "Wisdom", value: "wis"},
    {name: "Charisma", value: "cha"},
]
//@formatter:off
const OptionTypeValueToAbility = {
    // abilities
    "str": {ability: "str", text: "Strength",     name: "Strength"},
    "dex": {ability: "dex", text: "Dexterity",    name: "Dexterity"},
    "con": {ability: "con", text: "Constitution", name: "Constitution"},
    "int": {ability: "int", text: "Intelligence", name: "Intelligence"},
    "wis": {ability: "wis", text: "Wisdom",       name: "Wisdom"},
    "cha": {ability: "cha", text: "Charisma",     name: "Charisma"},
}
//@formatter:on

Hooks.once("ready", () => {
    if (game.user.isGM) {
        Hooks.on("renderChatMessage", (chatlog, chatData) => {
            const filter = /Save: ([A-Za-z]+) DC ([0-9]+)/;
            const match = chatlog.content.replace(/<[^>]*>/g, '').match(filter);
            if (match) {
                const type = match[1];
                const dc = match[2];

                const typeMapping = SAVE_MAPPING.filter(sm => sm.name === type);
                if (typeMapping && typeMapping.length === 0) {
                    printCheck({type: "save", optionValue: typeMapping[0].value, dc: dc})
                } else {
                    console.log(`I don't know what ${type} should be!`)
                }
            } else {
                console.log('No match in Message');
            }
        });
    }
});

function printCheck(formdata) {
    const type = formdata.type;
    const optionValue = formdata.optionValue;
    const dc = formdata.dc;
    let message =
        `
            <div class="dnd5e2 chat-card request-card">
                <div class="card-buttons">
                    <button
                        data-type="${type}"
                        data-format="long"
                        ${dc !== '' ? `data-dc="${dc}"` : ''}
                        data-ability="${OptionTypeValueToAbility[optionValue].ability}"
                        data-action="rollRequest"
                        data-visibility="all">
                        <span class="visible-dc">
                            ${Types[type].icon}
                            ${dc !== '' ? `DC ${dc} ` : ''}${OptionTypeValueToAbility[optionValue].text}
                        </span>
                        <span class="hidden-dc">
                            ${Types[type].icon}
                            ${OptionTypeValueToAbility[optionValue].text}
                        </span>
                    </button>
                </div>
            </div>
        `;

    let chatData = {
        user: game.user.id,
        flavor: 'Roll Request',
        content: message,
        speaker: {alias: "Auto Save Button"},
        blind: false
    };

    ChatMessage.create(chatData);
}
