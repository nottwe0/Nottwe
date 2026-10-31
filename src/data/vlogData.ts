import { VideoScene, CultureItem, PhotoBoothPose, PhotoStripFrame } from '../types';

export const TOTAL_DURATION_SECONDS = 17;

export const CREATOR_PROFILE = {
  accountName: 'Koralina',
  username: '@koralina.in.seoul',
  displayName: 'Koralina 🌸 코랄리나',
  bio: 'International creator living in Seoul 🇰🇷 · Sharing authentic Korean culture, campus life & student hidden gems ✨',
  avatarSrc: '/src/assets/images/koralina_profile_avatar_1792391951456.jpg',
  followers: '148.6K',
  following: '112',
  likes: '4.2M',
  verified: true,
  pronouns: 'she/her',
  city: 'Seoul, South Korea',
};

export const VIDEO_SCENES: VideoScene[] = [
  {
    id: 1,
    phase: 'Hook',
    timeRange: [0, 5.5],
    durationSec: 5.5,
    imageSrc: '/src/assets/images/scene1_koralina_street_hook_1792391949048.jpg',
    imageAlt: 'Slavic lifestyle blogger Koralina with wavy ginger hair walking on a sunny Hongdae street in Seoul, pointing warmly at an Insaengnecut photo booth',
    subtitles: {
      line1: 'Today I want to show you one super popular thing in Korea—',
      line2: 'these cute photo booths called Insaengnecut!',
    },
    voiceOverText: 'Today I want to show you one super popular thing in Korea—these cute photo booths called Insaengnecut!',
    wordCount: 17,
    cameraMovement: 'Casual handheld selfie tracking shot with Koralina walking down vibrant Hongdae street, smiling and pointing to the pastel photo booth storefront',
    visualAction: 'Koralina turns her phone camera around with a cheerful, warm expression, introducing the iconic photo booth spot',
    sfxNotes: 'Lively Seoul Hongdae street ambiance, upbeat warm acoustic lofi guitar chords, soft ambient whoosh',
    culturalNote: 'Foreign exchange students and international creators quickly discover photo booths as the staple weekend hangout spot across Korean university neighborhoods.',
  },
  {
    id: 2,
    phase: 'Explain',
    timeRange: [5.5, 11.5],
    durationSec: 6.0,
    imageSrc: '/src/assets/images/scene2_koralina_booth_explain_1792391950686.jpg',
    imageAlt: 'Inside the bright photo booth with ring lights, Koralina wearing plush bunny ears and heart sunglasses laughing and striking poses with her Korean friend',
    subtitles: {
      line1: "It literally means 'life's four cuts.' Grab silly headbands,",
      line2: 'squeeze in with your bestie, and strike four quick poses!',
    },
    voiceOverText: "It literally means 'life's four cuts.' Grab silly headbands, squeeze in with your bestie, and strike four quick poses!",
    wordCount: 19,
    cameraMovement: 'Photo studio camera perspective with ring light reflection and live dynamic flash bursts at 7.0s, 8.2s, 9.4s, 10.6s',
    visualAction: 'Koralina and her bestie grab plush bunny ears and novelty sunglasses from the lobby rack, laughing and switching poses before each timer flash',
    sfxNotes: 'Countdown beeps (3-2-1), 4 distinct studio camera shutter clicks + lens flashes, genuine giggles and laughter',
    culturalNote: "The name combines 'Insaeng' (life / best of your life) and 'Necut' (four cuts). The booths provide free straighteners, brushes, and costume racks right in the lobby.",
  },
  {
    id: 3,
    phase: 'Close',
    timeRange: [11.5, 17.0],
    durationSec: 5.5,
    imageSrc: '/src/assets/images/scene3_koralina_strip_close_1792391951712.jpg',
    imageAlt: 'Koralina with ginger hair smiling happily outside the booth, holding up the printed glossy 4-cut photo strip with cute poses to the camera',
    subtitles: {
      line1: 'And you get this adorable instant printed strip to keep forever.',
      line2: 'You honestly have to try it!',
    },
    voiceOverText: 'And you get this adorable instant printed strip to keep forever. You honestly have to try it!',
    wordCount: 17,
    cameraMovement: 'Macro push-in on the glossy printed 4-cut film strip with Koralina smiling warmly in the soft-focus Seoul street background',
    visualAction: 'Freshly printed strip sliding into frame; Koralina presents the 4 cuts, timestamp, and Korean branding with a natural, friendly smile',
    sfxNotes: 'Smooth mechanical photo printer ejection sound, warm closing bell chime, and gentle mellow lofi beat outro',
    culturalNote: 'Strips print in pairs (1+1) for sharing with friends. Almost all university students slide their latest strip into the back of their clear phone cases.',
  },
];

export const TOTAL_SCRIPT_WORDS = VIDEO_SCENES.reduce((acc, s) => acc + s.wordCount, 0);

