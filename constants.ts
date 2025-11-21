
import { PetConfig, PetType, Achievement } from './types';

export const UNLOCK_THRESHOLD = 40;
export const EVOLUTION_THRESHOLD = 200;

export const AFFECTION_VALUES = {
  PET: 10,
  FEED: 5,
  BATHE: 10,
};

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first_meet',
    title: '初次见面',
    description: '成功领养你的第一只宠物',
    icon: '👋',
    isUnlocked: false,
  },
  {
    id: 'care_novice',
    title: '初级饲养员',
    description: '与宠物互动达到 50 次',
    icon: '🍼',
    isUnlocked: false,
  },
  {
    id: 'psychologist',
    title: '宠物心理师',
    description: '任意一只宠物的好感度达到 250',
    icon: '🧠',
    isUnlocked: false,
  },
  {
    id: 'collector',
    title: '养宠达人',
    description: '集齐所有类型的宠物',
    icon: '🏆',
    isUnlocked: false,
  }
];

export const PET_CONFIGS: Record<PetType, PetConfig> = {
  cat: {
    type: 'cat',
    displayName: '猫咪',
    emoji: '🐱',
    diet: 'carnivore',
    images: {
      baby: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Cat%20Face.png',
      youth: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Cat.png'
    },
    description: '独立但充满爱心。喜欢吃鱼和温暖的地方。',
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  dog: {
    type: 'dog',
    displayName: '狗狗',
    emoji: '🐶',
    diet: 'carnivore',
    images: {
      baby: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dog%20Face.png',
      youth: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dog.png'
    },
    description: '忠诚且充满活力。见到你总是很开心！',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  rabbit: {
    type: 'rabbit',
    displayName: '兔子',
    emoji: '🐰',
    diet: 'herbivore',
    images: {
      baby: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Rabbit%20Face.png',
      youth: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Rabbit.png'
    },
    description: '柔软又活泼。喜欢胡萝卜和安静的角落。',
    color: 'bg-pink-100 text-pink-800 border-pink-200'
  },
  dino: {
    type: 'dino',
    displayName: '小恐龙',
    emoji: '🦖',
    diet: 'carnivore',
    images: {
      baby: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Sauropod.png',
      youth: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/T-Rex.png'
    },
    description: '一只迷你的霸王龙。出乎意料地粘人，但要小心手指。',
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  bird: {
    type: 'bird',
    displayName: '小鸟',
    emoji: '🦜',
    diet: 'herbivore',
    images: {
      baby: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Hatching%20Chick.png',
      youth: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Parrot.png'
    },
    description: '色彩斑斓且健谈。喜欢种子和唱歌。',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  hamster: {
    type: 'hamster',
    displayName: '仓鼠',
    emoji: '🐹',
    diet: 'herbivore',
    images: {
      baby: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Hamster%20Face.png',
      youth: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Hamster.png'
    },
    description: '脸颊圆鼓鼓的小吃货，跑轮上的运动健将。',
    color: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  panda: {
    type: 'panda',
    displayName: '熊猫',
    emoji: '🐼',
    diet: 'herbivore',
    images: {
      baby: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Panda%20Face.png',
      youth: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Panda.png'
    },
    description: '圆滚滚的国宝，最爱吃竹子和睡懒觉。',
    color: 'bg-slate-100 text-slate-800 border-slate-200'
  }
};
