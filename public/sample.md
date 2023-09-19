# paraTeX, Write markdown, get LaTeX
[It is here](https://github.com/TrickEye/paraTeX)
- V 0.2: add sample markdown file, remove redundant newlines(WIP)
- V 0.1: add usage tips, basic feature support (heading, list, inline), add azure deploy strategy

## Usage
1. 在这里输入markdown源代码
2. 点击paraTeX!
3. 在右侧看到tex源码

## Features
- 标题
  - 一，二，三，四+级标题分别对应`\section`, `\subsection`, `\subsubsection`, `\paragraph`;
- 列表
  - 无序列表对应`\begin{itemize}...\end{itemize}`;
  - 有序列表对应`\begin{enumerate}...\end{enumerate}`;
- 行内样式
  - **加粗**对应`\textbf{...}`;
  - *斜体*对应`\textit{...}`;
  - `行内代码`对应`\texttt{...}`;
  - [链接](#features)对应`\href{...}{...}`;
  - ![图片](url)对应`\includegraphics{...}`;

## Known issues
出现奇怪的空行，不符合人类输入习惯。会是之后的主要改进方向。

LaTeX保留字符转义。这个好办，会实现的。

前端比较简陋。笑死，这个就是随便写的，可以到时候怎么好看怎么改。