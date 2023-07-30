import { useEffect, useState } from "react";

function App() {
  const [WIDTH, setWidth] = useState(300);
  const [GAP, setGap] = useState(3);
  const [CELLS_PER_THIRD, setCellsPerThird] = useState(4);
  const [color, setColor] = useState("#a855f7"); // Set the default color value
  const [borderRadius, setBorderRadius] = useState(3);
  const [scromble, setScromble] = useState(0.1);
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [, setStr] = useState(
    btoa(
      Array([(CELLS_PER_THIRD * 3) ** 2])
        .map(() => 0)
        .join("")
    )
  );

  // don't change this?
  const THIRD = 3;

  const WIDTH_PER_CELL = WIDTH / (THIRD * CELLS_PER_THIRD);
  const ROWS = WIDTH / WIDTH_PER_CELL;
  const INNER_WIDTH = WIDTH_PER_CELL - GAP - GAP;

  function drawGrid(ctx: CanvasRenderingContext2D) {
    // draw background
    ctx.beginPath();
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, WIDTH, WIDTH);

    // draw center square
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;

    ctx.beginPath();
    ctx.roundRect(
      WIDTH / 3 + GAP,
      WIDTH / 3 + GAP,
      WIDTH / 3 - GAP - GAP,
      WIDTH / 3 - GAP - GAP,
      borderRadius * CELLS_PER_THIRD * 2
    );
    ctx.stroke();

    const binArr = [];

    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < ROWS; j++) {
        if (
          i * WIDTH_PER_CELL + WIDTH_PER_CELL <= WIDTH / 3 ||
          i * WIDTH_PER_CELL >= WIDTH * (2 / 3) ||
          j * WIDTH_PER_CELL + WIDTH_PER_CELL <= WIDTH / 3 ||
          j * WIDTH_PER_CELL >= WIDTH * (2 / 3)
        ) {
          if (Math.random() < scromble) {
            binArr[i * 10 + j] = 0;
            continue;
          }

          binArr[i * 10 + j] = 1;

          // outline

          // ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)';
          // ctx.beginPath();
          // ctx.roundRect(
          //   i * WIDTH_PER_CELL + GAP,
          //   j * WIDTH_PER_CELL + GAP,
          //   WIDTH_PER_CELL - GAP - GAP,
          //   WIDTH_PER_CELL - GAP - GAP,
          //   5
          // );
          // ctx.stroke();

          // actual
          ctx.strokeStyle = color;
          ctx.lineWidth = strokeWidth;

          ctx.beginPath();
          ctx.roundRect(
            i * WIDTH_PER_CELL + GAP + getOffset(i),
            j * WIDTH_PER_CELL + GAP + getOffset(j),
            INNER_WIDTH - getOffsetPost(i),
            INNER_WIDTH - getOffsetPost(j),
            borderRadius
          );
          ctx.stroke();
        }
      }
    }

    setStr(binaryToBase64(binArr));
  }
  function binaryToBase64(binaryArray: Array<number>): string {
    // Convert binary array to a string
    const binaryString = String.fromCharCode.apply(null, binaryArray);

    // Convert the string to Base64
    return btoa(binaryString);
  }

  useEffect(() => {
    const c = document.getElementById("myCanvas") as HTMLCanvasElement;
    if (!c) {
      return;
    }

    const ctx = c.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, WIDTH, WIDTH);

    drawGrid(ctx);
  }, [WIDTH, CELLS_PER_THIRD, GAP, color, borderRadius, scromble, strokeWidth]);

  // gets the pixel x/y to subtract from each grid's start position
  function getOffset(cellIteration: number) {
    if (cellIteration * WIDTH_PER_CELL < WIDTH / 3) {
      return (
        INNER_WIDTH - INNER_WIDTH * ((cellIteration + 1) / CELLS_PER_THIRD)
      );
    }

    return 0;
  }

  // gets the pixel width/height to subtract from each rectangle's start position
  function getOffsetPost(cellIteration: number) {
    if (cellIteration * WIDTH_PER_CELL < WIDTH / 3) {
      return (
        ((-1 / CELLS_PER_THIRD) * cellIteration +
          (CELLS_PER_THIRD - 1) / CELLS_PER_THIRD) *
        INNER_WIDTH
      );
    }

    if (cellIteration * WIDTH_PER_CELL > WIDTH * (2 / 3)) {
      return (
        INNER_WIDTH - INNER_WIDTH * ((ROWS % cellIteration) / CELLS_PER_THIRD)
      );
    }

    return 0;
  }

  function save() {
    const c = document.getElementById("myCanvas") as HTMLCanvasElement;
    if (!c) {
      return;
    }

    const link = document.getElementById("link");

    if (!link) {
      return;
    }

    link.setAttribute(
      "download",
      (Math.random() * 2).toString().replace(".", "") + ".png"
    );
    link.setAttribute(
      "href",
      c.toDataURL("image/png").replace("image/png", "image/octet-stream")
    );
    link.click();
  }

  return (
    <div
      className="w-screen min-h-screen p-4"
      style={{ backgroundColor: color }}
    >
      <div className="bg-white rounded-lg flex flex-col md:flex-row justify-center items-center relative shadow-sm p-6">
        <div className="m-0 lg:mr-8 max-w-[600px] flex items-center justify-center min-w-min">
          <canvas
            id="myCanvas"
            width={WIDTH}
            height={WIDTH}
            style={{
              // margin: "2rem",
              outline: `${strokeWidth}px solid ` + color,
              borderRadius: borderRadius * 4,
            }}
            className="mb-8"
          ></canvas>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-2 gap-4 min-w-min">
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="widthSlider"
            >
              Width: {WIDTH}
            </label>
            <input
              style={{ accentColor: color }}
              type="range"
              id="widthSlider"
              className="w-full"
              min="200"
              max="800"
              step="10"
              value={WIDTH}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="GAPSlider"
            >
              Gap: {GAP}
            </label>
            <input
              style={{ accentColor: color }}
              type="range"
              id="GAPSlider"
              className="w-full"
              min="0"
              max="10"
              step="1"
              value={GAP}
              onChange={(e) => setGap(Number(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="CELLS_PER_THIRDSlider"
            >
              Cells Per Third: {CELLS_PER_THIRD}
            </label>
            <input
              style={{ accentColor: color }}
              type="range"
              id="CELLS_PER_THIRDSlider"
              className="w-full"
              min="2"
              max="6"
              step="1"
              value={CELLS_PER_THIRD}
              onChange={(e) => setCellsPerThird(Number(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="colorPicker"
            >
              Color:
            </label>
            <input
              style={{ accentColor: color }}
              type="color"
              id="colorPicker"
              className="w-full"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="borderRadius"
            >
              Border Radius: {borderRadius}
            </label>
            <input
              style={{ accentColor: color }}
              type="range"
              id="borderRadius"
              className="w-full"
              min="0"
              max="20"
              step="1"
              value={borderRadius}
              onChange={(e) => setBorderRadius(Number(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="strokeWidth"
            >
              Stroke Width: {strokeWidth}
            </label>
            <input
              style={{ accentColor: color }}
              type="range"
              id="strokeWidth"
              className="w-full"
              min="1"
              max="4"
              step="1"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="scromble"
            >
              scromble: {scromble}
            </label>
            <input
              style={{ accentColor: color }}
              type="range"
              id="scromble"
              className="w-full"
              min="0"
              max="0.9"
              step="0.1"
              value={scromble}
              onChange={(e) => setScromble(Number(e.target.value))}
            />
          </div>
          <button
            onClick={save}
            style={{ backgroundColor: color }}
            className="cursor-pointer rounded p-1 text-white px-4 tracking-wide h-10 place-items-end"
          >
            save
          </button>
        </div>
        {/* <pre>{str}</pre> */}
      </div>
      <a id="link"></a>
    </div>
  );
}

export default App;
