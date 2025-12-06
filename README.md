# Foundry Auto Save Button

This module automatically creates an additional roll-request-chat-message, in case a chat-message includes a specific
trigger.
This trigger is `Save: <Type of save> DC <DC value>`.
In case these words are part of the chat-message, and type is known to the module (one of the following types), then it
uses the Type and DC to create an automatic roll-request.

List of supported types:

* Strength
* Dexterity
* Constitution
* Intelligence
* Wisdom
* Charisma

## Setup / Installation

To install this module, you have to add the module.json's address into the module-manager of foundry.
The url is https://raw.githubusercontent.com/JoToMo1993/Foundry_Module_Auto_Save_Button/refs/heads/main/module.json