/** inspired on https://micromodal.now.sh/ &  https://tingle.robinparisi.com/ */

const defaultDOMString = `
  <div class="modal">
    <div id="modal_overlay" class="fixed top-0 left-0 right-0 bottom-0 bg-black flex justify-center items-center">
        <div id="modal_container" class="container p-16 bg-white max-h-screen m-auto">
            <div id="modal_header"></div>
            <div id="modal_body"></div>
            <div id="modal_footer"></div>
        </div>
        <div id="modal_close_btn" class="fixed right-0 top-0 mr-4 mt-4 text-white cursor-pointer z-10 text-white">&#10006;</div>
    </div>
  </div>`;

const BramModal = class {
  constructor({ id, customClass, footer }) {
    this.id = id;
    this.domString = defaultDOMString;
    this.customClass = customClass;
    this.footer = footer;

    document.addEventListener(
      "DOMContentLoaded",
      () => {
        this.template = document.querySelector("template#" + this.id);
        this.triggers = document.querySelectorAll(
          '*[data-modal-trigger="' + this.id + '"]'
        );
        this.triggers.forEach((trigger) =>
          trigger.addEventListener("click", () => this.showModal())
        );
      },
      false
    );
  }

  showModal() {
    let elements = this.parseDOMString(this.domString);
    elements = this.populateElements(elements);
    this.appendElementsToDOM(elements);
    //Need to add listeners here since clone does not copy event listeners - lame
    this.addListeners();
  }

  parseDOMString(domString) {
    let html = new DOMParser().parseFromString(domString, "text/html");
    return Array.from(html.body.childNodes);
  }

  populateElements(elements) {
    //root
    elements[0].id = this.id;
    if (this.customClass) {
      elements[0].classList.add(this.customClass);
    }

    const overlay = elements[0].children[0];

    if (this.template) {
      overlay.replaceChild(
        this.template.content.cloneNode(true),
        overlay.children[0]
      );
    } else {
      overlay.children[0].children[0].innerHTML = "HEADER";
      overlay.children[0].children[1].innerHTML = "BODY";
      if (this.footer) {
        overlay.children[0].children[2].innerHTML = "FOOTER";
      }
    }

    return elements;
  }

  appendElementsToDOM(elements) {
    const toNodeList = function (arrayOfNodes) {
      let fragment = document.createDocumentFragment();
      arrayOfNodes.forEach(function (item) {
        fragment.appendChild(item.cloneNode(true));
      });
      return fragment.childNodes;
    };

    document.body.append(toNodeList(elements)[0]);
  }

  addListeners() {
    const overlay = document.body.querySelector("#modal_overlay");
    overlay.addEventListener("click", (e) => {
      if (e.target !== e.currentTarget) return;
      this.closeModal();
    });

    const btn = document.body.querySelector("#modal_close_btn");
    btn.addEventListener("click", (e) => {
      if (e.target !== e.currentTarget) return;
      this.closeModal();
    });

    document.onkeydown = (e) => {
      e = e || window.event;
      var isEscape = false;
      if ("key" in e) {
        isEscape = e.key === "Escape" || e.key === "Esc";
      } else {
        isEscape = e.keyCode === 27;
      }
      if (isEscape) {
        this.closeModal();
      }
    };
  }

  closeModal() {
    document.body.removeChild(document.querySelector(".modal#" + this.id)); // https://www.tutorialspoint.com/how-can-detached-dom-elements-cause-memory-leak-in-javascript
  }
};

export default BramModal;
