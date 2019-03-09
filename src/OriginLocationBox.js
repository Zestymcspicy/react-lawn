import './OriginLocationBox.css'

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
    this.container.className = "current-location-box";
    this.container.textContent = `Your Location: ${this.originText}`;

    return this.container

    }


    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}
