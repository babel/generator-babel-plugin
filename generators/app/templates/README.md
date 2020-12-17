# <%= githubRepoName %>

<%= description %>

## Example

**In**

```js
// input code
```

**Out**

```js
"use strict";

// output code
```

## Installation

```sh
$ npm install <%= githubRepoName %>
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["<%= name %>"]
}
```

### Via CLI

```sh
$ babel --plugins <%= name %> script.js
```

### Via Node API

```javascript
require("@babel/core").transform("code", {
  plugins: ["<%= name %>"]
});
```
