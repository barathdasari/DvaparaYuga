// unions.js — Dvapara Yuga Lineage Cosmos v3
// Fields: id, partnerA, partnerB (null = svayambhu/unnamed), children[], type
// Types: marriage | niyoga | divine | yajna | svayambhu

const unions = [

// ── Gen 0-1 · Primordials ──────────────────────────────────────────────────
{
  id:"U-Atri-Anasuya",
  partnerA:"Atri", partnerB:"Anasuya",
  children:["Chandra"],
  type:"marriage"
},
{
  id:"U-Chandra-Tara",
  partnerA:"Chandra", partnerB:"Tara",
  children:["Budha"],
  type:"divine"
  // Illicit union that triggered the Tarakamaya celestial war
},

// ── Gen 2-4 · Early Lunar Kings ───────────────────────────────────────────
{
  id:"U-Budha-Ila",
  partnerA:"Budha", partnerB:"Ila",
  children:["Pururavas"],
  type:"marriage"
},
{
  id:"U-Pururavas-Urvashi",
  partnerA:"Pururavas", partnerB:"Urvashi",
  children:["Ayu"],
  type:"divine"
},
{
  id:"U-Ayu",
  partnerA:"Ayu", partnerB:null,
  children:["Nahusha"],
  type:"svayambhu"
},
{
  id:"U-Nahusha",
  partnerA:"Nahusha", partnerB:null,
  children:["Yayati"],
  type:"svayambhu"
},

// ── Gen 6-9 · Yayati Era ──────────────────────────────────────────────────
{
  id:"U-Yayati-Devayani",
  partnerA:"Yayati", partnerB:"Devayani",
  children:["Yadu"],
  type:"marriage"
},
{
  id:"U-Yayati-Sharmishtha",
  partnerA:"Yayati", partnerB:"Sharmishtha",
  children:["Puru"],
  type:"marriage"
},
{
  id:"U-Puru",
  partnerA:"Puru", partnerB:null,
  children:["Dushyanta"],
  type:"svayambhu"
  // Many generations compressed between Puru and Dushyanta
},
{
  id:"U-Yadu",
  partnerA:"Yadu", partnerB:null,
  children:["Shurasena"],
  type:"svayambhu"
  // Many Yadava generations compressed
},
{
  id:"U-Dushyanta-Shakuntala",
  partnerA:"Dushyanta", partnerB:"Shakuntala",
  children:["Bharata"],
  type:"marriage"
},
{
  id:"U-Bharata",
  partnerA:"Bharata", partnerB:null,
  children:["Kuru"],
  type:"svayambhu"
},
{
  id:"U-Kuru",
  partnerA:"Kuru", partnerB:null,
  children:["Pratipa"],
  type:"svayambhu"
},

// ── Gen 11-12 · Kuru Court Origins ────────────────────────────────────────
{
  id:"U-Pratipa-Sunanda",
  partnerA:"Pratipa", partnerB:"Sunanda",
  children:["Devapi","Bahlika","Shantanu"],
  type:"marriage"
},
{
  id:"U-Parashara-Satyavati",
  partnerA:"Parashara", partnerB:"Satyavati",
  children:["Vyasa"],
  type:"divine"
  // Sage union on river island; Satyavati's maidenhood restored after
},
{
  id:"U-Bharadwaja",
  partnerA:"Bharadwaja", partnerB:null,
  children:["Dronacharya"],
  type:"svayambhu"
  // Drona born in a vessel (drona) from sage's semen — no mother
},
{
  id:"U-Kripa-born",
  partnerA:"Bharadwaja", partnerB:null,
  children:["Kripacharya","Kripi"],
  type:"svayambhu"
  // Sharadvan's twins born from reeds; Bharadwaja raised them
},
{
  id:"U-Bahlika",
  partnerA:"Bahlika", partnerB:null,
  children:["Somadatta"],
  type:"svayambhu"
},
{
  id:"U-Somadatta",
  partnerA:"Somadatta", partnerB:null,
  children:["Bhuri","Bhurishravas"],
  type:"svayambhu"
},
{
  id:"U-Subala",
  partnerA:"Subala", partnerB:null,
  children:["Gandhari","Shakuni"],
  type:"svayambhu"
},
{
  id:"U-Shurasena",
  partnerA:"Shurasena", partnerB:null,
  children:["Vasudeva","Kunti"],
  type:"svayambhu"
},
{
  id:"U-Ugrasena",
  partnerA:"Ugrasena", partnerB:null,
  children:["Kamsa","Devaki"],
  type:"svayambhu"
},
{
  id:"U-Prashati",
  partnerA:"Prashati", partnerB:null,
  children:["Drupada"],
  type:"svayambhu"
},
{
  id:"U-Bhishmaka",
  partnerA:"Bhishmaka", partnerB:null,
  children:["Rukmini","Rukmi"],
  type:"svayambhu"
},

// ── Gen 12-13 · Shantanu Era ──────────────────────────────────────────────
{
  id:"U-Shantanu-Ganga",
  partnerA:"Shantanu", partnerB:"Ganga",
  children:["Bhishma"],
  type:"marriage"
},
{
  id:"U-Shantanu-Satyavati",
  partnerA:"Shantanu", partnerB:"Satyavati",
  children:["Chitrangada","Vichitravirya"],
  type:"marriage"
},

// ── Niyoga Unions · Vyasa fathering Kuru heirs ────────────────────────────
{
  id:"U-Vyasa-Ambika",
  partnerA:"Vyasa", partnerB:"Ambika",
  children:["Dhritarashtra"],
  type:"niyoga"
},
{
  id:"U-Vyasa-Ambalika",
  partnerA:"Vyasa", partnerB:"Ambalika",
  children:["Pandu"],
  type:"niyoga"
},
{
  id:"U-Vyasa-Parishrami",
  partnerA:"Vyasa", partnerB:"Parishrami",
  children:["Vidura"],
  type:"niyoga"
},

// ── Gen 13-14 · Yadava Marriages ──────────────────────────────────────────
{
  id:"U-Vasudeva-Devaki",
  partnerA:"Vasudeva", partnerB:"Devaki",
  children:["Krishna"],
  type:"marriage"
  // Balarama transferred to Rohini's womb — shown in separate union
},
{
  id:"U-Vasudeva-Rohini",
  partnerA:"Vasudeva", partnerB:"Rohini",
  children:["Balarama","Subhadra"],
  type:"marriage"
},
{
  id:"U-Dronacharya-Kripi",
  partnerA:"Dronacharya", partnerB:"Kripi",
  children:["Ashwatthama"],
  type:"marriage"
},

// ── Gen 14 · Dhritarashtra's Children ─────────────────────────────────────
{
  id:"U-Dhritarashtra-Gandhari",
  partnerA:"Dhritarashtra", partnerB:"Gandhari",
  children:["Duryodhana","Dushasana","Vikarna","Dushala"],
  type:"marriage"
  // 100 sons + 1 daughter total; key ones listed
},
{
  id:"U-Dhritarashtra-Sukhada",
  partnerA:"Dhritarashtra", partnerB:"Sukhada",
  children:["Yuyutsu"],
  type:"marriage"
},

// ── Gen 14 · Panchala Yajna ───────────────────────────────────────────────
{
  id:"U-Drupada-Yajna",
  partnerA:"Drupada", partnerB:null,
  children:["Dhrishtadyumna","Draupadi"],
  type:"yajna"
  // Born directly from the sacrificial fire to destroy Drona
},
{
  id:"U-Drupada-Shikhandi",
  partnerA:"Drupada", partnerB:null,
  children:["Shikhandi"],
  type:"svayambhu"
  // Shikhandi born biologically but mother unnamed
},

// ── Divine Births · Kunti's Mantras ──────────────────────────────────────
{
  id:"U-Kunti-Surya",
  partnerA:"Kunti", partnerB:"Surya",
  children:["Karna"],
  type:"divine"
  // Pre-wed; Karna set adrift on the Ganga
},
{
  id:"U-Kunti-Dharmaraja",
  partnerA:"Kunti", partnerB:"Dharmaraja",
  children:["Yudhishthira"],
  type:"divine"
},
{
  id:"U-Kunti-Vayu",
  partnerA:"Kunti", partnerB:"Vayu",
  children:["Bhima"],
  type:"divine"
},
{
  id:"U-Kunti-Indra",
  partnerA:"Kunti", partnerB:"Indra",
  children:["Arjuna"],
  type:"divine"
},
{
  id:"U-Madri-AshwiniKumaras",
  partnerA:"Madri", partnerB:"AshwiniKumaras",
  children:["Nakula","Sahadeva"],
  type:"divine"
},

// ── Gen 15 · War Generation Marriages ────────────────────────────────────
{
  id:"U-Krishna-Rukmini",
  partnerA:"Krishna", partnerB:"Rukmini",
  children:["Pradyumna"],
  type:"marriage"
},
{
  id:"U-Krishna-Jambavati",
  partnerA:"Krishna", partnerB:"Jambavati",
  children:["Samba"],
  type:"marriage"
},
{
  id:"U-Arjuna-Draupadi",
  partnerA:"Arjuna", partnerB:"Draupadi",
  children:["Upapandavas"],
  type:"marriage"
  // Represents all five Pandava unions with Draupadi; children are the Upapandavas
},
{
  id:"U-Arjuna-Subhadra",
  partnerA:"Arjuna", partnerB:"Subhadra",
  children:["Abhimanyu"],
  type:"marriage"
},
{
  id:"U-Arjuna-Ulupi",
  partnerA:"Arjuna", partnerB:"Ulupi",
  children:["Iravan"],
  type:"marriage"
},
{
  id:"U-Arjuna-Chitrangada2",
  partnerA:"Arjuna", partnerB:"Chitrangada2",
  children:["Babruvahana"],
  type:"marriage"
},
{
  id:"U-Bhima-Hidimbi",
  partnerA:"Bhima", partnerB:"Hidimbi",
  children:["Ghatotkacha"],
  type:"marriage"
},
{
  id:"U-Duryodhana-Bhanumati",
  partnerA:"Duryodhana", partnerB:"Bhanumati",
  children:["LakshmanaKumara","Lakshmana"],
  type:"marriage"
},
{
  id:"U-Karna-Vrushali",
  partnerA:"Karna", partnerB:"Vrushali",
  children:["Vrishasena","Vrishaketu"],
  type:"marriage"
},
{
  id:"U-Adhiratha-Radha",
  partnerA:"Adhiratha", partnerB:"Vrishaketu2",
  children:["Karna"],
  type:"marriage"
  // Adoptive union — Karna raised by Adhiratha & Radha
},
{
  id:"U-Shakuni",
  partnerA:"Shakuni", partnerB:null,
  children:["Uluka"],
  type:"svayambhu"
},
{
  id:"U-Virata-Sudeshna",
  partnerA:"Virata", partnerB:"Sudeshna",
  children:["Uttara","Uttarakumara"],
  type:"marriage"
},

// ── Gen 16-17 · Next Generation ───────────────────────────────────────────
{
  id:"U-Pradyumna-Rukmavati",
  partnerA:"Pradyumna", partnerB:"Rukmavati",
  children:["Aniruddha"],
  type:"marriage"
},
{
  id:"U-Abhimanyu-Uttara",
  partnerA:"Abhimanyu", partnerB:"Uttara",
  children:["Parikshit"],
  type:"marriage"
},
{
  id:"U-Parikshit-Madravati",
  partnerA:"Parikshit", partnerB:"Madravati",
  children:["Janamejaya"],
  type:"marriage"
},
{
  id:"U-Samba-Lakshmana",
  partnerA:"Samba", partnerB:"Lakshmana",
  children:[],
  type:"marriage"
  // Union of Yadava and Kaurava lines
},

]; // ═══ END OF UNION DATA ═══

