import { observable, action } from 'mobx';
import { compress, decompress } from 'utils/stringPress';
import { saveAs } from 'file-saver';

class PaintStore {
  canvas;
  ctx;
  lastX;
  lastY;
  hue = 0;
  isInitialized = false;
  strokeHistory = [];
  session = [];
  redos = [];
  fileUploader;
  backgroundImage;

  @observable
  isDrawing = false;

  @observable
  color = 'black';

  @observable
  backgroundColor = 'white';

  @observable
  size = 6;

  @action
  setColor = color => {
    this.color = color;
  };

  @action
  setEraseColor = () => {
    this.color = this.backgroundColor;
  };

  @action
  setBackgroundColor = color => {
    this.backgroundColor = color;
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  @action
  setBackgroundImage = () => {
    this.fileUploader.click();
  };

  @action
  setSize = size => {
    this.size = size;
  };

  initialize = canvas => {
    if (canvas) {
      this.canvas = canvas;
      this.canvas.width = canvas.clientWidth;
      this.canvas.height = canvas.clientHeight;
      this.boundingClientRect = canvas.getBoundingClientRect();
      this.ctx = canvas.getContext('2d');
      this.ctx.lineJoin = 'round';
      this.ctx.lineCap = 'round';
      this.ctx.fillStyle = this.backgroundColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      const fileSelector = document.createElement('input');
      fileSelector.setAttribute('type', 'file');
      fileSelector.setAttribute('accept', 'image/*');
      fileSelector.addEventListener('change', () => {
        try {
          let selected = fileSelector.files[0];
          let reader = new FileReader();
          reader.readAsDataURL(selected);
          reader.onloadend = () => {
            let background = new Image();
            background.src = reader.result;
            background.onload = () => {
              if (background.width == background.height)
                this.ctx.drawImage(
                  background,
                  0,
                  0,
                  this.canvas.width,
                  this.canvas.height
                );
              else {
                let imgW = background.width;
                let imgH = background.height;
                let max = imgW > imgH ? imgW : imgH;
                let ratioToCanvas = parseFloat(this.canvas.height / max);
                console.log(this.canvas.height, max, ratioToCanvas);
                imgW *= ratioToCanvas;
                imgH *= ratioToCanvas;
                const x = (this.canvas.width - imgW) / 2;
                const y = (this.canvas.height - imgH) / 2;
                this.ctx.drawImage(background, x, y, imgW, imgH);
              }
              fileSelector.value = null;
              localStorage.setItem('background', reader.result);
            };
          };
        } catch (error) {
          console.log('file selection cancelled');
        }
      });
      this.fileUploader = fileSelector;
      this.isInitialized = true;

      console.log('is initialized ', this.isInitialized);
    } else {
      console.log('the canvas was initialized already');
    }
  };

  stroke = ({ color, size, lastX, lastY, clientX, clientY }) => {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = size;
    this.ctx.beginPath();
    this.ctx.moveTo(lastX, lastY);
    this.ctx.lineTo(clientX, clientY);
    this.ctx.stroke();
  };

  draw = (event, firstContact = false) => {
    let touch;
    if (event.touches && event.touches.length) {
      touch = event.touches.item(0);
    }
    if (!this.isDrawing) return;
    const { left, top } = this.boundingClientRect;

    const color = !this.color ? `hsl(${this.hue++}, 100%, 50%)` : this.color;
    const size = this.size;
    const clientX = (touch ? touch.clientX : event.clientX) - left;
    const clientY = (touch ? touch.clientY : event.clientY) - top;
    const lastX = firstContact ? clientX : this.lastX;
    const lastY = firstContact ? clientY : this.lastY;

    const strokeData = { color, size, lastX, lastY, clientX, clientY };

    this.stroke(strokeData);
    this.session.push(strokeData);

    this.lastX = clientX;
    this.lastY = clientY;
  };

  redraw = (stack = this.strokeHistory) => {
    this.clear();
    console.log(stack);
    let filename = localStorage.getItem('background');
    if (filename) {
      let background = new Image();
      background.src = filename;
      background.onload = () => {
        this.ctx.drawImage(
          background,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
        localStorage.setItem('background', filename);
        stack.forEach(entry => {
          entry.forEach(this.stroke);
        });
      };
    } else {
      stack.forEach(entry => {
        entry.forEach(this.stroke);
      });
    }
  };

  start = event => {
    this.isDrawing = true;
    if (this.redos.length) {
      this.redos = [];
    }
    this.draw(event, true);
  };

  stop = () => {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.strokeHistory.push(this.session);
      this.session = [];
    }
  };

  undo = () => {
    this.redos.push(this.strokeHistory.pop());
    this.redraw();
  };

  redo = () => {
    if (this.redos.length) {
      this.strokeHistory.push(this.redos.pop());
      this.redraw();
    }
  };

  clear = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  reset = () => {
    this.strokeHistory = [];
    this.session = [];
    this.redos = [];
    this.clear();
  };

  save = () => {
    const history = this.strokeHistory.reduce(
      (history, entry) =>
        history.concat(
          entry.map(step => [
            step.lastX,
            step.lastY,
            step.clientX,
            step.clientY,
            step.color,
            step.size,
          ])
        ),
      []
    );

    const compressed = compress(JSON.stringify(history));
    localStorage.setItem('saved', compressed);
  };

  load = () => {
    const saved = localStorage.getItem('saved');
    if (!saved) return;

    try {
      const parsed = JSON.parse(decompress(saved)).map(entry => {
        const [lastX, lastY, clientX, clientY, color, size] = entry;
        return { lastX, lastY, clientX, clientY, color, size };
      });
      this.reset();
      this.strokeHistory.push(parsed);
      this.redraw();
    } catch (e) {
      console.log('removed');
    }
  };

  saveToFile = () => {
    this.canvas.toBlob(blob => {
      saveAs(blob, 'newArt.png');
    });
  };
}

export default PaintStore;
