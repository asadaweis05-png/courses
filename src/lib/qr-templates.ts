export type QrCategory = 'romantic' | 'birthday' | 'apology' | 'friendship' | 'casual' | 'eid' | 'motivational';

export interface QrTemplate {
  id: string;
  text: string;
  isPremium?: boolean;
}

export interface QrCategoryInfo {
  key: QrCategory;
  label: string;
  labelSo: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
}

export const CATEGORIES: QrCategoryInfo[] = [
  { key: 'romantic', label: 'Romantic', labelSo: 'Jacayl', icon: '💕', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)', description: 'Fariimo jacayl oo qalbiga taabta' },
  { key: 'birthday', label: 'Birthday', labelSo: 'Dhalasho', icon: '🎂', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', description: 'Hambalyo dhalasho oo xiiso badan' },
  { key: 'apology', label: 'Apology', labelSo: 'Raali Galin', icon: '🙏', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)', description: 'Erey raali-galin ah oo daacad ah' },
  { key: 'friendship', label: 'Friendship', labelSo: 'Saaxiibtinimo', icon: '🤝', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #0ea5e9)', description: 'U sheeg saaxiibkaaga qiimaha uu kuu leeyahay' },
  { key: 'casual', label: 'Casual', labelSo: 'Salaan', icon: '👋', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #34d399)', description: 'Salaan fudud oo wanaagsan' },
  { key: 'eid', label: 'Eid / Islamic', labelSo: 'Ciid / Diini', icon: '🌙', color: '#a78bfa', gradient: 'linear-gradient(135deg, #a78bfa, #c084fc)', description: 'Hambalyo ciid iyo ducooyin' },
  { key: 'motivational', label: 'Motivational', labelSo: 'Dhiiri Galin', icon: '💪', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #fb923c)', description: 'Erey dhiiri-galin ah oo xoog siiya' },
];

export const TEMPLATES: Record<QrCategory, QrTemplate[]> = {
  romantic: [
    { id: 'r1', text: 'Adiga waxaad tahay qofka qalbigayga degan, nolosheyda macno siiyay. Mar walba waan ku jeclaan doonaa.' },
    { id: 'r2', text: 'Maalintii aan kugu arkay, noloshyda ayaa is beddeshay. Waxaad tahay iftiinka aan ku noolahay.' },
    { id: 'r3', text: 'Haddii aan adduunka oo dhan leeyahay, adiga ayaan dooran lahaa. Waxaad tahay runta jacaylkeyga.' },
    { id: 'r4', text: 'Qalbigeyga adiga ayuu u garaacaa. Nafteyda adiga ayay ku xiran tahay. Waan ku jeclahay weligey.' },
    { id: 'r5', text: 'Xasuustayadda waa warqad jacayl ah oo aan maalin walba akhriyo. Waxaad tahay sheekadeyda ugu quruxda badan.' },
    { id: 'r6', text: 'Miyaad ogtahay? Adiga ayaa qofka kaliya ee i dareensiiya inaan adduunkan ku filan yahay.' },
    { id: 'r7', text: 'Habeen walba xiddigaha ayaan ka codsadaa inay ku ilaaliyaan. Adiga waxaad tahay ducadeyda ugu weyn.' },
    { id: 'r8', text: 'Jacaylkaaga waa biyo noolaysha ciidda ah ee qalbigeyga. Adiga la\'aantaa waxba uma dhammaan.' },
    { id: 'r9', text: 'Waxaan jeclaan lahaa inaan kuu sheego erey kasta oo qalbigeyga ku jira, laakiin jacaylku waa ka weyn yahay ereyga.', isPremium: true },
    { id: 'r10', text: 'Adiga waxaad tahay bilowga iyo dhammaadka sheekadeyda jacaylka. Weligey kuma illoobi doono.', isPremium: true },
  ],
  birthday: [
    { id: 'b1', text: 'Dhalasho farxad leh! Ilaahay ha kuu kordhiyo cimri dheer, caafimaad iyo guul badan.' },
    { id: 'b2', text: 'Maalintaada dhalashada waxaan kuu rajeynayaa farxad aan dhammaaneyso iyo nolol barwaaqo ah.' },
    { id: 'b3', text: 'Sannad walba waxaad sii noqotaa qof ka qurux badan. Dhalasho wanaagsan, qofkeyga qaliga ah!' },
    { id: 'b4', text: 'Aduunyadu waxay noqotay mid ka qurux badan maalintii aad dhashay. Hambalyo!' },
    { id: 'b5', text: 'Waxaan kuu rajeynayaa sannad cusub oo ka fiican kan hore. Dhalasho wacan!' },
    { id: 'b6', text: 'Maalintani waa tan aad adduunka u qurxisay markii aad dhashay. Hambalyo dhalasho!' },
    { id: 'b7', text: 'Qofkeyga, maalintaada ayaa maanta ah! Ilaahay ha ku siiyo wixii aad qalbiga ka rabto.' },
    { id: 'b8', text: 'Sannaddani cusub ha kuu noqoto mid guul, farxad iyo barwaaqo leh. Dhalasho wanaagsan!' },
    { id: 'b9', text: 'Happy Birthday! Noloshaada ha noqoto mid ka buuxdo jacayl, qosol iyo xasilooni.', isPremium: true },
    { id: 'b10', text: 'Adiga waxaad mudan tahay wax kasta oo wanaagsan. Maalintaada dhalashadu ha ku farxadiso!', isPremium: true },
  ],
  apology: [
    { id: 'a1', text: 'Waan ka xumahay wixii dhacay, qaladkeyga waan qirayaa. Fadlan i cafi.' },
    { id: 'a2', text: 'Miyaan ku dhibay? Waxaan ahay qof qalad sameeyay oo ka xumaaday. Raalli iga noqo.' },
    { id: 'a3', text: 'Qalbigeyga wuxuu ka buuxa qoomamadii aan kugu galiyay. Waxaan ku baryayaa inaad i cafido.' },
    { id: 'a4', text: 'Ma aha inaan sidan ku dhibay. Waan ka xunahay, runtii waan ka xunahay.' },
    { id: 'a5', text: 'Haddii aan kuu sheego inta aan ka xumahay, ereygu ma filnaanayeen. Fadlan i cafi.' },
    { id: 'a6', text: 'Waxaan ogahay inaan khalad sameeyay. Waxaan doonayaa inaan wax ka beddelo. Fursad kale i sii.' },
    { id: 'a7', text: 'Cafi waa xoog, cadho waa tabar la\'aan. Waxaan ku baryayaa xoogga cafiska.' },
    { id: 'a8', text: 'Sabab walba oo aad u cadhootay, xaq baad u leedahay. Laakiin waan ka xumahay dhab ahaantii.' },
    { id: 'a9', text: 'Waxaan doonayaa inaan dib u dhiso kalsoonidii aan jabiyay. Fadlan fursad i sii.', isPremium: true },
    { id: 'a10', text: 'Qofka runta cafiya waa qofka ugu xoogga badan. Waxaan ku baryayaa inaad xoogga cafisku ku jirto.', isPremium: true },
  ],
  friendship: [
    { id: 'f1', text: 'Saaxiib dhab ah ayaad ii tahay, mar walba waan ku garab taaganahay.' },
    { id: 'f2', text: 'Saaxiibtinimadeena waa midda aan marnaba beddeli doonin. Weligey waan ku qaddarin doonaa.' },
    { id: 'f3', text: 'Adiga waxaad tahay saaxiibka aan xitaa 3 subaxnimo u soo jeedin lahaa. Waa taas saaxiibtinimo dhab ah!' },
    { id: 'f4', text: 'Waxaan ku mahadcelinayaa inaad mar walba ii joogtay — wakhtiga farxadda iyo wakhtiga dhibaatada.' },
    { id: 'f5', text: 'Nolosha saaxiib sida adiga oo kale ah waa nasiib weyn. Mahadsanid inaad noloshyda ku jirto.' },
    { id: 'f6', text: 'Dadka badan ayaa noloshaada soo mara, laakiin adiga waxaad ka mid tahay kuwa sii jooga.' },
    { id: 'f7', text: 'Waan ogahay inaan ku tiirsaday mar badan, laakiin waad ii dulqaadatay. Mahadsanid saaxiib!' },
    { id: 'f8', text: 'Saaxiibtinimadeena ma aha mid ereyga lagu sheego, waa mid ficilka lagu muujiyo.' },
    { id: 'f9', text: 'Haddii saaxiibtinimadu tahay buug, adiga waxaad ahaan lahayd cutubkii ugu macnaha badnaa.', isPremium: true },
    { id: 'f10', text: 'Adiga waxaad tahay walaalka/walaashii aan dooranay. Saaxiibtinimadeenu waa mid weligeed sii xoogaysan doonto.', isPremium: true },
  ],
  casual: [
    { id: 'c1', text: 'Waan ku xasuustay maanta, sidee tahay? Rajeynayaa inaad fiican tahay.' },
    { id: 'c2', text: 'Subax wanaagsan! ☀️ Maalintaadu ha ku hagaagto.' },
    { id: 'c3', text: 'Waan ku xiisay walaal, wax cusub ma jiraan?' },
    { id: 'c4', text: 'Muddo baan ku waayay! Bal iga warran sidee tahay.' },
    { id: 'c5', text: 'Fiiri maanta waan ku xasuustay. Isku soo xaadiri!' },
    { id: 'c6', text: 'Habeennimo wanaagsan! 🌙 Si fiican u seexo.' },
    { id: 'c7', text: 'Hey! Nolosha sidee kugu socotaa? Waan ku weydiisan jiray.' },
    { id: 'c8', text: 'Waxba ha ka walwalin, wax walba waa iska hagaagi doonaan. 💪' },
    { id: 'c9', text: 'Weekend-ka waa inaan wax wada qabsano! Ma diyaar baad u tahay?' },
    { id: 'c10', text: 'Miss you walaal! 🫂 Goorma ayaan is arki doonnaa?' },
  ],
  eid: [
    { id: 'e1', text: 'Ciid wanaagsan! Ilaahey cibaadooyinkiinna ha aqbalo, dambiigaana ha idiin dhaafo.' },
    { id: 'e2', text: 'Eid Mubaarak! Allaha kala aqbalo cibaadadii aad sameyseen.' },
    { id: 'e3', text: 'Maalinta ciiddan waxaan idinku rajeynayaa nabad, farxad iyo barwaaqo.' },
    { id: 'e4', text: 'Ciid wanaagsan qoyskeenna iyo ummadda Muslimka ah oo dhan!' },
    { id: 'e5', text: 'Allaha ina gaarsiiyo ciidado badan oo wanaagsan, nabadda iyo caafimaadka idinla jirto.' },
    { id: 'e6', text: 'Bisha barakeysan ayaa ina soo maraysa. Ilaahey cadaab kasta ha naga ilaaliyo.' },
    { id: 'e7', text: 'Ducada habeen walba waxaan ku daraa adiga iyo qoyskaaga. Ciid wanaagsan!' },
    { id: 'e8', text: 'Taqabalallahu minnaa wa minkum. Ilaahey ha inaga aqbalo oo idinkana ha idinka aqbalo.' },
    { id: 'e9', text: 'Ciiddan ha noqoto mid farxad, midnimo iyo nabad leh. Eid Saciid!', isPremium: true },
    { id: 'e10', text: 'Ilaahey ha idin siiyo caafimaad, rizqi halaal ah, iyo qoys ku faraxsan. Ciid wanaagsan!', isPremium: true },
  ],
  motivational: [
    { id: 'm1', text: 'Ha iska daalin, guusha waa kuwa adkeysta. Adiga wax kasta waad sameysan kartaa!' },
    { id: 'm2', text: 'Maalin walba waa fursad cusub. Ha daahin inaad ka faa\'iideyso.' },
    { id: 'm3', text: 'Dadka ku dhimanaya waa kuwa isku dayista joojiya. Sii wad!' },
    { id: 'm4', text: 'Adiga adigu waxaad leedahay awood aadan wali ogayn. Isku day oo waxaad arki doontaa.' },
    { id: 'm5', text: 'Caqabadaha nolosha waa casharro, haddii aad ka barato wax badan ayaad horumarisaa.' },
    { id: 'm6', text: 'Qofka raba inuu wax beddelo, isaga ayaa marka hore isbeddeli doona.' },
    { id: 'm7', text: 'Xataa safarkii ugu dheeraa wuxuu ka bilaabmaa hal tallaabo. Qaado tallaabooyinkaaga maanta.' },
    { id: 'm8', text: 'Kama hadlayo wax fudud, waxaan kaa hadlayaa wax suurta gal ah. Guusha adiga ha kuu ahaato!' },
    { id: 'm9', text: 'Waxaad noqon kartaa cid kasta oo aad rabto. Keliya ha joojin isku dayga.', isPremium: true },
    { id: 'm10', text: 'Qofka ku guulaysta nolosha waa ka adkeysta dhibaatooyinka. Adiga ayaa ka xoog badan dhibaatadaada!', isPremium: true },
  ],
};

export const QUICK_SEND_TEMPLATES = [
  { id: 'qs1', text: 'Waan ku xasuustay maanta 💭', icon: '💭', category: 'casual' as QrCategory },
  { id: 'qs2', text: 'Subax wanaagsan! ☀️', icon: '☀️', category: 'casual' as QrCategory },
  { id: 'qs3', text: 'Miss you walaal! 🫂', icon: '🫂', category: 'casual' as QrCategory },
  { id: 'qs4', text: 'Adigaa xoog badan 💪', icon: '💪', category: 'motivational' as QrCategory },
  { id: 'qs5', text: 'Habeennimo wanaagsan 🌙', icon: '🌙', category: 'casual' as QrCategory },
  { id: 'qs6', text: 'Waan ku jeclahay ❤️', icon: '❤️', category: 'romantic' as QrCategory },
  { id: 'qs7', text: 'Dhalasho wanaagsan! 🎂', icon: '🎂', category: 'birthday' as QrCategory },
  { id: 'qs8', text: 'Waan ka xumahay 🙏', icon: '🙏', category: 'apology' as QrCategory },
];
