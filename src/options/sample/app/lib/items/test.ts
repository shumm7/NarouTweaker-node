import { OptionUI_Item } from "../type";
//import { novel_customHeaderSortable, novel_fontEditor, novel_replacePattern, novel_skinEditor } from "./_optionsAction";

export const test_optionsList: Array<OptionUI_Item> = [
    /* Switch */
    {
        id: "switch_0",
        title: "Switch 0",
        description: {
            text: "Default",
        },
        ui: {
            type: "switch",
            showForce: true,
        },
        location: {
            page: "test",
            category: "switch",
            noindex: true,
        },
        value: {
            related: ["novelCustomStyle"],
        }
    },
    {
        id: "switch_1",
        title: "Swtich 1",
        description: {
            text: "Show label and description",
        },
        ui: {
            type: "switch",
            label: "Label",
            description: "Description",
            showForce: true,
        },
        location: {
            page: "test",
            category: "switch",
            noindex: true,
        },
        value: {
            related: [],
        }
    },

    /* Checkbox */
    {
        id: "checkbox_0",
        title: "Checkbox 0",
        description: {
            text: "Default",
        },
        ui: {
            type: "checkbox",
            showForce: true,
        },
        location: {
            page: "test",
            category: "checkbox",
            noindex: true
        },
        value: {
            related: [],
        }
    },
    {
        id: "checkbox_1",
        title: "Checkbox 1",
        description: {
            text: "Show label and description",
        },
        ui: {
            type: "checkbox",
            label: "Label",
            description: "Description",
            showForce: true,
        },
        location: {
            page: "test",
            category: "checkbox",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "checkbox_2",
        title: "Checkbox 2",
        description: {
            text: "Show label (Top)",
        },
        ui: {
            type: "checkbox",
            label: "Label",
            labelPlacement: "top",
            showForce: true,
        },
        location: {
            page: "test",
            category: "checkbox",
            noindex: true,
        },
        value: {
            related: [],
        }
    },

    
    /* Select */
    {
        id: "select_0",
        title: "Select 0",
        description: {
            text: "Default",
        },
        ui: {
            type: "select",
            data: {
                values: [
                    {value: "0", label: "Value 0"},
                    {value: "1", label: "Value 1"},
                    {value: "2", label: "Value 2"}
                ]
            },
            showForce: true,
        },
        location: {
            page: "test",
            category: "select",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "select_1",
        title: "Select 1",
        description: {
            text: "Show label and description",
        },
        ui: {
            type: "select",
            data: {
                values: [
                    {value: "0", label: "Value 0"},
                    {value: "1", label: "Value 1"},
                    {value: "2", label: "Value 2"}
                ]
            },
            label: "Label",
            description: "Description",
            showForce: true,
        },
        location: {
            page: "test",
            category: "select",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "select_2",
        title: "Select 2",
        description: {
            text: "Variant: Outlined",
        },
        ui: {
            type: "select",
            data: {
                values: [
                    {value: "0", label: "Value 0"},
                    {value: "1", label: "Value 1"},
                    {value: "2", label: "Value 2"}
                ]
            },
            variant: "outlined",
            showForce: true,
        },
        location: {
            page: "test",
            category: "select",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "select_3",
        title: "Select 3",
        description: {
            text: "Variant: Standard",
        },
        ui: {
            type: "select",
            data: {
                values: [
                    {value: "0", label: "Value 0"},
                    {value: "1", label: "Value 1"},
                    {value: "2", label: "Value 2"}
                ]
            },
            variant: "standard",
            showForce: true,
        },
        location: {
            page: "test",
            category: "select",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "select_4",
        title: "Select 4",
        description: {
            text: "Variant: Filled",
        },
        ui: {
            type: "select",
            data: {
                values: [
                    {value: "0", label: "Value 0"},
                    {value: "1", label: "Value 1"},
                    {value: "2", label: "Value 2"}
                ]
            },
            variant: "filled",
            showForce: true,
        },
        location: {
            page: "test",
            category: "select",
            noindex: true,
        },
        value: {
            related: [],
        }
    },

    /* Radio */
    {
        id: "radio_0",
        title: "Radio 0",
        description: {
            text: "Default",
        },
        ui: {
            type: "radio",
            data: {
                values: [
                    {value: "0", label: "Value 0"},
                    {value: "1", label: "Value 1"},
                    {value: "2", label: "Value 2"}
                ]
            },
            showForce: true,
        },
        location: {
            page: "test",
            category: "radio",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "radio_1",
        title: "Radio 1",
        description: {
            text: "Show label and description",
        },
        ui: {
            type: "radio",
            data: {
                values: [
                    {value: "0", label: "Value 0"},
                    {value: "1", label: "Value 1"},
                    {value: "2", label: "Value 2"}
                ]
            },
            label: "Label",
            description: "Description",
            showForce: true,
        },
        location: {
            page: "test",
            category: "radio",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "radio_2",
        title: "Radio 2",
        description: {
            text: "Show label (Top)",
        },
        ui: {
            type: "radio",
            data: {
                values: [
                    {value: "0", label: "Value 0"},
                    {value: "1", label: "Value 1"},
                    {value: "2", label: "Value 2"}
                ]
            },
            label: "Label",
            labelPlacement: "top",
            showForce: true,
        },
        location: {
            page: "test",
            category: "radio",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "radio_3",
        title: "Radio 3",
        description: {
            text: "Wide",
        },
        ui: {
            type: "radio",
            data: {
                values: [
                    {value: "0", label: "Value 0"},
                    {value: "1", label: "Value 1"},
                    {value: "2", label: "Value 2"}
                ],
                layout: "wide"
            },
            showForce: true,
        },
        location: {
            page: "test",
            category: "radio",
            noindex: true,
        },
        value: {
            related: [],
        }
    },

    /* Slider */
    {
        id: "slider_0",
        title: "Slider 0",
        description: {
            text: "Default",
        },
        ui: {
            type: "slider",
            showForce: true,
        },
        location: {
            page: "test",
            category: "slider",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "slider_1",
        title: "Slider 1",
        description: {
            text: "Min: 0 / Max: 20 / Step: 2 / Show Label: auto",
        },
        ui: {
            type: "slider",
            data: {
                min: 0,
                max: 20,
                step: 2,
                showLabel: "auto"
            },
            showForce: true,

        },
        location: {
            page: "test",
            category: "slider",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "slider_2",
        title: "Slider 2",
        description: {
            text: "Min: 0 / Max: 15 / Step: 3 / Marks: true / Show Label: on",
        },
        ui: {
            type: "slider",
            data: {
                min: 0,
                max: 15,
                step: 3,
                marks: true,
                showLabel: "on"
            },
            showForce: true,

        },
        location: {
            page: "test",
            category: "slider",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "slider_3",
        title: "Slider 3",
        description: {
            text: "Min: 0 / Max: 100 / Step: null / Marks: 0-15-37 / Size: small / Show Label: auto / width: 1.5x",
        },
        ui: {
            type: "slider",
            data: {
                min: 0,
                max: 100,
                step: null,
                marks: [
                    {value: 0, label: "0℃"},
                    {value: 15, label: "15℃"},
                    {value: 37, label: "37℃"},
                    {value: 100, label: "100℃"},
                ],
                showLabel: "auto",
                size: "small",
                width: 1.5
            },
            showForce: true,

        },
        location: {
            page: "test",
            category: "slider",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "slider_4",
        title: "Slider 4",
        description: {
            text: "Min: 0 / Max: 100 / Step: 10 / Show Label: auto / Show Field: true",
        },
        ui: {
            type: "slider",
            data: {
                min: 0,
                max: 100,
                step: 10,
                showLabel: "auto",
                showField: true
            },
            showForce: true,

        },
        location: {
            page: "test",
            category: "slider",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "slider_5",
        title: "Slider 5",
        description: {
            text: "Min: 0 / Max: 100 / Step: 10 / Show Label: auto / Show Field: true / Force Step: true",
        },
        ui: {
            type: "slider",
            data: {
                min: 0,
                max: 100,
                step: 10,
                showLabel: "auto",
                showField: true,
                forceStep: true
            },
            showForce: true,
        },
        location: {
            page: "test",
            category: "slider",
            noindex: true,
        },
        value: {
            related: [],
        }
    },

    /* TextArea */
    {
        id: "textarea_0",
        title: "TextArea 0",
        description: {
            text: "Default",
        },
        ui: {
            type: "textarea",
            showForce: true,
        },
        location: {
            page: "test",
            category: "textarea",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "textarea_1",
        title: "TextArea 1",
        description: {
            text: "Show label and description Rows: 3",
        },
        ui: {
            type: "textarea",
            label: "Label",
            description: "Description",
            data: {
                rows: 3
            },
            showForce: true,
        },
        location: {
            page: "test",
            category: "textarea",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "textarea_2",
        title: "TextArea 2",
        description: {
            text: "Rows: 3",
        },
        ui: {
            type: "textarea",
            label: "Label",
            data: {
                rows: 3
            },
            showForce: true,
        },
        location: {
            page: "test",
            category: "textarea",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "textarea_3",
        title: "TextArea 3",
        description: {
            text: "MinRows: 2 / MaxRows: 5",
        },
        ui: {
            type: "textarea",
            label: "Label",
            data: {
                minRows: 2,
                maxRows: 5
            },
            showForce: true,
        },
        location: {
            page: "test",
            category: "textarea",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "textarea_4",
        title: "TextArea 4",
        description: {
            text: "Variant: outlined",
        },
        ui: {
            type: "textarea",
            label: "Label",
            variant: "outlined",
            showForce: true,
        },
        location: {
            page: "test",
            category: "textarea",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "textarea_5",
        title: "TextArea 5",
        description: {
            text: "Variant: standard",
        },
        ui: {
            type: "textarea",
            label: "Label",
            variant: "standard",
            showForce: true,
        },
        location: {
            page: "test",
            category: "textarea",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "textarea_6",
        title: "TextArea 6",
        description: {
            text: "Variant: filled",
        },
        ui: {
            type: "textarea",
            label: "Label",
            variant: "filled",
            showForce: true,
        },
        location: {
            page: "test",
            category: "textarea",
            noindex: true,
        },
        value: {
            related: [],
        }
    },
    {
        id: "textarea_7",
        title: "TextArea 7",
        description: {
            text: "Wide",
        },
        ui: {
            type: "textarea",
            label: "Label",
            placeholder: "Placeholder",
            data: {
                layout: "wide"
            },
            showForce: true,
        },
        location: {
            page: "test",
            category: "textarea",
            noindex: true,
        },
        value: {
            related: [],
        }
    },

    /* Code Editor */
    {
        id: "code_0",
        title: "Code 0",
        description: {
            text: "Default / Language: json",
        },
        ui: {
            type: "code",
            data: {
                language: "json"
            },
            showForce: true,
        },
        location: {
            page: "test",
            category: "code",
            noindex: true,
        },
        value: {
            related: [], 
        }
    },
    {
        id: "code_1",
        title: "Code 1",
        description: {
            text: "Wide / Max Height: 200 / Language: json",
        },
        ui: {
            type: "code",
            label: "Label",
            description: "Description",
            placeholder: "Placeholder",
            data: {
                language: "json",
                layout: "wide",
                maxHeight: 200,
            },
            showForce: true,
        },
        location: {
            page: "test",
            category: "code",
            noindex: true,
        },
        value: {
            related: [],
        }
    },

    /* Text Field */
    {
        id: "textfield_0",
        title: "TextField 0",
        description: {
            text: "Default",
        },
        ui: {
            type: "textfield",
            showForce: true,
        },
        location: {
            page: "test",
            category: "textfield",
            noindex: true,
        },
        value: {
            related: [], 
        }
    },
    {
        id: "textfield_1",
        title: "TextField 1",
        description: {
            text: "Wide",
        },
        ui: {
            type: "textfield",
            data: {
                layout: "wide"
            },
            showForce: true,
        },
        location: {
            page: "test",
            category: "textfield",
            noindex: true,
        },
        value: {
            related: [], 
        }
    },

    /* Number */
    {
        id: "number_0",
        title: "Number 0",
        description: {
            text: "Default",
        },
        ui: {
            type: "number",
            showForce: true,
        },
        location: {
            page: "test",
            category: "textfield",
            noindex: true,
        },
        value: {
            related: [], 
        }
    },
    {
        id: "number_1",
        title: "Number 1",
        description: {
            text: "Wide",
        },
        ui: {
            type: "number",
            data: {
                layout: "wide"
            },
            showForce: true,
        },
        location: {
            page: "test",
            category: "textfield",
            noindex: true,
        },
        value: {
            related: [], 
        }
    },
]