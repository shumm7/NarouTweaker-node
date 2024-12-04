import SimpleCodeEditor from "react-simple-code-editor";
import { styled, alpha } from "@mui/material/styles";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/themes/prism-okaidia.min.css";

const fontFamilyCode = "'BizinGothicDiscord', 'Menlo', 'Consolas', 'Droid Sans Mono', 'monospace'";
const CodeComponent = styled("div")(({ theme }) => [{

    "& pre": {
        // The scroll container needs to be the parent of the editor, overriding:
        // https://github.com/mui/material-ui/blob/269c1d0c7572fcb6ae3b270a2622d16c7e40c848/docs/src/modules/components/MarkdownElement.js#L27-L26

        lineHeight: 1.5,
        // Developers like when the code is dense.
        margin: theme.spacing(2, "auto"),
        padding: theme.spacing(2),
        // a special, one-off, color tailored for the code blocks using MUI's branding theme blue palette as the starting point. It has a less saturaded color but still maintaining a bit of the blue tint.
        color: "hsl(60, 30%, 96%)",
        colorScheme: "dark",
        ...theme.applyStyles('light', {
            color: "black",
            colorScheme: "light",
        }),
        borderRadius: 12,
        border: "1px solid",
        borderColor: theme.palette.primary.dark,
        overflowX: "hidden",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        fontSize: 13,
        maxWidth: "inherit",
        maxHeight: "initial",
    },
    "& code": {
        fontFamily: fontFamilyCode,
        fontWeight: 400,
        WebkitFontSmoothing: "subpixel-antialiased",
        fontSize: "inherit",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
        lineHeight: "inherit",
        backgroundColor: "transparent",
    },
    "& .MuiCode-ScrollContainer": {
        maxHeight: "inherit",
        overflow: "auto",
        height: "100%",
        border: `1px solid`,
        borderColor: "rgba(255,255,255,0.23)",
        colorScheme: "dark",
        ...theme.applyStyles('light', {
            borderColor: "rgba(0,0,0,0.23)",
            colorScheme: "light",
        }),
        borderRadius: 12,
        "&:hover": {
            borderColor: theme.palette.text.primary,
        },
        "&:focus, &:focus-within, &:active": {
            borderColor: theme.palette.primary.main,
            outline: "1px solid",
            outlineColor: theme.palette.primary.main,
        },
    },

    /* Prism - Coy Theme */
    ...theme.applyStyles('light', {
        '& code[class*="language-"], & pre[class*="language-"]': {
            color: "inherit",
            textShadow: "none",
        },
        ".token.comment, & .token.prolog, & .token.doctype, & .token.cdata": {
            color: "#7D8B99"
        },
        "& .token.punctuation": {
            color: "#5F6364"
        },
        "& .token.property, & .token.tag, & .token.constant, & .token.symbol, & .token.deleted": {
            color: "#c92c2c"
        },
        "& .token.boolean, & .token.number": {
            color: "#ae81ff"
        },
        "& .token.selector, & .token.attr-name, & .token.string, & .token.char, & .token.builtin, & .token.inserted": {
            color: "#2f9c0a"
        },
        "& .token.operator, & .token.entity, & .token.url, & .language-css .token.string, & .style .token.string, & .token.variable": {
            color: "#a67f59"
        },
        "& .token.atrule, & .token.attr-value, & .token.function, & .token.class-name": {
            color: "#a67f59"
        },
        "& .token.keyword": {
            color: "#1990b8"
        },
        "& .token.regex, & .token.important": {
            color: "#e90"
        }
    }),
}]);

const StyledCodeEditor = styled(SimpleCodeEditor)(({ theme }) => ({
    ...theme.typography.body2,
    fontSize: theme.typography.pxToRem(13),
    fontFamily: fontFamilyCode,
    fontWeight: 400,
    WebkitFontSmoothing: "subpixel-antialiased",
    direction: "ltr /*! @noflip */" as any,
    float: "left",
    minWidth: "100%",
    "& textarea": {
        outline: 0,
    },
    "& > textarea, & > pre": {
        // Override inline-style
        whiteSpace: "pre-wrap !important",
        wordBreak: "break-all !important",
    },
}));

const getHighlight = (code: string, lang?: string) => {
    if (lang === "json") {
        return `<code class="language-json">${Prism.highlight(
            code,
            Prism.languages.json,
            "json"
        )}</code>`
    } else if (lang === "css") {
        return `<code class="language-css">${Prism.highlight(
            code,
            Prism.languages.css,
            "css"
        )}</code>`
    }

    return `<code class="language-plaintext">${Prism.highlight(
        code,
        Prism.languages.plaintext,
        "plaintext"
    )}</code>`
}

export default function CodeEditor(props: {
    id?: string;
    name?: string
    width?: number;
    height?: number;
    maxWidth?: number;
    maxHeight?: number;
    placeholder?: string
    language?: "json" | "css" | "plaintext"
    tabSize?: number
    autoFocus?: boolean
    readonly?: boolean
    minLength?: number
    maxLength?: number
    value?: string
    onChange: (code: string) => void;
    onBlur?: (React.FocusEventHandler<HTMLDivElement> & React.FocusEventHandler<HTMLTextAreaElement>) | undefined;
    onClick?: (React.MouseEventHandler<HTMLDivElement> & React.MouseEventHandler<HTMLTextAreaElement>) | undefined;
    onFocus?: (React.FocusEventHandler<HTMLDivElement> & React.FocusEventHandler<HTMLTextAreaElement>) | undefined;
    onKeyDown?: (React.KeyboardEventHandler<HTMLDivElement> & React.KeyboardEventHandler<HTMLTextAreaElement>) | undefined;
    onKeyUp?: (React.KeyboardEventHandler<HTMLDivElement> & React.KeyboardEventHandler<HTMLTextAreaElement>) | undefined;
}) {
    const getmin = (v1?: number, v2?: number) => {
        if (v1 === undefined && v2 === undefined) {
            return undefined
        } else {
            if (v1 === undefined) {
                return v2
            } else if (v2 === undefined) {
                return v2
            }
            return Math.min(v1, v2)
        }
    }

    return (
        <CodeComponent
            className="MuiCode-root"
            style={{
                maxWidth: props.maxWidth,
                maxHeight: props.maxHeight,
                width: props.width ?? props.maxWidth ?? "100%",
                height: props.height,
            }}
        >
            <div
                className="MuiCode-ScrollContainer"
                style={{
                    maxHeight: getmin(props.maxHeight, props.height),
                    maxWidth: getmin(props.maxWidth, props.width)
                }}
            >
                <StyledCodeEditor
                    name={props.name}
                    padding={15}
                    highlight={(code: any) =>
                        getHighlight(code, props.language)
                    }
                    tabSize={props.tabSize ?? 3}
                    id={props.id}
                    value={props.value ?? ""}
                    placeholder={props.placeholder}
                    minLength={props.minLength}
                    maxLength={props.maxLength}
                    autoFocus={props.autoFocus}
                    readOnly={props.readonly}
                    onValueChange={props.onChange}
                    onBlur={props.onBlur}
                    onClick={props.onClick}
                    onFocus={props.onFocus}
                    onKeyDown={props.onKeyDown}
                    onKeyUp={props.onKeyUp}
                    style={{
                        minHeight: props.height !== undefined ? "100%" : undefined,
                        minWidth: props.width !== undefined ? "100%" : undefined,
                        maxWidth: "100%"
                    }}
                />
            </div>
        </CodeComponent>
    );
}
