// const container = document.querySelector(".container");

const colors = ["#B90000", "#009B48", "#FF5900", "#0045AD", "#FFD500", "white"];
const container = document.querySelector(".cube-container-flat");
const container3d = document.querySelector(".cube");

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
 * Move a row on the X axis
 * @param {"right" | "left"} direction
 * @param {0|1|2} rowIndex
 */
function moveX(direction, rowIndex) {
  const facesToSlide = [3, 0, 1, 2];
  const faceToRotate = rowIndex === 0 ? 4 : 5;

  // validate given attributes
  if (
    !direction ||
    !["right", "left"].includes(direction) ||
    typeof rowIndex !== "number" ||
    ![0, 1, 2].includes(rowIndex)
  ) {
    return;
  }

  // Get values of current row
  const currentRow = facesToSlide.map(
    (faceIndex) => facesMatrix[faceIndex][rowIndex]
  );

  // Get values of current Top Face
  const currentFaceToRotate = facesMatrix[faceToRotate];

  // Create the newRow values by switching the position of the last element of the current row
  const newRow = [];

  // Based on the direction of the move,
  // we need to switch the position of the last element of the current row
  if (direction === "right") {
    newRow.push(
      currentRow[currentRow.length - 1],
      ...currentRow.slice(0, currentRow.length - 1)
    );
  } else {
    newRow.push(...currentRow.slice(1, currentRow.length), currentRow[0]);
  }

  // Calculate new top face content
  const newFaceToRotate = currentFaceToRotate.map((row, i) => {
    if (direction === "left") {
      return [
        currentFaceToRotate[0][2 - i],
        currentFaceToRotate[1][2 - i],
        currentFaceToRotate[2][2 - i],
      ];
    } else {
      return [
        currentFaceToRotate[2][i],
        currentFaceToRotate[1][i],
        currentFaceToRotate[0][i],
      ];
    }
  });

  // Set new values to the current row
  facesToSlide.forEach((faceIndex, i) => {
    facesMatrix[faceIndex][rowIndex] = newRow[i];
  });

  // console.log(rowIndex);

  // rotate top or bottom face only if moving top or bottom level
  if ([0, 2].includes(rowIndex)) {
    console.log(newFaceToRotate);

    // set new values to the current top face
    facesMatrix[faceToRotate] = newFaceToRotate;
  }

  renderCube();
}

/**
 * Move a column on the Y axis
 * @param {"up"|"down"} direction
 * @param {0|1|2} colIndex
 */
function moveY(direction, colIndex) {
  const facesToSlide = [4, 0, 5, 2];
  const faceToRotate = colIndex === 0 ? 3 : 1;

  // validate given attributes
  if (
    !direction ||
    !["up", "down"].includes(direction) ||
    typeof colIndex !== "number" ||
    ![0, 1, 2].includes(colIndex)
  ) {
    return;
  }

  // Get current col values
  const currentCol = facesToSlide.reduce((acc, faceIndex) => {
    const col = [];

    facesMatrix[faceIndex].forEach((row, j) => {
      col.push(row[colIndex]);
    });

    acc.push(col);

    return acc;
  }, []);

  // Get values of current Top Face
  const currentFaceToRotate = facesMatrix[faceToRotate];

  // Generate newColValues
  const newCol = [];

  // Based on the direction of the move,
  // we need to switch the position of the last element of the current row
  if (direction === "down") {
    newCol.push(
      currentCol[currentCol.length - 1],
      ...currentCol.slice(0, currentCol.length - 1)
    );
  } else {
    newCol.push(...currentCol.slice(1, currentCol.length), currentCol[0]);
  }

  // Calculate new top face content
  const newFaceToRotate = currentFaceToRotate.map((row, i) => {
    if (direction === "left") {
      return [
        currentFaceToRotate[0][2 - i],
        currentFaceToRotate[1][2 - i],
        currentFaceToRotate[2][2 - i],
      ];
    } else {
      return [
        currentFaceToRotate[2][i],
        currentFaceToRotate[1][i],
        currentFaceToRotate[0][i],
      ];
    }
  });

  // Set new values to the current row
  facesToSlide.forEach((faceIndex, i) => {
    // For each row in the face
    facesMatrix[faceIndex].forEach((row, j) => {
      facesMatrix[faceIndex][j][colIndex] = newCol[i][j];
    });
  });

  // rotate top or bottom face only if moving top or bottom level
  if ([0, 2].includes(colIndex)) {
    console.log(newFaceToRotate);

    // set new values to the current top face
    facesMatrix[faceToRotate] = newFaceToRotate;
  }

  // console.log(facesMatrix);
  renderCube();
}

function getLeftIndex(currentFace) {
  return currentFace === 0 ? 3 : currentFace - 1;
}

function getRightIndex(currentFace) {
  return currentFace === 3 ? 0 : currentFace + 1;
}

function getLeftFace(currentFace) {
  return facesMatrix[getLeftIndex(currentFace)];
}

function getRightFace(currentFace) {
  return facesMatrix[getRightIndex(currentFace)];
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

        rowContainer.appendChild(squareContainer);
      });

      faceContainer.appendChild(rowContainer);
    });

    container.appendChild(faceContainer);
  });
}

function renderCube() {
  if (!window.document) {
    console.log(facesMatrix);

    return;
  }

  renderContainer(container);
  renderContainer(container3d);
}

renderCube();
