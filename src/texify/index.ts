// texify algorithm.
// TrickEye 2023.
//
// Works with marked and convert lexed tokens to tex source code.

import {marked} from "marked";

class TexBuf extends Array<string> {
    private _indent: number;

    constructor() {
        super();
        this._indent = 0;
    }

    public addIndent(): void {
        this._indent++;
    }

    public subIndent(): void {
        this._indent--;
    }

    push(...items: string[]): number {
        return super.push(...items.map((item: string) => '\t'.repeat(this._indent) + item));
    }
}

function translate(token: Object, texBuf: TexBuf, pkgSet: Set<string>): void {
    if (grocery[token["type"]]) {
        grocery[token["type"]](token, texBuf, pkgSet);
    } else {
        texBuf.push("Warning: token type: " + token["type"] + " not implemented.");
    }
}

let grocery  = {
    space: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        texBuf.push('\n');
    },
    code: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        pkgSet.add('listings');
        texBuf.push('\\begin{lstlisting}');
        texBuf.push(token["text"]);
    },
    heading: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        const texElement = ['section', 'subsection', 'subsubsection', 'paragraph'];
        const elem = texElement[token["depth"] - 1 > 3 ? 3 : token["depth"] - 1];

        texBuf.push('\\' + elem + '{');
        texBuf.addIndent();
        token["tokens"].forEach((token: Object) => {
            translate(token, texBuf, pkgSet);
        });
        texBuf.subIndent();
        texBuf.push('}');
    },
    table: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        // todo
        texBuf.push('table not implemented!');
    },
    blockquote: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        texBuf.push('\\begin{quote}');
        texBuf.addIndent();
        token["tokens"].forEach((token: Object) => {
            translate(token, texBuf, pkgSet);
        });
        texBuf.subIndent();
        texBuf.push('\\end{quote}');
    },
    list: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        const ordered: boolean = token["ordered"];
        texBuf.push(ordered ? '\\begin{enumerate}' : '\\begin{itemize}');
        texBuf.addIndent();
        token["items"].forEach((token: Object) => {
            translate(token, texBuf, pkgSet);
        });
        texBuf.subIndent();
        texBuf.push(ordered ? '\\end{enumerate}' : '\\end{itemize}');
    },
    list_item: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        texBuf.push('\\item ');
        texBuf.addIndent();
        token["tokens"].forEach((token: Object) => {
            translate(token, texBuf, pkgSet);
        });
        texBuf.subIndent();
    },
    paragraph: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        token["tokens"].forEach((token: Object) => {
            translate(token, texBuf, pkgSet);
        });
    },
    html: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        // todo
        texBuf.push('html not implemented!');
    },
    text: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        if (token["tokens"] !== undefined) {
            token["tokens"].forEach((token: Object) => {
                translate(token, texBuf, pkgSet);
            });
        } else {
            texBuf.push(token["text"]);
        }
    },
    def: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        // todo
        texBuf.push('def not implemented!');
    },
    escape: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        // todo
        texBuf.push('escape not implemented!');
    },
    tag: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        // todo
        texBuf.push('tag not implemented!');
    },
    link: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        texBuf.push('\\href{' + token["href"] + '}{');
        texBuf.addIndent();
        token["tokens"].forEach((token: Object) => {
            translate(token, texBuf, pkgSet);
        });
        texBuf.subIndent();
        texBuf.push('}');
    },
    image: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        pkgSet.add('graphicx');
        texBuf.push('\\begin{figure}[htbp]');
        texBuf.addIndent();
        texBuf.push('\\centering');
        texBuf.push('\\includegraphics{' + token["href"] + '}');
        texBuf.push('\\caption{' + token["text"] + '}');
        texBuf.subIndent();
        texBuf.push('\\end{figure}');
    },
    strong: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        texBuf.push('\\textbf{');
        texBuf.addIndent();
        token["tokens"].forEach((token: Object) => {
            translate(token, texBuf, pkgSet);
        });
        texBuf.subIndent();
        texBuf.push('}');
    },
    em: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        texBuf.push('\\emph{');
        texBuf.addIndent();
        token["tokens"].forEach((token: Object) => {
            translate(token, texBuf, pkgSet);
        });
        texBuf.subIndent();
        texBuf.push('}');
    },
    codespan: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        texBuf.push('\\texttt{' + token["text"] + '}');
    },
    br: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        texBuf.push('\\newline');
    },
    del: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        // todo
        texBuf.push('del not implemented!');
    },
}

export default function texify(tokens: Array<Object>): Array<string> {
    let typeBuf: Array<string> = [];
    let texBuf: TexBuf = new TexBuf();
    let pkgBuf: Set<string> = new Set();

    tokens.forEach((token: Object) => {
        typeBuf.push(token["type"]);

        translate(token, texBuf, pkgBuf);
    })
    return [...typeBuf, ...texBuf, ...pkgBuf];
}