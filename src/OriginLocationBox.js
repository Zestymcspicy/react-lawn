

export default class OriginLocationBox {
  constructor(originText){
    this.originText = originText;
  }
  onAdd(map) {
    this.customStyles = {
      backgroundColor: "white"
    }
    this.map = map;
    this.container = document.createElement('div');
    this.container.style = ("background-color: white; position: absolute; top: 10px; text-align: center; right: 5%");
    this.container.textContent = `Your Location: ${this.originText}`;

    return this.container

    }


    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}
