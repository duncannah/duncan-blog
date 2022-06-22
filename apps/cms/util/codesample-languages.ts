const codesampleLanguages = [
	{
		text: `Plain text`,
		value: `none`,
	},
	{
		text: `Plain text`,
		value: `plain`,
	},
	{
		text: `Plain text`,
		value: `plaintext`,
	},
	{
		text: `Plain text`,
		value: `text`,
	},
	{
		text: `Plain text`,
		value: `txt`,
	},
	{
		text: `HTML`,
		value: `html`,
	},
	{
		text: `XML`,
		value: `xml`,
	},
	{
		text: `SVG`,
		value: `svg`,
	},
	{
		text: `MathML`,
		value: `mathml`,
	},
	{
		text: `SSML`,
		value: `ssml`,
	},
	{
		text: `RSS`,
		value: `rss`,
	},
	{
		text: `CSS`,
		value: `css`,
	},
	{
		text: `C-like`,
		value: `clike`,
	},
	{
		text: `JavaScript`,
		value: `js`,
	},
	{
		text: `ABAP`,
		value: `abap`,
	},
	{
		text: `ABNF`,
		value: `abnf`,
	},
	{
		text: `AL`,
		value: `al`,
	},
	{
		text: `ANTLR4`,
		value: `antlr4`,
	},
	{
		text: `ANTLR4`,
		value: `g4`,
	},
	{
		text: `Apache Configuration`,
		value: `apacheconf`,
	},
	{
		text: `APL`,
		value: `apl`,
	},
	{
		text: `AQL`,
		value: `aql`,
	},
	{
		text: `Arduino`,
		value: `ino`,
	},
	{
		text: `ARFF`,
		value: `arff`,
	},
	{
		text: `ARM Assembly`,
		value: `armasm`,
	},
	{
		text: `ARM Assembly`,
		value: `arm-asm`,
	},
	{
		text: `Arturo`,
		value: `art`,
	},
	{
		text: `AsciiDoc`,
		value: `asciidoc`,
	},
	{
		text: `AsciiDoc`,
		value: `adoc`,
	},
	{
		text: `ASP.NET (C#)`,
		value: `aspnet`,
	},
	{
		text: `6502 Assembly`,
		value: `asm6502`,
	},
	{
		text: `Atmel AVR Assembly`,
		value: `asmatmel`,
	},
	{
		text: `AutoHotkey`,
		value: `autohotkey`,
	},
	{
		text: `AutoIt`,
		value: `autoit`,
	},
	{
		text: `AviSynth`,
		value: `avisynth`,
	},
	{
		text: `AviSynth`,
		value: `avs`,
	},
	{
		text: `Avro IDL`,
		value: `avro-idl`,
	},
	{
		text: `Avro IDL`,
		value: `avdl`,
	},
	{
		text: `AWK`,
		value: `awk`,
	},
	{
		text: `GAWK`,
		value: `gawk`,
	},
	{
		text: `BASIC`,
		value: `basic`,
	},
	{
		text: `BBcode`,
		value: `bbcode`,
	},
	{
		text: `BNF`,
		value: `bnf`,
	},
	{
		text: `RBNF`,
		value: `rbnf`,
	},
	{
		text: `BSL (1C:Enterprise)`,
		value: `bsl`,
	},
	{
		text: `OneScript`,
		value: `oscript`,
	},
	{
		text: `C#`,
		value: `csharp`,
	},
	{
		text: `C#`,
		value: `cs`,
	},
	{
		text: `C#`,
		value: `dotnet`,
	},
	{
		text: `C++`,
		value: `cpp`,
	},
	{
		text: `CFScript`,
		value: `cfscript`,
	},
	{
		text: `CFScript`,
		value: `cfc`,
	},
	{
		text: `CIL`,
		value: `cil`,
	},
	{
		text: `CMake`,
		value: `cmake`,
	},
	{
		text: `COBOL`,
		value: `cobol`,
	},
	{
		text: `CoffeeScript`,
		value: `coffee`,
	},
	{
		text: `Concurnas`,
		value: `conc`,
	},
	{
		text: `Content-Security-Policy`,
		value: `csp`,
	},
	{
		text: `CSS Extras`,
		value: `css-extras`,
	},
	{
		text: `CSV`,
		value: `csv`,
	},
	{
		text: `CUE`,
		value: `cue`,
	},
	{
		text: `DataWeave`,
		value: `dataweave`,
	},
	{
		text: `DAX`,
		value: `dax`,
	},
	{
		text: `Django/Jinja2`,
		value: `django`,
	},
	{
		text: `Django/Jinja2`,
		value: `jinja2`,
	},
	{
		text: `DNS zone file`,
		value: `dns-zone-file`,
	},
	{
		text: `DNS zone file`,
		value: `dns-zone`,
	},
	{
		text: `Docker`,
		value: `dockerfile`,
	},
	{
		text: `DOT (Graphviz)`,
		value: `dot`,
	},
	{
		text: `DOT (Graphviz)`,
		value: `gv`,
	},
	{
		text: `EBNF`,
		value: `ebnf`,
	},
	{
		text: `EditorConfig`,
		value: `editorconfig`,
	},
	{
		text: `EJS`,
		value: `ejs`,
	},
	{
		text: `Embedded Lua templating`,
		value: `etlua`,
	},
	{
		text: `ERB`,
		value: `erb`,
	},
	{
		text: `Excel Formula`,
		value: `excel-formula`,
	},
	{
		text: `Excel Formula`,
		value: `xlsx`,
	},
	{
		text: `Excel Formula`,
		value: `xls`,
	},
	{
		text: `F#`,
		value: `fsharp`,
	},
	{
		text: `Firestore security rules`,
		value: `firestore-security-rules`,
	},
	{
		text: `FreeMarker Template Language`,
		value: `ftl`,
	},
	{
		text: `GameMaker Language`,
		value: `gml`,
	},
	{
		text: `GameMaker Language`,
		value: `gamemakerlanguage`,
	},
	{
		text: `GAP (CAS)`,
		value: `gap`,
	},
	{
		text: `G-code`,
		value: `gcode`,
	},
	{
		text: `GDScript`,
		value: `gdscript`,
	},
	{
		text: `GEDCOM`,
		value: `gedcom`,
	},
	{
		text: `gettext`,
		value: `gettext`,
	},
	{
		text: `gettext`,
		value: `po`,
	},
	{
		text: `GLSL`,
		value: `glsl`,
	},
	{
		text: `GN`,
		value: `gn`,
	},
	{
		text: `GN`,
		value: `gni`,
	},
	{
		text: `GNU Linker Script`,
		value: `linker-script`,
	},
	{
		text: `GNU Linker Script`,
		value: `ld`,
	},
	{
		text: `Go module`,
		value: `go-module`,
	},
	{
		text: `Go module`,
		value: `go-mod`,
	},
	{
		text: `GraphQL`,
		value: `graphql`,
	},
	{
		text: `Handlebars`,
		value: `hbs`,
	},
	{
		text: `Haskell`,
		value: `hs`,
	},
	{
		text: `HCL`,
		value: `hcl`,
	},
	{
		text: `HLSL`,
		value: `hlsl`,
	},
	{
		text: `HTTP`,
		value: `http`,
	},
	{
		text: `HTTP Public-Key-Pins`,
		value: `hpkp`,
	},
	{
		text: `HTTP Strict-Transport-Security`,
		value: `hsts`,
	},
	{
		text: `IchigoJam`,
		value: `ichigojam`,
	},
	{
		text: `ICU Message Format`,
		value: `icu-message-format`,
	},
	{
		text: `Idris`,
		value: `idr`,
	},
	{
		text: `.ignore`,
		value: `ignore`,
	},
	{
		text: `.gitignore`,
		value: `gitignore`,
	},
	{
		text: `.hgignore`,
		value: `hgignore`,
	},
	{
		text: `.npmignore`,
		value: `npmignore`,
	},
	{
		text: `Inform 7`,
		value: `inform7`,
	},
	{
		text: `JavaDoc`,
		value: `javadoc`,
	},
	{
		text: `JavaDoc-like`,
		value: `javadoclike`,
	},
	{
		text: `Java stack trace`,
		value: `javastacktrace`,
	},
	{
		text: `JQ`,
		value: `jq`,
	},
	{
		text: `JSDoc`,
		value: `jsdoc`,
	},
	{
		text: `JS Extras`,
		value: `js-extras`,
	},
	{
		text: `JSON`,
		value: `json`,
	},
	{
		text: `Web App Manifest`,
		value: `webmanifest`,
	},
	{
		text: `JSON5`,
		value: `json5`,
	},
	{
		text: `JSONP`,
		value: `jsonp`,
	},
	{
		text: `JS stack trace`,
		value: `jsstacktrace`,
	},
	{
		text: `JS Templates`,
		value: `js-templates`,
	},
	{
		text: `Keepalived Configure`,
		value: `keepalived`,
	},
	{
		text: `Kotlin Script`,
		value: `kts`,
	},
	{
		text: `Kotlin`,
		value: `kt`,
	},
	{
		text: `KuMir (КуМир)`,
		value: `kumir`,
	},
	{
		text: `KuMir (КуМир)`,
		value: `kum`,
	},
	{
		text: `LaTeX`,
		value: `latex`,
	},
	{
		text: `TeX`,
		value: `tex`,
	},
	{
		text: `ConTeXt`,
		value: `context`,
	},
	{
		text: `LilyPond`,
		value: `lilypond`,
	},
	{
		text: `LilyPond`,
		value: `ly`,
	},
	{
		text: `Lisp`,
		value: `emacs`,
	},
	{
		text: `Lisp`,
		value: `elisp`,
	},
	{
		text: `Lisp`,
		value: `emacs-lisp`,
	},
	{
		text: `LLVM IR`,
		value: `llvm`,
	},
	{
		text: `Log file`,
		value: `log`,
	},
	{
		text: `LOLCODE`,
		value: `lolcode`,
	},
	{
		text: `Magma (CAS)`,
		value: `magma`,
	},
	{
		text: `Markdown`,
		value: `md`,
	},
	{
		text: `Markup templating`,
		value: `markup-templating`,
	},
	{
		text: `MATLAB`,
		value: `matlab`,
	},
	{
		text: `MAXScript`,
		value: `maxscript`,
	},
	{
		text: `MEL`,
		value: `mel`,
	},
	{
		text: `METAFONT`,
		value: `metafont`,
	},
	{
		text: `MongoDB`,
		value: `mongodb`,
	},
	{
		text: `MoonScript`,
		value: `moon`,
	},
	{
		text: `N1QL`,
		value: `n1ql`,
	},
	{
		text: `N4JS`,
		value: `n4js`,
	},
	{
		text: `N4JS`,
		value: `n4jsd`,
	},
	{
		text: `Nand To Tetris HDL`,
		value: `nand2tetris-hdl`,
	},
	{
		text: `Naninovel Script`,
		value: `naniscript`,
	},
	{
		text: `Naninovel Script`,
		value: `nani`,
	},
	{
		text: `NASM`,
		value: `nasm`,
	},
	{
		text: `NEON`,
		value: `neon`,
	},
	{
		text: `nginx`,
		value: `nginx`,
	},
	{
		text: `NSIS`,
		value: `nsis`,
	},
	{
		text: `Objective-C`,
		value: `objectivec`,
	},
	{
		text: `Objective-C`,
		value: `objc`,
	},
	{
		text: `OCaml`,
		value: `ocaml`,
	},
	{
		text: `OpenCL`,
		value: `opencl`,
	},
	{
		text: `OpenQasm`,
		value: `openqasm`,
	},
	{
		text: `OpenQasm`,
		value: `qasm`,
	},
	{
		text: `PARI/GP`,
		value: `parigp`,
	},
	{
		text: `Object Pascal`,
		value: `objectpascal`,
	},
	{
		text: `PATROL Scripting Language`,
		value: `psl`,
	},
	{
		text: `PC-Axis`,
		value: `pcaxis`,
	},
	{
		text: `PC-Axis`,
		value: `px`,
	},
	{
		text: `PeopleCode`,
		value: `peoplecode`,
	},
	{
		text: `PeopleCode`,
		value: `pcode`,
	},
	{
		text: `PHP`,
		value: `php`,
	},
	{
		text: `PHPDoc`,
		value: `phpdoc`,
	},
	{
		text: `PHP Extras`,
		value: `php-extras`,
	},
	{
		text: `PlantUML`,
		value: `plant-uml`,
	},
	{
		text: `PlantUML`,
		value: `plantuml`,
	},
	{
		text: `PL/SQL`,
		value: `plsql`,
	},
	{
		text: `PowerQuery`,
		value: `powerquery`,
	},
	{
		text: `PowerQuery`,
		value: `pq`,
	},
	{
		text: `PowerQuery`,
		value: `mscript`,
	},
	{
		text: `PowerShell`,
		value: `powershell`,
	},
	{
		text: `PromQL`,
		value: `promql`,
	},
	{
		text: `.properties`,
		value: `properties`,
	},
	{
		text: `Protocol Buffers`,
		value: `protobuf`,
	},
	{
		text: `PureBasic`,
		value: `purebasic`,
	},
	{
		text: `PureBasic`,
		value: `pbfasm`,
	},
	{
		text: `PureScript`,
		value: `purs`,
	},
	{
		text: `Python`,
		value: `py`,
	},
	{
		text: `Q#`,
		value: `qsharp`,
	},
	{
		text: `Q#`,
		value: `qs`,
	},
	{
		text: `Q (kdb+ database)`,
		value: `q`,
	},
	{
		text: `QML`,
		value: `qml`,
	},
	{
		text: `Racket`,
		value: `rkt`,
	},
	{
		text: `Razor C#`,
		value: `cshtml`,
	},
	{
		text: `Razor C#`,
		value: `razor`,
	},
	{
		text: `React JSX`,
		value: `jsx`,
	},
	{
		text: `React TSX`,
		value: `tsx`,
	},
	{
		text: `Ren'py`,
		value: `renpy`,
	},
	{
		text: `Ren'py`,
		value: `rpy`,
	},
	{
		text: `ReScript`,
		value: `res`,
	},
	{
		text: `reST (reStructuredText)`,
		value: `rest`,
	},
	{
		text: `Robot Framework`,
		value: `robotframework`,
	},
	{
		text: `Robot Framework`,
		value: `robot`,
	},
	{
		text: `Ruby`,
		value: `rb`,
	},
	{
		text: `SAS`,
		value: `sas`,
	},
	{
		text: `Sass (Sass)`,
		value: `sass`,
	},
	{
		text: `Sass (Scss)`,
		value: `scss`,
	},
	{
		text: `Shell session`,
		value: `shell-session`,
	},
	{
		text: `Shell session`,
		value: `sh-session`,
	},
	{
		text: `Shell session`,
		value: `shellsession`,
	},
	{
		text: `SML`,
		value: `sml`,
	},
	{
		text: `SML/NJ`,
		value: `smlnj`,
	},
	{
		text: `Solidity (Ethereum)`,
		value: `solidity`,
	},
	{
		text: `Solidity (Ethereum)`,
		value: `sol`,
	},
	{
		text: `Solution file`,
		value: `solution-file`,
	},
	{
		text: `Solution file`,
		value: `sln`,
	},
	{
		text: `Soy (Closure Template)`,
		value: `soy`,
	},
	{
		text: `SPARQL`,
		value: `sparql`,
	},
	{
		text: `SPARQL`,
		value: `rq`,
	},
	{
		text: `Splunk SPL`,
		value: `splunk-spl`,
	},
	{
		text: `SQF: Status Quo Function (Arma 3)`,
		value: `sqf`,
	},
	{
		text: `SQL`,
		value: `sql`,
	},
	{
		text: `Stata Ado`,
		value: `stata`,
	},
	{
		text: `Structured Text (IEC 61131-3)`,
		value: `iecst`,
	},
	{
		text: `SuperCollider`,
		value: `supercollider`,
	},
	{
		text: `SuperCollider`,
		value: `sclang`,
	},
	{
		text: `Systemd configuration file`,
		value: `systemd`,
	},
	{
		text: `T4 templating`,
		value: `t4-templating`,
	},
	{
		text: `T4 Text Templates (C#)`,
		value: `t4-cs`,
	},
	{
		text: `T4 Text Templates (C#)`,
		value: `t4`,
	},
	{
		text: `T4 Text Templates (VB)`,
		value: `t4-vb`,
	},
	{
		text: `TAP`,
		value: `tap`,
	},
	{
		text: `Template Toolkit 2`,
		value: `tt2`,
	},
	{
		text: `TOML`,
		value: `toml`,
	},
	{
		text: `trickle`,
		value: `trickle`,
	},
	{
		text: `troy`,
		value: `troy`,
	},
	{
		text: `TriG`,
		value: `trig`,
	},
	{
		text: `TypeScript`,
		value: `ts`,
	},
	{
		text: `TSConfig`,
		value: `tsconfig`,
	},
	{
		text: `UnrealScript`,
		value: `uscript`,
	},
	{
		text: `UnrealScript`,
		value: `uc`,
	},
	{
		text: `UO Razor Script`,
		value: `uorazor`,
	},
	{
		text: `URI`,
		value: `uri`,
	},
	{
		text: `URL`,
		value: `url`,
	},
	{
		text: `VB.Net`,
		value: `vbnet`,
	},
	{
		text: `VHDL`,
		value: `vhdl`,
	},
	{
		text: `vim`,
		value: `vim`,
	},
	{
		text: `Visual Basic`,
		value: `visual-basic`,
	},
	{
		text: `VBA`,
		value: `vba`,
	},
	{
		text: `Visual Basic`,
		value: `vb`,
	},
	{
		text: `WebAssembly`,
		value: `wasm`,
	},
	{
		text: `Web IDL`,
		value: `web-idl`,
	},
	{
		text: `Web IDL`,
		value: `webidl`,
	},
	{
		text: `WGSL`,
		value: `wgsl`,
	},
	{
		text: `Wiki markup`,
		value: `wiki`,
	},
	{
		text: `Wolfram language`,
		value: `wolfram`,
	},
	{
		text: `Mathematica Notebook`,
		value: `nb`,
	},
	{
		text: `Wolfram language`,
		value: `wl`,
	},
	{
		text: `XeoraCube`,
		value: `xeoracube`,
	},
	{
		text: `XML doc (.net)`,
		value: `xml-doc`,
	},
	{
		text: `Xojo (REALbasic)`,
		value: `xojo`,
	},
	{
		text: `XQuery`,
		value: `xquery`,
	},
	{
		text: `YAML`,
		value: `yaml`,
	},
	{
		text: `YAML`,
		value: `yml`,
	},
	{
		text: `YANG`,
		value: `yang`,
	},
];

export default codesampleLanguages;