// Build quick lookup maps for graph traversal
const unionMap   = Object.fromEntries(unions.map(u => [u.id, u]));
const parentOf   = {}; // childId → [unionId, ...]
const childrenOf = {}; // charId → [childId, ...]
const spouseOf   = {}; // charId → [spouseId, ...]

unions.forEach(u => {
  // children → parents map
  u.children.forEach(cid => {
    if (!parentOf[cid]) parentOf[cid] = [];
    parentOf[cid].push(u.id);
  });
  // char → children map
  [u.partnerA, u.partnerB].filter(Boolean).forEach(pid => {
    if (!childrenOf[pid]) childrenOf[pid] = [];
    u.children.forEach(cid => {
      if (!childrenOf[pid].includes(cid)) childrenOf[pid].push(cid);
    });
  });
  // spouse map
  if (u.partnerA && u.partnerB) {
    if (!spouseOf[u.partnerA]) spouseOf[u.partnerA] = [];
    if (!spouseOf[u.partnerB]) spouseOf[u.partnerB] = [];
    if (!spouseOf[u.partnerA].includes(u.partnerB)) spouseOf[u.partnerA].push(u.partnerB);
    if (!spouseOf[u.partnerB].includes(u.partnerA)) spouseOf[u.partnerB].push(u.partnerA);
  }
});
