import { useState, useMemo, useRef, useEffect } from "react";

// ─────────────────────────────────────────────
//  STONE DATA
// ─────────────────────────────────────────────

const STONES = [
  {
    id: "sandstone",
    name: "Sandstone",
    color: "#c49a6c",
    glow: "rgba(196,154,108,0.35)",
    harmony: "none",
    gates: ["Random Chakra Gate"],
    progenitor: {
      action: "Action",
      shards: 2,
      effect: [
        "Choose a point that you can see within 30ft. of you and create a small obelisk of sandstone 5ft. wide by 10ft. tall.",
        "For the next minute, the obelisk creates a 10ft. sphere of difficult terrain centered around itself. If a creature ends its turn or movement within this sphere, it is pulled into the center as the obelisk explodes, Stunning the creature until the end of its next turn.",
        "After the explosion, the Sandstone disappears. Afterwards, you may roll a d8 to open a random Chakra Gate.",
      ],
    },
    fused: {
      shardsToCreate: 12,
      action: "Passive",
      effect: [
        "While holding this crystal in your palm, you gain the following benefits:",
        "Sand Swim — You gain a burrow speed equal to half of your movement speed (rounded down to nearest 5). While burrowed, you gain complete cover and are Blinded. Upon burrowing, you create a sandstone obelisk at point of entry (max 3). You may only create one obelisk per turn.",
        "Slow Sand — Your speed is reduced by half so long as you are not walking on natural ground (Dirt, Sand, Grass, etc.).",
        "Sandstone Implosion (Recharge 5-6) — Using an action, force a sandstone obelisk to implode. All creatures inside make a DEX saving throw or take 32 (7d8) Piercing damage, half on success. Once per long rest, roll a d8 to open a random Chakra Gate, regardless of any other previously opened gates.",
      ],
    },
  },
  {
    id: "grape-agate",
    name: "Grape Agate",
    color: "#9b72cf",
    glow: "rgba(155,114,207,0.35)",
    harmony: "none",
    gates: ["Third Eye Gate", "Crown Gate"],
    progenitor: {
      action: "Action",
      shards: 4,
      effect: [
        "Using an action, you can take a non-organic, tiny to small-sized object and magically turn it into a bundle of grapes with approximately the same mass.",
        "Once grapes, the object remains as grapes until eaten or expires after 1d4 days. Afterwards, the item harmlessly rematerializes within 5ft. If all grapes are consumed by the same creature, the item will spontaneously reconstitute itself within the target's body at some point during the digestion cycle.",
        "After the object reconstitutes, you may open your Third Eye or Crown Gates.",
      ],
    },
    fused: {
      shardsToCreate: 10,
      action: "Passive",
      effect: [
        "As long as this stone is held, you gain the Plant creature type and are treated as such for effects like Locate Plants. You also gain the following benefits:",
        "Grape Splash (Recharge 5-6) — You create a stream of grape juice as if using a Decanter of Endless Water.",
        "Natural Weakness — You take double damage from all Fire damage, regardless of any resistances or immunities. You may only receive healing when hydrated. You can cast Goodberry as a bonus action once per short rest (creates grapes, naturally).",
        "You can partially speak to and understand all plant types; however, you can fully speak and understand grape.",
        "Only when you move during your turn, you have the ability to walk on water, similar to the way grapes float.",
        "Once per long rest, roll a d8 to open your Third Eye or Crown Gates regardless of any previously opened gates.",
      ],
    },
  },
  {
    id: "moldavite",
    name: "Moldavite",
    color: "#4caf6e",
    glow: "rgba(76,175,110,0.35)",
    harmony: "positive",
    gates: ["Crown Gate"],
    progenitor: {
      action: "Action",
      shards: 4,
      effect: [
        "Choose one of the following effects:",
        "Moldavite Flush — For the next minute, Moldavite sends vibrations throughout your body, placing you under the Zero Gravity condition. Your long and high jump distances are both multiplied by 5. You are under the effects of Feather Fall for the duration. You can hold and carry inanimate objects up to 10x your weight.",
        "Reverse Gravity — Shatter the stone onto the ground. For the next minute, all living creatures who enter or start their turn within a 20ft. sphere must make a STR saving throw or hover 5ft. off the ground. All creatures who fail have their speed reduced by 5 × your positive Harmony score and have disadvantage on melee attacks while inside. A creature may reattempt the save at the start of each subsequent turn; once succeeded, they are immune for 24 hours.",
        "Impound Gravity — Crush the stone into powder in a 10ft. area. For the next minute, this cloud of Moldavite follows you like a nebula. All creatures who enter or start their turn in this cloud must make a DEX saving throw or have their speed reduced by 5 × your positive Harmony score and have disadvantage on all DEX checks and saving throws.",
        "Once any effect ends, you may choose to open the Crown Gate.",
      ],
    },
    fused: {
      shardsToCreate: 14,
      action: "Passive",
      effect: [
        "As long as this stone is held, you gain the following benefits:",
        "Suggestive Gravity — You are constantly under the Zero Gravity condition and can toggle it on/off with a bonus action.",
        "Cosmic Cloud (1/day) — You always have your Impound Gravity aura active, hovering 20ft. around you. All creatures within (including you) gain special cover equal to your positive Harmony score bonus to AC. Once per long rest, force the cloud to swirl violently: all creatures within make a STR saving throw and take 36 (8d8) Piercing damage (half on success). All who fail have speed reduced to 0 and are pulled to the nearest open space to you. Once per long rest, you may open the Crown Gate regardless of any other previously opened gates.",
        "Magnetic Pull — Any loose objects weighing 5 lbs or less are caught in your gravitational pull and fly towards you.",
        "Into the Stratosphere — Each time you leave the ground while Zero Gravity is active, roll a d20 + your positive Harmony score. If the final total is less than 5 or a natural 1, you lose control of your personal gravity and rocket into the sky to a max of 50ft. straight up.",
      ],
    },
  },
  {
    id: "onyx",
    name: "Onyx",
    color: "#5a5a7a",
    glow: "rgba(90,90,122,0.35)",
    harmony: "negative",
    gates: ["Solar Plexus Gate"],
    progenitor: {
      action: "Action",
      shards: 4,
      effect: [
        "You call forth the power of the mighty Onyx, shrouding yourself in an Onyx Veil — a suit of armor whose helm takes the shape of a lion's mane. For the next 10 minutes, you open the Solar Plexus Gate and your AC increases to 18 + (−1 × your negative Harmony score). While active, you also become Invisible while standing or moving through shadows.",
        "In addition, you gain the following attack:",
        "Onyx Punch — Melee Attack, +Stonekeeper attack modifier to hit, reach 5 ft., one target. Hit: 11 (2d10) + STR modifier. You may use this attack a second time at level 8 and a third at level 12.",
      ],
    },
    fused: {
      shardsToCreate: 15,
      action: "Passive",
      effect: [
        "As long as this stone is held, you gain the following benefits:",
        "Armored Adversary — You constantly have an Onyx Veil active around you at all times.",
        "Immovable Object — You cannot be Grappled while wearing the Onyx Veil. All Slashing damage taken is reduced by your negative Harmony score.",
        "Unstoppable Force (1/day) — When you have your Onyx Veil active, use an action to move forward twice your movement speed in a straight line. This movement is unavoidable and you smash through all creatures, objects, and structures up to 10ft. thick. Any creature caught in this line makes a DEX saving throw or takes 33 (6d10) Bludgeoning damage (half on success). All creatures are thrown 10 + (−1 × your negative Harmony score) feet and knocked Prone.",
        "Once per day, you may open the Solar Plexus Gate regardless of any previously opened gates.",
        "⚠️ Drawback: You can no longer take the Dash Action, and all normal movement counts as difficult terrain while the Onyx Veil is being worn.",
      ],
    },
  },
  {
    id: "jade",
    name: "Jade",
    color: "#4dab76",
    glow: "rgba(77,171,118,0.35)",
    harmony: "positive",
    gates: ["Heart Gate"],
    progenitor: {
      action: "Bonus Action",
      shards: 2,
      effect: [
        "When cast, this stone appears as a tiny Jade Ox that rests sleeping on your shoulder. You may have up to 2 tiny Jade Oxen active at a time. The tiny Jade Ox only awakens when your Harmony is positive.",
        "When struck with a melee or ranged weapon attack, you may use your reaction to call the Ox to intercept the blow. Make a melee attack with advantage, adding only your positive Harmony score. If your attack meets or exceeds the incoming attack roll, the Ox nullifies the attack and destroys itself. On a miss, the attack goes through and the Ox is shattered.",
        "Alternatively, if you hit with a melee attack, you may use this reaction to send the tiny Jade Ox rocketing toward the target dealing an additional 11 (2d10) Radiant damage + your positive Harmony score, destroying itself.",
        "After the Ox is destroyed, you may choose to open the Heart Gate.",
      ],
    },
    fused: {
      shardsToCreate: 15,
      action: "Action",
      effect: [
        "You may spend an action touching its forehead to summon a Large-sized Jade Ox that becomes your familiar. It follows your every command, and you communicate with it telepathically.",
        "This Ox cannot benefit from short/long rests and cannot receive any healing whatsoever. It remains active until destroyed or dismissed, after which it goes on a 7-day cooldown.",
        "Jade Ox Statblock: Large Construct, Lawful Neutral | AC 13 (Natural Armor) + your positive Harmony score | HP 90 (5d20+38) | Speed 50 ft. | STR 20, DEX 12, CON 11, INT 9, WIS 12, CHA 8",
        "Trampling Charge — If the Jade Ox moves at least 20ft. straight toward a creature and hits it with a gore attack, the target must succeed on a DC 15 STR saving throw or be knocked prone. If prone, the ox can make a hooves attack as a bonus action.",
        "Open Gate Four — When summoned, it opens the Heart Chakra centered within a 5ft. radius of itself. All allied creatures within gain a bonus to attack and damage rolls equal to your positive Harmony score.",
        "Dense Construction — Resistant to Slashing and Piercing damage; vulnerable to Bludgeoning damage.",
        "Actions: Gore (+6 to hit, 2d8+4 Bludgeoning + 2d6+8 Radiant) | Hooves (+6 to hit, 1d12+4 Bludgeoning + 1d6+8 Radiant)",
        "Reaction — Interception: When an allied creature is hit by an attack while within the Heart Chakra aura, the Ox may take the damage instead. The Ox gains temporary HP equal to half the damage taken until end of its next turn.",
      ],
    },
  },
  {
    id: "blue-sapphire",
    name: "Blue Sapphire",
    color: "#3a7bd5",
    glow: "rgba(58,123,213,0.35)",
    harmony: "none",
    gates: ["Throat Gate", "Third Eye Gate"],
    progenitor: {
      action: "Action",
      shards: 5,
      effect: [
        "Using an action, you swallow this stone to activate it. Choose one of the following effects:",
        "Vocalize Thoughts — Roll a d20 + your proficiency bonus (max 20). This number replaces your current INT and CHA ability scores for the next hour. Cannot be affected by external effects such as the Lucky Feat or Portent Dice. Afterwards, you may open the Throat Gate.",
        "Mind Scramble — For the next minute after swallowing the Blue Sapphire, you force the next humanoid NPC you touch to make either a CHA or INT saving throw (whichever is higher). On a failed save, the target's CHA and INT scores swap places for the next hour or until the creature is injured. Afterwards, you may open your Third Eye.",
      ],
    },
    fused: {
      shardsToCreate: 18,
      action: "Action",
      effect: [
        "Using an action, you swallow this stone to activate it. Choose one of the following effects:",
        "Improved Vocalize Thoughts — For the next hour, if either your INT or CHA ability scores are below 20, they both become 20.",
        "Improved Mind Scramble — For the next minute after swallowing the Blue Sapphire, you force the next humanoid NPC you touch to make either a CHA or INT saving throw (whichever is higher). On a failed save, if either of the target's CHA or INT ability scores is higher than 10, they become reduced to 10.",
        "When either effect has taken place, you open both the Throat and Third Eye Gates regardless of any other previously opened gates for the next hour. Afterwards, this stone goes on a 7-day cooldown.",
      ],
    },
  },
  {
    id: "bloodstone",
    name: "Bloodstone",
    color: "#a33030",
    glow: "rgba(163,48,48,0.35)",
    harmony: "negative",
    gates: ["Solar Plexus Gate"],
    progenitor: {
      action: "Bonus Action",
      shards: 3,
      effect: [
        "When this stone is triggered, your next successful melee attack (weapon or unarmed) deals extra Piercing damage equal to twice your CON modifier, and you gain Temporary HP equal to the damage dealt.",
        "After damage has been done, force the target to make a CON saving throw. On a failure, the target reduces its next saving throw by your negative Harmony score.",
        "Afterwards, you may choose to open the Solar Plexus Gate.",
      ],
    },
    fused: {
      shardsToCreate: 11,
      action: "Passive",
      effect: [
        "So long as this stone rests in your palm, you cannot have your HP total dropped to 0, though you can still gain conditions like Unconscious. Once you hit your last hit point, you gain the Purgatory condition — you can no longer die because neither Heaven nor Hell will claim you.",
        "While Purgatory is active:",
        "Life Drain — At the start of each of your turns, you steal HP from all living creatures within 10ft. equal to your negative Harmony score.",
        "Sight of Stone (1/day) — Using an action, force a single creature you are making eye contact with to make a CON saving throw against your Stonekeeper DC or become Petrified for the next hour.",
        "Punishment — Roll a d6 twice and reroll duplicates. You lose two of your senses: (1) Sight, (2) Smell, (3) Touch, (4) Speech, (5) Taste, (6) Hearing. Any check requiring a lost sense automatically fails.",
        "You reduce all ability checks, attack rolls, and saving throws by 3.",
        "The first melee weapon or unarmed attack you make each round gains a bonus to final damage equal to half your CON score (rounded down). Damage type is Piercing.",
        "You open the Solar Plexus Gate for an hour, regardless of any other currently opened gates.",
        "Purgatory persists until healed by Remove Curse, Greater Restoration, or greater.",
      ],
    },
  },
  {
    id: "sunstone",
    name: "Sunstone",
    color: "#e8a020",
    glow: "rgba(232,160,32,0.35)",
    harmony: "positive",
    gates: ["Sacral Gate"],
    progenitor: {
      action: "Action",
      shards: 7,
      concentration: true,
      effect: [
        "Touch an object you can see. For the next 10 minutes (while concentrating), the warmth of the Sunstone superheats the material into solid, refractive glass.",
        "Armor/Clothing — Becomes Heavy Armor with AC 17 + your positive Harmony score (max 20). Grants resistance to Slashing and Piercing damage, but vulnerability to Bludgeoning. Shatters on a critical hit.",
        "Weapon — Becomes practically invisible while wielded, granting Advantage on all weapon attacks. The user adds your positive Harmony score to final damage of each successful attack. Shatters on a critical failure.",
        "Shield — Becomes a lens that magnifies vision. Grants a bonus to Perception (WIS) and Investigation (INT) checks equal to your positive Harmony score. Shield gains AC bonus equal to −1 + your positive Harmony score. Drawback: Disadvantage on all DEX and STR checks and saving throws while wielded.",
        "Ammunition — Effective range increased by 20ft. × your positive Harmony score. User adds your positive Harmony score to attack roll. Drawback: Must fire with Disadvantage on targets within 30ft.; on a failed attack roll, the weapon misfires and cannot be used until the end of the user's next turn.",
        "Wall/Vehicle — Becomes light-bending, one-sided glass. You can see through the side you are touching. All creatures on the opposite side see you as under the Invisible condition. Illusion stays active for 2 + your positive Harmony score rounds; each subsequent round requires a CON saving throw (DC 10 + each round the illusion has been active).",
        "After all effects dispel, you may choose to open the Sacral Gate.",
      ],
    },
    fused: {
      shardsToCreate: 16,
      action: "Passive",
      effect: [
        "Instead of turning items into light-bending glass, you yourself become clad in divine light. So long as you hold this stone, you gain the following effects:",
        "Light Drain (Recharge 5-6) — Use an action to drain a single source of light. Heal an amount of d6s equal to the size of the light source (1d6 for Tiny, 2d6 for Small, etc.).",
        "Bright Blight — You shed 30ft. of bright light in all directions. All creatures requiring sight have Advantage on attack rolls against you.",
        "All damage you deal is turned into Radiant damage.",
        "Once per long rest, you may open the Sacral Gate regardless of any other currently opened gates.",
        "Divine Light (1/day) — Using an action, you turn yourself fully into solid light for the next 10 minutes. During movement, you gain a flight speed of 30ft. and become Incorporeal, passing through solid objects. If you remain in a solid object after your turn concludes, you are ejected to the nearest possible space and take 12d6 Bludgeoning damage.",
        "⚠️ Drawback: Once Divine Light expires, you gain the Blinded condition until the end of your next long rest, as your ocular nerves become fried. This condition supersedes any immunities.",
      ],
    },
  },
  {
    id: "obsidian",
    name: "Obsidian",
    color: "#4a4060",
    glow: "rgba(74,64,96,0.35)",
    harmony: "negative",
    gates: ["Root Gate"],
    progenitor: {
      action: "Action or Reaction",
      shards: 3,
      effect: [
        "Choose one of the following:",
        "Obsidian Spear — Melee Attack, +Stonekeeper attack modifier to hit, reach 10ft., one target. Hit: 7 (1d12) Psychic damage. +2 Psychic damage per additional Shard spent after the first three. On a critical hit, the creature must make an INT saving throw against your Stonekeeper DC or lose their Attack Action on their next turn.",
        "Obsidian Knife — Melee Attack, +Stonekeeper attack modifier to hit, reach 5ft., one target. Hit: 4 (1d6) Psychic damage. +1d4 Psychic damage per additional 2 Shards spent after the first three. This attack can crit on an 18 or 19.",
        "Obsidian Mirror (Reaction) — When hit with a single-target melee or ranged attack from a creature you can see, deal Psychic damage back equal to half the damage taken (rounded down). +1d8 Psychic damage per additional 2 Shards spent after the first three. If the incoming attack is a critical hit, using this reaction nullifies it and treats it as a normal hit.",
        "After an action has been made, you may have the Obsidian 'cleanse' your negative Harmony score and swap it to its opposite (e.g. −1 changed to +1).",
      ],
    },
    fused: {
      shardsToCreate: 17,
      action: "Action",
      effect: [
        "When you hold this stone in your palm, you gain the following abilities:",
        "Obsidian Sneak Attack (Recharge 5-6) — Once you reappear from a shadow, you may spend an action and at least 3 Shards to attack with either the Obsidian Spear or Obsidian Knife. Attacking this way reduces the number needed for a critical hit by 1.",
        "You are able to see through all magical and nonmagical darkness as if it weren't there, and you gain immunity to the Blinded condition.",
        "Light Sensitivity — You become vulnerable to Radiant damage, regardless of any other resistances or immunities.",
        "Once per long rest, you may open the Root Gate regardless of any other previously opened gates.",
        "Darkness Incarnate (1/day) — Using an action, you turn each shadow you see into a reflection of the abyss for the next 10 minutes. During movement, you may walk through pools of shadows as if they were water, becoming Invisible and swimming through all connected shadows on the floor, walls, or ceiling. You reappear standing in your exact end position.",
        "⚠️ Drawback: Once Darkness Incarnate expires, your body enters a state of uncertainty. Until the end of your next long rest, your speed is reduced to 0. This condition supersedes any immunities.",
        "At any time, you may choose to clear your negative Harmony score and swap it to its opposite. Afterwards, this stone goes on a 24-hour cooldown, and you open the Root Gate for an hour.",
      ],
    },
  },
  {
    id: "citrine",
    name: "Citrine",
    color: "#d4a017",
    glow: "rgba(212,160,23,0.35)",
    harmony: "none",
    gates: ["Solar Plexus Gate", "Sacral Gate"],
    progenitor: {
      action: "Reaction",
      shards: 1,
      effect: [
        "When haggling with a merchant or other business person, you may use a reaction mid-conversation to artificially deflate the price of one object you can touch. Roll a d4 and reduce the price by the percentage of the number rolled, rounded up.",
        "You can spend additional Shards to increase this die by 1 size per Shard spent:",
        "1 Shard → 1d6 | 2 Shards → 1d12 | 3 Shards → 2d12 | 5 Shards → 2d20 | 10 Shards → 1d100",
        "After the price point is set, you must complete the purchase, regardless of the final price. Afterwards, you may open the Solar Plexus or Sacral Gates.",
      ],
    },
    fused: {
      shardsToCreate: 5,
      action: "Action",
      effect: [
        "When receiving a new item in the inventory of either you or an ally, you may choose to use an action and a number of Shards to duplicate the item. When duplicated, the item is perfectly duplicated and functions exactly as normal for the duration.",
        "Shard cost by duration:",
        "2 Shards → 1 Round | 4 Shards → 1 Minute | 6 Shards → 5 Minutes | 8 Shards → 10 Minutes | 10 Shards → 1 Hour | 12 Shards → 8 Hours | 14 Shards → 24 Hours | 20 Shards → Indefinitely",
        "Once created, the object remains until used, consumed, destroyed, or time expires. Afterwards, the object melts into a black, unusable goo, and you may then choose to open Solar Plexus or Sacral Gates for the next hour.",
        "After an object has been created, the Citrine goes on a 7-day cooldown.",
      ],
    },
  },
  {
    id: "amethyst",
    name: "Amethyst",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.35)",
    harmony: "negative",
    gates: ["Crown Gate"],
    progenitor: {
      action: "Action",
      shards: 2,
      effect: [
        "When you trigger this stone, you feel a pit open up within your stomach. For the next 10 minutes, anything you consume orally (up to a maximum of 50 gallons) does not travel through your digestive tract but instead falls harmlessly into a pocket dimension within your body (similar to a Bag of Holding). Any harmful items, such as poisons, maintain their potency but don't affect you in any way.",
        "You are also able to combine potions together into a pseudo-concoction that bears the effects of all potions involved.",
        "At any time, you may choose to use an object interaction to launch any or all held objects from your mouth a distance of feet equal to 30 × (−1 × your negative Harmony score).",
        "Once time has expired, all held items are forcefully launched to their maximum distance, after which you may choose to open the Crown Gate.",
      ],
    },
    fused: {
      shardsToCreate: 12,
      action: "Passive",
      effect: [
        "While holding this crystal, you gain the following benefits:",
        "Deep Pit — You permanently have an Amethyst pocket dimension at your disposal. This dimension can hold up to 100 gallons of material; your speed is reduced by 5ft. for every 10 gallons filled above 50.",
        "Hunger — You must consume at least 1 gallon of material into your Amethyst pocket dimension every minute or take 30 Force damage as your pit growls louder.",
        "You become immune to the Poisoned condition and resistant to Poison damage.",
        "You reduce the DC of all INT checks you make by your negative Harmony score.",
        "Once per long rest, you may open the Crown Gate regardless of any other previously opened gates.",
      ],
    },
  },
  {
    id: "moqui-marble",
    name: "Moqui Marble",
    color: "#8a7060",
    glow: "rgba(138,112,96,0.35)",
    harmony: "negative",
    gates: ["Root Gate"],
    progenitor: {
      action: "Bonus Action",
      shards: 4,
      concentration: true,
      effect: [
        "Moqui Marble creates a faint projection of yourself next to you, veiled in soft purple light. It has 10 hit points and a walking speed of 10ft. × (−1 × your negative Harmony score). If you lose concentration or it falls to 0 HP, it is dispelled.",
        "Using a bonus action (on this and subsequent turns), you can command this illusion to move into an unoccupied space you can see and/or swap places with you. Afterwards, make a CON saving throw to maintain concentration; DC is 10 + each round the illusion has been active.",
        "On a failure, the illusion is dispelled. Once dispelled, you may choose to open the Root Gate.",
      ],
    },
    fused: {
      shardsToCreate: 14,
      action: "1 Hour Ritual",
      effect: [
        "If you spend an hour polishing this Moqui Marble, you trigger this Crystal, summoning a Moqui Marble mirage of yourself. The casting time is reduced by −10 minutes × your negative Harmony score.",
        "The mirage inherits part of your consciousness, your movement speed, and half of your current HP and AC (both rounded down). This clone looks exactly like you to the naked eye.",
        "Choose three of your Ability scores and share them with your projection. It can complete complex tasks on its own, though it has no equipment. Your mirage has access to your Stonekeeper class features and can open gates; it can also wield Shards, though it cannot create them on its own.",
        "You constantly see what your Moqui Marble mirage sees, and you may swap places with it at any time.",
        "Once summoned, both you and your Mirage may choose to open the Root Gate for the next hour, regardless of any currently opened gates.",
        "Once this Crystal has been used, you cannot use it again until the Moqui Marble mirage has been dispelled or dismissed, after which it goes on a 7-day cooldown.",
      ],
    },
  },
  {
    id: "turquoise",
    name: "Turquoise",
    color: "#2cb5a0",
    glow: "rgba(44,181,160,0.35)",
    harmony: "positive",
    gates: ["Throat Gate"],
    progenitor: {
      action: "Action",
      shards: 5,
      effect: [
        "Choose one of the following to express:",
        "Balance — Move your Harmony score to its opposite (−1 to +1).",
        "Passion — Gain advantage on CHA saving throws for the next minute.",
        "Understanding — Add your positive Harmony score to your next CHA check. Add it twice if this check is an Insight check.",
        "Peace — Remove a condition that is making you act irrationally.",
        "Manifestation — Gain 1 Chakra.",
        "After any expression has taken place, open the Throat Gate.",
      ],
    },
    fused: {
      shardsToCreate: 16,
      action: "Passive",
      effect: [
        "As long as you are holding this stone, you gain the following benefits:",
        "Infectious Personality (1/day) — Use an action to force a target humanoid creature to become Charmed by you (no saving throw required), as long as you choose to take the Charmed condition against it.",
        "Transcendent Mood (1/day) — Make your Harmony score either +3 or −3. If you send your Harmony into the negative, this stone ceases its functions.",
        "Once per day, you may open the Throat Gate regardless of any other previously opened gates.",
        "Coin Toss (Recharge 5-6) — Using a bonus action, flip the coin in the air. If Smiling (Heads), add your positive Harmony score to all CHA checks and saving throws while in the presence of 10 or more humanoid creatures. If Frowning (Tails), add it while in the presence of 9 or fewer humanoid creatures.",
        "Anxious Attachment — While alone or solely in the presence of hostile humanoid creatures, you have the Frightened condition.",
      ],
    },
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    color: "#e8829a",
    glow: "rgba(232,130,154,0.35)",
    harmony: "positive",
    gates: ["Heart Gate"],
    progenitor: {
      action: "Action",
      shards: 5,
      effect: [
        "Choose a non-hostile, humanoid NPC that can see you and have them make a CHA saving throw against your Stonekeeper DC. On a failed save, the creature becomes Charmed by you for a number of minutes equal to your positive Harmony score and you may give them one of the following commands:",
        "Live — Until this Charmed condition expires, the target is flooded with determination to complete their life's goal. The target will immediately use whatever movement it has to flee out of sight in order to chase its dream.",
        "Laugh — Until this Charmed condition expires, the target begins to laugh uncontrollably. The target gains the Blinded and Silenced conditions as the laughter makes them weep with excitement.",
        "Love — Until this Charmed condition expires, the target is overrun with love. The target will immediately grapple the nearest humanoid within their vision (that they know) with a massive hug. This grapple has no saving throw; if no familiar creatures can be found nearby, the target will simply hug you for the duration.",
        "If the target succeeded their save or once time expires, they are no longer Charmed and know you attempted to charm them — afterwards, they become hostile towards you.",
        "After the creature has been charmed or not, you may choose to open the Heart Gate.",
      ],
    },
    fused: {
      shardsToCreate: 18,
      action: "Reaction",
      effect: [
        "You may only trigger this stone while mid-conversation with a non-hostile, humanoid NPC. Once you use a reaction to trigger Rose Quartz, you pause time momentarily for you and your target. A breeze carrying cherry blossom petals floats by as you enter a JRPG-like dating simulator.",
        "Present your DM with a goal you'd like to complete or gain through this conversation that you both agree upon. You then complete the rest of the conversation solo, presented with 3 dialogue options each time you speak. Each option presents you with 3 randomly chosen skills. Make the check; DC = 5 + the target's WIS score.",
        "Level One — Grants you a bonus to your next CHA check with this creature equal to your positive Harmony score.",
        "Level Two — Gives the target the Charmed condition for hours equal to your positive Harmony score.",
        "Level Three — Grants you your original goal in the conversation.",
        "Level Four (all 4 checks) — The target becomes Charmed by you for approximately 30 (2d20+9) days, believing you are their one true love. After the condition expires, they will hold resentment toward you as if you ruthlessly broke up with them.",
        "After dialogue concludes, you may open the Heart Gate regardless of any previously opened gates. Rose Quartz then goes on a 7-day cooldown.",
      ],
    },
  },
  {
    id: "garnet",
    name: "Garnet",
    color: "#c62828",
    glow: "rgba(198,40,40,0.35)",
    harmony: "none",
    gates: ["Sacral Gate"],
    progenitor: {
      action: "Action, Bonus Action, or Reaction",
      shards: 4,
      effect: [
        "You may manifest one of the following actions:",
        "Action — Garnet Bloodshot: Ranged Attack, +Stonekeeper attack modifier to hit, reach 60/90ft., one target. Hit: Heal the target 13 (3d8) HP + twice your positive Harmony score. You can target a second creature at level 8 and a third at level 12.",
        "Bonus Action — Garnet Overdrive: Touch a target creature; until the end of your next turn, the target gains resistance to all nonmagical Bludgeoning, Piercing, and Slashing damage, plus a bonus to all attack and damage rolls equal to your positive Harmony score. At level 8, resistance becomes full magical; at level 12, the target gains immunity to all Bludgeoning, Piercing, and Slashing damage.",
        "Reaction — Garnet Seal: If you are conscious after being hit with a melee or ranged weapon attack, use a reaction to heal yourself by 4d10 HP. Add +1d10 per additional Shard spent. At level 8, you may use this on a creature within 10ft. (20ft. at level 12).",
        "After all effects have taken place, you are able to roll a d8 to open the Sacral Gate.",
      ],
    },
    fused: {
      shardsToCreate: 12,
      action: "10-Minute Ritual",
      effect: [
        "Spend 10 minutes prying the edges of this stone open. When you do, you manifest a version of yourself from another life — from another timeline. In a flash of light, your current self and your manifested self swap places.",
        "Choose any of the 12 Core Classes from the D&D 5e Source Books (Artificer, Barbarian, Bard, Cleric, Druid, Fighter, Rogue, Ranger, Paladin, Monk, Warlock, or Wizard) and any of their Subclasses.",
        "Once chosen, you replace all your current abilities with those of that class. Your Level, Health, and Ability Scores remain the same; however, you may swap any of your ability scores with one another as you see fit.",
        "Your physique and gear are magically reflected in the class chosen. All new gear is made of solid Garnet and is granted a bonus equal to your positive Harmony score (e.g., a +2 Wand or a +1 Shield). You may only choose from 2 pieces of gear.",
        "This manifestation lasts for the next hour, after which your true self swaps back, and you may open the Sacral Gate regardless of any previously opened gates.",
        "Afterwards, this Garnet goes on a 7-day cooldown.",
      ],
    },
  },
];

