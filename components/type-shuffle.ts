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

type TargetCell = {
  original: string;
  originalColor: string | undefined;
};

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

function parseTargetLines(element: HTMLDivElement) {
  const lines: TargetCell[][] = [[]];

  const visit = (node: Node, inheritedColor?: string) => {
    if (node.nodeType === Node.TEXT_NODE) {
      for (const character of node.textContent ?? "") {
        lines.at(-1)?.push({
          original: character,
          originalColor: inheritedColor,
        });
      }
      return;
    }

    if (!(node instanceof HTMLElement)) return;
    if (node.tagName === "BR") {
      lines.push([]);
      return;
    }

    const color = node.style.color || inheritedColor;
    node.childNodes.forEach((child) => visit(child, color));
  };

  element.childNodes.forEach((child) => visit(child));
  return lines;
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
  private animationFrame: number | undefined;
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
    if (this.animationFrame !== undefined) {
      window.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
    return this.generation;
  }

  private runBatchedTransition<T>(
    items: T[],
    iterations: number,
    interval: number,
    minDelay: number,
    maxDelay: number,
    render: (item: T, iteration: number) => void,
  ) {
    const generation = this.beginTransition();
    const entries = items.map((item) => ({
      item,
      delay: this.randomDelay(minDelay, maxDelay),
      iteration: -1,
    }));
    const startedAt = window.performance.now();

    const tick = (now: number) => {
      if (this.destroyed || generation !== this.generation) return;

      let hasPendingEntries = false;
      entries.forEach((entry) => {
        const elapsed = now - startedAt - entry.delay;
        if (elapsed < 0) {
          hasPendingEntries = true;
          return;
        }

        const iteration = Math.min(
          iterations - 1,
          Math.floor(elapsed / interval),
        );
        if (iteration !== entry.iteration) {
          render(entry.item, iteration);
          entry.iteration = iteration;
        }
        if (iteration < iterations - 1) hasPendingEntries = true;
      });

      if (hasPendingEntries) {
        this.animationFrame = window.requestAnimationFrame(tick);
      } else {
        this.animationFrame = undefined;
      }
    };

    this.animationFrame = window.requestAnimationFrame(tick);
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
    const iterations = 10;
    this.runBatchedTransition(
      this.lines.flatMap((line) => line.cells),
      iterations,
      50,
      100,
      2500,
      (cell, iteration) => {
        cell.set(
          iteration >= iterations - 1 ? cell.original : this.randomCharacter(),
        );
      },
    );
  }

  initTransitionInfo() {
    if (!this.lines[0]?.cells[0]) return;
    const generation = this.beginTransition();
    const iterations = 4;
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
    const nextLines = parseTargetLines(element);
    const iterations = 10;
    const cells = this.lines.flatMap((line) =>
      line.cells.flatMap((cell) => {
        const nextCell = nextLines[line.position]?.[cell.position];
        return nextCell ? [{ cell, nextCell }] : [];
      }),
    );

    this.runBatchedTransition(
      cells,
      iterations,
      50,
      100,
      2000,
      ({ cell, nextCell }, iteration) => {
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
      },
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
