fetch('src/OpeningBook/Games.txt')
  .then(response => response.text())
  .then(contents => {
    const lines = contents.split('\n');
    let arr = []
    lines.forEach((line) => {
      // Process each line here
      arr.push(line);
    });
    const first_el = arr[0];
    console.log(first_el)
    const moves = first_el.split(' ');

  })
  .catch(error => console.log(error));