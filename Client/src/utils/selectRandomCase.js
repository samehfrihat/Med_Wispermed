let previousOption = null;

export const TASK_CASES = {
  WisPerMid: {
    option: "WisPerMid",
    redirectUrl: "/",
  },
  Pubmed: {
    option: "Pubmed",
    redirectUrl: "/search/pubmed",
  },
};
const pickRandom = (value) => {
  const threshold = 0.5;
  if (value < threshold) {
    return TASK_CASES.WisPerMid;
  } else {
    return TASK_CASES.Pubmed;
  }
};
export const selectRandomCase = () => {
  let selectedOption;
  do {
    selectedOption = pickRandom(Math.random());
  } while (selectedOption === previousOption);

  previousOption = selectedOption;

  return selectedOption;
};
