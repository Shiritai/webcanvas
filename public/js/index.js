"use strict";
/**
 * Implement color selector generation and corresponding methods
 */
class ColorMethod {
    constructor(stack, ref, color_r, color_g, color_b) {
        this.cur = -1;
        this.color_arr = new Array(); // about to init 10 buttons
        this.code_arr = new Array(); // about to init 10 buttons
        const n = 10;
        for (let i = n - 1; i >= 0; --i) {
            let cs = document.createElement("label");
            cs.classList.add("form-control", "form-control-color");
            cs.id = `color${i}`;
            cs.style.borderWidth = "2px";
            cs.onmouseenter = () => {
                cs.style.borderColor = "black";
            };
            cs.onmouseleave = () => {
                cs.style.borderColor = i != this.cur ?
                    "gray" : "orange";
            };
            cs.onclick = (ev) => {
                if (this.cur != i || ref.classList.contains('show')) {
                    // assign
                    cs.style.backgroundColor = this._color(this.code_arr[i]);
                    [color_r.value, color_g.value, color_b.value] = this.code_arr[i];
                }
                offcanvas_move(ref, this.cur == i);
                this.color_arr.forEach((_cs) => {
                    _cs.style.borderColor = "gray";
                });
                cs.style.borderColor = "orange";
                this.cur = i;
            };
            this.color_arr.unshift(cs);
            this.code_arr.unshift(["127", "127", "127"]);
            stack.prepend(cs);
        }
        this.color_arr[0].onclick(new MouseEvent("dummy")); // dummy triggering
        ref.classList.remove('show');
    }
    assign(r, g, b) {
        this.code_arr[this.cur] = [r, g, b];
        this.color_arr[this.cur].style.backgroundColor = this.color();
    }
    load() {
        return this.code_arr[this.cur];
    }
    _color([a, b, c]) {
        return `rgb(${a}, ${b}, ${c})`;
    }
    /**
     * Get current selected color
     */
    color() {
        return this._color(this.code_arr[this.cur]);
    }
}
class Screenshot {
    constructor(ref, x, y, w, h) {
        // in-class members
        this.arr = [];
        this.size = 0;
        this.cur = -1;
        this.undo_mode = false;
        this.ref = ref;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.reset();
    }
    /**
     * Take screenshot
     */
    shot() {
        if (this.undo_mode) {
            this.size = this.cur + 1;
            this.undo_mode = false;
        }
        let data = this.ref.getImageData(this.x, this.y, this.w, this.h);
        if (this.cur + 1 == this.arr.length) { // expand
            this.arr.push(data);
        }
        else {
            this.arr[this.cur + 1] = data;
        }
        if (++this.cur == this.size) {
            ++this.size;
        }
    }
    /**
     * Undo last change
     */
    undo() {
        if (this.cur > 0) {
            this.undo_mode = true;
            this.ref.putImageData(this.arr[--this.cur], this.x, this.y);
        }
        else { // additional function
            alert("Nothing to undo!");
        }
    }
    /**
     * Redo last change
     */
    redo() {
        if (this.undo_mode && this.cur + 1 < this.size) {
            this.ref.putImageData(this.arr[++this.cur], this.x, this.y);
        }
        else { // additional function
            alert("Nothing to redo!");
        }
    }
    /**
     * Reset all screenshots to current canvas content
     */
    reset() {
        this.arr = new Array();
        this.size = 0;
        this.cur = -1;
        this.undo_mode = false;
        // shot current canvas content
        // which is expected as an empty screen
        this.shot();
    }
}
class MultipleShape {
    constructor(shapes, total_state) {
        this.shapes = shapes;
        this.total_state = total_state;
        this.state = 0;
    }
    change() {
        this.shapes[this.state].style.visibility = "hidden";
        this.state = this.state + 1 < this.total_state ? this.state + 1 : 0;
        this.shapes[this.state].style.visibility = "visible";
    }
}
;
var Mutex;
(function (Mutex_1) {
    const Locked = true;
    const Free = false;
    class Mutex {
        constructor() {
            this.lk = Free;
        }
        /**
         * Try to lock mutex, true if success, false if not
         */
        lock() {
            let ret = this.lk;
            this.lk = Locked;
            return ret == Free;
        }
        unlock() {
            this.lk = Free;
        }
    }
    Mutex_1.Mutex = Mutex;
})(Mutex || (Mutex = {}));
var canvas;
var board;
var drawing;
var img_data;
var start_x, start_y;
var screenshot;
/**
 * Well defined input color method
 */
