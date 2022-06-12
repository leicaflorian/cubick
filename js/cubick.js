const colors = ["#B90000", "#009B48", "#FF5900", "#0045AD", "#FFD500", "white"];
const container = document.querySelector(".cube-container-flat");
/**
 * @type {HTMLElement}
 */
const container3d = document.querySelector(".cube");
const container3dScene = document.querySelector(".cube-3d-scene");
let activeCoords;

let mouseDown = false;
let initialMousePosition = { x: 0, y: 0 };
let initialCssProps = {
  x: 0,
  y: 0,
  z: 0,
  deg: 0,
};

const facesMatrix = [
  [
    // faccia 1 - red
    [0, 0, 0], // T
    [0, 0, 0], // C
    [0, 0, 0], // B
  ],
  [
    // faccia 2 - green
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ],
  [
    // faccia 3 - orange
    [2, 2, 2],
    [2, 2, 2],
    [2, 2, 2],
  ],
  [
    // faccia 4 - blue
    [3, 3, 3],
    [3, 3, 3],
    [3, 3, 3],
  ],
  [
    // faccia 5 - yellow
    [4, 4, 4],
    [4, 4, 4],
    [4, 4, 4],
  ],
  [
    // faccia 6 - white
    [5, 5, 5],
    [5, 5, 5],
    [5, 5, 5],
  ],
];

console.log("----------------------- original matrix -----------------------");
console.log(facesMatrix);
console.log("----------------------- original matrix -----------------------");

/**
 * Move a column on the Y axis
 * @param {"up"|"down"} direction
 * @param {0|1|2} colIndex
 */
function moveX(direction, rowIndex, faceIndex) {
  console.log("direction", direction, "row", rowIndex, "face", faceIndex);

  const facesToSlide = [4, 5].includes(faceIndex) ? [3, 4, 1, 5] : [3, 0, 1, 2];
  const faceToRotateIndex = getXFaceToRotateIndex(faceIndex, rowIndex);
  const currentRow = getRow(
    facesToSlide,
    faceIndex,
    facesMatrix,
    rowIndex,
    direction
  );
  const faceToRotate = facesMatrix[faceToRotateIndex];

  let directionToRotate = direction;

  // For face 4 and 2 the direction must be inverted
  if ([4, 2].includes(faceToRotateIndex)) {
    directionToRotate = direction === "left" ? "right" : "left";
  }

  const newFace = rotateArray(faceToRotate, directionToRotate);

  setRow(
    facesToSlide,
    faceIndex,
    facesMatrix,
    rowIndex,
    slideArray(currentRow, direction)
  );

  facesMatrix[faceToRotateIndex] = newFace;

  renderCube();
}

function moveY(direction, colIndex, faceIndex) {
  console.log("direction", direction, "col", colIndex, "face", faceIndex);

  direction = direction === "up" ? "left" : "right";

  if ([2, 3].includes(faceIndex)) {
    if (direction === "left") {
      direction = "right";
    } else {
      direction = "left";
    }
  }

  const facesToSlide = [3, 1].includes(faceIndex) ? [3, 4, 1, 5] : [4, 0, 5, 2];
  const faceToRotateIndex = getYFaceToRotateIndex(faceIndex, colIndex);
  const currentCol = getColumn(
    facesToSlide,
    faceIndex,
    facesMatrix,
    colIndex,
    direction
  );
  const faceToRotate = facesMatrix[faceToRotateIndex];
  let directionToRotate = direction;

  console.log("faceToRotate index", faceToRotateIndex);

  // For face 4 and 2 the direction must be inverted
  if ([3, 1].includes(faceIndex)) {
    if (faceIndex === 1 && colIndex === 2) {
      directionToRotate = direction === "left" ? "right" : "left";
    }
  }

  const newFace = rotateArray(faceToRotate, directionToRotate);

  setColumn(
    facesToSlide,
    faceIndex,
    facesMatrix,
    colIndex,
    slideArray(currentCol, direction)
  );

  facesMatrix[faceToRotateIndex] = newFace;

  renderCube();
}

