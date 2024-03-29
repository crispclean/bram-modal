# Bram Modal

**BramModal** is a barebones and small vanilla MODAL JS script (<4kb).

Inspired on https://micromodal.now.sh/ & https://tingle.robinparisi.com/

https://tailwindcss.com is currently needed for styling.

No IE11 support for now!

## Installation

```sh
npm install bram-modal --dev
```

## Usage

- You can pass a HTML string via domString parameter
- or add a template in your HTML files.

### JS

```sh
import BramModal from "bram-modal";

new BramModal({
    id:'', /* required */
    contentDomString: '',
    classModifier: '',
    onClose: (modal) => (), /* modal.elements */
    onShow: (modal) => (), /* modal.elements */
});

```

### HTML

```sh
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Bram Modal</title>
    <link rel="stylesheet" href="./tailwind.css" />
    <script src="./index.js"></script>
  </head>

  <body class="m-16">
    <h1>Bram Modal Demo</h1>

    <div class="pt-16">
      <button
        data-modal-trigger="modal-1"
        class="px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400"
      >
        Open modal
      </button>
    </div>
  </body>
</html>

<template data-modal-content="modal-1">
  <div class="container p-16 bg-white max-h-screen m-auto">
    <header>HEADER</header>
    <div>BODY</div>
    <footer>FOOTER</footer>
  </div>
</template>

```
