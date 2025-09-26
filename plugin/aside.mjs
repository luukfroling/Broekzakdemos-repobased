// plugins/aside.mjs

// function to insert raw typst code
const generateTypstNode = (val) => {
  let result = {
    type: 'raw',
    lang: 'typst',
    typst: val
  }
  return result
}

const asideTransform = {
  name: "aside-to-typst",
  doc: "Convert {aside} blocks into marge #note sidenotes for Typst PDF.",
  stage: "document",
  plugin: () => (tree) => {
    // const isPDF = process.argv.some(a => /\bpdf\b/i.test(a));
    const isPDF = process.argv.some(arg => arg.includes("typst"));

    if (!isPDF) return;

    // single line function, A is an array with variable in it or empty array
    const A = v => Array.isArray(v) ? v : v ? [v] : [];

    // Helper to get text content of a node and its children
    const getText = (n) =>
      n?.type === "text" ? (n.value ?? "") : A(n?.children).map(getText).join("");

    const isAside = (n) =>
      n?.type === "aside" ||
      (n?.type === "admonition" &&
       (n.kind === "aside" ||
        (Array.isArray(n.classes) && n.classes.includes("admonition-aside"))));

    let rootChildren = tree.children?.[0]?.children || [];

    for (let i = 0; i < rootChildren.length; i++) {
      const n = rootChildren[i];

      if (!isAside(n)) continue;

      const kids = A(n.children);
      const titleIdx = kids.findIndex(k => k?.type === "admonitionTitle" || k?.type === "title");
      const title = titleIdx >= 0 ? getText(kids[titleIdx]).trim() : "";
      const body = kids.filter((_, idx) => idx !== titleIdx);

      // Bouw een synthetische node die exporter als `#note[...]` kan uitschrijven
      // #noteBlock(heading: [Example: Here is an example])[
      //    With some text.
      // ]

      rootChildren[i] = generateTypstNode(
        '#import "aside_style.typ": aside \n #aside("' + title + '", "' + body.map(b => getText(b)).join("\n") + '")'
      );
    }
  },
};


const plugin = {
  name: "Conditional Aside Plugin",
  transforms: [asideTransform],
};

export default plugin;