var color_method;
var color_stack;
/**
 * brush size
 */
var brush_sz;
var brush_sz_txt;
/**
 * transparency value
 */
var trans_val;
var trans_val_txt;
/* checked, unchecked */
var eraser;
var pencil;
var undo;
var redo;
var reset;
var download;
var upload;
var textbox;
var line;
var circle;
var triangle;
var rectangle;
/* Offcanvas for setting color */
var offcanvas_c;
var color_r;
var color_g;
var color_b;
var color_r_txt;
var color_g_txt;
var color_b_txt;
/* Offcanvas for setting font */
var offcanvas_f;
var font_sz;
var font;
var font_sz_txt;
/**
 * Show/hide offcanvas
 * move offcanvas based on status of offcanvas
 * @param move whether we want to activate or move offcanvas
 */
function offcanvas_move(of, move) {
    if (move && of.classList.contains('show')) {
        of.classList.remove('show');
    }
    else {
        of.classList.add('show');
    }
}
var mode;
var shape_container;
var tri_counter;
/**
 * prevent duplicate invocation of input text generation
 */
var mutex;
/**
 * Load HTML elements and setup initial value of global variables
 */
function loadHtmlElements() {
    canvas = document.getElementById("canvas");
    eraser = document.getElementById("eraser");
    pencil = document.getElementById("pencil");
    undo = document.getElementById("undo");
    redo = document.getElementById("redo");
    reset = document.getElementById("reset");
    download = document.getElementById("download");
    upload = document.getElementById("upload");
    textbox = document.getElementById("textbox");
    line = document.getElementById("line");
    circle = document.getElementById("circle");
    triangle = document.getElementById("triangle");
    rectangle = document.getElementById("rectangle");
    color_stack = document.getElementById("color-stack");
    brush_sz = document.getElementById("brush-rng");
    brush_sz_txt = document.getElementById("brush-rng-text");
    trans_val = document.getElementById("trans-rng");
    trans_val_txt = document.getElementById("trans-rng-text");
    /* color setting */
    offcanvas_c = document.getElementById("color-offcanvas");
    color_r = document.getElementById("color_r");
    color_r_txt = document.getElementById("color_r_txt");
    color_g = document.getElementById("color_g");
    color_g_txt = document.getElementById("color_g_txt");
    color_b = document.getElementById("color_b");
    color_b_txt = document.getElementById("color_b_txt");
    // initialize color method
    color_method = new ColorMethod(color_stack, offcanvas_c, color_r, color_g, color_b);
    /* font setting */
    offcanvas_f = document.getElementById("font-offcanvas");
    font_sz = document.getElementById("font_sz");
    font = document.getElementById("font");
    font_sz_txt = document.getElementById("font_sz_txt");
    let circle_lb = document.getElementById("circle-container");
    let triangle_lb = document.getElementById("triangle-container");
    let rectangle_lb = document.getElementById("rectangle-container");
    tri_counter = new Map();
    shape_container = new Map();
    let shapes = [[circle, circle_lb], [triangle, triangle_lb], [rectangle, rectangle_lb]];
    shapes.forEach(([e, l]) => {
        tri_counter.set(e.id, { act: "none", sp: "void" });
        shape_container.set(e.id, new MultipleShape(l.getElementsByTagName('img'), 2));
    });
    font.onchange = () => { font.value; }; // make selector load selected value
    // initialize mutex for input text
    mutex = new Mutex.Mutex();
}
function initializeWidget() {
    // set brush
    brush_sz.value = "4";
    (brush_sz.onmousemove = () => {
        brush_sz_txt.innerText = `Brush:${'\xa0'.repeat(3 - brush_sz.value.length)}${brush_sz.value}px`;
    })();
    // set trans
    trans_val.value = "100";
    (trans_val.onmousemove = () => {
        trans_val_txt.innerText = `Opacity:${'\xa0'.repeat(3 - trans_val.value.length)}${trans_val.value}%`;
    })();
    offcanvas_c.onchange = () => {
        [color_r.value, color_g.value, color_b.value] = color_method.load();
    };
    color_r.value = "255";
    (color_r.onmousemove = color_r.onmouseup = () => {
        color_r_txt.innerText = `Red: ${color_r.value} (from 0 ~ 255)`;
        color_method.assign(color_r.value, color_g.value, color_b.value);
    })();
    color_g.value = "255";
    (color_g.onmousemove = color_g.onmouseup = () => {
        color_g_txt.innerText = `Green: ${color_g.value} (from 0 ~ 255)`;
        color_method.assign(color_r.value, color_g.value, color_b.value);
    })();
    color_b.value = "255";
    (color_b.onmousemove = color_b.onmouseup = () => {
        color_b_txt.innerText = `Blue: ${color_b.value} (from 0 ~ 255)`;
        color_method.assign(color_r.value, color_g.value, color_b.value);
    })();
    font_sz.value = "12";
    (font_sz.onmousemove = font_sz.onclick = () => {
        font_sz_txt.innerText = `Font size: ${font_sz.value}px`;
    })();
}
function resetCanvasMouseIcon(id) {
    // use ...arr to unpack array
    canvas.classList.remove(...['pencil', 'eraser', 'textbox',
        'line', 'circle_void', 'circle_solid', 'triangle_void',
        'triangle_solid', 'rectangle_void', 'rectangle_solid']
        .map((s) => { return `cursor-${s}`; }));
    canvas.classList.add(`cursor-${id}`);
}
function setOnclickEvent() {
    /* Set on-click event for the following elements */
    [eraser, pencil, line].forEach((ele) => {
        ele.onclick = () => {
            resetCanvasMouseIcon(ele.id);
            mode = ele.id;
        };
    });
    [circle, triangle, rectangle].forEach((ele) => {
        ele.onclick = () => {
            let status = tri_counter.get(ele.id);
            if (status.act == 'none') {
                tri_counter.forEach((t) => {
                    t.act = 'none';
                });
                status.act = 'activate';
            }
            else {
                status.sp = status.sp == 'void' ? 'solid' : 'void';
                shape_container.get(ele.id).change();
            }
            resetCanvasMouseIcon(`${ele.id}_${status.sp}`);
            mode = ele.id;
        };
    });
    textbox.onclick = () => {
        resetCanvasMouseIcon(textbox.id);
        offcanvas_move(offcanvas_f, mode == textbox.id);
        mode = textbox.id;
    };
    undo.onclick = () => {
        resetCanvasMouseIcon(undo.id);
        mode = undo.id;
        screenshot.undo();
    };
    redo.onclick = () => {
        resetCanvasMouseIcon(redo.id);
        mode = redo.id;
        screenshot.redo();
    };
    reset.onclick = () => {
        resetCanvasMouseIcon(reset.id);
        mode = reset.id;
        if (confirm("Are you sure to reset the canvas?")) {
            board.clearRect(0, 0, canvas.width, canvas.height);
            screenshot.reset();
        }
    };
    download.onclick = () => {
        resetCanvasMouseIcon(reset.id);
        mode = download.id;
        let link = document.createElement('a');
        link.download = 'my_scratch.png';
        link.href = canvas.toDataURL();
        link.click();
    };
    upload.onclick = (e) => {
        resetCanvasMouseIcon(reset.id);
        mode = upload.id;
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = "image/*";
        input.onchange = () => {
            var image = document.createElement('img');
            image.src = URL.createObjectURL(input.files[0]);
            image.onload = () => {
                console.log('loading');
                board.drawImage(image, 0, 0);
                screenshot.shot();
                console.log('loaded');
            };
        };
        input.click();
    };
}
/**
 * Initialize drawing: collect initial values
 */
