export const classroomLayouts = {
    'CVR-215': {
      name: 'RS LAB CVR-215',
      rows: 4,
      seatsPerRow: 5,
      doorPosition: 'bottom-left',
      teacherTablePosition: 'top-center',
      tables: [
        { startRow: 2, startCol: 2, width: 2, height: 1 },
        { startRow: 4, startCol: 3, width: 2, height: 1 },
      ],
    },
    'CVR-210A': {
      name: 'CVR-210A',
      rows: 6,
      seatsPerRow: 8,
      doorPosition: 'bottom-center',
      teacherTablePosition: 'top-center',
    },
    'CVR-210B': {
      name: 'CVR-210B',
      rows: 3,
      seatsPerRow: 4,
      doorPosition: 'bottom-center',
      teacherTablePosition: 'bottom-right',
    },
    'CVR-208':{

        name: 'CVR-208',
        rows: 3,
        seatsPerRow: 3,
        doorPosition: 'bottom-center',
        teacherTablePosition:'top-center',
    },
    'CVR-212':{

        name: 'MT LAB CVR-212',
        rows: 4,
        seatsPerRow: 6,
        doorPosition: 'top-left',
        teacherTablePosition:'bottom-left',
    },
    'UCC LAB':{
        name: 'UCC LAB',
        rows: 3,
        seatsPerRow: 10,
        doorPosition: 'top-center',
        teacherTablePosition:'top-center',
    },
    // Add more classroom layouts as needed
  };