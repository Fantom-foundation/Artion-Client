import { css } from '@emotion/core';

export default css`
  html {
    box-sizing: border-box;
    -ms-overflow-style: scrollbar;
    -webkit-tap-highlight-color: transparent;
    overflow-x: hidden;
    font-size: 16px;
  }
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
  [tabindex='-1']:focus {
    outline: none !important;
  }
  div {
    margin: 0;
    padding: 0;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
  }
  p {
    margin: 0;
  }
  abbr[title],
  abbr[data-original-title] {
    cursor: help;
  }
  address {
    margin-bottom: 1rem;
    font-style: normal;
    line-height: inherit;
  }
  ol,
  ul,
  dl {
    margin-top: 0;
    margin-bottom: 1rem;
  }
  ol ol,
  ul ul,
  ol ul,
  ul ol {
    margin-bottom: 0;
  }
  dd {
    margin-bottom: 0.5rem;
    margin-left: 0;
  }
  blockquote {
    margin: 0 0 1rem;
  }
  a:not([href]):not([tabindex]) {
    text-decoration: none;
    &:hover,
    &:focus {
      color: inherit;
      text-decoration: none;
    }
    &:focus {
      outline: 0;
    }
  }
  pre {
    margin-top: 0;
    margin-bottom: 1rem;
    overflow: auto;
  }
  figure {
    margin: 0 0 1rem;
  }
  img {
    display: block;
    max-width: 100%;
    vertical-align: middle;
  }
  [role='button'] {
    cursor: pointer;
  }
  a,
  area,
  button,
  [role='button'],
  input,
  label,
  select,
  summary,
  textarea {
    touch-action: manipulation;
  }
  table {
    border-collapse: collapse;
  }
  caption {
    text-align: left;
    caption-side: bottom;
  }
  th {
    text-align: left;
  }
  label {
    display: inline-block;
    margin-bottom: 0rem;
  }
  button:focus {
    outline: 1px dotted;
    outline: 5px auto -webkit-focus-ring-color;
  }
  input,
  button,
  select,
  textarea {
    line-height: inherit;
    font-family: inherit;
    font-size: inherit;
  }
  input[type='radio'],
  input[type='checkbox'] {
    &:disabled {
      cursor: not-allowed;
    }
  }
  input[type='date'],
  input[type='time'],
  input[type='datetime-local'],
  input[type='month'] {
    -webkit-appearance: listbox;
  }
  textarea {
    resize: vertical;
  }
  fieldset {
    min-width: 0;
    padding: 0;
    margin: 0;
    border: 0;
  }
  legend {
    display: block;
    width: 100%;
    padding: 0;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
    line-height: inherit;
  }
  input {
    border-radius: 0;
  }
  [hidden] {
    display: none !important;
  }
  body {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-family: sans-serif;
    margin: 0;
    transition-timing-function: ease-in-out;
  }
  img {
    max-width: 100%;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  a {
    color: inherit;
  }
  p a {
    color: inherit;
    border-bottom: 1px solid;
    text-decoration: none;
    transition: 350ms;
    &:hover,
    &:focus,
    &:visited {
      opacity: 0.6;
      transition: 350ms;
    }
  }
  .no-scroll {
    overflow: hidden;
  }
`;
