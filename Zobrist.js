

export function getHash()
{
    fetch('baron30.bin')
    .then(response => response.arrayBuffer())
    .then(data => {
        const entrySize = 16;
        const dataView = new DataView(data);
        const numEntries = data.byteLength / entrySize;

        for (let i = 0; i < numEntries; i++) {
        const offset = i * entrySize;
        const entry = {};

        // Extract individual fields from the entry
        const key = dataView.getBigUint64(offset, true); // true indicates little-endian byte order
        const move = dataView.getUint16(offset + 8, true);
        const weight = dataView.getUint16(offset + 10, true);
        const learn = dataView.getUint32(offset + 12, true);
        
        // Add the extracted fields to the entry object
        entry.key = Number(key);
        entry.move = move;
        entry.weight = weight;
        entry.learn = learn;

        // Do something with the entry
        //console.log(entry);
        }
    })
    .catch(error => {
      console.error('Error fetching file:', error);
    });
  
  
 
}