// Full scripture book mapping and parser
const scriptureBooks = {

  ot: {
    "Genesis":"gen","Exodus":"ex","Leviticus":"lev","Numbers":"num","Deuteronomy":"deut",
    "Joshua":"josh","Judges":"judg","Ruth":"ruth","1 Samuel":"1-sam","2 Samuel":"2-sam",
    "1 Kings":"1-kgs","2 Kings":"2-kgs","1 Chronicles":"1-chr","2 Chronicles":"2-chr",
    "Ezra":"ezra","Nehemiah":"neh","Esther":"esth","Job":"job","Psalms":"ps","Proverbs":"prov",
    "Ecclesiastes":"eccl","Song of Solomon":"song","Isaiah":"isa","Jeremiah":"jer",
    "Lamentations":"lam","Ezekiel":"ezek","Daniel":"dan","Hosea":"hos","Joel":"joel",
    "Amos":"amos","Obadiah":"obad","Jonah":"jonah","Micah":"mic","Nahum":"nah","Habakkuk":"hab",
    "Zephaniah":"zeph","Haggai":"hag","Zechariah":"zech","Malachi":"mal"
  },

  nt: {
    "Matthew":"matt","Mark":"mark","Luke":"luke","John":"john","Acts":"acts",
    "Romans":"rom","1 Corinthians":"1-cor","2 Corinthians":"2-cor","Galatians":"gal",
    "Ephesians":"eph","Philippians":"phil","Colossians":"col","1 Thessalonians":"1-thess",
    "2 Thessalonians":"2-thess","1 Timothy":"1-tim","2 Timothy":"2-tim","Titus":"titus",
    "Philemon":"philem","Hebrews":"heb","James":"jas","1 Peter":"1-pet","2 Peter":"2-pet",
    "1 John":"1-jn","2 John":"2-jn","3 John":"3-jn","Jude":"jude","Revelation":"rev"
  },

  bofm: {
    "1 Nephi":"1-ne","2 Nephi":"2-ne","Jacob":"jacob","Enos":"enos","Jarom":"jarom","Omni":"omni",
    "Words of Mormon":"w-of-m","Mosiah":"mos","Alma":"alma","Helaman":"hel","3 Nephi":"3-ne",
    "4 Nephi":"4-ne","Mormon":"morm","Ether":"ether","Moroni":"moro"
  },

  dc: {
    "D&C":"dc"
  },

  pgp: {
    "Moses":"mos","Abraham":"abr","Joseph Smith—Matthew":"js-m","Joseph Smith—History":"js-h",
    "Articles of Faith":"a-of-f"
  }

};

// Parser function
function generateScriptureUrl(reference) {
  reference = reference.trim();

  // Special case: D&C
  const dcMatch = reference.match(/D\.?&?C\.?\s*(\d+)[:|\s](\d+)/i);
  if (dcMatch) {
    const chapter = dcMatch[1];
    const verse = dcMatch[2];
    return `https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/${chapter}?lang=eng&id=p${verse}#p${verse}`;
  }

  // Generic match: Book Chapter:Verse
  const genericMatch = reference.match(/^([1-4]?\s?\w[\w\s—\-']*)\s+(\d+)[:|\s](\d+)$/);
  if (!genericMatch) return null;

  let book = genericMatch[1].trim();
  let chapter = genericMatch[2];
  let verse = genericMatch[3];

  let section = null;
  let bookAbbrev = null;

  for (let sec of ["ot","nt","bofm","pgp"]) {
    if (scriptureBooks[sec][book]) {
      section = sec;
      bookAbbrev = scriptureBooks[sec][book];
      break;
    }
  }

  if (!section) return null;

  return `https://www.churchofjesuschrist.org/study/scriptures/${section}/${bookAbbrev}/${chapter}?lang=eng&id=p${verse}#p${verse}`;
}

// Panel loads and requests scripture from background
window.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.sendMessage({ action: "getScripture" }, (response) => {
    if (!response || !response.ref) return;

    const url = generateScriptureUrl(response.ref);

    // Fallback if parser failed
    document.getElementById("scriptureFrame").src =
      url || "https://www.churchofjesuschrist.org/study/scriptures";
  });
});