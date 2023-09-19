<script>
import { NConfigProvider, NGrid, NGridItem, NCode } from 'naive-ui'
import { marked } from 'marked';
import texify from "../texify/index.ts";

import hljs from 'highlight.js/lib/core';
import latex from 'highlight.js/lib/languages/latex.js';
hljs.registerLanguage('tex', latex);

export default {
  data() {
    return {
      hljs: hljs,
      textInput: '',
      lexer: marked.lexer,
      output: ['no output']
    }
  },
  components: {
    NConfigProvider,
    NGrid,
    NGridItem,
    NCode
  },
  methods: {
    clicked() {
      console.log(marked.lexer(this.textInput))
      console.log(texify(marked.lexer(this.textInput)))
      this.output = texify(marked.lexer(this.textInput))
    }
  },
  mounted() {
    fetch('sample.md')
      .then(response => response.text())
      .then(data => {
        this.textInput = data
        this.clicked()
      })
  }
}

</script>

<template>
  <h1 @click="clicked">ParaTeX</h1>
  <n-config-provider :hljs="hljs">
    <n-grid cols="2" item-responsive responsive="screen">
      <n-grid-item span="2 m:1">
        <div class="gi">
          <n-input
              v-model:value="textInput"
              type="textarea"
              :autosize="{minRows: 20}"
          ></n-input>
        </div>
      </n-grid-item>
      <n-grid-item span="2 m:1">
        <div class="gi right">
          <n-code
            :code="output.join('\n')"
            languages="tex"
          ></n-code>
        </div>
      </n-grid-item>
    </n-grid>
  </n-config-provider>
</template>

<style scoped>
h1 {
  transition: 0.2s
}
h1:hover {
  cursor: pointer;
  transform: scale(1.1);
}

.n-input {
  text-align: left;
  width: 100em;
  font-family: Consolas, monospace;
  font-size: large;
}

.gi {
  padding-left: 10px;
  padding-right: 10px;
  text-align: left;
  /* border: black solid 1px; */
}

.gi.right {
  margin-left: 10px;
}
</style>
