package main

import (
	"bytes"
	"github.com/yuin/goldmark"
)

func main(){
	var buf bytes.Buffer
	if err := goldmark.Convert([]byte("#hello"), &buf); err != nil {
		panic(err)
	}
	println(buf.String())
}
