export const filterText = (data, InputArray, Output) => {
  if (!InputArray || InputArray.length === 0) {
    Output([]); // Clear if input array is empty
    return;
  }

  // แปลงคำที่ต้องการค้นหาเป็นอาร์เรย์ของคำ
  const searchTerms = InputArray.map(term => term.trim().toLowerCase()).filter(Boolean);

  // กรองข้อมูลโดยใช้แต่ละคำจาก InputArray
  let filteredData = data.filter((item) => {
    // ตรวจสอบว่ามีคำใดคำหนึ่งจาก searchTerms ที่ตรงกับข้อมูลใน item
    return searchTerms.every((term) => 
      Object.keys(item).some(
        (key) => 
          item[key] && item[key].toString().toLowerCase().includes(term)
      )
    );
  });

  if (filteredData.length > 0) {
    Output(filteredData); // Return the top matches
  } else {
    // ถ้าไม่มีคำตรง ให้หาคำที่ใกล้เคียงที่สุดโดยใช้ Levenshtein Distance
    const rankedMatches = data
      .map((item) => ({
        Product_name: `${item.Product_name}`,
        Product_type: `${item.Product_type}`,
        Product_type_name: `${item.Product_type_name}`,
        foot: `${item.foot}`,
        frame: `${item.frame}`,
        hand: `${item.hand}`,
        Description: `${item.Description}`,
        Backrest: `${item.Backrest}`,
        Product_Path_img: `${item.Product_Path_img}`,
        // คำนวณ Levenshtein Distance ระหว่างคำใน searchTerms กับคำที่ใน item
        distance: searchTerms.reduce((acc, term) => {
          return acc + levenshteinDistance(term, `${item.Product_name} ${item.Product_type} ${item.Product_type_name} ${item.foot} ${item.frame} ${item.hand} ${item.Description} ${item.Backrest}`);
        }, 0)
      }))
      .sort((a, b) => a.distance - b.distance) // Sort by lowest distance

    Output(rankedMatches); // Return top matches
  }
};

export const levenshteinDistance = (a, b) => {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0
    )
  );  

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] =
        a[i - 1] === b[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]) + 1;
    }
  }

  return matrix[a.length][b.length];
};