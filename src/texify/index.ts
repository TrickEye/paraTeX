// texify algorithm.
// TrickEye 2023.
//
// Works with marked and convert lexed tokens to tex source code.

class TexBuf extends Array<string> {
    private _indent: number;

    constructor() {
        super();
        this._indent = 0;
    }

    public addIndent() {
        this._indent++;
        return this;
    }

    public subIndent() {
        this._indent--;
        return this;
    }

    public getIndent(): number {
        return this._indent;
    }

    public setIndent(n: number) {
        this._indent = n;
    }

    push(...items: string[]): number {
        return super.push(...items.map((item: string) => '\t'.repeat(this._indent) + item));
    }

    toString(): string {
        return this.join('\n');
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
        texBuf.push('');
    },
    code: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        pkgSet.add('listings');
        texBuf.push('\\begin{lstlisting}');
        texBuf.push(token["text"]);
    },
    heading: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        const texElement = ['section', 'subsection', 'subsubsection', 'paragraph'];
        const elem = texElement[token["depth"] - 1 > 3 ? 3 : token["depth"] - 1];

        let tempBuf = new TexBuf()
        token["tokens"].forEach((token: Object) => {
            translate(token, tempBuf, pkgSet);
        });
        tempBuf[0] = '\\' + elem + '{' + tempBuf[0];
        tempBuf[tempBuf.length - 1] += '}';

        texBuf.push(...tempBuf);
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
        let tempBuf = new TexBuf();
        token["tokens"].forEach((token: Object) => {
            translate(token, tempBuf, pkgSet);
        });
        texBuf.push('\\item\t' + tempBuf[0]);
        texBuf.addIndent()
        texBuf.push(...tempBuf.slice(1))
        texBuf.subIndent()
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
        let tempBuf = new TexBuf();
        token["tokens"].forEach((token: Object) => {
            translate(token, tempBuf, pkgSet);
        });
        tempBuf[0] = '\\href{' + token["href"] + '}{' + tempBuf;
        tempBuf[tempBuf.length - 1] += '}'
        texBuf.push(...tempBuf)
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
        let tempBuf = new TexBuf();
        token["tokens"].forEach((token: Object) => {
            translate(token, tempBuf, pkgSet);
        });
        tempBuf[tempBuf.length - 1] += '}';
        texBuf.push('\\textbf{' + tempBuf[0]);
        texBuf.addIndent();
        texBuf.push(...tempBuf.slice(1));
        texBuf.subIndent();
    },
    em: function (token: Object, texBuf: TexBuf, pkgSet: Set<string>) {
        let tempBuf = new TexBuf();
        token["tokens"].forEach((token: Object) => {
            translate(token, tempBuf, pkgSet);
        });
        tempBuf[tempBuf.length - 1] += '}';
        texBuf.push('\\emph{' + tempBuf[0]);
        texBuf.addIndent();
        texBuf.push(...tempBuf.slice(1));
        texBuf.subIndent();
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
    let texBuf: TexBuf = new TexBuf();
    let pkgBuf: Set<string> = new Set();

    tokens.forEach((token: Object) => {
        translate(token, texBuf, pkgBuf);
    })
    return [...texBuf];
}