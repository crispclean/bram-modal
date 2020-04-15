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

//   onShow: modal => console.info(`${modal.id} is shown`), // [1]
//   onClose: modal => console.info(`${modal.id} is hidden`), // [2]
//   openTrigger: 'data-custom-open', // [3]
//   closeTrigger: 'data-custom-close', // [4]
//   openClass: 'is-open', // [5]
//   disableScroll: true, // [6]
//   disableFocus: false, // [7]
//   awaitOpenAnimation: false, // [8]
//   awaitCloseAnimation: false, // [9]
//   debugMode: true // [10]

const BramModal = class {
  constructor(params = {}) {
    if (params.id == undefined) {
      throw "ID is a required field";
    }

    this.id = params.id;
    this.domString = defaultDOMString;
    this.customClass = params.customClass;
    this.hideFooter = params.hideFooter;
    this.onShow = params.onShow;
    this.onClose = params.onClose;

    document.addEventListener(
      "DOMContentLoaded",
      this.onDomContentLoaded.bind(this)
    );
  }

  onDomContentLoaded() {
    this.template = document.querySelector("template#" + this.id);
    this.triggers = document.querySelectorAll(
      '*[data-modal-trigger="' + this.id + '"]'
    );
    this.triggers.length &&
      this.triggers.forEach((trigger) =>
        trigger.addEventListener("click", () => this.showModal())
      );
  }

  showModal() {
    this.elements = this.parseDOMString(this.domString)[0];
    this.populateContentAndListeners();
    document.body.append(this.elements);
    this.onShow && this.onShow(this);
  }

  closeModal() {
    this.onClose && this.onClose(this);
    document.body.removeChild(document.querySelector(".modal#" + this.id)); // https://www.tutorialspoint.com/how-can-detached-dom-elements-cause-memory-leak-in-javascript
  }

  parseDOMString(domString) {
    let html = new DOMParser().parseFromString(domString, "text/html");
    return Array.from(html.body.childNodes);
  }

  populateContentAndListeners() {
    //root
    this.elements.id = this.id;
    if (this.customClass) {
      this.elements.classList.add(this.customClass);
    }

    document.onkeydown = this.eventClose.bind(this);

    const overlay = this.elements.children[0];
    overlay.addEventListener("click", this.eventClose.bind(this));

    const closeBtn = overlay.children[1];
    closeBtn.addEventListener("click", this.eventClose.bind(this));

    if (this.template) {
      overlay.replaceChild(
        this.template.content.cloneNode(true),
        overlay.children[0]
      );
    } else {
      overlay.children[0].children[0].innerHTML = "HEADER DEFAULT";
      overlay.children[0].children[1].innerHTML = "BODY ";
      if (!this.hideFooter) {
        overlay.children[0].children[2].innerHTML = "FOOTER";
      }
    }
  }

  eventClose(e) {
    if ("key" in e) {
      if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {
        this.closeModal();
      }
    } else {
      if (e.target !== e.currentTarget) return;
      this.closeModal();
    }
  }
};

export default BramModal;
