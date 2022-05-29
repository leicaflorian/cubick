const demoArray = [
  [0, 0, 0],
  [1, 1, 1],
  [2, 2, 2],
];

const demoRowArray = [
  [3, 3, 3],
  [4, 4, 4],
  [1, 1, 1],
  [5, 5, 5],
];

/**
 *
 * @param {[][]} toRotate
 * @param {"left"|"right"|"up"|"down"} direction
 * @returns
 */
function rotateArray(toRotate, direction) {
  // Left or up must create the same type of movement
  direction = ["left", "up"].includes(direction) ? "left" : "right";

  const rotated = [[], [], []];

  if (!toRotate) {
    return [];
  }

  for (let i = 0; i < toRotate.length; i++) {
    for (let j = 0; j < toRotate[i].length; j++) {
      const indexToRead = direction === "left" ? 2 - j : j;

      rotated[j][direction === "left" ? "push" : "unshift"](
        toRotate[i][indexToRead]
      );
    }
  }

  return rotated;
}

/**
 *
 * @param {[][]} toRotate
 * @param {"left"|"right"|"up"|"down"} direction
 * @returns
 */
function slideArray(toRotate, direction) {
  // Left or up must create the same type of movement
  direction = ["left", "up"].includes(direction) ? "left" : "right";

  const slided = [];
  const slicedPortion = toRotate.slice(
    direction === "left" ? 1 : 0,
    direction === "left" ? toRotate.length : toRotate.length - 1
  );

  slided.push(...slicedPortion);

  if (direction === "left") {
    slided.push(toRotate[0]);
  } else {
    slided.unshift(toRotate[toRotate.length - 1]);
  }

  return slided;
}

/**
 *
 * @param {number[]} facesToSlide
 * @param {number} faceIndex
 * @param {number[][][]} facesMatrix
 * @returns
 */
function getRow(facesToSlide, faceIndex, facesMatrix, rowIndex, direction) {
  return facesToSlide.map((face) => {
    let newRowIndex = rowIndex;

    if ([4, 5].includes(faceIndex)) {
      let toReturn = [];

      if (faceIndex === 4) {
        if ([1, 5].includes(face)) {
          if (rowIndex === 2) {
            newRowIndex = 0;
          } else if (rowIndex === 0) {
            newRowIndex = 2;
          }
        }
      } else if (faceIndex === 5) {
        if ([4, 3].includes(face)) {
          if (rowIndex === 2) {
            newRowIndex = 0;
          } else if (rowIndex === 0) {
            newRowIndex = 2;
          }
        }
      }

      if ([3, 1].includes(face)) {
        toReturn = facesMatrix[face].map((row) => row[newRowIndex]);
      } else {
        toReturn = facesMatrix[face][newRowIndex];
      }

      if ([4, 5].includes(faceIndex)) {
        if ([3, 1].includes(face) && direction === "right") {
          toReturn.reverse();
        } else if ([4, 5].includes(face) && direction === "left") {
          toReturn.reverse();
        }
      }

      return toReturn;
    } else {
      return facesMatrix[face][newRowIndex];
    }
  });
}

/**
 *
 * @param {number[]} facesToSlide
 * @param {number} faceIndex
 * @param {number[][][]} facesMatrix
 * @returns
 */
function getColumn(facesToSlide, faceIndex, facesMatrix, colIndex, direction) {
  return facesToSlide.map((face) => {
    const toReturn = [];

    let newColIndex = colIndex;

    if (faceIndex === 2 && face !== 2) {
      if (colIndex === 0) {
        newColIndex = 2;
      } else if (colIndex === 2) {
        newColIndex = 0;
      }
    } else if ([0, 4, 5].includes(faceIndex)) {
      if (face === 2) {
        if (colIndex === 0) {
          newColIndex = 2;
        } else if (colIndex === 2) {
          newColIndex = 0;
        }
      }
    }

    if ([1, 3].includes(faceIndex)) {
      if (faceIndex === 1) {
        if ([3, 4].includes(face)) {
          if (colIndex === 2) {
            newColIndex = 0;
          } else if (colIndex === 0) {
            newColIndex = 2;
          }
        }
      } else if (faceIndex === 3) {
        if ([5, 1].includes(face)) {
          if (colIndex === 2) {
            newColIndex = 0;
          } else if (colIndex === 0) {
            newColIndex = 2;
          }
        }
      }

      if ([4, 5].includes(face)) {
        toReturn.push(...facesMatrix[face][newColIndex]);
      } else {
        facesMatrix[face].forEach((row) => {
          toReturn.push(row[newColIndex]);
        });
      }

      if ([3, 1].includes(face) && direction === "right") {
        toReturn.reverse();
      } else if ([4, 5].includes(face) && direction === "left") {
        toReturn.reverse();
      }
    } else {
      facesMatrix[face].forEach((row) => {
        toReturn.push(row[newColIndex]);
      });
    }

    if ([4, 0, 5, 2].includes(faceIndex)) {
      if ([2, 5].includes(face) && direction === "right") {
        toReturn.reverse();
      } else if ([4, 2].includes(face) && direction === "left") {
        toReturn.reverse();
      }
    }

    return toReturn;
  });
}

