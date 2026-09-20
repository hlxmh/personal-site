import Splitting from "splitting";

class Cell {
  original: string;
  color: string | undefined;
  originalColor: string | undefined;

  constructor(
    readonly element: HTMLSpanElement,
    readonly position: number,
  ) {
    this.original = element.getAttribute("data-char") ?? "";
    this.color = this.originalColor =
      element.parentElement?.parentElement?.parentElement?.style.color;
    this.set("&nbsp;");
  }

  set(value: string) {
    this.element.innerHTML = value;
  }
}

class Line {
  cells: Cell[] = [];

  constructor(readonly position: number) {}
}

function splitIntoLines(element: HTMLDivElement) {
  const results = Splitting({ target: element, by: "lines" });
  results.forEach((result) => Splitting({ target: result.words }));

  return (results[0]?.lines ?? []).map((words, linePosition) => {
    const line = new Line(linePosition);
	let cellPosition = 0;
    line.cells = words.flatMap((word) =>
      [...word.querySelectorAll(".char")].map((character) =>
        new Cell(character as HTMLSpanElement, cellPosition++),
      ),
    );
    return line;
  });
}

/** Owns all timers and DOM mutations for the ASCII and track-info shuffle effects. */
export class TypeShuffle {
  private readonly lettersAndSymbols = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "!", "@", "#", "$", "&", "*", "(", ")", "-", "_", "+", "=", "/",
    "[", "]", "{", "}", ";", ":", "<", ">", ",", "0", "1", "2", "3",
    "4", "5", "6", "7", "8", "9",
  ];
  private lines: Line[];
  private timers = new Set<number>();
  private generation = 0;
  private destroyed = false;

  constructor(element: HTMLDivElement) {
    this.lines = splitIntoLines(element);
  }

  private schedule(callback: () => void, delay: number, generation: number) {
    const timer = window.setTimeout(() => {
      this.timers.delete(timer);
      if (!this.destroyed && generation === this.generation) callback();
    }, delay);
    this.timers.add(timer);
  }

  private beginTransition() {
    this.generation += 1;
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers.clear();
    return this.generation;
  }

  private randomCharacter() {
    return this.lettersAndSymbols[
      Math.floor(Math.random() * this.lettersAndSymbols.length)
    ];
  }

  private randomDelay(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.beginTransition();
    this.lines = [];
  }

  initTransition() {
    const generation = this.beginTransition();
    const iterations = 30;
    const loop = (cell: Cell, iteration = 0) => {
      cell.set(iteration >= iterations - 1 ? cell.original : this.randomCharacter());
      const nextIteration = iteration + 1;
      if (nextIteration < iterations) {
        this.schedule(() => loop(cell, nextIteration), 80, generation);
      }
    };

    this.lines.forEach((line) =>
      line.cells.forEach((cell) =>
        this.schedule(() => loop(cell), this.randomDelay(500, 20000), generation),
      ),
    );
  }

  initTransitionInfo() {
    if (!this.lines[0]?.cells[0]) return;
    const generation = this.beginTransition();
    const iterations = 5;
    const loop = (lineIndex: number, cellIndex: number, iteration = 0) => {
      const cell = this.lines[lineIndex]?.cells[cellIndex];
      if (!cell) return;
      if (iteration >= iterations - 1) {
        cell.set(cell.original);
        if (cellIndex < this.lines[lineIndex].cells.length - 1) loop(lineIndex, cellIndex + 1);
        else if (lineIndex < this.lines.length - 1) loop(lineIndex + 1, 0);
      } else {
        cell.set(this.randomCharacter());
      }
      const nextIteration = iteration + 1;
      if (nextIteration < iterations) {
        this.schedule(
          () => loop(lineIndex, cellIndex, nextIteration + this.randomDelay(0, 1)),
          40,
          generation,
        );
      }
    };
    loop(0, 0);
  }

  change(element: HTMLDivElement) {
    const nextLines = splitIntoLines(element);
    const generation = this.beginTransition();
    const iterations = 10;
    const loop = (line: Line, cell: Cell, iteration = 0) => {
      const nextCell = nextLines[line.position]?.cells[cell.position];
      if (!nextCell) return;
      if (iteration >= iterations - 1) {
        cell.set(nextCell.original);
        cell.color = nextCell.originalColor;
        cell.element.style.color = cell.color ?? "";
      } else {
        cell.set(this.randomCharacter());
        cell.element.style.color = Math.random() > 0.5
          ? nextCell.originalColor ?? cell.color ?? ""
          : cell.color ?? "";
      }
      const nextIteration = iteration + 1;
      if (nextIteration < iterations) {
        this.schedule(() => loop(line, cell, nextIteration), 80, generation);
      }
    };
    this.lines.forEach((line) =>
      line.cells.forEach((cell) =>
        this.schedule(() => loop(line, cell), this.randomDelay(500, 15000), generation),
      ),
    );
  }

  cleanTransition(callback: () => void) {
    if (!this.lines[0]?.cells[0]) {
      callback();
      return;
    }
    const generation = this.beginTransition();
    const iterations = 5;
    const loop = (lineIndex: number, cellIndex: number, iteration = 0) => {
      const cell = this.lines[lineIndex]?.cells[cellIndex];
      if (!cell) return;
      if (iteration === iterations - 1) {
        cell.set("&nbsp;");
        if (cellIndex < this.lines[lineIndex].cells.length - 1) loop(lineIndex, cellIndex + 1);
        else if (lineIndex < this.lines.length - 1) loop(lineIndex + 1, 0);
        else callback();
      } else {
        cell.set(this.randomCharacter());
      }
      const nextIteration = iteration + 1;
      if (nextIteration < iterations) {
        this.schedule(() => loop(lineIndex, cellIndex, nextIteration), 40, generation);
      }
    };
    loop(0, 0);
  }
}
