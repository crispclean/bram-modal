import BramModal from "./modal";
//import BramModal from "../dist/modal.min.js";

const modal1 = new BramModal({
  id: "modal-1",
  onShow: (modal) => {
    const body = modal.elements.querySelector("#modal_body");
    body.classList.add("cursor-pointer");
    body.addEventListener("click", () => modal.closeModal());
  },
});