function initDraw(ev) {
    if (!drawing) {
        // enable drawing
        drawing = true;
        // cache old canvas for drawing shapes (line, circle, ...)
        img_data = board.getImageData(0, 0, canvas.width, canvas.height);
        // record starting position
        start_x = ev.pageX - canvas.offsetLeft;
        start_y = ev.pageY - canvas.offsetTop;
    }
}
/**
 * Setup board environment
 */
function beforeDraw() {
    board.lineWidth = parseInt(brush_sz.value);
    board.strokeStyle = board.fillStyle = color_method.color();
    board.globalAlpha = parseFloat(trans_val.value) / 100;
    board.font = `${font_sz.value}px ${font.value}`;
}
/**
 * Draw a scratch (prepare to draw) by setting up our board
 */
function drawScratch(ev) {
    // cancel possible erase mode
    board.globalCompositeOperation = "source-over";
    board.lineJoin = 'miter'; // default curve behavior
    let cur_x = ev.pageX - canvas.offsetLeft, cur_y = ev.pageY - canvas.offsetTop;
    switch (mode) {
        case eraser.id:
            // set erase mode
            board.globalCompositeOperation = "destination-out";
            board.globalAlpha = 1.;
        // keep going
        case pencil.id:
            board.lineCap = 'round';
            board.lineTo(cur_x, cur_y);
            break;
        case "none":
        case textbox.id:
        case undo.id:
        case redo.id:
        case reset.id:
        case download.id:
        case upload.id:
            break;
        default: // for shapes
            board.putImageData(img_data, 0, 0);
            board.beginPath();
            switch (mode) {
                case line.id:
                    board.moveTo(start_x, start_y);
                    board.lineTo(cur_x, cur_y);
                    break;
                case circle.id:
                    let radius = Math.sqrt(Math.pow((cur_x - start_x) / 2, 2) +
                        Math.pow((cur_y - start_y) / 2, 2));
                    board.arc((cur_x + start_x) / 2, (cur_y + start_y) / 2, radius, 0, 2 * Math.PI);
                    break;
                case triangle.id:
                    board.lineJoin = 'round'; // better curve behavior for triangle
                    board.moveTo(cur_x, cur_y);
                    board.lineTo(start_x, cur_y);
                    board.lineTo((cur_x + start_x) / 2, start_y);
                    board.lineTo(cur_x, cur_y);
                    board.lineTo(start_x, cur_y);
                    break;
                case rectangle.id:
                    board.rect(start_x, start_y, cur_x - start_x, cur_y - start_y);
                    break;
                default: // unknown cases
                    console.log(`Unknown mode: ${mode}`);
                    return;
            }
            break;
    }
}
/**
 * Unleash draws set before according to current drawing method
 */
