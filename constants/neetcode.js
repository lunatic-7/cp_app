export const ROADMAP_NODES = [
  { name: "Arrays & Hashing", x: 350, y: 30 },
  { name: "Two Pointers", x: 230, y: 145 },
  { name: "Stack", x: 480, y: 145 },
  { name: "Binary Search", x: 70, y: 275 },
  { name: "Sliding Window", x: 270, y: 275 },
  { name: "Linked List", x: 500, y: 275 },
  { name: "Trees", x: 350, y: 410 },
  { name: "Tries", x: 100, y: 550 },
  { name: "Heap / Priority Queue", x: 285, y: 635 },
  { name: "Backtracking", x: 520, y: 550 },
  { name: "Intervals", x: 15, y: 790 },
  { name: "Greedy", x: 185, y: 855 },
  { name: "Advanced Graphs", x: 350, y: 825 },
  { name: "Graphs", x: 500, y: 690 },
  { name: "1-D Dynamic Programming", x: 680, y: 650 },
  { name: "2-D Dynamic Programming", x: 560, y: 850 },
  { name: "Bit Manipulation", x: 735, y: 850 },
  { name: "Math & Geometry", x: 675, y: 1010 },
];

export const ROADMAP_EDGES = [
  ["Arrays & Hashing", "Two Pointers"], ["Arrays & Hashing", "Stack"],
  ["Two Pointers", "Binary Search"], ["Two Pointers", "Sliding Window"], ["Two Pointers", "Linked List"],
  ["Binary Search", "Trees"], ["Linked List", "Trees"],
  ["Trees", "Tries"], ["Trees", "Heap / Priority Queue"], ["Trees", "Backtracking"],
  ["Heap / Priority Queue", "Intervals"], ["Heap / Priority Queue", "Greedy"], ["Heap / Priority Queue", "Advanced Graphs"],
  ["Backtracking", "Graphs"], ["Backtracking", "1-D Dynamic Programming"],
  ["Graphs", "Advanced Graphs"], ["Graphs", "2-D Dynamic Programming"],
  ["1-D Dynamic Programming", "2-D Dynamic Programming"], ["1-D Dynamic Programming", "Bit Manipulation"],
  ["2-D Dynamic Programming", "Math & Geometry"], ["Bit Manipulation", "Math & Geometry"],
];

export const PROGRESS_KEY = "neetcode250:completed";
export const noteKey = (slug) => `neetcode250:note:${slug}`;
