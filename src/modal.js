/** inspired on https://micromodal.now.sh/ &  https://tingle.robinparisi.com/ */

const defaultModalDomString = `
  <div class="modal">
    <div class="modal__overlay fixed top-0 left-0 right-0 bottom-0 bg-black flex justify-center items-center z-50">
        <div class="modal__content w-full h-full flex justify-center items-center"></div>
        <div class="modal__closeButton fixed right-0 top-0 mr-4 mt-4 text-white cursor-pointer z-10 text-white">&#10006;</div>
    </div>
  </div>`;

const defaultContentDomString = `
  <div class="container p-16 bg-white max-h-screen m-auto">
    <div class="modal__header">HEADER</div>
    <div class="modal__body">BODY</div>
    <div class="modal__footer">FOOTER</div>
  </div>`;

const BramModal = class {
  constructor(params = {}) {
    if (params.id == undefined) {
      throw "ID is a required field";
    }

    this.id = params.id;
    this.modalDomString = defaultModalDomString;
    this.contentDomString = params.contentDomString || defaultContentDomString;
    this.classModifier = params.classModifier;
    this.onShow = params.onShow;
    this.onClose = params.onClose;
    this.disableScroll = true;

    if (
      document.readyState === "complete" ||
      document.readyState === "interactive"
    ) {
      this.onDomContentLoaded();
    } else {
      document.addEventListener(
        "DOMContentLoaded",
        this.onDomContentLoaded.bind(this)
      );
    }
  }

  onDomContentLoaded() {
    this.template = document.querySelector(
      '*[data-modal-content="' + this.id + '"]'
    );
    this.triggers = document.querySelectorAll(
      '*[data-modal-trigger="' + this.id + '"]'
    );

    this.triggers.length &&
      this.triggers.forEach((trigger) =>
        trigger.addEventListener("click", () => this.showModal())
      );
  }

  showModal() {
    if (document.getElementById(this.id)) return;
    this.elements = this.parseDOMString(this.modalDomString)[0];
    this.populateContentAndListeners();
    document.body.append(this.elements);
    if (this.disableScroll) document.body.style.overflow = "hidden";
    this.onShow && this.onShow(this);
  }

  closeModal() {
    this.onClose && this.onClose(this);
    document.body.removeChild(document.querySelector(".modal#" + this.id)); // https://www.tutorialspoint.com/how-can-detached-dom-elements-cause-memory-leak-in-javascript
    document.body.style.overflow = "";
  }

  parseDOMString(domString) {
    let html = new DOMParser().parseFromString(domString, "text/html");
    return Array.from(html.body.childNodes);
  }

  populateContentAndListeners() {
    //root
    this.elements.id = this.id;
    if (this.classModifier) {
      this.elements.classList.add("modal--" + this.classModifier);
    }

    document.onkeydown = this.eventClose.bind(this);

    const overlay = this.elements.children[0];
    overlay.addEventListener("click", this.eventClose.bind(this));

    const closeBtn = overlay.children[1];
    closeBtn.addEventListener("click", this.eventClose.bind(this));

    const content = overlay.children[0];

    if (this.template) {
      content.append(this.template.content.cloneNode(true));
    } else {
      content.innerHTML = this.contentDomString;
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
