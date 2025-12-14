
export interface SiteConfig {
  siteName: string;
  tagline: string;
  colors: {
    primary: string;
    secondary: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  about: {
    title: string;
    content: string;
    image: string;
  };
}

export interface Destination {
  id: string;
  name: string;
  location: string;
  price: string;
  image: string;
  description: string;
  featured: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  author: string;
  image: string;
  excerpt: string;
  content: string;
}

export interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface AppState {
  config: SiteConfig;
  destinations: Destination[];
  posts: BlogPost[];
  services: Service[];
}

const STORAGE_KEY = 'worldclass_cms_data_v1';

const DEFAULT_CONFIG: SiteConfig = {
  siteName: 'WorldClass',
  tagline: 'Experience the Extraordinary',
  colors: {
    primary: '#0f172a', // Slate 900
    secondary: '#d4af37', // Metallic Gold
  },
  contact: {
    email: 'concierge@worldclass.travel',
    phone: '+1 (800) 999-9999',
    address: '123 Luxury Lane, Beverly Hills, CA 90210'
  },
  social: {
    instagram: '#',
    facebook: '#',
    twitter: '#'
  },
  hero: {
    title: 'Discover the World in Style',
    subtitle: 'Curated journeys for the discerning traveler.',
    backgroundImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop'
  },
  about: {
    title: 'Our Story',
    content: 'WorldClass was founded on the belief that travel should be more than just a trip; it should be a transformative experience. We specialize in crafting bespoke itineraries that blend luxury, adventure, and cultural immersion.',
    image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?q=80&w=2001&auto=format&fit=crop'
  }
};

const DEFAULT_DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Santorini Sunset',
    location: 'Greece',
    price: '$3,400',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2938&auto=format&fit=crop',
    description: 'Experience the magic of the Aegean Sea with private yacht tours and sunset dinners.',
    featured: true
  },
  {
    id: '2',
    name: 'Kyoto Retreat',
    location: 'Japan',
    price: '$4,200',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
    description: 'Immerse yourself in ancient traditions, tea ceremonies, and cherry blossom gardens.',
    featured: true
  },
  {
    id: '3',
    name: 'Amalfi Coast',
    location: 'Italy',
    price: '$3,800',
    image: 'https://images.unsplash.com/photo-1633321088355-d0f8430a30b9?q=80&w=2070&auto=format&fit=crop',
    description: 'Drive the coastline in a vintage convertible and stay in cliffside villas.',
    featured: true
  },
  {
    id: '4',
    name: 'Swiss Alps',
    location: 'Switzerland',
    price: '$5,100',
    image: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=2665&auto=format&fit=crop',
    description: 'Luxury ski chalets and helicopter tours over the Matterhorn.',
    featured: false
  },
  {
    id: '5',
    name: 'Maldives Escape',
    location: 'Maldives',
    price: '$6,500',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2665&auto=format&fit=crop',
    description: 'Private overwater bungalows with direct ocean access and spa treatments.',
    featured: false
  }
];

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Top 10 Hidden Gems in Europe',
    date: 'Oct 12, 2023',
    author: 'Elena Rossi',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070&auto=format&fit=crop',
    excerpt: 'Discover the villages and coastal towns that mass tourism hasn\'t found yet.',
    content: 'Europe is full of famous landmarks, but the true magic often lies off the beaten path...'
  },
  {
    id: '2',
    title: 'Packing for a Safari',
    date: 'Sep 28, 2023',
    author: 'James Beard',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop',
    excerpt: 'Essential gear and clothing tips for your first African adventure.',
    content: 'Going on a safari is a life-changing experience, but packing right is crucial...'
  },
  {
    id: '3',
    title: 'Culinary Journey through Peru',
    date: 'Aug 15, 2023',
    author: 'Sofia Mendez',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2070&auto=format&fit=crop',
    excerpt: 'From street food in Lima to fine dining in Cusco.',
    content: 'Peru has arguably the best food scene in South America...'
  }
];

const DEFAULT_SERVICES: Service[] = [
  { id: '1', title: 'Private Jets', icon: 'Plane', description: 'Charter private flights for seamless travel.' },
  { id: '2', title: 'Luxury Accommodation', icon: 'Hotel', description: 'Access to the world\'s most exclusive hotels.' },
  { id: '3', title: 'Custom Itineraries', icon: 'Map', description: 'Trips tailored specifically to your tastes.' },
  { id: '4', title: '24/7 Concierge', icon: 'Phone', description: 'Support whenever and wherever you need it.' },
];

export const loadData = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    config: DEFAULT_CONFIG,
    destinations: DEFAULT_DESTINATIONS,
    posts: DEFAULT_POSTS,
    services: DEFAULT_SERVICES
  };
};

export const saveData = (data: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