function drawUp() {
    let draw_method = tri_counter.get(mode);
    if (draw_method != null && draw_method.sp == 'solid') {
        board.fill(); // draw and fill surrounded space
    }
    else {
        board.stroke(); // draw
    }
}
function afterDraw(shot) {
    drawing = false;
    board.beginPath();
    if (shot)
        screenshot.shot();
}
/**
 * Will invoke afterDraw() after lost input focus
 */
function setupTextInput(ev) {
    let input = document.createElement('input');
    input.type = 'text';
    input.style.position = 'absolute';
    input.style.left = `${ev.pageX}px`;
    input.style.top = `${ev.pageY}px`;
    const check_and_destroy = () => {
        let should_shot = input.value != null && input.value !== '';
        if (should_shot) {
            beforeDraw();
            board.fillText(input.value, start_x, start_y);
        }
        afterDraw(should_shot);
        document.body.removeChild(input);
        mutex.unlock(); // unlock after destroy element
    };
    // unfocused
    input.onblur = check_and_destroy;
    input.onkeydown = (ev) => {
        if (ev.key == 'Enter') {
            check_and_destroy();
        }
    };
    document.body.appendChild(input);
    input.focus(); // force focus
}
function canvasSetup() {
    // set canvas
    canvas.width = window.innerWidth - canvas.offsetLeft;
    canvas.height = (window.innerHeight - canvas.offsetTop);
    // get context reference: board
    board = canvas.getContext("2d");
    // initialize screenshot for undo/redo
    screenshot = new Screenshot(board, 0, 0, canvas.width, canvas.height);
    drawing = false;
    canvas.onmousedown = (ev) => {
        if (ev.button != 0) { // not left button
            return;
        }
        initDraw(ev);
        beforeDraw();
    };
    canvas.onmousemove = (ev) => {
        if (!drawing) {
            return;
        }
        drawScratch(ev);
        drawUp();
    };
    canvas.onmouseup = (ev) => {
        if (!drawing) {
            return;
        }
        if (mode != textbox.id || !mutex.lock()) {
            drawUp();
            afterDraw(true);
        }
        else {
            setupTextInput(ev);
        }
    };
}
window.onload = () => {
    loadHtmlElements();
    initializeWidget();
    canvasSetup();
    setOnclickEvent();
    mode = 'none'; // mode: tool which is using
    color_method.assign('127', '127', '127');
};
