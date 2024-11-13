export const Layouts = {
  lab1: {
    name: "CVR-215 RS LAB",
    rows: 5,
    seatsPerRow: 8,
    seatArrangement: [
      [1, 2, 3, 4, null, null, 5, 6, 7, 8],
      [9, 10, 11, 12, null, null, 13, 14, 15, 16],
      [null, null, null, null, null, null, null, null, null, null],
      [17, 18, 19, 20, null, null, 21, 22, 23, 24],
      [25, 26, 27, 28, null, null, 29, 30, 31, 32]
    ],
    teacherDesk: { row: 2, col: 5 },
    door: { row: 2, col: 0 }
  },
  lab2: {
    name: "CVR-212 MT LAB",
    rows: 4,
    seatsPerRow: 6,
    seatArrangement: [
      [1, 2, 3, null, null, 4, 5, 6],
      [7, 8, 9, null, null, 10, 11, 12],
      [13, 14, 15, null, null, 16, 17, 18],
      [19, 20, 21, null, null, 22, 23, 24]
    ],
    teacherDesk: { row: 1, col: 4 },
    door: { row: 3, col: 7 }
  }
};