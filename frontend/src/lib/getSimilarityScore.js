const array = ['โต๊ะ training', 'เตะ Kick', 'hand มือ', 'taining'];
const search = 'โต๊ะเทรนนิ่ง';

// ฟังก์ชันค้นหาคำที่คล้ายคำค้นหามากที่สุด
const searchResults = array
  .filter(item => item.toLowerCase().includes(search.toLowerCase())) // ค้นหาคำที่คล้าย
  .sort((a, b) => a.toLowerCase().indexOf(search.toLowerCase()) - b.toLowerCase().indexOf(search.toLowerCase())); // เรียงตามลำดับที่พบคำค้นหา

console.log(searchResults); // ผลลัพธ์ที่ได้
