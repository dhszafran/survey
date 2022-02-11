/**
 * # Player type implementation of the game stages
 * Copyright(c) 2021 Stefano Balietti <ste@nodegame.org>
 * MIT Licensed
 *
 * Each client type must extend / implement the stages defined in `game.stages`.
 * Upon connection each client is assigned a client type and it is automatically
 * setup with it.
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

const ngc = require('nodegame-client');
const { EXECUTION_MODE } = require('../../waitroom/waitroom.settings');
const J = ngc.JSUS;

module.exports = function (treatmentName, settings, stager, setup, gameRoom) {

    // Define a function for future use.
    function capitalizeInput(input) {
        var str;
        str = input.value;
        str = str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
        input.value = str;
    }

    // Make the player step through the steps without waiting for other players.
    stager.setDefaultStepRule(ngc.stepRules.SOLO);

    stager.setOnInit(function () {

        // Initialize the client.

        var header;

        // Setup page: header + frame.
        header = W.generateHeader();
        W.generateFrame();

        // Add widgets.
        this.visuaStage = node.widgets.append('VisualStage', header);
        this.visualRound = node.widgets.append('VisualRound', header);

        this.discBox = node.widgets.append('DisconnectBox', header, {
            disconnectCb: function () {
                var str;
                W.init({ waitScreen: true });
                str = 'Disconnection detected. Please refresh to reconnect.';
                node.game.pause(str);
                alert(str);
            },
            connectCb: function () {
                // If the user refresh the page, this is not called, it
                // is a normal (re)connect.
                if (node.game.isPaused()) node.game.resume();
            }
        });


        this.doneButton = node.widgets.append('DoneButton', header, {
            text: 'Next'
        });

        this.backButton = node.widgets.append('BackButton', header, {
            acrossStages: true,
            className: 'btn btn-secondary'
        });
        this.backButton.button.style['margin-top'] = '6px';

        // No need to show the wait for other players screen in single-player
        // games.
        W.init({ waitScreen: false });

        // Additional debug information while developing the game.
        // this.debugInfo = node.widgets.append('DebugInfo', header)
    });

    stager.extendStep('consent', {
        donebutton: false,
        widget: 'Consent',
        cb: function () {
            node.on('CONSENT_REJECTING', function () {
                this.discBox.destroy();
            });
        }
        // Takes settings.CONSENT by default.
    });

    stager.extendStep('introduction', {
        // Do not go back to consent.
        backbutton: false,
        // No need to specify the frame, if named after the step id.
        // frame: 'instructions.htm',
        cb: function () {
            var s;
            // Note: we need to specify node.game.settings,
            // and not simply settings, because this code is
            // executed on the client.
            s = node.game.settings;
            // Replace variables in the instructions.
            W.setInnerHTML('coins', s.COINS);
            W.setInnerHTML('time', s.CONSENT.EXP_TIME);

            W.setInnerHTML('treatment', s.text);
        },
        widget: {
            name: 'ChoiceManager',
            options: {
                id: 'demo1',
                mainText: 'Please insert the following information to generate your personalised code:',
                simplify: true,
                forms: [
                    {    name: 'CustomInput',
                        id: 'secondletter',
                        mainText: 'Second letter of your mother\'s first name: ',
                        type: 'text',
                        min: 1,
                        max: 1,
                        shuffleChoices: false,
                    },
                    {
                        name: 'CustomInput',
                        id: 'month',
                        mainText: 'Your birth month: ',
                        type: 'int',
                        min: 1,
                        max: 12,
                        shuffleChoices: false,
                    },
                    {
                        name: 'CustomInput',
                        id: 'secondtolastletter',
                        mainText: 'Second to last letter of your last name: ',
                        type: 'text',
                        min: 1,
                        max: 1,
                        shuffleChoices: false,
                    },
                    {
                        name: 'CustomInput',
                        id: 'lastletter',
                        mainText: 'Last letter of your father\'s first name: ',
                        type: 'text',
                        min: 1,
                        max: 1,
                        shuffleChoices: false,
                    }, 
                ],
                formsOptions: {
                    requiredChoice: true,
                    shuffleChoices: false
                },
                className: 'centered'
            }
        }
    });
        

    stager.extendStep('sociodemographics', {
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            options: {
                id: 'demo1',
                mainText: 'Questions regarding your sociodemographics.',
                simplify: true,
                forms: [
                    {
                        id: 'gender',
                        mainText: 'What is your gender?',
                        choices: ['Male', 'Female'],
                        shuffleChoices: false,
                        
                    },
                    {
                        name: 'CustomInput',
                        id: 'byear',
                        mainText: 'Which year were you born in?',
                        type: 'int',
                        hint: '(Please insert in YYYY format)',
                        shuffleChoices: false,
                        // requiredChoice: false
                    },
                    {
                        name: 'CustomInput',
                        id: 'bmonth',
                        mainText: 'Which month were you born in?',
                        type: 'int',
                        hint: '(Please insert in MM format)',
                        min: 1,
                        max: 12,
                        shuffleChoices: false,
                        // requiredChoice: false
                    },
                    {
                        id: 'schooltype',
                        selectMultiple: false,
                        mainText: 'What type of school do you attend?',
                        choices: ['Hauptschule', 'Realschule',
                            'Gymnasium'],
                        shuffleChoices: false,
                    },
                    {
                        name: 'CustomInput',
                        id: 'grade',
                        mainText: 'What grade level are you currently attending?',
                        type: 'int',
                        hint: '(Please insert the right number)',
                        min: 5,
                        max: 13,
                        shuffleChoices: false,
                        // requiredChoice: false
                    },
                    {
                        name: 'CustomInput',
                        id: 'height',
                        mainText: 'What is your current body height measured in centimeters?',
                        type: 'int',
                        hint: '(If you are not sure, please give your best estimate)',
                        min: 100,
                        shuffleChoices: false,
                        // requiredChoice: false
                    },
                    {
                        name: 'CustomInput',
                        id: 'weight',
                        mainText: 'What is your current body weight measured in kilograms?',
                        type: 'int',
                        hint: '(If you are not sure, please give your best estimate)',
                        min: 20,
                        shuffleChoices: false,
                        // requiredChoice: false
                    },
                    {
                        id: 'background',
                        selectMultiple: false,
                        mainText: 'Was one or both of your parents born outside of Germany?',
                        choices: ['No, both my parents were born in Germany', 'Yes, one of my parents was born outside of Germany',
                            'Yes, both of my parents were born outside of Germany'],
                        shuffleChoices: false,
                    },
                ],
                formsOptions: {
                    requiredChoice: true,
                    shuffleChoices: false
                },
                className: 'centered'
            }
        }
    });


    stager.extendStep('social media', {
        widget: {
            name: 'ChoiceManager',
            options: {
                id: 'demo2',
                mainText: 'Leisure activities and social media use.',
                simplify: true,
                forms: [
                    {
                        name: 'ChoiceTableGroup',
                        id: 'activity',
                        mainText: 'How many days in a normal week from Monday to Sunday do you engage in the following activities?',
                        items: ['Taking care of or playing with animals', 'Self-care activities', 'Doing sports', 'Shopping', 'Meeting friends', 'Spending quality time with family members', 'Actively engaging in a hobby', 'Watching or streaming movies, series etc.', 'Reading', 'Playing video games'],
                        choices: ['every day', '5-6 days', '3-4 days', '1-2 days', 'never'],
                        shuffleItems: false,
                    },
                    {
                        name: 'ChoiceTableGroup',
                        id: 'socialmedia1',
                        mainText: 'How many hours on a normal day between Monday and Friday do you spend using these social media platforms?',
                        hint: '(Think about all devices you use i.e., your phone, tablet, computer etc.)',
                        items: ['Instagram', 'Tik Tok', 'Facebook', 'Youtube', 'Snapchat'],
                        choices: ['less than 1 hour', 'between 1 and 2 hours', 'between 3 and 4 hours', 'more than 5 hours', 'I do not use it at all'],
                        shuffleItems: false,
                    },
                    {
                        name: 'ChoiceTableGroup',
                        id: 'socialmedia2',
                        mainText: 'Now focusing on the weekend (Saturday and Sunday): how many hours do you spend using these social media platforms?',
                        hint: '(Think about all devices you use i.e., your phone, tablet, computer etc.)',
                        items: ['Instagram', 'Tik Tok', 'Facebook', 'Youtube', 'Snapchat'],
                        choices: ['less than 1 hour', 'between 1 and 2 hours', 'between 3 and 4 hours', 'more than 5 hours', 'I do not use it at all'],
                        shuffleItems: false,
                    },
                    {
                        name: 'ChoiceTableGroup',
                        id: 'socialmedia3',
                        mainText: 'If you think about each of these platforms, which of these options describe the manner in which you use them the most accurately?',
                        hint: '(Think about all devices you use i.e., your phone, tablet, computer etc.)',
                        items: ['Instagram', 'Tik Tok', 'Facebook', 'Youtube', 'Snapchat'],
                        choices: ['I actively share content on a regular basis', 'I seldom share content', 'I just browse through without sharing any content', 'I do not use it at all'],
                        shuffleItems: false,
                    },
                ],
                formsOptions: {
                    requiredChoice: true,
                    shuffleChoices: false
                },
                className: 'centered'
            }
        }
    });

    stager.extendStep('body image', {
        widget: {
            name: 'ChoiceManager',
            options: {
                id: 'demo3',
                mainText: 'Questions about your body image.',
                simplify: true,
                forms: [
                    {
                        name: 'ChoiceTableGroup',
                        id: 'bodyimage',
                        mainText: 'Please indicate whether the statement is true about you never, seldom, sometimes, often, or always.',
                        items: ['I respect my body.', 'I feel good about my body.', 'I feel that my body has at least some good qualities.', 'I take a positive attitude towards my body.', 'I am attentive to my body\'s needs.', 'I feel love for my body.', 'I appreciate the different and unique characteristics of my body.', 'My behavior reveals my positive attitude toward my body, e.g. I hold my head high and smile.', 'I am comfortable in my body.', 'I feel like I am beautiful even if I am different from media images of attractive people.'],
                        choices: ['never = 1', 'seldom = 2', 'sometimes = 3', 'often = 4', 'always = 5'],
                        shuffleItems: false,
                    },
                    {
                        name: 'ChoiceTableGroup',
                        id: 'bodyimagefriends',
                        mainText: 'Please indicate to what extent the statement is true about you and your friends.',
                        items: ['Do your friends influence your idea of the perfect body?', 'Do your friends influence you to use diet products?', 'Do your friends influence you to exercise to tone up?', 'Do your friends influence your ideas on how to get a perfect body?', 'Do your friends influence your diet to lose weight?'],
                        choices: ['not at all true = 1', 'not very true = 2', 'neither true nor false = 3', 'fairly true = 4', 'very true = 5'],
                        shuffleItems: false,
                    },
                    {
                        id: 'bodyimage2',
                        selectMultiple: false,
                        mainText: 'Do you believe you are...',
                        hint: 'Please choose what applies most to you.',
                        choices: ['far too thin?', 'too thin?',
                            'just the right weight?', 'too fat?',
                            'far too fat?'],
                    },
                ],
                formsOptions: {
                    requiredChoice: true,
                    shuffleChoices: false
                },
                className: 'centered'
            }
        }
    });

    stager.extendStep('outro', {
        backbutton: false,
        cb: function () {
            var s;
            // Note: we need to specify node.game.settings,
            // and not simply settings, because this code is
            // executed on the client.
            s = node.game.settings;
            W.setInnerHTML('coins', s.COINS);
            W.setInnerHTML('time', s.CONSENT.EXP_TIME);

            W.setInnerHTML('treatment', s.text);
        }
    });
};
