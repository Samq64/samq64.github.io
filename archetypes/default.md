---
date: "{{ .Date }}"
title: "{{ replace .File.ContentBaseName `-` ` ` | title }}"
description: "{{ replace .File.ContentBaseName `-` ` ` | strings.FirstUpper }}."
draft: true
---
