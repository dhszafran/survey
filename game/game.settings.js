/**
 * # Game settings definition file
 * Copyright(c) 2021 Stefano Balietti <ste@nodegame.org>
 * MIT Licensed
 *
 * The variables in this file will be sent to each client and saved under:
 *
 *   `node.game.settings`
 *
 * The name of the chosen treatment will be added as:
 *
 *    `node.game.settings.treatmentName`
 *
 * http://www.nodegame.org
 * ---
 */

let basePay = 3;

module.exports = {

    // Variables shared by all treatments.

    // #nodeGame properties:

    /**
     * ### TIMER (object) [nodegame-property]
     *
     * Maps the names of the steps of the game to timer durations
     *
     * If a step name is found here, then the value of the property is
     * used to initialize the game timer for the step.
     */
    //TIMER: {

    //},

    /**
     * ### CONSENT (object) [nodegame-property]
     *
     * Contains info to be added to the page by the Consent widget
     *
     */
    CONSENT: {

        EXP_TITLE: 'Self-image Survey',

        EXP_PURPOSE: 'This study is intended to facilitate the exploration of a potential relationship between body self-perception and social media use.',

        EXP_DESCR: 'You will answer various questions from three areas: first about your socio-demographics, second about your leisure time and social media use, and third about your body self-perception.',

        EXP_TIME: '15'

        
      },

      BASE_PAY: basePay,

    // # Game specific properties

    // Number of coins available each round.
    COINS: 1,

    // Exchange rate coins to dollars.
    //EXCHANGE_RATE: 1,

    // # Treatments definition.

    // They can contain any number of properties, and also overwrite
    // those defined above.

    // If the `treatments` object is missing a treatment named _standard_
    // will be created automatically, and will contain all variables.

    treatments: {

        standard: {
            description: "Self-image Survey",
            text: 'Self-image Survey'
        },

        info: {
            description: "A simple information treatment",
            text: 'The INFORMATION treatment'
        }

    }
};
