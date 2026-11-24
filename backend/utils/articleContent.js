
const WORD_LIMIT = 500;

const getWords = (text = "") => {
  return String(text).trim().split(/\s+/).filter(Boolean);
};

const countWords = (text = "") => getWords(text).length;

const sliceTextByWords = (text = "", start, end) => {
  return getWords(text).slice(start, end).join(" ");
};

const getArticleUnits = (article) => {
  const units = [];

  (article.introductionParagraphs || []).forEach((text, index) => {
    units.push({
      type: "intro",
      index,
      text: text || "",
      words: countWords(text),
    });
  });

  (article.contentBlocks || []).forEach((block, index) => {
    const plainBlock = block.toObject?.() || block;

    if (plainBlock.type === "image") {
      units.push({
        type: "image",
        index,
        block: plainBlock,
        words: 0,
      });

      return;
    }

    if (plainBlock.type === "bulletList") {
      (plainBlock.items || []).forEach((item, itemIndex) => {
        units.push({
          type: "bullet",
          index,
          itemIndex,
          text: item || "",
          block: plainBlock,
          words: countWords(item),
        });
      });

      return;
    }

    units.push({
      type: "blockText",
      index,
      block: plainBlock,
      text: plainBlock.text || "",
      words: countWords(plainBlock.text),
    });
  });

  (article.closingParagraphs || []).forEach((text, index) => {
    units.push({
      type: "closing",
      index,
      text: text || "",
      words: countWords(text),
    });
  });

  (article.closingBullets || []).forEach((text, index) => {
    units.push({
      type: "closingBullet",
      index,
      text: text || "",
      words: countWords(text),
    });
  });

  return units;
};

export const getArticleWordCount = (article) => {
  return getArticleUnits(article).reduce(
    (total, unit) => total + unit.words,
    0
  );
};

export const getArticleSegment = (article, segment = 1) => {
  const safeSegment = Math.max(
    1,
    Math.min(2, Number(segment) || 1)
  );

// Segment 1 = first 500 words
// Segment 2 = first 1000 words (cumulative)
const start = 0;
const end = safeSegment * WORD_LIMIT;

  const units = getArticleUnits(article);

  let currentWord = 0;

  const introductionParagraphs = [];
  const contentBlocks = [];
  const closingParagraphs = [];
  const closingBullets = [];

  // Keeps original content block order.
  const blockMap = new Map();

  const addBlock = (index, block, type) => {
    if (!blockMap.has(index)) {
      const newBlock = { ...block };

      if (type === "bulletList") {
        newBlock.items = [];
      }

      if (type !== "image") {
        newBlock.text = newBlock.text || "";
      }

      blockMap.set(index, newBlock);
    }

    return blockMap.get(index);
  };

  units.forEach((unit) => {
    if (unit.type === "image") {
      // Images at the exact segment boundary belong to
      // the next segment, not the previous segment.
      if (currentWord >= start && currentWord < end) {
        blockMap.set(unit.index, { ...unit.block });
      }

      return;
    }

    const unitStart = currentWord;
    const unitEnd = currentWord + unit.words;

    const overlapStart = Math.max(unitStart, start);
    const overlapEnd = Math.min(unitEnd, end);

    if (overlapStart < overlapEnd) {
      const localStart = overlapStart - unitStart;
      const localEnd = overlapEnd - unitStart;

      const slicedText = sliceTextByWords(
        unit.text,
        localStart,
        localEnd
      );

      if (unit.type === "intro") {
        introductionParagraphs.push(slicedText);
      }

      if (unit.type === "closing") {
        closingParagraphs.push(slicedText);
      }

      if (unit.type === "closingBullet") {
        closingBullets.push(slicedText);
      }

      if (unit.type === "blockText") {
        const target = addBlock(
          unit.index,
          unit.block,
          "text"
        );

        target.text = [
          target.text,
          slicedText,
        ].filter(Boolean).join(" ");
      }

      if (unit.type === "bullet") {
        const target = addBlock(
          unit.index,
          unit.block,
          "bulletList"
        );

        target.items.push(slicedText);
      }
    }

    currentWord = unitEnd;
  });

  // Map preserves insertion order of original block indexes.
  blockMap.forEach((block) => {
    contentBlocks.push(block);
  });

  const articleObject = article.toObject?.() || { ...article };

  const result = {
    ...articleObject,
    introductionParagraphs,
    contentBlocks,
    closingParagraphs,
    closingBullets,
  };

  // Never expose legacy unrestricted full-content fields.
  delete result.introduction;
  delete result.sections;

  const totalWords = getArticleWordCount(article);

  return {
    article: result,
    totalWords,
    hasMore: totalWords > end,
    hasSecondSegment: totalWords > WORD_LIMIT,
  };
};

export const getPublicArticleMetadata = (article) => {
  const result = article.toObject?.() || { ...article };

  delete result.introductionParagraphs;
  delete result.contentBlocks;
  delete result.closingParagraphs;
  delete result.closingBullets;
  delete result.introduction;
  delete result.sections;

  return result;
};
