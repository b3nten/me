package main

import (
	"bytes"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/ast"
	"github.com/yuin/goldmark/renderer"
	"github.com/yuin/goldmark/renderer/html"
	"github.com/yuin/goldmark/util"
)

func WriteBlock(w util.BufWriter, nodeType string, content string, entering bool) {
	if entering {
		w.WriteString(`[{"type":"`)
		w.WriteString(nodeType)
		w.WriteString(`"},`)
		w.WriteString(content)
	} else {
		w.WriteString(`],`)
	}
}

func WriteText(w util.BufWriter, content string, entering bool) {
	if entering {
		w.WriteString(`"`)
		w.WriteString(content)
	} else {
		w.WriteString(`",`)
	}
}

type JSONRenderer struct{}

func (r *JSONRenderer) RegisterFuncs(reg renderer.NodeRendererFuncRegisterer) {
	reg.Register(ast.KindHeading, r.heading)
	reg.Register(ast.KindText, r.text)
	reg.Register(ast.KindParagraph, r.paragraph)
	reg.Register(ast.KindEmphasis, r.bold)
	reg.Register(ast.KindHTMLBlock, r.htmlBlock)
	reg.Register(ast.KindRawHTML, r.html)
}

func (r *JSONRenderer) heading(w util.BufWriter, _ []byte, node ast.Node, entering bool) (
	ast.WalkStatus, error,
) {
	WriteBlock(w, "heading", "", entering)
	return ast.WalkContinue, nil
}

func (r *JSONRenderer) paragraph(w util.BufWriter, _ []byte, node ast.Node, entering bool) (
	ast.WalkStatus, error,
) {
	WriteBlock(w, "paragraph", "", entering)
	return ast.WalkContinue, nil
}

func (r *JSONRenderer) text(w util.BufWriter, src []byte, node ast.Node, entering bool) (
	ast.WalkStatus, error,
) {
	n := node.(*ast.Text)
	WriteText(w, string(n.Segment.Value(src)), entering)
	return ast.WalkContinue, nil
}

func (r *JSONRenderer) bold(w util.BufWriter, src []byte, node ast.Node, entering bool) (
	ast.WalkStatus, error,
) {
	WriteBlock(w, "bold", "", entering)
	return ast.WalkContinue, nil
}

func (r *JSONRenderer) htmlBlock(w util.BufWriter, src []byte, node ast.Node, entering bool) (
	ast.WalkStatus, error,
) {
	n := node.(*ast.HTMLBlock)
	if entering {
		n.Dump(src, 0)
	}
	return ast.WalkContinue, nil
}

func (r *JSONRenderer) html(w util.BufWriter, src []byte, node ast.Node, entering bool) (
	ast.WalkStatus, error,
) {
	n := node.(*ast.RawHTML)
	if entering {
		n.Dump(src, 0)
	}
	return ast.WalkContinue, nil
}

func NewJSONRenderer() renderer.NodeRenderer {
	return &JSONRenderer{}
}

var r = renderer.NewRenderer(
	renderer.WithNodeRenderers(util.Prioritized(NewJSONRenderer(), 1000)),
)

var content = []byte(`
# hello

This is a *test* of this <b>renderer</b>.

<Test name="name" />

<Code>child</Code>

`)

func main() {
	var buf bytes.Buffer

	err := goldmark.New(
		goldmark.WithRendererOptions(html.WithUnsafe()),
		//goldmark.WithRenderer(r),
	).Convert(content, &buf)
	if err != nil {
		println(err.Error())
	}
	println("[", buf.String(), "]")
}
