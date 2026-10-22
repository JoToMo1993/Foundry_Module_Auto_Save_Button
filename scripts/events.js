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
        console.log("Init Auto Save Button")
        const checkedMessageIds = [];
        Hooks.on("renderChatMessageHTML", (chatlog, chatData) => {
            if (checkedMessageIds.includes(chatlog.uuid)) {
                // already checked
                return;
            }
            console.log('checking', chatlog);
            checkedMessageIds.push(chatlog.uuid);
            const filter = /Save: ([A-Za-z]+) DC ([0-9]+)/;
            const match = chatlog.content.replace(/<[^>]*>/g, '').match(filter);
            if (match) {
                const type = match[1];
                const dc = match[2];

                const typeMapping = SAVE_MAPPING.filter(sm => sm.name === type);
                if (typeMapping && typeMapping.length !== 0) {
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
    const buttons = [{
        type: TypeFromTypeGroup[formdata.type],
        dc: Number(formdata.dc),
        format: 'short',
        ability: OptionTypeValueToAbility[formdata.optionValue].ability,
    }];
    buttons.forEach((button) => {
        if (button.type === "tool") {
            button.usingTool = true;
            button.tool = formdata.optionValue;
        } else if (button.type === "skill") {
            button.skill = formdata.optionValue;
        }
    })

    const MessageClass = getDocumentClass("ChatMessage");
    MessageClass.create({
        flavor: _loc("EDITOR.DND5E.Inline.RollRequest"),
        speaker: MessageClass.getSpeaker({user: game.user}),
        system: {broadcast: true, buttons},
        type: "prompt",
        user: game.user.id
    });
}
