export type Gender = 'female' | 'male';

export interface FamilyInfo {
  fatherProfession: string;
  motherProfession: string;
  brothers: string;
  sisters: string;
  familyStatus: 'उच्च मध्यम वर्ग (Upper Middle Class)' | 'संपन्न व्यापारिक परिवार (Affluent Business Family)' | 'मध्यम वर्ग (Middle Class)';
  familyType: 'संयुक्त परिवार (Joint Family)' | 'एकल परिवार (Nuclear Family)';
  familyValues: 'संस्कारवान एवं आधुनिक (Cultured & Modern)' | 'पारंपरिक (Traditional)' | 'प्रगतिशील (Progressive)';
  familyOrigin: string;
}

export interface MatrimonyProfile {
  id: string;
  name: string;
  nameHindi: string;
  age: number;
  gender: Gender;
  height: string;
  subcaste: string;
  subcasteHindi: string;
  gotra: string;
  motherGotra: string;
  rashi: string;
  nakshatra: string;
  manglik: 'Non-Manglik' | 'Manglik' | 'Anshik Manglik';
  manglikHindi: 'मांगलिक नहीं' | 'मांगलिक' | 'आंशिक मांगलिक';
  maritalStatus: 'Never Married';
  maritalStatusHindi: 'अविवाहित';
  education: string;
  profession: string;
  professionCategory: 'IT / Software' | 'Doctor / Medical' | 'CA / Finance' | 'Business / Industrialist' | 'Civil Services / Govt' | 'Law / Legal' | 'Architecture / Design';
  company: string;
  income: string;
  city: string;
  state: string;
  nativePlace: string;
  diet: 'शुद्ध शाकाहारी (Pure Veg)' | 'जैन शाकाहारी (Jain Veg)' | 'शाकाहारी (Vegetarian)';
  photos: string[];
  aboutMeHindi: string;
  aboutMeEnglish: string;
  family: FamilyInfo;
  partnerExpectationsHindi: string;
  verified: {
    aadhaar: boolean;
    photo: boolean;
    kundali: boolean;
    employment: boolean;
  };
  trustScore: number;
  featured: boolean;
  onlineStatus: 'online' | 'active_today' | 'active_recently';
  defaultMatchGunaScore: number; // e.g. 32 out of 36
  videoUrl?: string;
  videoDuration?: string;
}

export interface MatchFilter {
  gender: Gender;
  minAge: number;
  maxAge: number;
  subcaste: string;
  profession: string;
  location: string;
  manglik: string;
  diet: string;
  minIncome: string;
  searchQuery?: string;
}

export interface GunaDetail {
  name: string;
  points: number;
  max: number;
  description: string;
}

export interface AiMatchAnalysisResult {
  totalGunaScore: number;
  gunaMax: number;
  verdictHindi: string;
  gunaBreakdown: GunaDetail[];
  manglikCompatibility: {
    status: string;
    analysis: string;
  };
  modernCompatibilityScore: number;
  keyHighlights: string[];
  conversationStarters: string[];
  panditJiBlessing: string;
}

export interface MessageItem {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isSender: boolean;
}

export interface SuccessStory {
  id: string;
  coupleName: string;
  coupleNameHindi: string;
  weddingDate: string;
  image: string;
  location: string;
  storyHindi: string;
  storyEnglish: string;
}

export interface MembershipPlan {
  id: string;
  nameHindi: string;
  nameEnglish: string;
  price: string;
  duration: string;
  popular?: boolean;
  featuresHindi: string[];
  featuresEnglish: string[];
  badgeColor: string;
}