export const CULTURE_GUIDE_ITEMS: CultureItem[] = [
  {
    id: 'insaengnecut-meaning',
    koreanText: '인생네컷',
    romanization: 'Insaengnecut',
    meaning: "Life's Four Cuts / Best Four Shots of Your Life",
    explanation:
      "In Korean, 'Insaeng' (인생) means life, and 'Necut' (네컷) refers to four cuts/frames. Calling something an 'insaeng-item' is Korean slang for the best or most defining version of something you will experience in your lifetime.",
    tag: 'Terminology',
  },
  {
    id: 'hangout-ritual',
    koreanText: '3차 코스',
    romanization: 'Sam-cha Course',
    meaning: 'The Mandatory 3rd Stop of a Night Out',
    explanation:
      'For university students in South Korea, visiting a four-cut photo booth is an automatic ritual after dining (1차) and a café or drinks (2차). It creates a physical milestone commemorating who you spent that specific evening with.',
    tag: 'Social Culture',
  },
  {
    id: 'prop-culture',
    koreanText: '소품존 & 파우더룸',
    romanization: 'Sopum-zon & Powder Room',
    meaning: 'Free Prop Station & Vanity Mirrors',
    explanation:
      'Korean booths are unstaffed but meticulously stocked. Booth lobbies feature hair dryers, flat irons, LED vanity mirrors, and wall racks with hundreds of plush animal hats, character headbands, and oversized comedic sunglasses.',
    tag: 'Experience',
  },
  {
    id: 'qr-code-feature',
    koreanText: 'QR 코드 영상',
    romanization: 'QR Code Yeongsang',
    meaning: 'Hidden Time-Lapse Video Feature',
    explanation:
      'If you check the consent box on screen, a micro QR code is printed on the strip corner. Scanning it lets you download not only high-res digital photos but also a behind-the-scenes 10-second video of you laughing and posing inside the booth.',
    tag: 'Tech Feature',
  },
  {
    id: 'phone-case-display',
    koreanText: '폰케이스 꾸미기',
    romanization: 'Phone Case Kkumigi',
    meaning: 'Tucking Strips into Clear Phone Cases',
    explanation:
      'Unlike pure smartphone selfies stored on cloud drives, physical 4-cut strips are worn as badges of friendship—tucked into clear silicone phone cases, stuck to dorm desk mirrors, or pinned to cafe bulletin boards.',
    tag: 'Lifestyle Trend',
  },
];

export const POPULAR_POSES: PhotoBoothPose[] = [
  {
    id: 'cheek-heart',
    name: 'Cheek Heart',
    koreanName: '볼하트 (Bol-Heart)',
    description: 'Pressing one curled hand against your cheek to form a cute half-heart silhouette.',
    funFact: 'Invented by K-pop idols during fan meetings and now the most common pose across Korean photo booths.',
    iconName: 'Heart',
  },
  {
    id: 'sandwich-stack',
    name: 'Friend Sandwich',
    koreanName: '샌드위치 포즈 (Sandwich Pose)',
    description: 'One friend stands in the foreground smiling while the other peeks out right over their shoulder.',
    funFact: 'Ideal for 2 to 3 friends fitting into the vertical lens framing without blocking the studio flash.',
    iconName: 'Users',
  },
  {
    id: 'goofy-shades',
    name: 'Novelty Prop Chaos',
    koreanName: '소품 장난 (Sopum Jangnan)',
    description: 'Wearing giant diamond sunglasses and lobster claw gloves with a completely serious, straight face.',
    funFact: 'Korean Gen Z loves contrasting ultra-ridiculous props with high-fashion chic deadpan facial expressions.',
    iconName: 'Glasses',
  },
  {
    id: 'v-sign-flower',
    name: 'Flower Cup / V-Sign',
    koreanName: '꽃받침 & 브이 (Kkot-batchim)',
    description: 'Cupping both hands beneath your chin like flower petals or classic double peace signs.',
    funFact: 'Creates an optical slimming effect while evoking playful youthful nostalgia.',
    iconName: 'Sparkles',
  },
];

export const PHOTO_STRIP_FRAMES: PhotoStripFrame[] = [
  {
    id: 'classic-pink',
    name: 'Classic Insaeng Pink',
    bgColor: '#fdf2f8',
    textColor: '#831843',
    accentBorder: '#fbcfe8',
  },
  {
    id: 'seoul-sky',
    name: 'Hongdae Pastel Sky',
    bgColor: '#f0f9ff',
    textColor: '#075985',
    accentBorder: '#bae6fd',
  },
  {
    id: 'film-charcoal',
    name: 'Minimalist Film Black',
    bgColor: '#18181b',
    textColor: '#f4f4f5',
    accentBorder: '#27272a',
  },
  {
    id: 'lavender-dream',
    name: 'Seongsu Lavender',
    bgColor: '#faf5ff',
    textColor: '#581c87',
    accentBorder: '#e9d5ff',
  },
];
