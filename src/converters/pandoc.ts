import {execFile as execFileOriginal} from "node:child_process";
import {ExecFileFn} from "./types";

export const properties = {
    from: {
        text: [
            "textile",
            "tikiwiki",
            "tsv",
            "twiki",
            "typst",
            "vimwiki",
            "biblatex",
            "bibtex",
            "bits",
            "commonmark",
            "commonmark_x",
            "creole",
            "csljson",
            "csv",
            "djot",
            "docbook",
            "docx",
            "dokuwiki",
            "endnotexml",
            "epub",
            "fb2",
            "gfm",
            "haddock",
            "html",
            "ipynb",
            "jats",
            "jira",
            "json",
            "latex",
            "man",
            "markdown",
            "markdown_mmd",
            "markdown_phpextra",
            "markdown_strict",
            "mediawiki",
            "muse",
            "pandoc native",
            "opml",
            "org",
            "ris",
            "rst",
            "rtf",
            "t2t",
        ],
    },
    to: {
        text: [
            "tei",
            "texinfo",
            "textile",
            "typst",
            "xwiki",
            "zimwiki",
            "asciidoc",
            "asciidoc_legacy",
            "asciidoctor",
            "beamer",
            "biblatex",
            "bibtex",
            "chunkedhtml",
            "commonmark",
            "commonmark_x",
            "context",
            "csljson",
            "djot",
            "docbook",
            "docbook4",
            "docbook5",
            "docx",
            "dokuwiki",
            "dzslides",
            "epub",
            "epub2",
            "epub3",
            "fb2",
            "gfm",
            "haddock",
            "html",
            "html4",
            "html5",
            "icml",
            "ipynb",
            "jats",
            "jats_archiving",
            "jats_articleauthoring",
            "jats_publishing",
            "jira",
            "json",
            "latex",
            "man",
            "markdown",
            "markdown_mmd",
            "markdown_phpextra",
            "markdown_strict",
            "markua",
            "mediawiki",
            "ms",
            "muse",
            "pandoc native",
            "odt",
            "opendocument",
            "opml",
            "org",
            "pdf",
            "plain",
            "pptx",
            "revealjs",
            "rst",
            "rtf",
            "s5",
            "slideous",
            "slidy",
            "docuwiki"
        ],
    },
};

// A list of Markdown formats: markdown (Pandoc), commonmark, markdown_mmd (MultiMarkdown),
// gfm (GitHub markdown), commonmark_x (extended CommonMark)
// Not all input formats are here for now
// JSON is the JSON serialisation of the Pandoc AST which can be used for filtering
export type InputFormat = typeof properties.from.text[number];

// Subset of output formats, will add more later
// Note: you need a `-o -` in the command to output odt, docx, epub or PDF output (presumably as they are binary formats or something)
export type OutputFormat = typeof properties.to.text[number];

export function needsLaTeX(format: OutputFormat): boolean {
    return format === 'pdf';
}

export function needsPandoc(format: OutputFormat): boolean {
    return format !== 'html';
}

export function needsStandaloneFlag(output: OutputFormat, filename: string): boolean {
    return filename.endsWith('html')
        || output === 'html'
        || output === 'revealjs'
        || output === 'latex'
        || output === 'beamer';
}

export function convert(
    filePath: string,
    fileType: InputFormat,
    convertTo: OutputFormat,
    targetPath: string,
    options?: unknown,
    execFile: ExecFileFn = execFileOriginal,
): Promise<string> {
    // Build arguments array
    const args: string[] = [];

    if (fileType) {
        args.push('--from');
        args.push(fileType);
    }
    if (convertTo) {
        args.push('--to');
        args.push(convertTo);
    }
    if (needsStandaloneFlag(convertTo, filePath))
        args.push('-s');
    args.push('-o');
    args.push(targetPath);

    // // Support Unicode in the PDF output if XeLaTeX is installed
    if (convertTo === 'pdf') args.push('--pdf-engine=xelatex');
    // The metadata title is needed for ePub and standalone HTML formats
    // We use a metadata file to avoid being vulnerable to command injection
    if (fileType === "markdown") {
        args.push("data/md.yaml");
    }
    args.push(filePath);
    // Extra parameters

    return new Promise((resolve, reject) => {
        execFile("pandoc", args, (error, stdout, stderr) => {
            if (error) {
                reject(`error: ${error}`);
            }

            if (stdout) {
                console.log(`stdout: ${stdout}`);
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }

            resolve("Done");
        });
    });
}
