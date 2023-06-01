import { PortableText } from "@portabletext/react";

const aciculeDefinition = [
    {
        "_type": "block",
        "_key": "4fa3b7bb6ad8",
        "markDefs": [],
        "style": "normal",
        "level": null,
        "listItem": null,
        "children": [
            {
                "_type": "span",
                "_key": "5459f03f9b550",
                "marks": [],
                "text": "En forme d’aiguille, telles des aiguilles de pins."
            }
        ]
    },
    {
        "_type": "block",
        "_key": "5b79ce206cee",
        "markDefs": [],
        "style": "normal",
        "level": null,
        "listItem": null,
        "children": [
            {
                "_type": "span",
                "_key": "05070a2339db0",
                "marks": [],
                "text": "Se dit surtout d’éléments microscopiques."
            }
        ]
    },
    {
        "_type": "block",
        "_key": "1fa7191afb61",
        "markDefs": [
            {
                "_type": "link",
                "href": "acuminé.htm",
                "_key": "c3506c633626"
            }
        ],
        "style": "normal",
        "level": null,
        "listItem": null,
        "children": [
            {
                "_type": "span",
                "_key": "0a809e30ee1f0",
                "marks": [],
                "text": "Différent de "
            },
            {
                "_type": "span",
                "_key": "0a809e30ee1f1",
                "marks": [
                    "c3506c633626"
                ],
                "text": "acuminé"
            },
            {
                "_type": "span",
                "_key": "0a809e30ee1f2",
                "marks": [],
                "text": " qui implique un centre un peu plus large, se terminant en pointe."
            }
        ]
    },
    {
        "_type": "block",
        "_key": "fdae345479fd",
        "markDefs": [
            {
                "_type": "link",
                "href": "planche/formes-des-cystides.jpg",
                "_key": "368803d0015c"
            }
        ],
        "style": "normal",
        "level": null,
        "listItem": null,
        "children": [
            {
                "_type": "span",
                "_key": "2a82855bc45f0",
                "marks": [],
                "text": "Voir planche des "
            },
            {
                "_type": "span",
                "_key": "2a82855bc45f1",
                "marks": [
                    "368803d0015c"
                ],
                "text": "formes des cystides"
            },
            {
                "_type": "span",
                "_key": "2a82855bc45f2",
                "marks": [],
                "text": "."
            }
        ]
    }
];

const TermDetails = () => {
    return (
        <div className="pl-8 py-6 bg-slate-200">
            <div className="text-green-600 text-6xl font-semibold">
                Aciculé
            </div>
            <div className="pt-2">
                <p className="text-justify font-semibold leading-loose">
                    <PortableText
                        value={aciculeDefinition} />
                </p>
            </div>
        </div>
    )
}

export default TermDetails;