function renderContainer(container) {
  // clear container
  container.innerHTML = "";

  // render faces
  facesMatrix.forEach((face, faceIndex) => {
    const faceContainer = document.createElement("div");
    faceContainer.classList.add("face");
    faceContainer.dataset.index = faceIndex;
    faceContainer.style.order = 1;

    if (faceIndex === 3) {
      faceContainer.style.order = 0;
    }

    if (faceIndex === 4) {
      faceContainer.classList.add("top");
    } else if (faceIndex === 5) {
      faceContainer.classList.add("bottom");
    }

    face.forEach((row, rowIndex) => {
      const rowContainer = document.createElement("div");
      rowContainer.classList.add("row");

      row.forEach((color, squareIndex) => {
        const squareContainer = document.createElement("div");
        squareContainer.classList.add("square");
        squareContainer.style.backgroundColor = colors[color];
        squareContainer.dataset.coords = `${faceIndex},${rowIndex},${squareIndex}`;
        squareContainer.innerHTML = `<span>${color}</span>`;
        // squareContainer.innerHTML = squareIndex
        // squareContainer.innerHTML = faceIndex;

        if (squareContainer.dataset.coords === activeCoords) {
          squareContainer.classList.add("active");
        }

        squareContainer.addEventListener("click", onSquareClick);

        rowContainer.appendChild(squareContainer);
      });

      faceContainer.appendChild(rowContainer);
    });

    container.appendChild(faceContainer);
  });
}

/**
 * @this {HTMLElement}
 */
function onSquareClick() {
  const activeSquares = document.querySelectorAll(
    `[data-coords="${activeCoords}"]`
  );
  const mustAdd = !this.classList.contains("active");

  activeCoords = undefined;
  activeSquares.forEach((square) => square.classList.remove("active"));

  if (mustAdd) {
    activeCoords = this.dataset.coords;

    const targetSquares = document.querySelectorAll(
      `[data-coords="${activeCoords}"]`
    );

    targetSquares.forEach((target) => target.classList.add("active"));
  }

  console.log(activeCoords);
}

function renderCube() {
  if (!window.document) {
    console.log(facesMatrix);

    return;
  }

  renderContainer(container);
  renderContainer(container3d);
}

function onMouseDown(e) {
  mouseDown = true;
  initialMousePosition = { x: e.clientX || e.touches[0].clientX, y: e.clientY || e.touches[0].clientY };
  initialCssProps = {
    x: +getComputedStyle(container3d)
      .getPropertyValue("--rotateX")
      .replace("deg", ""),
    y: +getComputedStyle(container3d)
      .getPropertyValue("--rotateY")
      .replace("deg", ""),
    z: +getComputedStyle(container3d).getPropertyValue("--rotateZ"),
    deg: +getComputedStyle(container3d)
      .getPropertyValue("--rotateDeg")
      .replace("deg", ""),
  };

  console.log(e);
}

function onMouseUp(e) {
  mouseDown = false;
}

function onMouseMove(e) {
  if (mouseDown) {
    e.preventDefault();
    
    const delta = {
      x: (e.clientX || e.touches[0].clientX) - initialMousePosition.x,
      y: (e.clientY || e.touches[0].clientY) - initialMousePosition.y,
      z: 0,
      deg: 0,
    };

    const finalCssProps = {
      x:
        delta.x >= 0
          ? initialCssProps.x + delta.x
          : initialCssProps.x - -delta.x,
      y: initialCssProps.y - delta.y,
    };

    if (finalCssProps.x > 360 || finalCssProps.x < -360) {
      finalCssProps.x = 0;
    }

    if (finalCssProps.y > 360 || finalCssProps.y < -360) {
      finalCssProps.y = 0;
    }

    container3d.style.setProperty("--rotateX", finalCssProps.x + "deg");
    container3d.style.setProperty("--rotateY", finalCssProps.y + "deg");
  }
}

/**
 * @param {KeyboardEvent} e
 */
window.addEventListener("keydown", (e) => {
  const key = e.key;
  const keyMap = {
    arrowUp: "ArrowUp",
    arrowDown: "ArrowDown",
    arrowLeft: "ArrowLeft",
    arrowRight: "ArrowRight",
  };

  if (Object.values(keyMap).includes(key)) {
    if (!activeCoords) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const activeFace = +activeCoords.split(",")[0];

    if (key === keyMap.arrowUp || key === keyMap.arrowDown) {
      const activeCol = activeCoords.split(",")[2];

      moveY(key === keyMap.arrowUp ? "up" : "down", +activeCol, activeFace);
    } else {
      const activeRow = activeCoords.split(",")[1];

      moveX(
        key === keyMap.arrowLeft ? "left" : "right",
        +activeRow,
        activeFace
      );
    }
  }
});

container3dScene.addEventListener("mousedown", onMouseDown);
container3dScene.addEventListener("touchstart", onMouseDown);
container3dScene.addEventListener("mouseup", onMouseUp);
container3dScene.addEventListener("touchend", onMouseUp);
container3dScene.addEventListener("mousemove", onMouseMove);
container3dScene.addEventListener("touchmove", onMouseMove);

renderCube();