/**
 * Get the index of the face that should rotate based on the face that is moving
 *
 * @param {number} faceIndex
 * @param {number} rowIndex
 * @returns {number}
 */
function getXFaceToRotateIndex(faceIndex, rowIndex) {
  let faceToRotate;

  if ([3, 0, 1, 2].includes(faceIndex)) {
    if (rowIndex === 0) {
      faceToRotate = 4;
    } else if (rowIndex === 2) {
      faceToRotate = 5;
    }
  } else if ([4].includes(faceIndex)) {
    if (rowIndex === 2) {
      faceToRotate = 0;
    } else if (rowIndex === 0) {
      faceToRotate = 2;
    }
  } else if ([5].includes(faceIndex)) {
    faceToRotate = rowIndex;
  }

  return faceToRotate;
}

/**
 * Get the index of the face that should rotate based on the face that is moving
 *
 * @param {number} faceIndex
 * @param {number} colIndex
 * @returns {number}
 */
function getYFaceToRotateIndex(faceIndex, colIndex) {
  let faceToRotate;

  if ([0, 4, 5].includes(faceIndex)) {
    if (colIndex === 0) {
      faceToRotate = 3;
    } else if (colIndex === 2) {
      faceToRotate = 1;
    }
  } else if ([2].includes(faceIndex)) {
    if (colIndex === 0) {
      faceToRotate = 1;
    } else if (colIndex === 2) {
      faceToRotate = 3;
    }
  } else if ([1].includes(faceIndex)) {
    if (colIndex === 2) {
      faceToRotate = 2;
    } else if (colIndex === 0) {
      faceToRotate = 0;
    }
  } else if ([3].includes(faceIndex)) {
    if (colIndex === 0) {
      faceToRotate = 2;
    } else if (colIndex === 2) {
      faceToRotate = 0;
    }
  }

  return faceToRotate;
}

/**
 *
 * @param {number[]} facesToSlide
 * @param {number} faceIndex
 * @param {number[][][]} facesMatrix
 * @param {number[][]} newRow
 * @returns
 */
function setRow(facesToSlide, faceIndex, facesMatrix, rowIndex, newRow) {
  facesToSlide.forEach((face, i) => {
    let newRowIndex = rowIndex;

    if ([4, 5].includes(faceIndex)) {
      if (faceIndex === 4) {
        if ([1, 5].includes(face)) {
          if (rowIndex === 2) {
            newRowIndex = 0;
          } else if (rowIndex === 0) {
            newRowIndex = 2;
          }
        }
      } else if (faceIndex === 5) {
        if ([4, 3].includes(face)) {
          if (rowIndex === 2) {
            newRowIndex = 0;
          } else if (rowIndex === 0) {
            newRowIndex = 2;
          }
        }
      }

      if ([3, 1].includes(face)) {
        return facesMatrix[face].forEach(
          (row, j) => (row[newRowIndex] = newRow[i][j])
        );
      } else {
        facesMatrix[face][newRowIndex] = newRow[i];
      }
    } else {
      facesMatrix[face][newRowIndex] = newRow[i];
    }
  });
}

function setColumn(facesToSlide, faceIndex, facesMatrix, colIndex, newCol) {
  facesToSlide.forEach((face, i) => {
    let newColIndex = colIndex;

    if (faceIndex === 2 && face !== 2) {
      if (colIndex === 0) {
        newColIndex = 2;
      } else if (colIndex === 2) {
        newColIndex = 0;
      }
    } else if ([0, 4, 5].includes(faceIndex)) {
      if (face === 2) {
        if (colIndex === 0) {
          newColIndex = 2;
        } else if (colIndex === 2) {
          newColIndex = 0;
        }
      }
    }

    if ([1, 3].includes(faceIndex)) {
      if (faceIndex === 1) {
        if ([3, 4].includes(face)) {
          if (colIndex === 2) {
            newColIndex = 0;
          } else if (colIndex === 0) {
            newColIndex = 2;
          }
        }
      } else if (faceIndex === 3) {
        if ([5, 1].includes(face)) {
          if (colIndex === 2) {
            newColIndex = 0;
          } else if (colIndex === 0) {
            newColIndex = 2;
          }
        }
      }

      if ([4, 5].includes(face)) {
        facesMatrix[face][newColIndex] = newCol[i];
      } else {
        facesMatrix[face].forEach((row, j) => {
          row[newColIndex] = newCol[i][j];
        });
      }
    } else {
      facesMatrix[face].forEach((row, j) => {
        row[newColIndex] = newCol[i][j];
      });
    }
  });
}
