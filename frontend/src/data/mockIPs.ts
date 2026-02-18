// Mock IP data from Robin Wood catalog
// Based on /Users/yvesfogel/Documents/obsidian/obsidian-vault/900 Clawd/CMC Unified/docs/ROBIN-WOOD-CATALOG.md

export interface MockIP {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  tagline: string;
  description: string;
  logline: string;
  genre: string;
  format: string;
  tier: 'flagship' | 'strong' | 'hidden-gem';
  period: string;
  location: string;
  worldType: string;
  themes: string[];
  comparables: string[];
  availableRights: string[];
  availableTerritories: string[];
  targetAudience: string;
  aiScore: number;
  aiStrengths: string[];
  aiImprovements: string[];
  viewCount: number;
  saveCount: number;
  inquiryCount: number;
  posterUrl?: string;
  status: 'published';
  episodeCount: number;
}

export const MOCK_IPS: MockIP[] = [
  {
    id: 'nippur-001',
    creatorId: 'robin-wood-estate',
    creatorName: 'Robin Wood Estate',
    title: 'Nippur de Lagash',
    tagline: 'A legendary Sumerian general seeks redemption across the ancient world',
    description: `Nippur was born in the streets of Lagash, ancient Sumeria (2500 BCE). Rising from nothing to become the greatest general of his age, he is betrayed by the king he served and cast into exile. Now a wanderer, Nippur travels through Egypt, Babylon, Persia, India, and beyond—encountering gods, monsters, and empires while carrying the weight of a homeland he can never return to.

450 episodes of serialized storytelling spanning decades of adventure. Each arc introduces new civilizations, conflicts, and mythologies while Nippur's core mission remains: find meaning in a world that took everything from him.`,
    logline: 'A legendary Sumerian general, betrayed by his king and exiled from his homeland, wanders the ancient world seeking redemption while his sword carves history across civilizations.',
    genre: 'Historical Epic',
    format: 'Drama Series',
    tier: 'flagship',
    period: 'Ancient (2500 BCE)',
    location: 'Mesopotamia / Mediterranean / India',
    worldType: 'Historical',
    themes: ['exile', 'redemption', 'revenge', 'adventure', 'honor'],
    comparables: ['The Witcher', 'Marco Polo', 'Conan the Barbarian', 'Game of Thrones'],
    availableRights: ['Live-action TV', 'Film', 'Animation', 'Gaming', 'Merchandise'],
    availableTerritories: ['Worldwide'],
    targetAudience: 'Adults 18-49, fantasy/historical fans',
    aiScore: 8.5,
    aiStrengths: ['Epic scope', 'Proven source material (10M+ readers)', 'Rich mythology', '450 episodes of story'],
    aiImprovements: ['Budget-heavy production', 'Complex world-building'],
    viewCount: 342,
    saveCount: 28,
    inquiryCount: 5,
    status: 'published',
    episodeCount: 450,
  },
  {
    id: 'martin-hel-001',
    creatorId: 'robin-wood-estate',
    creatorName: 'Robin Wood Estate',
    title: 'Martín Hel',
    tagline: 'A paranormal detective navigates Buenos Aires occult underworld',
    description: `Martín Hel can see what others can't: ghosts, demons, and the dark patterns behind seemingly random deaths. A reluctant hero, he takes cases no police or priest would touch—disappearances with ritual markings, murders with no earthly explanation, possessions that psychiatry can't explain.

Set in contemporary Buenos Aires—a city of tango, decay, and hidden occult history—Hel operates in the margins. His clients are desperate. His enemies are inhuman. His methods are unorthodox. And his own soul is collateral in every bargain he makes.

200 episodes of case-of-the-week storytelling with deep mythology. Each season builds toward larger supernatural threats while Hel's personal demons (literal and figurative) close in.`,
    logline: 'A chain-smoking, hard-drinking psychic detective navigates Buenos Aires\' occult underworld, solving cases that blur the line between crime and the supernatural—while his own cursed past hunts him down.',
    genre: 'Paranormal Thriller',
    format: 'Drama Series',
    tier: 'flagship',
    period: 'Contemporary',
    location: 'Buenos Aires, Argentina',
    worldType: 'Contemporary',
    themes: ['supernatural', 'noir', 'mystery', 'dark', 'addiction'],
    comparables: ['Constantine', 'Hellboy', 'True Detective', 'Lucifer'],
    availableRights: ['Live-action TV', 'Film', 'Animation', 'Gaming'],
    availableTerritories: ['Worldwide'],
    targetAudience: 'Adults 18-49, horror/thriller fans',
    aiScore: 8.2,
    aiStrengths: ['Fresh LATAM aesthetic', 'Case-of-the-week structure', 'Mythology arc potential', 'Urban noir vibe'],
    aiImprovements: ['VFX budget considerations', 'Balancing episodic vs serialized'],
    viewCount: 285,
    saveCount: 21,
    inquiryCount: 3,
    status: 'published',
    episodeCount: 200,
  },
  {
    id: 'dago-001',
    creatorId: 'robin-wood-estate',
    creatorName: 'Robin Wood Estate',
    title: 'Dago',
    tagline: 'A Venetian nobleman hunts his enemies across the 16th century Mediterranean',
    description: `Born César Doménico Doménici, heir to a powerful Venetian family, his world shatters at age 10 when rivals massacre his family and sell him into slavery. Renamed Dago ("the Daguerreotype") by his captors, he survives through intelligence, violence, and an unbreakable will.

By adulthood, Dago commands pirate fleets, navigates the politics of Ottoman sultans and Christian kings, and systematically eliminates every man responsible for his family's destruction. But revenge is a path with no end—and each enemy killed reveals another layer of conspiracy.

150 episodes spanning 40 years of adventure across Venice, Constantinople, the Barbary Coast, Spain, and beyond. Political intrigue, naval battles, forbidden love, and one man's transformation from victim to legend.`,
    logline: 'A Venetian nobleman, enslaved as a child and forged into a ruthless pirate, spends decades hunting the men who destroyed his family—while building an empire across the 16th century Mediterranean.',
    genre: 'Historical Epic',
    format: 'Drama Series',
    tier: 'flagship',
    period: 'Renaissance (1500s)',
    location: 'Venice / Constantinople / Mediterranean',
    worldType: 'Historical',
    themes: ['revenge', 'power', 'adventure', 'political', 'identity'],
    comparables: ['Black Sails', 'The Count of Monte Cristo', 'Vikings', 'Game of Thrones'],
    availableRights: ['Live-action TV', 'Film', 'Animation', 'Gaming'],
    availableTerritories: ['Worldwide'],
    targetAudience: 'Adults 18-49, historical drama fans',
    aiScore: 8.7,
    aiStrengths: ['Epic revenge saga', 'Complete narrative arc', 'Mediterranean setting (fresh)', 'Political complexity'],
    aiImprovements: ['Production design complexity', 'Naval battle VFX'],
    viewCount: 418,
    saveCount: 35,
    inquiryCount: 7,
    status: 'published',
    episodeCount: 150,
  },
  {
    id: 'dennis-martin-001',
    creatorId: 'robin-wood-estate',
    creatorName: 'Robin Wood Estate',
    title: 'Dennis Martin',
    tagline: 'A Cold War spy navigates deadly missions across the globe',
    description: `Dennis Martin is the James Bond of Latin America—a suave, deadly intelligence operative working during the height of the Cold War. From Moscow to Havana, from Berlin to Buenos Aires, Martin handles the missions too dangerous or too sensitive for conventional channels.

181 episodes of espionage thriller action. Each mission brings new locations, deadly adversaries, beautiful allies, and impossible odds. Martin's loyalty is to his country, but his methods are his own.`,
    logline: 'A Latin American spy navigates the deadly world of Cold War espionage, where every mission could be his last.',
    genre: 'Spy Thriller',
    format: 'Action Series',
    tier: 'flagship',
    period: '1960s-1980s',
    location: 'Global (focus on LATAM/USSR/Europe)',
    worldType: 'Historical',
    themes: ['espionage', 'action', 'political', 'adventure'],
    comparables: ['James Bond', 'Mission: Impossible', 'The Americans'],
    availableRights: ['Live-action TV', 'Film', 'Animation', 'Gaming'],
    availableTerritories: ['Worldwide'],
    targetAudience: 'Adults 25-54, action/thriller fans',
    aiScore: 7.8,
    aiStrengths: ['Proven genre', 'LATAM Bond angle', 'Cold War zeitgeist'],
    aiImprovements: ['Dated tropes', 'Needs modernization'],
    viewCount: 192,
    saveCount: 14,
    inquiryCount: 2,
    status: 'published',
    episodeCount: 181,
  },
  {
    id: 'savarese-001',
    creatorId: 'robin-wood-estate',
    creatorName: 'Robin Wood Estate',
    title: 'Savarese',
    tagline: 'A crime saga through 1920s-1940s America',
    description: `From Prohibition to World War II, Savarese chronicles the rise and fall of organized crime in America. Part Goodfellas, part FBI procedural, the series follows multiple perspectives—mobsters, G-men, civilians—as they navigate the violence, corruption, and moral ambiguity of the era.

160 episodes spanning 20+ years of American history. Each arc tackles a different era of crime: bootlegging, union wars, wartime black markets, and the rise of modern organized crime.`,
    logline: 'A sprawling crime epic through Prohibition-era America, where mobsters and FBI agents wage war across two decades.',
    genre: 'Crime Drama',
    format: 'Drama Series',
    tier: 'flagship',
    period: '1920s-1940s',
    location: 'USA (New York, Chicago, Las Vegas)',
    worldType: 'Historical',
    themes: ['crime', 'power', 'corruption', 'violence', 'ambition'],
    comparables: ['Goodfellas', 'Boardwalk Empire', 'The Godfather', 'Narcos'],
    availableRights: ['Live-action TV', 'Film', 'Animation', 'Gaming'],
    availableTerritories: ['Worldwide'],
    targetAudience: 'Adults 18-49, crime drama fans',
    aiScore: 8.1,
    aiStrengths: ['Proven genre', 'Epic scope', 'Rich historical period'],
    aiImprovements: ['Crowded genre space', 'Period production costs'],
    viewCount: 156,
    saveCount: 12,
    inquiryCount: 1,
    status: 'published',
    episodeCount: 160,
  },
  {
    id: 'mojado-001',
    creatorId: 'robin-wood-estate',
    creatorName: 'Robin Wood Estate',
    title: 'Mojado',
    tagline: 'An immigrant\'s journey through the Mexico-USA border underworld',
    description: `"Mojado" (Spanish for "wetback") tells the story of undocumented immigrants crossing the Mexico-USA border—but with a Breaking Bad twist. Survival in the desert. Cartels. Coyotes. Corruption. And protagonists who must make impossible choices to protect their families.

120 episodes of gritty, contemporary drama that explores immigration, crime, family, and the American Dream through unflinching eyes.`,
    logline: 'An undocumented immigrant navigates the deadly world of border crossings, cartels, and survival.',
    genre: 'Crime Drama',
    format: 'Drama Series',
    tier: 'strong',
    period: 'Contemporary',
    location: 'Mexico / USA Border',
    worldType: 'Contemporary',
    themes: ['immigration', 'crime', 'survival', 'family', 'identity'],
    comparables: ['Breaking Bad', 'Narcos', 'Sicario', 'The Border'],
    availableRights: ['Live-action TV', 'Film'],
    availableTerritories: ['Worldwide'],
    targetAudience: 'Adults 18-49, drama fans',
    aiScore: 7.9,
    aiStrengths: ['Timely subject matter', 'Intense drama', 'Underrepresented POV'],
    aiImprovements: ['Politically sensitive', 'Requires nuanced handling'],
    viewCount: 223,
    saveCount: 18,
    inquiryCount: 4,
    status: 'published',
    episodeCount: 120,
  },
  {
    id: 'wolf-001',
    creatorId: 'robin-wood-estate',
    creatorName: 'Robin Wood Estate',
    title: 'Wolf',
    tagline: 'A medieval warrior battles dark magic in ancient Britain',
    description: `In medieval Britain, a lone warrior named Wolf protects villages from raiders, monsters, and dark sorcery. Part Vikings, part fantasy adventure, Wolf blends historical action with supernatural threats in a brutal, visceral world.

117 episodes of sword-and-sorcery adventure where magic is rare, deadly, and feared.`,
    logline: 'A medieval warrior battles raiders and dark magic across ancient Britain.',
    genre: 'Fantasy Action',
    format: 'Action Series',
    tier: 'strong',
    period: 'Medieval',
    location: 'Britain',
    worldType: 'Historical Fantasy',
    themes: ['adventure', 'magic', 'honor', 'survival'],
    comparables: ['Vikings', 'The Witcher', 'Beowulf'],
    availableRights: ['Live-action TV', 'Animation', 'Gaming'],
    availableTerritories: ['Worldwide'],
    targetAudience: 'Adults 18-49, fantasy/action fans',
    aiScore: 7.5,
    aiStrengths: ['Fantasy action', 'Viking-era setting', 'Episodic adventure'],
    aiImprovements: ['Crowded fantasy genre', 'VFX requirements'],
    viewCount: 134,
    saveCount: 9,
    inquiryCount: 1,
    status: 'published',
    episodeCount: 117,
  },
  {
    id: 'mark-001',
    creatorId: 'robin-wood-estate',
    creatorName: 'Robin Wood Estate',
    title: 'Mark',
    tagline: 'Survival in a post-apocalyptic wasteland',
    description: `After civilization collapses, Mark wanders a brutal wasteland where resources are scarce, violence is common, and hope is a luxury. Part Mad Max, part survivalist thriller, Mark explores humanity at its breaking point.

116 episodes of post-apocalyptic drama where every day is a fight to survive.`,
    logline: 'A lone wanderer fights to survive in the ruins of civilization.',
    genre: 'Post-Apocalyptic',
    format: 'Drama Series',
    tier: 'strong',
    period: 'Post-Apocalyptic Future',
    location: 'Wasteland (unspecified)',
    worldType: 'Post-Apocalyptic',
    themes: ['survival', 'violence', 'humanity', 'hope'],
    comparables: ['Mad Max', 'The Walking Dead', 'The Road'],
    availableRights: ['Live-action TV', 'Film', 'Gaming'],
    availableTerritories: ['Worldwide'],
    targetAudience: 'Adults 18-49, sci-fi/action fans',
    aiScore: 7.3,
    aiStrengths: ['Genre popularity', 'Action-heavy', 'Survivalist appeal'],
    aiImprovements: ['Crowded post-apoc genre', 'Production costs (wasteland sets)'],
    viewCount: 98,
    saveCount: 7,
    inquiryCount: 0,
    status: 'published',
    episodeCount: 116,
  },
  {
    id: 'morgan-001',
    creatorId: 'robin-wood-estate',
    creatorName: 'Robin Wood Estate',
    title: 'Morgan',
    tagline: 'A cyberpunk detective in 2043',
    description: `In the neon-soaked streets of 2043, detective Morgan hunts criminals in a world of megacorporations, AI, cyborgs, and corrupt cops. Part Blade Runner, part noir detective, Morgan navigates moral ambiguity in a future where technology has outpaced humanity.

41 episodes of cyberpunk noir where the case is never just about the crime.`,
    logline: 'A cyberpunk detective navigates corporate conspiracy and moral decay in 2043.',
    genre: 'Cyberpunk Thriller',
    format: 'Drama Series',
    tier: 'hidden-gem',
    period: 'Near-Future (2043)',
    location: 'Megacity (unspecified)',
    worldType: 'Cyberpunk',
    themes: ['technology', 'corruption', 'identity', 'noir'],
    comparables: ['Blade Runner', 'Altered Carbon', 'Ghost in the Shell'],
    availableRights: ['Live-action TV', 'Animation', 'Gaming'],
    availableTerritories: ['Worldwide'],
    targetAudience: 'Adults 18-49, sci-fi/noir fans',
    aiScore: 7.6,
    aiStrengths: ['Cyberpunk genre growing', 'Detective structure', 'Visual potential'],
    aiImprovements: ['Smaller episode count', 'High VFX budget'],
    viewCount: 167,
    saveCount: 13,
    inquiryCount: 2,
    status: 'published',
    episodeCount: 41,
  },
  {
    id: 'el-gringo-001',
    creatorId: 'robin-wood-estate',
    creatorName: 'Robin Wood Estate',
    title: 'El Gringo',
    tagline: 'Adventures in the Amazon rainforest, 1900s',
    description: `An American adventurer navigates the dangerous Amazon rainforest in the early 1900s. Treasure, lost civilizations, deadly wildlife, and indigenous conflicts—El Gringo is Indiana Jones meets Heart of Darkness.

40 episodes of jungle adventure with colonial-era grit.`,
    logline: 'An American adventurer hunts treasure and lost civilizations in the deadly Amazon.',
    genre: 'Adventure',
    format: 'Action Series',
    tier: 'hidden-gem',
    period: '1900s',
    location: 'Amazon Rainforest',
    worldType: 'Historical',
    themes: ['adventure', 'exploration', 'survival', 'colonialism'],
    comparables: ['Indiana Jones', 'The Lost City of Z', 'Jungle Cruise'],
    availableRights: ['Live-action TV', 'Film', 'Animation'],
    availableTerritories: ['Worldwide'],
    targetAudience: 'Adults 18-49, adventure fans',
    aiScore: 7.1,
    aiStrengths: ['Adventure genre', 'Unique setting (Amazon)', 'Pulp appeal'],
    aiImprovements: ['Smaller episode count', 'Location shooting costs', 'Colonialist tropes'],
    viewCount: 89,
    saveCount: 6,
    inquiryCount: 1,
    status: 'published',
    episodeCount: 40,
  },
];