// ─────────────────────────────────────────────
//  SHARD TRACKER WIDGET
// ─────────────────────────────────────────────

const MAX_LOG = 40;
const QUICK_SPEND_AMOUNTS = [1, 2, 3, 4, 5, 7, 10];
const QUICK_GAIN_AMOUNTS = [1, 2, 3, 5];

function ShardTracker({ isOpen, onToggle }) {
  const [shards, setShards] = useState(0);
  const [log, setLog] = useState([
    { id: Date.now(), type: "info", text: "Tracker ready. Go forth and collect.", total: null },
  ]);
  const [customAmount, setCustomAmount] = useState("");
  const [customLabel, setCustomLabel] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const push = (delta, text, type) => {
    const next = Math.max(0, shards + delta);
    setShards(next);
    setLog((prev) => [
      ...prev.slice(-(MAX_LOG - 1)),
      { id: Date.now() + Math.random(), type, text, total: next },
    ]);
  };

  const gain = (n, lbl) => push(+n, lbl ?? `+${n} Shard${n !== 1 ? "s" : ""} gained`, "gain");
  const spend = (n, lbl) => { if (shards >= n) push(-n, lbl ?? `−${n} Shard${n !== 1 ? "s" : ""} spent`, "spend"); };

  const handleCustom = (type) => {
    const n = parseInt(customAmount, 10);
    if (!n || n <= 0) return;
    const label = customLabel.trim() || null;
    if (type === "gain") gain(n, label ? `+${n} · ${label}` : null);
    else spend(n, label ? `−${n} · ${label}` : null);
    setCustomAmount("");
    setCustomLabel("");
  };

  const handleReset = () => {
    if (confirmClear) {
      setShards(0);
      setLog([{ id: Date.now(), type: "info", text: "Tracker reset.", total: null }]);
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  const buttonBase = {
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontFamily: "'Cinzel', serif",
    fontWeight: "700",
    transition: "all 0.15s",
    fontSize: "0.72rem",
  };

  return (
    <>
      {/* FAB toggle */}
      <button
        onClick={onToggle}
        title="Shard Tracker"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 200,
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          border: `2px solid ${isOpen ? "#8b5cf6" : "#3a3060"}`,
          background: isOpen ? "linear-gradient(135deg, #2a1a5a, #1a0a3a)" : "linear-gradient(135deg, #1a1230, #0e0a20)",
          color: isOpen ? "#c0a8f8" : "#5a4a8a",
          fontSize: "1.5rem",
          cursor: "pointer",
          boxShadow: isOpen ? "0 0 24px rgba(139,92,246,0.5), 0 4px 20px rgba(0,0,0,0.6)" : "0 4px 16px rgba(0,0,0,0.5)",
          transition: "all 0.25s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
        }}
      >
        💎
        {shards > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              background: "#8b5cf6",
              color: "#fff",
              borderRadius: "10px",
              fontSize: "0.58rem",
              fontWeight: "800",
              fontFamily: "'Cinzel', serif",
              padding: "1px 5px",
              minWidth: "18px",
              textAlign: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
              lineHeight: "16px",
            }}
          >
            {shards}
          </span>
        )}
      </button>

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          bottom: "96px",
          right: "24px",
          zIndex: 199,
          width: "min(348px, calc(100vw - 32px))",
          background: "linear-gradient(160deg, #0f0c20, #09080f)",
          border: "1px solid #221840",
          borderRadius: "14px",
          boxShadow: "0 0 48px rgba(100,60,200,0.18), 0 20px 60px rgba(0,0,0,0.8)",
          fontFamily: "'Crimson Text', Georgia, serif",
          overflow: "hidden",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
          pointerEvents: isOpen ? "all" : "none",
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}
      >
        {/* Panel header */}
        <div
          style={{
            padding: "14px 16px 10px",
            borderBottom: "1px solid #1e1638",
            background: "linear-gradient(90deg, #150f2c, #0f0c20)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0, fontFamily: "'Cinzel', serif", fontSize: "0.88rem", color: "#b8a0f0", letterSpacing: "0.1em", fontWeight: "700" }}>
            💎 Shard Tracker
          </h3>
          <button
            onClick={handleReset}
            style={{
              ...buttonBase,
              background: confirmClear ? "#4a0018" : "transparent",
              border: `1px solid ${confirmClear ? "#883050" : "#3a2a5a"}`,
              color: confirmClear ? "#ff7090" : "#5a4a7a",
              padding: "3px 9px",
              fontSize: "0.62rem",
            }}
          >
            {confirmClear ? "Confirm?" : "Reset"}
          </button>
        </div>

        {/* Big counter display */}
        <div style={{ textAlign: "center", padding: "14px 16px 8px", background: "rgba(0,0,0,0.2)" }}>
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "3.4rem",
              fontWeight: "900",
              lineHeight: 1,
              color: shards === 0 ? "#30244a" : "#c0a8f8",
              textShadow: shards > 0 ? "0 0 40px rgba(180,140,255,0.45)" : "none",
              transition: "color 0.3s, text-shadow 0.3s",
            }}
          >
            {shards}
          </div>
          <div style={{ fontSize: "0.6rem", color: "#3a2a5a", letterSpacing: "0.22em", fontFamily: "'Cinzel', serif", marginTop: "3px" }}>
            SHARDS IN INVENTORY
          </div>
        </div>

        {/* Quick spend */}
        <div style={{ padding: "10px 14px 8px" }}>
          <div style={{ fontSize: "0.58rem", color: "#3e2e5e", letterSpacing: "0.18em", fontFamily: "'Cinzel', serif", marginBottom: "6px" }}>
            QUICK SPEND
          </div>
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            {QUICK_SPEND_AMOUNTS.map((n) => {
              const ok = shards >= n;
              return (
                <button
                  key={n}
                  onClick={() => spend(n)}
                  disabled={!ok}
                  style={{
                    ...buttonBase,
                    width: "38px",
                    padding: "5px 0",
                    background: ok ? "#1e1030" : "#0e0a18",
                    border: `1px solid ${ok ? "#4a2a6a" : "#20152a"}`,
                    color: ok ? "#c0a0e8" : "#2e1e40",
                    cursor: ok ? "pointer" : "not-allowed",
                  }}
                  onMouseEnter={(e) => { if (ok) e.currentTarget.style.background = "#2a1848"; }}
                  onMouseLeave={(e) => { if (ok) e.currentTarget.style.background = "#1e1030"; }}
                >
                  −{n}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick gain */}
        <div style={{ padding: "6px 14px 10px", borderBottom: "1px solid #1a1230" }}>
          <div style={{ fontSize: "0.58rem", color: "#3e2e5e", letterSpacing: "0.18em", fontFamily: "'Cinzel', serif", marginBottom: "6px" }}>
            QUICK GAIN
          </div>
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", alignItems: "center" }}>
            {QUICK_GAIN_AMOUNTS.map((n) => (
              <button
                key={n}
                onClick={() => gain(n)}
                style={{
                  ...buttonBase,
                  width: "38px",
                  padding: "5px 0",
                  background: "#091810",
                  border: "1px solid #1a4028",
                  color: "#78d898",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#102018")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#091810")}
              >
                +{n}
              </button>
            ))}
            <button
              onClick={() => gain(1, "+1 · Failed saving throw")}
              title="Gained 1 Shard from failing a saving throw imposed by a hostile source"
              style={{
                ...buttonBase,
                padding: "5px 9px",
                background: "#1a1008",
                border: "1px solid #38280a",
                color: "#c8a050",
                cursor: "pointer",
                fontSize: "0.6rem",
                letterSpacing: "0.03em",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#221508")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#1a1008")}
            >
              Failed Save +1
            </button>
          </div>
        </div>

        {/* Custom entry */}
        <div style={{ padding: "10px 14px", borderBottom: "1px solid #1a1230" }}>
          <div style={{ fontSize: "0.58rem", color: "#3e2e5e", letterSpacing: "0.18em", fontFamily: "'Cinzel', serif", marginBottom: "7px" }}>
            CUSTOM AMOUNT
          </div>
          <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
            <input
              type="number"
              min="1"
              placeholder="#"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustom("gain")}
              style={{
                flex: "0 0 56px",
                padding: "6px 8px",
                background: "#0c0a18",
                border: "1px solid #241840",
                borderRadius: "6px",
                color: "#b0a0d0",
                fontSize: "0.88rem",
                fontFamily: "'Crimson Text', serif",
                outline: "none",
              }}
            />
            <input
              type="text"
              placeholder="Label (optional)"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustom("gain")}
              style={{
                flex: 1,
                padding: "6px 8px",
                background: "#0c0a18",
                border: "1px solid #241840",
                borderRadius: "6px",
                color: "#b0a0d0",
                fontSize: "0.8rem",
                fontFamily: "'Crimson Text', serif",
                outline: "none",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {["gain", "spend"].map((type) => {
              const isGain = type === "gain";
              const n = parseInt(customAmount, 10);
              const enabled = n > 0 && (isGain ? true : shards >= n);
              return (
                <button
                  key={type}
                  onClick={() => handleCustom(type)}
                  disabled={!enabled}
                  style={{
                    ...buttonBase,
                    flex: 1,
                    padding: "6px",
                    background: enabled ? (isGain ? "#091810" : "#1e1030") : "#0a0812",
                    border: `1px solid ${enabled ? (isGain ? "#1a4028" : "#4a2a6a") : "#1a1228"}`,
                    color: enabled ? (isGain ? "#78d898" : "#c0a0e8") : "#2a1e38",
                    cursor: enabled ? "pointer" : "not-allowed",
                  }}
                >
                  {isGain ? "+ Gain" : "− Spend"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Log */}
        <div>
          <div style={{ padding: "8px 14px 4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.58rem", color: "#3e2e5e", letterSpacing: "0.18em", fontFamily: "'Cinzel', serif" }}>HISTORY</span>
            <span style={{ fontSize: "0.58rem", color: "#2a1e40", fontFamily: "'Cinzel', serif" }}>last {Math.min(log.length, MAX_LOG)}</span>
          </div>
          <div
            ref={logRef}
            style={{ maxHeight: "130px", overflowY: "auto", padding: "0 14px 12px" }}
          >
            {[...log].reverse().map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  padding: "3px 0",
                  borderBottom: "1px solid #14102a",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: entry.type === "gain" ? "#78c890" : entry.type === "spend" ? "#b090d8" : "#4a3a6a",
                    flex: 1,
                    lineHeight: "1.4",
                  }}
                >
                  {entry.text}
                </span>
                {entry.total !== null && (
                  <span style={{ fontSize: "0.68rem", color: "#3e2e5a", fontFamily: "'Cinzel', serif", whiteSpace: "nowrap", flexShrink: 0 }}>
                    → {entry.total}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
//  STONE CARD
// ─────────────────────────────────────────────

const HARMONY_CONFIG = {
  positive: { label: "Positive HAR", color: "#f0c040", icon: "☀️" },
  negative: { label: "Negative HAR", color: "#e05050", icon: "🌑" },
  none: { label: "No Requirement", color: "#8a8aaa", icon: "⚬" },
};

function StoneCard({ stone }) {
  const [tab, setTab] = useState("progenitor");
  const [expanded, setExpanded] = useState(false);
  const data = tab === "progenitor" ? stone.progenitor : stone.fused;

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #12111e, #0e0d1a)",
        borderRadius: "12px",
        border: `1px solid ${stone.color}40`,
        overflow: "hidden",
        boxShadow: expanded
          ? `0 0 24px ${stone.glow}, 0 8px 32px rgba(0,0,0,0.5)`
          : `0 0 8px ${stone.glow}, 0 4px 16px rgba(0,0,0,0.4)`,
        transition: "box-shadow 0.3s, transform 0.2s",
        transform: expanded ? "translateY(-2px)" : "translateY(0)",
        fontFamily: "'Crimson Text', Georgia, serif",
      }}
    >
      <div style={{ height: "3px", background: `linear-gradient(90deg, ${stone.color}, ${stone.color}88)` }} />

      {/* Clickable header */}
      <div style={{ padding: "16px 20px 10px", cursor: "pointer", userSelect: "none" }} onClick={() => setExpanded((v) => !v)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
          <h3 style={{ margin: 0, fontSize: "1.15rem", fontFamily: "'Cinzel', serif", color: stone.color, fontWeight: "700", textShadow: `0 0 20px ${stone.glow}`, lineHeight: 1.2 }}>
            {stone.name}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                padding: "2px 9px", borderRadius: "20px", fontSize: "0.68rem", fontWeight: "600", letterSpacing: "0.05em",
                border: `1px solid ${HARMONY_CONFIG[stone.harmony].color}44`,
                color: HARMONY_CONFIG[stone.harmony].color,
                background: `${HARMONY_CONFIG[stone.harmony].color}18`,
              }}
            >
              {HARMONY_CONFIG[stone.harmony].icon} {HARMONY_CONFIG[stone.harmony].label}
            </span>
            <span style={{ color: "#5a5a7a", fontSize: "0.9rem", transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0)", flexShrink: 0 }}>▾</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginTop: "12px" }} onClick={(e) => e.stopPropagation()}>
          {["progenitor", "fused"].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setExpanded(true); }}
              style={{
                padding: "4px 12px", borderRadius: "6px", border: "none", cursor: "pointer",
                fontSize: "0.72rem", fontFamily: "'Cinzel', serif", fontWeight: "700", letterSpacing: "0.05em",
                background: tab === t ? `${stone.color}30` : "transparent",
                color: tab === t ? stone.color : "#5a5a7a",
                borderBottom: tab === t ? `2px solid ${stone.color}` : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {t === "progenitor" ? "⬡ Progenitor" : "✦ Fused"}
            </button>
          ))}
        </div>
      </div>

      {/* Chips */}
      <div style={{ padding: "0 20px 10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
        <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: "600", color: "#c0b0e0", background: "#201830", border: "1px solid #3a2a5a" }}>
          ⚡ {data.action}
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "2px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: "700", color: "#b8cce8", background: "#1a2a3a", border: "1px solid #2a3a4a" }}>
          💎 {tab === "progenitor" ? `${stone.progenitor.shards} Shards to Use` : `${stone.fused.shardsToCreate} Shards to Fuse`}
        </span>
        {data.concentration && (
          <span style={{ padding: "2px 8px", borderRadius: "6px", fontSize: "0.7rem", color: "#e0c080", background: "#281e00", border: "1px solid #40300a" }}>◎ Concentration</span>
        )}
        {tab === "fused" && (
          <span style={{ padding: "2px 8px", borderRadius: "6px", fontSize: "0.7rem", color: "#80c0e0", background: "#0a1828", border: "1px solid #1a3040" }}>⊕ Requires Attunement</span>
        )}
      </div>

      {/* Gate tags */}
      <div style={{ padding: "0 20px 12px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {stone.gates.map((g) => (
          <span key={g} style={{ padding: "1px 7px", borderRadius: "4px", fontSize: "0.65rem", color: "#8ab0c8", background: "#0d1e2a", border: "1px solid #1a3040", fontStyle: "italic" }}>
            🔮 {g}
          </span>
        ))}
      </div>

      {/* Expanded body */}
      {expanded && (
        <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${stone.color}20` }}>
          <div style={{ paddingTop: "14px" }}>
            {data.effect.map((para, i) => (
              <p
                key={i}
                style={{
                  margin: "0 0 10px",
                  fontSize: "0.88rem",
                  lineHeight: "1.65",
                  color: para.startsWith("⚠️") ? "#d08060" : para.match(/^\w[\w\s]+ —/) ? "#c0b0d0" : "#9a9ab8",
                  fontStyle: para.startsWith("⚠️") ? "italic" : "normal",
                  paddingLeft: para.match(/^\w[\w\s]+ —/) ? "10px" : "0",
                  borderLeft: para.match(/^\w[\w\s]+ —/) && !para.startsWith("⚠️") ? `2px solid ${stone.color}50` : "none",
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  ROOT APP
// ─────────────────────────────────────────────

export default function StonekeeperLibrary() {
  const [search, setSearch] = useState("");
  const [harmonyFilter, setHarmonyFilter] = useState("all");
  const [trackerOpen, setTrackerOpen] = useState(false);

  const filtered = useMemo(
    () =>
      STONES.filter((s) => {
        const q = search.toLowerCase();
        const matchSearch =
          q === "" ||
          s.name.toLowerCase().includes(q) ||
          s.gates.some((g) => g.toLowerCase().includes(q));
        const matchHarmony = harmonyFilter === "all" || s.harmony === harmonyFilter;
        return matchSearch && matchHarmony;
      }),
    [search, harmonyFilter]
  );

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 20% 50%, #0d0b1f 0%, #060610 100%)", color: "#c0b8d8", fontFamily: "'Crimson Text', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a18; }
        ::-webkit-scrollbar-thumb { background: #2a2a4a; border-radius: 3px; }
        input::placeholder { color: #3a3a5a; }
        input:focus { outline: none; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.4; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "48px 24px 32px", borderBottom: "1px solid #1a1a32", background: "linear-gradient(180deg, #0a0920 0%, transparent 100%)", position: "relative", overflow: "hidden" }}>
        {["#8b5cf6", "#3a7bd5", "#4caf6e", "#e8a020", "#e8829a"].map((c, i) => (
          <div key={i} style={{ position: "absolute", width: "220px", height: "220px", borderRadius: "50%", background: `radial-gradient(circle, ${c}15 0%, transparent 70%)`, left: `${8 + i * 21}%`, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        ))}
        <div style={{ position: "relative" }}>
          <p style={{ margin: "0 0 6px", fontSize: "0.75rem", letterSpacing: "0.3em", color: "#5a5a8a", fontFamily: "'Cinzel', serif", textTransform: "uppercase" }}>
            Hunter's Homebrew Class
          </p>
          <h1 style={{ margin: "0 0 8px", fontSize: "clamp(1.8rem, 5vw, 3rem)", fontFamily: "'Cinzel', serif", fontWeight: "900", background: "linear-gradient(135deg, #c0a8f8 0%, #88b4e8 50%, #a8d8c0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "0.08em" }}>
            Stonekeeper
          </h1>
          <h2 style={{ margin: "0 0 14px", fontSize: "clamp(0.9rem, 2vw, 1.1rem)", fontFamily: "'Cinzel', serif", fontWeight: "400", color: "#6a6a9a", letterSpacing: "0.15em" }}>
            Crystal Reference Library
          </h2>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#4a4a6a", fontStyle: "italic" }}>
            {STONES.length} stones catalogued · Click a card to expand · 💎 Shard tracker bottom-right
          </p>
        </div>
      </div>

      {/* Sticky controls */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(8,8,20,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid #1a1a30", padding: "12px 24px", display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#3a3a5a" }}>🔍</span>
          <input
            type="text"
            placeholder="Search stones or gates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "8px 12px 8px 34px", background: "#0e0e20", border: "1px solid #2a2a3a", borderRadius: "8px", color: "#b0b0d0", fontSize: "0.85rem", fontFamily: "'Crimson Text', serif" }}
            onFocus={(e) => (e.target.style.borderColor = "#5a5a8a")}
            onBlur={(e) => (e.target.style.borderColor = "#2a2a3a")}
          />
        </div>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {[
            { key: "all", label: "All", color: "#7070a0" },
            { key: "positive", label: "☀️ Positive", color: "#f0c040" },
            { key: "negative", label: "🌑 Negative", color: "#e05050" },
            { key: "none", label: "⚬ Any HAR", color: "#8a8aaa" },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setHarmonyFilter(key)}
              style={{
                padding: "5px 12px", borderRadius: "6px", cursor: "pointer",
                border: `1px solid ${harmonyFilter === key ? color + "80" : "#2a2a3a"}`,
                background: harmonyFilter === key ? `${color}18` : "transparent",
                color: harmonyFilter === key ? color : "#5a5a7a",
                fontSize: "0.75rem", fontFamily: "'Cinzel', serif", letterSpacing: "0.04em", transition: "all 0.2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <span style={{ marginLeft: "auto", color: "#3a3a5a", fontSize: "0.75rem", fontFamily: "'Cinzel', serif", whiteSpace: "nowrap" }}>
          {filtered.length} / {STONES.length}
        </span>
      </div>

      {/* Card grid */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px", color: "#3a3a5a", fontStyle: "italic" }}>
            No stones match your search.
          </div>
        ) : (
          filtered.map((stone) => <StoneCard key={stone.id} stone={stone} />)
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "24px 24px 96px", color: "#2a2a4a", fontSize: "0.75rem", fontStyle: "italic", borderTop: "1px solid #12121e" }}>
        Stonekeeper class designed by Hunter · Reference library built for the table
      </div>

      {/* Shard Tracker */}
      <ShardTracker isOpen={trackerOpen} onToggle={() => setTrackerOpen((o) => !o)} />
    </div>
  );
}
