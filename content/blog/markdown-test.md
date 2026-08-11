---
date: "2026-08-08"
title: "Markdown Styling Test"
description: "Every piece of Markdown the site renders, on one page, for checking the styles against."
draft: true
tags: ["markdown", "test"]
---

A draft rather than a post: it exists to be looked at after a change to the stylesheets, and holds
one of everything the site can render. Raw HTML is deliberately absent — `unsafe` is off, so
Goldmark drops it and a test written with it would silently pass.

## Headings

Six levels, each hovered to check the anchor link the heading render hook adds.

### Level 3 heading

Text under a level 3.

#### Level 4 heading

Text under a level 4.

##### Level 5 heading

Text under a level 5.

###### Level 6 heading

Text under a level 6.

## Inline formatting

Some **bold** text, some _italic_ text, some **_both at once_**, some ~~strikethrough~~ text, and
some `inline code` sat in a sentence. A [link](https://example.com), a bare autolinked
https://example.com, and an \*escaped\* asterisk. This line ends in two spaces,  
so the break above is a hard one rather than a new paragraph.

A paragraph long enough to wrap several times, ending in a word no line can break inside of, so
that `overflow-wrap` has something to prove: Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch.

## Lists

Ordered, with a nested level:

1. Apple
1. Banana
   1. Cavendish
   1. Plantain
1. Cake

Unordered, with a paragraph inside an item:

- Some text

  A second paragraph in the same item, indented to stay in it.

- Some more text
  - A nested item
    - And one deeper still

Tasks:

- [x] A finished item
- [ ] An unfinished item

Terms:

Markdown
: A lightweight markup language for creating formatted text using a plain-text editor.

Goldmark
: The Markdown parser Hugo renders this page with.

## Blockquotes

> "Markdown is a lightweight markup language for creating formatted text using a plain-text editor."
> – John Gruber

> A quote holding a nested one:
>
> > and the nested quote itself, to check the boxes do not stack into a mess.

## Images

![Markdown Logo](https://upload.wikimedia.org/wikipedia/commons/4/48/Markdown-mark.svg)

## Code blocks

Highlighted, with line numbers and a line far too long for the page, so the block scrolls on its
own rather than the page:

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("Markdown");
const reallyLongVariableName = someFunction(argumentOne, argumentTwo, argumentThree, argumentFour);
```

Another language, to check the theme is not tuned to one:

```python
def calculate_sum(numbers):
    return sum(numbers)


# Example usage
result = calculate_sum([1, 2, 3, 4, 5])
print(f"The sum is: {result}")
```

A fence with no language, which Chroma leaves alone and the styles have to box anyway:

```
$ hugo --minify
Total in 22 ms
```

An indented block, the other way of writing one:

    #!/bin/sh
    echo "four spaces, no fence"

## Tables

Alignment, a cell wide enough to push the table past the page, and rows that stop short:

| Feature     | Supported | Notes                                                          | Count |
| :---------- | :-------: | :------------------------------------------------------------- | ----: |
| Bold/Italic |    Yes    | A deliberately long cell, so the table has to scroll sideways. |     1 |
| Lists       |    Yes    | Ordered, unordered, nested and tasks                           |    42 |
| Code blocks |    Yes    | Highlighted, plain and indented                                |   350 |
| Tables      |    Yes    |
| Footnotes   |    Yes    |

## Rules and footnotes

Above a horizontal rule:

---

And below it. A sentence with a footnote reference[^1], and a second one[^note] naming its label.

[^1]: The footnote itself, which Goldmark collects at the foot of the page.

[^note]: Labels are not rendered, so this reads as 2 wherever it lands.