// Helper functions for filtering
export function filterByGenre(ips: MockIP[], genre: string): MockIP[] {
  if (!genre) return ips;
  return ips.filter(ip => ip.genre.toLowerCase().includes(genre.toLowerCase()));
}

export function filterByTier(ips: MockIP[], tier: string): MockIP[] {
  if (!tier) return ips;
  return ips.filter(ip => ip.tier === tier);
}

export function searchIPs(ips: MockIP[], query: string): MockIP[] {
  if (!query) return ips;
  const lowerQuery = query.toLowerCase();
  return ips.filter(ip =>
    ip.title.toLowerCase().includes(lowerQuery) ||
    ip.tagline.toLowerCase().includes(lowerQuery) ||
    ip.description.toLowerCase().includes(lowerQuery) ||
    ip.genre.toLowerCase().includes(lowerQuery) ||
    ip.themes.some(theme => theme.toLowerCase().includes(lowerQuery)) ||
    ip.comparables.some(comp => comp.toLowerCase().includes(lowerQuery))
  );
}

export function sortIPs(ips: MockIP[], sortBy: 'newest' | 'popular' | 'alphabetical'): MockIP[] {
  const sorted = [...ips];

  switch (sortBy) {
    case 'popular':
      return sorted.sort((a, b) => b.viewCount - a.viewCount);
    case 'alphabetical':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'newest':
    default:
      return sorted;
  }
}
