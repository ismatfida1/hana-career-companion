---
name: imagegen
description: "Use for visual deliverable routing and image generation/editing tasks, including new images, image edits, image upscaling/restoration/enhancement, UI mockups, diagrams, infographics, posters, icons, logos, charts, visual assets, and ambiguous visual requests. Helps choose between Mermaid, Python plotting, static layout/code screenshots, web/app development, and AI image generation."
license: "Complete terms in LICENSE.txt"
---

# ImageGen Manus

Use this skill to decide the correct production route for visual deliverables.

## Core Principle

Identify the image's job before choosing a tool or style. A correct visual is not merely attractive; it must fit the user's intended medium, purpose, constraints, hierarchy, and acceptance criteria.

Optimize for the relevant goal: conversion, explanation, brand recognition, product accuracy, game usability, UI credibility, readable text, precise data mapping, or edit fidelity.

## Routing

- Use AI image generation/editing for original visual assets, illustrations, characters, scenes, icons, posters, logos, visual concepts, and faithful image transformations.
- Use Mermaid when the deliverable is primarily a precise structural diagram or flowchart.
- Use Python plotting when the deliverable is a data-driven chart where numerical accuracy matters.
- Use static layout/code screenshots when the goal is to demonstrate UI/code output precisely.
- Use web/app development when the requested visual must be interactive or functional rather than a static image.

## Before production

Do not start by asking about model names, API parameters, or internal generation settings. Ask only for missing user-facing constraints that materially affect correctness, such as:

- final medium/use case
- aspect ratio or dimensions
- exact text and language
- brand colors or visual system
- reference style or reference image
- transparency requirements
- product/character constraints
- what must be preserved during editing

## Acceptance criteria

Before producing a visual, ensure the result is appropriate for its intended medium and purpose, has a clear hierarchy, preserves required text and objects, and follows the requested visual constraints. For edits, preserve unaffected content and change only what the user requested.
