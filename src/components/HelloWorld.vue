<script>
import { darkTheme } from 'naive-ui'
import { marked } from 'marked';
import texify from "../texify/index.ts";

export default {
  data() {
    return {
      darkTheme: darkTheme,
      textInput: '# hello\n\n## hello world!',
      lexer: marked.lexer,
      output: 'no output'
    }
  },
  methods: {
    clicked() {
      console.log(marked.lexer(this.textInput))
      console.log(texify(marked.lexer(this.textInput)))
      this.output = texify(marked.lexer(this.textInput))
    }
  }
}

</script>

<template>
  <h1 @click="clicked">ParaTeX</h1>
  <n-config-provider :theme="darkTheme">
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
        <div class="gi">
<!--          <div v-for="item in output"><span>{{ item }}</span></div>-->
          <n-code
            :code="output.join('\n')"
            show-line-numbers
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
}
</style>
