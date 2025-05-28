// Define a mapping from types to colors
const typeToColor = {
  Disease: "#7aecec",
  Drug: "#bfeeb7",
  Species: "#feca74",
  HLA: "#ff9561",
  Gene: "#aa9cfc",
  CellLine: "#c887fb",
};

// Function to match entities in the text
export function matchEntitiesInText(conceptsArray, highlightedText, startsOn) {
  let replacmentPointer = 0;
  const matchedEntities = [];

  const baseText = highlightedText;

  conceptsArray.forEach((concept) => {
    let { start, end, entity, type } = concept;

    if (start - startsOn < 0) {
      console.log("SKIPPED", entity);
      return;
    } else {
      start -= startsOn;
      end -= startsOn;
    }
    const extractedText = highlightedText.substring(
      start + replacmentPointer,
      end + replacmentPointer
    );

    const color = typeToColor[type] || "#7aecec";

    // console.log('extractedText' ,extractedText)

    if (!extractedText) {
      return;
    }else{

         const replacement = `<span class="highlighted" style=" background-color: ${color};">${extractedText} </span>
            <span class="highlighted-type" style=" background-color: ${color};">${type}</span>`;

    highlightedText =
      highlightedText.substring(0, start + replacmentPointer) +
      replacement +
      highlightedText.substring(
        start + replacmentPointer + (replacement.length - 1)
      );


    replacmentPointer += replacement.length - extractedText.length;

    matchedEntities.push({ ...concept, extractedText });

    }

 
  });

  return { text: highlightedText, matchedEntities };
}
